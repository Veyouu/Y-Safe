const API_URL = window.location.origin + '/api';

// Track completed topics
let completedTopics = {};
try {
  completedTopics = JSON.parse(localStorage.getItem('y-safe-completed-topics') || '{}');
} catch (e) {
  console.error('Error loading completed topics:', e);
  completedTopics = {};
}

// YouTube video IDs for each lesson
const lessonVideos = {
  'bandage-parts': 'A7UIePi5ngM',
  'bandage-folds': 'N-om6XQHgQI', 
  'square-knot': '40TQ7qFwEfs',
  'head-wound': 'xrr9JZTEwf0',
  'forearm-wound': 'CT9GvWkadCI',
  'hand-burn': 'x4QndeNf85A',
  'arm-sling': 'PzZPxMwozE4',
  'face-burn': '4NnhldZISuQ'
};

// Main lesson quiz data with correct answer keys
const mainLessonQuiz = {
  firstAid: {
    title: 'First Aid Tutorial Quiz',
    questions: [
      {
        question: 'A triangular bandage is a versatile first aid material. What is its main use in emergency care?',
        options: ['Decorative support cloth', 'Bandaging wounds and making slings', 'Removing dirt from injuries', 'Measuring wound size'],
        correct: 1
      },
      {
        question: 'Proper knot tying is important when applying a triangular bandage. Which type of knot is recommended to secure bandage safely?',
        options: ['Loop knot', 'Square knot', 'Slip knot', 'Bow knot'],
        correct: 1
      },
      {
        question: 'Before applying any bandage, first aider must assess situation. What should be checked first before bandaging a wound?',
        options: ['The cleanliness of bandage', 'The style of knot needed', 'The condition and severity of wound', 'The location of injury'],
        correct: 2
      },
      {
        question: 'To prevent infection and further injury, what is the correct first step when treating a wound?',
        options: ['Secure bandage firmly', 'Clean and cover wound properly', 'Trim damaged skin immediately', 'Tie knot as quickly as possible'],
        correct: 1
      },
      {
        question: 'An arm sling is used to support injured body parts. Which injury is best treated using an arm sling?',
        options: ['Head wound', 'Leg wound', 'Arm injury', 'Foot burn'],
        correct: 2
      }
    ]
  }
};

let currentLesson = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOM loaded, setting up first aid page...');
    
    // Set up modal first
    setupModal();
    
    // Then set up lesson cards
    setupLessonCards();
    
    setupBackButton();
    updateQuizButton();
    updateCompletedTopics();
    
    console.log('First aid page loaded successfully');
  } catch (error) {
    console.error('Error initializing first aid page:', error);
  }
});

// Update quiz button when page regains focus (in case user switches tabs)
window.addEventListener('focus', () => {
  console.log('Page regained focus - updating quiz button');
  updateQuizButton();
  updateCompletedTopics();
});

// Update quiz button when page becomes visible (in case user switches apps)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('Page became visible - updating quiz button');
    updateQuizButton();
    updateCompletedTopics();
  }
});

// Authentication check removed - no longer needed

function setupBackButton() {
  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
}

const lessons = {
  'bandage-parts': {
    title: 'Parts of Triangular Bandage',
    content: `
      <h3>Parts of Triangular Bandage</h3>
      <p>A triangular bandage is a versatile first aid tool that can be used in various emergency situations. Understanding its parts is essential for proper application.</p>
      
      <h4>Main Parts:</h4>
      <ul>
        <li><strong>Base:</strong> The longest edge of triangular bandage</li>
        <li><strong>Apex:</strong> The point opposite base</li>
        <li><strong>Edges:</strong> The two sides that form triangle</li>
        <li><strong>Corners:</strong> Three points including apex and two base corners</li>
      </ul>
      
      <h4>Uses:</h4>
      <ul>
        <li>Creating arm slings</li>
        <li>Securing dressings</li>
        <li>Immobilizing injuries</li>
        <li>Applying pressure to wounds</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is the longest edge of a triangular bandage called?',
        options: ['Apex', 'Base', 'Edge', 'Corner'],
        correct: 1
      },
      {
        question: 'What is the point opposite the base called?',
        options: ['Corner', 'Edge', 'Apex', 'Side'],
        correct: 2
      },
      {
        question: 'How many corners does a triangular bandage have?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correct: 1
      },
      {
        question: 'What is one common use of a triangular bandage?',
        options: ['Creating arm slings', 'Cleaning wounds', 'Taking temperature', 'Measuring blood pressure'],
        correct: 0
      },
      {
        question: 'What are the two sides that form a triangle called?',
        options: ['Base and apex', 'Edges', 'Corners', 'Sides'],
        correct: 1
      }
    ]
  },
  'bandage-folds': {
    title: 'Triangular Bandage Folds',
    content: `
      <h3>Triangular Bandage Folds</h3>
      <p>Different folding techniques allow the triangular bandage to be used for various emergency situations.</p>
      
      <h4>Common Folds:</h4>
      <ul>
        <li><strong>Cravat fold:</strong> Narrow bandage for wrapping</li>
        <li><strong>Broad fold:</strong> Wide bandage for large areas</li>
        <li><strong>Saddle fold:</strong> Special shape for specific applications</li>
        <li><strong>Triangle fold:</strong> Compact for small injuries</li>
      </ul>
      
      <h4>Applications:</h4>
      <ul>
        <li>Cravat fold for limb bandaging</li>
        <li>Broad fold for chest or back injuries</li>
        <li>Saddle fold for shoulder injuries</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is the purpose of a cravat fold?',
        options: ['For wrapping injuries', 'For cleaning wounds', 'For measuring temperature', 'For taking blood pressure'],
        correct: 0
      },
      {
        question: 'Which fold is best for large areas?',
        options: ['Cravat fold', 'Broad fold', 'Saddle fold', 'Triangle fold'],
        correct: 1
      },
      {
        question: 'What fold is used for shoulder injuries?',
        options: ['Cravat fold', 'Broad fold', 'Saddle fold', 'Triangle fold'],
        correct: 2
      }
    ]
  },
  'square-knot': {
    title: 'Square Knot',
    content: `
      <h3>Square Knot</h3>
      <p>A proper square knot is essential for securing bandages safely and effectively.</p>
      
      <h4>Steps to Tie Square Knot:</h4>
      <ul>
        <li>Cross right end over left end</li>
        <li>Pass right end under and through loop</li>
        <li>Cross left end over right end</li>
        <li>Pass left end under and through loop</li>
        <li>Tighten by pulling both ends</li>
      </ul>
      
      <h4>Key Points:</h4>
      <ul>
        <li>Hold ends firmly while tying</li>
        <li>Ensure knot is flat and secure</li>
        <li>Don't make it too tight</li>
        <li>Practice regularly to master</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is the first step in tying a square knot?',
        options: ['Cross right over left', 'Cross left over right', 'Make a loop', 'Tie a bow'],
        correct: 0
      }
    ]
  },
  'head-wound': {
    title: 'Wound Top of Head',
    content: `
      <h3>Wound Top of Head</h3>
      <p>Head injuries require careful attention and proper bandaging technique.</p>
      
      <h4>Bandaging Steps:</h4>
      <ul>
        <li>Place center of bandage over wound</li>
        <li>Bring ends down around head</li>
        <li>Cross ends at back of head</li>
        <li>Tie with square knot on side</li>
        <li>Ensure firm but not too tight</li>
      </ul>
      
      <h4>Important Notes:</h4>
      <ul>
        <li>Check for concussion symptoms</li>
        <li>Don't apply pressure to skull fractures</li>
        <li>Monitor breathing and consciousness</li>
        <li>Seek medical help immediately</li>
      </ul>
    `,
    quiz: [
      {
        question: 'Where should the center of the bandage be placed for a head wound?',
        options: ['On the forehead', 'Over the wound', 'On the back of head', 'On the neck'],
        correct: 1
      }
    ]
  },
  'forearm-wound': {
    title: 'Wound on Forearm',
    content: `
      <h3>Wound on Forearm</h3>
      <p>Forearm injuries need proper bandaging to control bleeding and prevent infection.</p>
      
      <h4>Bandaging Technique:</h4>
      <ul>
        <li>Clean wound thoroughly</li>
        <li>Apply dressing pad</li>
        <li>Wrap bandage spiral fashion</li>
        <li>Overlap each turn by half</li>
        <li>Secure with square knot</li>
      </ul>
      
      <h4>Tips:</h4>
      <ul>
        <li>Start below and wrap upward</li>
        <li>Check circulation below bandage</li>
        <li>Don't wrap too tightly</li>
      </ul>
    `,
    quiz: [
      {
        question: 'How should you wrap a forearm wound?',
        options: ['Tightly', 'Spiral fashion with overlap', 'Randomly', 'In circles'],
        correct: 1
      }
    ]
  },
  'hand-burn': {
    title: 'Burn on Hand',
    content: `
      <h3>Burn on Hand</h3>
      <p>Hand burns require careful treatment to prevent infection and promote healing.</p>
      
      <h4>Immediate Treatment:</h4>
      <ul>
        <li>Cool burn with cool water</li>
        <li>Don't apply ice directly</li>
        <li>Don't break blisters</li>
        <li>Cover with sterile dressing</li>
        <li>Seek medical help for severe burns</li>
      </ul>
      
      <h4>Bandaging:</h4>
      <ul>
        <li>Use non-stick dressing</li>
        <li>Wrap gently, not tightly</li>
        <li>Elevate hand to reduce swelling</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What should you NOT do for a hand burn?',
        options: ['Cool with water', 'Apply ice directly', 'Cover with dressing', 'Break blisters'],
        correct: 1
      }
    ]
  },
  'arm-sling': {
    title: 'Arm Sling',
    content: `
      <h3>Arm Sling</h3>
      <p>An arm sling provides support and immobilization for arm injuries.</p>
      
      <h4>Creating an Arm Sling:</h4>
      <ul>
        <li>Fold triangular bandage into cravat</li>
        <li>Place one end over shoulder</li>
        <li>Support injured arm at elbow</li>
        <li>Bring other end around neck</li>
        <li>Tie square knot above collarbone</li>
      </ul>
      
      <h4>Adjustment:</h4>
      <ul>
        <li>Ensure comfortable height</li>
        <li>Check circulation in fingers</li>
        <li>Secure knot properly</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What type of knot is used to secure an arm sling?',
        options: ['Bow knot', 'Square knot', 'Loop knot', 'Slip knot'],
        correct: 1
      }
    ]
  },
  'face-burn': {
    title: 'Burn in Face and/or Back of Head',
    content: `
      <h3>Burn in Face and/or Back of Head</h3>
      <p>Facial and head burns require special care due to sensitive areas.</p>
      
      <h4>Treatment Approach:</h4>
      <ul>
        <li>Cool with water or wet cloth</li>
        <li>Don't apply ointments</li>
        <li>Don't break blisters</li>
        <li>Cover loosely with sterile dressing</li>
      </ul>
      
      <h4>Special Considerations:</h4>
      <ul>
        <li>Protect airway</li>
        <li>Monitor for shock</li>
        <li>Seek immediate medical attention</li>
        <li>Don't apply pressure if skull fracture suspected</li>
      </ul>
    `,
    quiz: [
      {
        question: 'How should you cover a face burn?',
        options: ['Tightly', 'With pressure', 'Loosely with sterile dressing', 'With plastic wrap'],
        correct: 2
      }
    ]
  }
};

function setupLessonCards() {
  console.log('Setting up lesson cards...'); // Debug log
  const lessonCards = document.querySelectorAll('.lesson-card');
  console.log('Found lesson cards:', lessonCards.length); // Debug log
  
  lessonCards.forEach((card, index) => {
    const lessonId = card.dataset.lesson;
    console.log(`Setting up card ${index} with lesson ID:`, lessonId); // Debug log
    
    // Mark as completed if already done
    if (completedTopics[lessonId]) {
      card.classList.add('completed');
    }
    
    // Check if button exists before adding event listener
    const lessonBtn = card.querySelector('.btn-lesson');
    console.log(`Button found for card ${lessonId}:`, !!lessonBtn); // Debug log
    
    if (lessonBtn) {
      lessonBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lessonId = card.dataset.lesson;
        console.log('Opening lesson from button:', lessonId); // Debug log
        openLesson(lessonId);
      });
    }
    
    // Also make the card clickable
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on button
      if (!e.target.classList.contains('btn-lesson')) {
        const lessonId = card.dataset.lesson;
        console.log('Opening lesson from card:', lessonId); // Debug log
        openLesson(lessonId);
      }
    });
  });
  
  console.log('Lesson cards setup complete'); // Debug log
}

function createVideoPlayer(videoId) {
  if (!videoId) return '';
  
  return `
    <div class="video-container">
      <div class="video-wrapper">
        <iframe 
          width="100%" 
          height="315" 
          src="https://www.youtube.com/embed/${videoId}?rel=0&showinfo=1&modestbranding=1" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
        </iframe>
      </div>
    </div>
  `;
}

function openLesson(lessonId) {
  console.log('openLesson called with ID:', lessonId); // Debug log
  
  const lesson = lessons[lessonId];
  if (!lesson) {
    console.error('Lesson not found for ID:', lessonId);
    return;
  }

  console.log('Lesson found:', lesson.title); // Debug log
  currentLesson = lessonId;
  
  const modal = document.getElementById('lessonModal');
  const modalTitle = document.getElementById('modalTitle'); // Fixed ID
  const modalContent = document.getElementById('modalBody'); // Fixed ID

  if (!modal || !modalTitle || !modalContent) {
    console.error('Modal elements not found - modal:', modal, 'title:', modalTitle, 'content:', modalContent);
    return;
  }

  modalTitle.textContent = lesson.title;  
  // Add video player if video exists for this lesson
  const videoId = lessonVideos[lessonId];
  console.log('YouTube video ID for lesson:', videoId); // Debug log
  const videoPlayer = createVideoPlayer(videoId);
  const updatedContent = videoPlayer + lesson.content;
  
  modalContent.innerHTML = updatedContent;

  // Check if this lesson is already completed and update the button
  const markBtn = document.getElementById('markCompletedBtn');
  if (markBtn) {
    if (completedTopics[lessonId]) {
      markBtn.textContent = 'Completed';
      markBtn.disabled = true;
      markBtn.classList.add('btn-secondary');
      markBtn.classList.remove('btn-success');
    } else {
      markBtn.textContent = 'Mark as Completed';
      markBtn.disabled = false;
      markBtn.classList.remove('btn-secondary');
      markBtn.classList.add('btn-success');
    }
  }

  modal.style.display = 'block';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  console.log('Modal opened with content length:', updatedContent.length);
}

function setupModal() {
  const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('Closing modal');
      // Close all modals
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
        modal.style.display = 'none';
      });
      document.body.style.overflow = 'auto';
      
      // IMPORTANT: Update quiz button when modal is closed
      // This fixes the bug where completed lessons don't enable the quiz
      setTimeout(() => {
        updateQuizButton();
        updateCompletedTopics();
      }, 100);
    });
  });

  document.getElementById('markCompletedBtn')?.addEventListener('click', () => {
    markTopicCompleted();
  });

  // Setup main quiz button
  document.getElementById('firstAidQuizBtn')?.addEventListener('click', () => {
    startMainQuiz('firstAid');
  });
}

function markTopicCompleted() {
  const lessonId = getCurrentLessonId();
  if (!lessonId || completedTopics[lessonId]) return;
  
  completedTopics[lessonId] = true;
  localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
  
  // Update lesson card
  updateLessonCard(lessonId, true);
  
  // Update button
  const markBtn = document.getElementById('markCompletedBtn');
  markBtn.textContent = 'Completed';
  markBtn.disabled = true;
  markBtn.classList.add('btn-secondary');
  markBtn.classList.remove('btn-success');
  
  // Update quiz button
  updateQuizButton();
  updateCompletedTopics();
}

function getCurrentLessonId() {
  // Return current lesson ID directly
  return currentLesson;
}

function updateLessonCard(lessonId, isCompleted) {
  const card = document.querySelector(`[data-lesson="${lessonId}"]`);
  if (card) {
    if (isCompleted) {
      card.classList.add('completed');
    } else {
      card.classList.remove('completed');
    }
  }
}

function updateQuizButton() {
  const firstAidTopics = Object.keys(lessons);
  const completedCount = firstAidTopics.filter(id => completedTopics[id]).length;
  
  console.log('Updating quiz button - completed:', completedCount, 'of', firstAidTopics.length); // Debug log
  
  const quizBtn = document.getElementById('firstAidQuizBtn');
  if (quizBtn) {
    if (completedCount === firstAidTopics.length) {
      quizBtn.disabled = false;
      quizBtn.textContent = 'Start Quiz';
      console.log('Quiz button enabled - all lessons completed');
    } else {
      quizBtn.disabled = true;
      const remaining = firstAidTopics.length - completedCount;
      quizBtn.textContent = `Complete ${remaining} more topic${remaining > 1 ? 's' : ''}`;
      console.log('Quiz button disabled - need', remaining, 'more lessons');
    }
  } else {
    console.log('Quiz button not found');
  }
}

function updateCompletedTopics() {
  const firstAidTopics = Object.keys(lessons);
  const completedCount = firstAidTopics.filter(id => completedTopics[id]).length;
  
  const completedSpan = document.getElementById('completedTopics');
  const totalSpan = document.getElementById('totalTopics');
  if (completedSpan && totalSpan) {
    completedSpan.textContent = completedCount;
    totalSpan.textContent = firstAidTopics.length;
  }
}

function startMainQuiz(lessonType) {
  currentQuiz = [...mainLessonQuiz[lessonType].questions];
  currentQuestionIndex = 0;
  correctAnswers = 0;
  
  document.getElementById('quizTitle').textContent = mainLessonQuiz[lessonType].title;
  document.getElementById('totalQuestions').textContent = currentQuiz.length;
  document.getElementById('quizModal').classList.add('active');
  
  showQuestion();
  document.getElementById('nextQuestionBtn').style.display = 'inline-flex';
  document.getElementById('submitQuizBtn').style.display = 'none';
}

function showQuestion() {
  const question = currentQuiz[currentQuestionIndex];
  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
  document.getElementById('quizQuestion').textContent = question.question;
  
  const progressPercent = ((currentQuestionIndex) / currentQuiz.length) * 100;
  const progressBar = document.querySelector('.quiz-progress-bar');
  if (progressBar) {
    progressBar.style.setProperty('--progress', `${progressPercent}%`);
  }
  
  const optionsContainer = document.getElementById('quizOptions');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'quiz-option';
    optionElement.textContent = option;
    optionElement.addEventListener('click', () => selectOption(index, optionElement));
    optionsContainer.appendChild(optionElement);
  });
  
  document.getElementById('nextQuestionBtn').disabled = true;
}

let selectedOption = null;

function selectOption(index, element) {
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.classList.remove('selected'));
  
  element.classList.add('selected');
  selectedOption = index;
  document.getElementById('nextQuestionBtn').disabled = false;
}

document.getElementById('nextQuestionBtn')?.addEventListener('click', () => {
  const correctAnswer = currentQuiz[currentQuestionIndex].correct;
  
  const options = document.querySelectorAll('.quiz-option');
  options.forEach((opt, idx) => {
    opt.style.pointerEvents = 'none';
    if (idx === correctAnswer) {
      opt.classList.add('correct');
    } else if (idx === selectedOption && idx !== correctAnswer) {
      opt.classList.add('incorrect');
    }
  });
  
  if (selectedOption === correctAnswer) {
    correctAnswers++;
  }
  
  setTimeout(() => {
    currentQuestionIndex++;
    selectedOption = null;
    
    if (currentQuestionIndex < currentQuiz.length) {
      showQuestion();
    } else {
      document.getElementById('nextQuestionBtn').style.display = 'none';
      document.getElementById('submitQuizBtn').style.display = 'inline-flex';
    }
  }, 1500);
});

document.getElementById('submitQuizBtn')?.addEventListener('click', () => {
  document.getElementById('quizModal').classList.remove('active');
  showResults();
});

function showResults() {
  const score = Math.round((correctAnswers / currentQuiz.length) * 100);
  const total = currentQuiz.length;
  
  document.getElementById('resultScore').textContent = `${score}%`;
  document.getElementById('correctCount').textContent = correctAnswers;
  document.getElementById('totalCount').textContent = total;
  
  let message = '';
  if (score === 100) {
    message = 'Perfect! You\'re a safety expert!';
    document.querySelector('.result-icon').textContent = '🏆';
  } else if (score >= 80) {
    message = 'Excellent work! You have great knowledge!';
    document.querySelector('.result-icon').textContent = '🎉';
  } else if (score >= 60) {
    message = 'Good job! Keep learning to improve!';
    document.querySelector('.result-icon').textContent = '👍';
  } else {
    message = 'Keep practicing! Review the lesson and try again.';
    document.querySelector('.result-icon').textContent = '📚';
  }
  
  document.getElementById('resultMessage').textContent = message;
  document.getElementById('quizResultModal').classList.add('active');
  
  saveQuizProgress(lessons[currentLesson].title, correctAnswers, total);
}

function saveQuizProgress(quizId, score, totalQuestions) {
  // Token no longer needed for API calls
  fetch(`${API_URL}/quiz-progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quizType: 'first-aid',
      quizId: quizId.toLowerCase(),
      score,
      totalQuestions
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Quiz progress saved:', data);
  })
  .catch(error => {
    console.error('Error saving quiz progress:', error);
  });
}