const API_URL = window.location.origin + '/api';

let currentUserId = null;
let completedTopics = {};

async function syncCompletedTopicsWithDatabase() {
  const token = localStorage.getItem('y-safe-token');
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_URL}/lesson-progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return false;
    
    const data = await response.json();
    const dbProgress = data.progress || {};
    
    completedTopics = {};
    dbProgress.forEach(lesson => {
      if (lesson.completed) {
        completedTopics[lesson.lesson_id] = true;
      }
    });
    
    localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
    return true;
  } catch (e) {
    console.error('Error syncing completed topics:', e);
    return false;
  }
}

// Track completed topics
try {
  completedTopics = JSON.parse(localStorage.getItem('y-safe-completed-topics') || '{}');
} catch (e) {
  console.error('Error loading completed topics:', e);
  completedTopics = {};
}

// Main lesson quiz data
const mainLessonQuiz = {
  essentials: {
    title: 'First Aid Essentials Quiz',
    questions: [
      {
        question: 'First aid plays an important role during emergencies. What best describes the main purpose of first aid?',
        options: ['To replace doctors', 'To give immediate care before professional help arrives', 'To cure all injuries', 'To diagnose diseases'],
        correct: 1
      },
      {
        question: 'Power interruptions often happen during disasters. Which emergency item provides light and helps people see in the dark?',
        options: ['Loud signaling device', 'Flashlight with batteries', 'Protective hand covering', 'Breathing protection gear'],
        correct: 1
      },
      {
        question: 'In emergency situations, access to clean water is limited. Why is drinking water an important part of emergency supplies?',
        options: ['For cleaning floors', 'To prevent dehydration', 'For cooking meals', 'For washing clothes'],
        correct: 1
      },
      {
        question: 'When giving first aid to an injured person, protecting yourself is important. Which item helps prevent direct contact with blood or body fluids?',
        options: ['Respiratory covering', 'Insulating cloth', 'Gloves', 'Audible alert device'],
        correct: 2
      },
      {
        question: 'In situations where help is needed but shouting is difficult, which emergency item is used to call attention and signal for help?',
        options: ['Decoration', 'Signaling for help', 'Playing games', 'Calling friends'],
        correct: 1
      }
    ]
  }
};

// First aid essentials items with lessons
const essentials = {
  flashlight: {
    title: 'Flashlight with Batteries',
    content: `
      <div class="lesson-text">
          <h3>Flashlight with Batteries</h3>
          <div class="lesson-image">
            <img src="images/flashlight with batteries.png" alt="Flashlight with batteries">
          </div>
          <p>A flashlight is an essential item in any first aid kit or emergency preparedness kit.</p>
          
          <h4>Purpose:</h4>
          <ul>
            <li>Provides light during power outages or dark conditions</li>
            <li>Helps signal for help in emergencies</li>
            <li>Aids in examining injuries in low light</li>
            <li>Can be used to navigate in dark environments</li>
          </ul>
          
          <h4>Features to Look For:</h4>
          <ul>
            <li>LED bulbs for longer battery life</li>
            <li>Water-resistant construction</li>
            <li>Extra batteries included</li>
            <li>Compact and durable design</li>
          </ul>
          
          <h4>Tips:</h4>
          <ul>
            <li>Check batteries regularly</li>
            <li>Keep in easily accessible location</li>
            <li>Consider rechargeable options</li>
          </ul>
      </div>
    `
  },
  water: {
    title: 'Drinking Water',
    content: `
      <div class="lesson-text">
          <h3>Drinking Water</h3>
          <div class="lesson-image">
            <img src="images/drinking water.png" alt="Drinking water">
          </div>
          <p>Clean drinking water is crucial for survival and first aid situations.</p>
          
          <h4>Importance:</h4>
          <ul>
            <li>Prevents dehydration during emergencies</li>
            <li>Essential for wound cleaning</li>
            <li>Helps regulate body temperature</li>
            <li>Needed for taking medications</li>
          </ul>
          
          <h4>Storage Guidelines:</h4>
          <ul>
            <li>Store at least 1 gallon per person per day</li>
            <li>Keep in cool, dark place</li>
            <li>Replace every 6 months</li>
            <li>Use sealed, food-grade containers</li>
          </ul>
          
          <h4>Emergency Uses:</h4>
          <ul>
            <li>Cleaning wounds when no sterile water available</li>
            <li>Rehydration after injury or illness</li>
            <li>Cooling burns (as last resort)</li>
          </ul>
      </div>
    `
  },
  food: {
    title: 'Ready-to-Eat Food',
    content: `
      <div class="lesson-text">
          <h3>Ready-to-Eat Food</h3>
          <div class="lesson-image">
            <img src="images/readty to eat.png" alt="Ready-to-eat food">
          </div>
          <p>Non-perishable food items are essential for emergency preparedness.</p>
          
          <h4>Types to Include:</h4>
          <ul>
            <li>Energy bars and granola</li>
            <li>Dried fruits and nuts</li>
            <li>Canned goods with pull tabs</li>
            <li>Peanut butter and crackers</li>
          </ul>
          
          <h4>Storage Tips:</h4>
          <ul>
            <li>Check expiration dates regularly</li>
            <li>Store in cool, dry place</li>
            <li>Rotate supplies every 6 months</li>
            <li>Include manual can opener</li>
          </ul>
          
          <h4>Considerations:</h4>
          <ul>
            <li>Dietary restrictions</li>
            <li>Easy preparation</li>
            <li>Minimal water requirement</li>
            <li>High energy content</li>
          </ul>
      </div>
    `
  },
  firstaid: {
    title: 'First Aid Kit',
    content: `
      <div class="lesson-text">
          <h3>First Aid Kit</h3>
          <div class="lesson-image">
            <img src="images/firstaidkit.png" alt="First aid kit">
          </div>
          <p>A comprehensive first aid kit is cornerstone of emergency preparedness.</p>
          
          <h4>Essential Contents:</h4>
          <ul>
            <li>Various bandage sizes</li>
            <li>Antiseptic wipes and solution</li>
            <li>Pain relievers</li>
            <li>Tweezers and scissors</li>
            <li>Medical tape and gauze</li>
          </ul>
          
          <h4>Additional Items:</h4>
          <ul>
            <li>Emergency contact information</li>
            <li>Medical history forms</li>
            <li>First aid manual</li>
            <li>Emergency blanket</li>
          </ul>
          
          <h4>Maintenance:</h4>
          <ul>
            <li>Check monthly for expired items</li>
            <li>Restock used supplies immediately</li>
            <li>Keep in waterproof container</li>
            <li>Store in accessible location</li>
          </ul>
        </div>
      </div>
    `
  },
  triangular: {
    title: 'Triangular Bandage',
    content: `
      <div class="lesson-text">
        <h3>Triangular Bandage</h3>
        <div class="lesson-image">
          <img src="images/triangular bandage.png" alt="Triangular Bandage">
        </div>
          <p>A versatile bandage that can be used in multiple emergency situations.</p>
          
          <h4>Common Uses:</h4>
          <ul>
            <li>Creating arm slings for injuries</li>
            <li>Securing dressings on wounds</li>
            <li>Immobilizing sprains and strains</li>
            <li>Applying pressure to control bleeding</li>
            <li>Making tourniquets (emergency only)</li>
          </ul>
          
          <h4>Proper Folding Techniques:</h4>
          <ul>
            <li>Cravat fold for narrow bandages</li>
            <li>Broad fold for large areas</li>
            <li>Saddle fold for special applications</li>
          </ul>
          
          <h4>Advantages:</h4>
          <ul>
            <li>Reusable and washable</li>
            <li>Multiple configurations</li>
            <li>Lightweight and compact</li>
            <li>Cost-effective</li>
          </ul>
      </div>
    `
  },
  adhesive: {
    title: 'Adhesive Bandage',
    content: `
      <div class="lesson-text">
          <h3>Adhesive Bandage</h3>
          <div class="lesson-image">
            <img src="images/adhesive bandage.png" alt="Adhesive Bandage">
          </div>
          <p>Adhesive bandages are essential for protecting minor cuts and scrapes.</p>
          
          <h4>Types Available:</h4>
          <ul>
            <li>Standard strip bandages</li>
            <li>Butterfly closures for deep cuts</li>
            <li>Finger tip bandages</li>
            <li>Knuckle bandages</li>
            <li>Large wound dressings</li>
          </ul>
          
          <h4>Proper Application:</h4>
          <ul>
            <li>Clean wound thoroughly first</li>
            <li>Choose appropriate size</li>
            <li>Apply sterile pad to wound</li>
            <li>Ensure good adhesive contact</li>
            <li>Change daily or when wet</li>
          </ul>
          
          <h4>Storage:</h4>
          <ul>
            <li>Keep in original packaging</li>
            <li>Store in cool, dry place</li>
            <li>Check regularly for damage</li>
          </ul>
      </div>
    `
  },
  whistle: {
    title: 'Emergency Whistle',
    content: `
      <div class="lesson-text">
          <h3>Emergency Whistle</h3>
          <div class="lesson-image">
            <img src="images/emergency whistle.png" alt="Emergency whistle">
          </div>
          <p>A whistle is a crucial signaling device in emergency situations.</p>
          
          <h4>Purpose:</h4>
          <ul>
            <li>Signals for rescue over long distances</li>
            <li>Works when voice is lost or weak</li>
            <li>Universal emergency signal</li>
            <li>Requires minimal energy to use</li>
          </ul>
          
          <h4>Emergency Signals:</h4>
          <ul>
            <li>Three blasts: Universal distress signal</li>
            <li>One blast: Attention needed</li>
            <li>Continuous blast: Immediate danger</li>
          </ul>
          
          <h4>Features to Consider:</h4>
          <ul>
            <li>Pealess design (won't freeze)</li>
            <li>High decibel rating</li>
            <li>Lanyard for easy access</li>
            <li>Bright color for visibility</li>
          </ul>
      </div>
    `
  },
  mask: {
    title: 'Face Mask (for Dust)',
    content: `
      <div class="lesson-text">
          <h3>Face Mask for Dust Protection</h3>
          <div class="lesson-image">
            <img src="images/facemask.png" alt="Face mask">
          </div>
          <p>Face masks protect respiratory system from harmful particles.</p>
          
          <h4>Types of Protection:</h4>
          <ul>
            <li>Dust particles from debris</li>
            <li>Smoke inhalation</li>
            <li>Chemical fumes</li>
            <li>Disease prevention</li>
          </ul>
          
          <h4>Emergency Situations:</h4>
          <ul>
            <li>Natural disasters (earthquakes, fires)</li>
            <li>Building collapses</li>
            <li>Industrial accidents</li>
            <li>Pandemic outbreaks</li>
          </ul>
          
          <h4>Proper Usage:</h4>
          <ul>
            <li>Ensure proper fit over nose and mouth</li>
            <li>Check for gaps around edges</li>
            <li>Change when wet or damaged</li>
            <li>Dispose properly after use</li>
          </ul>
      </div>
    `
  },
  gloves: {
    title: 'Gloves',
    content: `
      <div class="lesson-text">
          <h3>Gloves</h3>
          <div class="lesson-image">
            <img src="images/safety gloves.png" alt="Gloves">
          </div>
          <p>Protective gloves are essential for both the rescuer and the injured person.</p>
          
          <h4>Protection Benefits:</h4>
          <ul>
            <li>Prevents disease transmission</li>
            <li>Protects from bloodborne pathogens</li>
            <li>Keeps wounds clean during treatment</li>
            <li>Provides grip in slippery conditions</li>
          </ul>
          
          <h4>Types of Gloves:</h4>
          <ul>
            <li>Latex examination gloves</li>
            <li>Nitrile for latex allergies</li>
            <li>Vinyl for basic protection</li>
            <li>Heavy-duty for cleanup</li>
          </ul>
          
          <h4>Proper Use:</h4>
          <ul>
            <li>Check for tears before use</li>
            <li>Change between patients</li>
            <li>Dispose properly after use</li>
            <li>Wash hands after removal</li>
          </ul>
      </div>
    `
  },
  blanket: {
    title: 'Small Blanket',
    content: `
      <div class="lesson-text">
          <h3>Small Blanket</h3>
          <div class="lesson-image">
            <img src="images/small blanket.png" alt="Small blanket">
          </div>
          <p>An emergency blanket provides warmth and protection in various situations.</p>
          
          <h4>Uses in First Aid:</h4>
          <ul>
            <li>Preventing hypothermia</li>
            <li>Comfort for shock victims</li>
            <li>Making temporary shelters</li>
            <li>Ground insulation</li>
          </ul>
          
          <h4>Types Available:</h4>
          <ul>
            <li>Wool for warmth</li>
            <li>Emergency space blankets</li>
            <li>Fleece for lightweight warmth</li>
            <li>All-purpose utility blankets</li>
          </ul>
          
          <h4>Emergency Blanket Features:</h4>
          <ul>
            <li>Compact and lightweight</li>
            <li>Water-resistant backing</li>
            <li>Bright color for visibility</li>
            <li>Durable construction</li>
          </ul>
      </div>
    `
  }
};

let currentLesson = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

document.addEventListener('DOMContentLoaded', () => {
  try {
    async function initializePage() {
      await syncCompletedTopicsWithDatabase();
      
      setupBackButton();
      setupEssentialItems();
      setupModal();
      updateQuizButton();
      updateCompletedTopics();
      
      // Universal fallback for dashboard button
      document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.id === 'backBtn' || target.classList.contains('btn-back') || 
            target.closest('#backBtn') || target.closest('.btn-back')) {
          e.preventDefault();
          console.log('Universal dashboard button handler triggered');
          window.location.href = 'dashboard.html';
        }
      });
      
      console.log('Essentials page loaded successfully');
    }
    
    initializePage();
  } catch (error) {
    console.error('Error initializing essentials page:', error);
  }
});

// Authentication check removed - no longer needed

function setupBackButton() {
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    // Remove any existing event listeners
    backBtn.replaceWith(backBtn.cloneNode(true));
    const newBackBtn = document.getElementById('backBtn');
    
    newBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Dashboard button clicked - going to dashboard');
      window.location.href = 'dashboard.html';
    });
    
    // Also add onclick as backup
    newBackBtn.onclick = function(e) {
      e.preventDefault();
      console.log('Dashboard onclick triggered - going to dashboard');
      window.location.href = 'dashboard.html';
    };
  } else {
    console.error('Back button not found!');
  }
}

function setupEssentialItems() {
  const items = document.querySelectorAll('.kit-item');
  
  items.forEach(item => {
    const itemId = item.dataset.item;
    
    // Mark as completed if already done
    if (completedTopics[itemId]) {
      item.classList.add('completed');
    }
    
    // Handle "View Lesson" button clicks
    const lessonBtn = item.querySelector('.btn-lesson');
    if (lessonBtn) {
      lessonBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the item click
        openLesson(itemId);
      });
    }
    
    // Handle item click (image/title area)
    item.addEventListener('click', (e) => {
      // Don't open lesson if clicking on button
      if (!e.target.classList.contains('btn-lesson')) {
        openLesson(itemId);
      }
    });
  });
}

function openLesson(itemId) {
  const lesson = essentials[itemId];
  if (!lesson) return;
  
  currentLesson = { title: lesson.title, id: itemId };
  document.getElementById('modalTitle').textContent = lesson.title;
  document.getElementById('modalBody').innerHTML = lesson.content;
  document.getElementById('lessonModal').classList.add('active');
  
  // Update Mark as Completed button state
  const markBtn = document.getElementById('markCompletedBtn');
  if (completedTopics[itemId]) {
    markBtn.textContent = 'Completed';
    markBtn.disabled = true;
    markBtn.classList.add('btn-secondary');
    markBtn.classList.remove('btn-success');
  } else {
    markBtn.textContent = 'Mark as Completed';
    markBtn.disabled = false;
    markBtn.classList.add('btn-success');
    markBtn.classList.remove('btn-secondary');
  }
}

function setupModal() {
  const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Close all modals
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = 'auto';
    });
  });

  document.getElementById('markCompletedBtn')?.addEventListener('click', () => {
    markTopicCompleted();
  });

  // Setup main quiz button
  document.getElementById('essentialsQuizBtn')?.addEventListener('click', () => {
    startMainQuiz('essentials');
  });

  // Setup quiz modals
  setupQuizModals();
}

function setupQuizModals() {
  // Quiz modal
  document.querySelectorAll('#quizModal .modal-close, #quizModal .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('quizModal').classList.remove('active');
    });
  });

  // Result modal
  document.querySelectorAll('#quizResultModal .modal-close, #quizResultModal .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('quizResultModal').classList.remove('active');
    });
  });

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
}

let selectedOption = null;

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

function selectOption(index, element) {
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.classList.remove('selected'));
  
  element.classList.add('selected');
  selectedOption = index;
  document.getElementById('nextQuestionBtn').disabled = false;
}

async function markTopicCompleted() {
  const itemId = getCurrentLessonId();
  if (!itemId || completedTopics[itemId]) return;
  
  const token = localStorage.getItem('y-safe-token');
  if (token) {
    try {
      const response = await fetch(`${API_URL}/lesson-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId: itemId,
          completed: true
        })
      });
      const data = await response.json();
      console.log('Lesson progress saved:', data);
    } catch (error) {
      console.error('Error saving lesson progress:', error);
    }
  }
  
  completedTopics[itemId] = true;
  localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
  
  // Update lesson card
  updateLessonCard(itemId, true);
  
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

function updateLessonCard(itemId, isCompleted) {
  const card = document.querySelector(`[data-item="${itemId}"]`);
  if (card) {
    if (isCompleted) {
      card.classList.add('completed');
    } else {
      card.classList.remove('completed');
    }
  }
}

function getCurrentLessonId() {
  // Return the current lesson ID from currentLesson object
  return currentLesson ? currentLesson.id : null;
}

function updateQuizButton() {
  const essentialItems = Object.keys(essentials);
  const completedCount = essentialItems.filter(id => completedTopics[id]).length;
  
  const quizBtn = document.getElementById('essentialsQuizBtn');
  if (quizBtn) {
    if (completedCount === essentialItems.length) {
      quizBtn.disabled = false;
      quizBtn.textContent = 'Start Quiz';
    } else {
      quizBtn.disabled = true;
      quizBtn.textContent = `Complete ${essentialItems.length - completedCount} more topic${essentialItems.length - completedCount > 1 ? 's' : ''}`;
    }
  }
}

function updateCompletedTopics() {
  const essentialItems = Object.keys(essentials);
  const completedCount = essentialItems.filter(id => completedTopics[id]).length;
  
  const completedSpan = document.getElementById('completedTopics');
  const totalSpan = document.getElementById('totalTopics');
  if (completedSpan && totalSpan) {
    completedSpan.textContent = completedCount;
    totalSpan.textContent = essentialItems.length;
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
  
  saveQuizProgress('essentials', correctAnswers, total);
}

function saveQuizProgress(quizId, score, totalQuestions) {
  console.log('Saving quiz progress:', { quizId, score, totalQuestions });
  
  const token = localStorage.getItem('y-safe-token');
  if (!token) {
    console.error('No token found, cannot save quiz progress');
    alert('Please login to save your quiz progress');
    return;
  }

  fetch(`${API_URL}/quiz-progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      quizType: 'essentials',
      quizId: quizId.toLowerCase(),
      score,
      totalQuestions
    })
  })
  .then(response => {
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Quiz progress saved successfully:', data);
    if (data.success) {
      console.log('Quiz saved to database');
    }
  })
  .catch(error => {
    console.error('Error saving quiz progress:', error);
    alert('Failed to save quiz progress. Please try again.');
  });
}