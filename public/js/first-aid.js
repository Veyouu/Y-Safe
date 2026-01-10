const API_URL = 'http://localhost:3000/api';

const lessons = {
  cpr: {
    title: 'CPR (Cardiopulmonary Resuscitation)',
    content: `
      <h3>What is CPR?</h3>
      <p>CPR is a lifesaving technique used in emergencies when someone's breathing or heartbeat has stopped. This can happen after cardiac arrest, drowning, or electric shock.</p>
      
      <h3>When to Perform CPR</h3>
      <ul>
        <li>The person is unresponsive and not breathing</li>
        <li>The person has no pulse</li>
        <li>You find someone collapsed and unresponsive</li>
      </ul>
      
      <h3>CPR Steps (CAB Method)</h3>
      <h4>1. Compressions</h4>
      <ul>
        <li>Place the heel of your hand on the center of the person's chest</li>
        <li>Put your other hand on top and interlock fingers</li>
        <li>Push hard and fast - at least 2 inches deep</li>
        <li>Aim for 100-120 compressions per minute</li>
      </ul>
      
      <h4>2. Airway</h4>
      <ul>
        <li>Tilt the head back and lift the chin</li>
        <li>Check for breathing (look, listen, feel)</li>
        <li>If not breathing, begin rescue breaths</li>
      </ul>
      
      <h4>3. Breathing</h4>
      <ul>
        <li>Pinch the nose shut</li>
        <li>Give 2 rescue breaths</li>
        <li>Watch for chest rise</li>
        <li>Continue cycles of 30 compressions and 2 breaths</li>
      </ul>
      
      <h3>Important Tips</h3>
      <ul>
        <li>Don't stop until help arrives</li>
        <li>If you're not trained, do hands-only CPR</li>
        <li>Call for help immediately</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is the recommended compression rate for CPR?',
        options: ['50-60 per minute', '80-90 per minute', '100-120 per minute', '150+ per minute'],
        correct: 2
      },
      {
        question: 'What does CAB stand for in CPR?',
        options: ['Check, Airway, Breathing', 'Compressions, Airway, Breathing', 'Call, Assess, Breathe', 'Chest, Arms, Back'],
        correct: 1
      },
      {
        question: 'How deep should chest compressions be?',
        options: ['At least 1 inch', 'At least 2 inches', 'At least 3 inches', 'Just until you feel resistance'],
        correct: 1
      },
      {
        question: 'What is the ratio of compressions to breaths in CPR?',
        options: ['10:1', '20:2', '30:2', '50:1'],
        correct: 2
      },
      {
        question: 'If you are not trained in CPR, what should you do?',
        options: ['Do nothing', 'Do hands-only CPR', 'Wait for professional help', 'Try to find a doctor'],
        correct: 1
      }
    ]
  },
  burns: {
    title: 'Treating Burns',
    content: `
      <h3>Types of Burns</h3>
      <h4>First-Degree Burns</h4>
      <ul>
        <li>Affects only the outer layer of skin</li>
        <li>Red, painful, and swollen</li>
        <li>Example: mild sunburn</li>
      </ul>
      
      <h4>Second-Degree Burns</h4>
      <ul>
        <li>Affects the outer and second layer of skin</li>
        <li>Blisters, severe pain, and redness</li>
        <li>Example: hot liquid spill</li>
      </ul>
      
      <h4>Third-Degree Burns</h4>
      <ul>
        <li>Damages all layers of skin</li>
        <li>White, black, or charred skin</li>
        <li>May not hurt due to nerve damage</li>
      </ul>
      
      <h3>First Aid for Minor Burns</h3>
      <ul>
        <li>Cool the burn with cool running water for 10-15 minutes</li>
        <li>Do NOT use ice - it can cause more damage</li>
        <li>Remove tight items near the burn</li>
        <li>Cover with a sterile, non-stick bandage</li>
        <li>Take over-the-counter pain relievers if needed</li>
      </ul>
      
      <h3>What NOT to Do</h3>
      <ul>
        <li>Do NOT apply butter, oil, or greasy substances</li>
        <li>Do NOT break blisters</li>
        <li>Do NOT apply ice directly</li>
        <li>Do NOT remove clothing stuck to the burn</li>
      </ul>
      
      <h3>When to Seek Medical Help</h3>
      <ul>
        <li>Large or deep burns</li>
        <li>Burns on face, hands, feet, or genitals</li>
        <li>Electrical or chemical burns</li>
        <li>Signs of infection</li>
      </ul>
    `,
    quiz: [
      {
        question: 'How long should you cool a minor burn with water?',
        options: ['1-2 minutes', '5-10 minutes', '10-15 minutes', '30 minutes'],
        correct: 2
      },
      {
        question: 'What should you NOT apply to a burn?',
        options: ['Cool water', 'Butter or oil', 'Sterile bandage', 'Ice'],
        correct: 1
      },
      {
        question: 'Which type of burn affects all layers of skin?',
        options: ['First-degree', 'Second-degree', 'Third-degree', 'Fourth-degree'],
        correct: 2
      },
      {
        question: 'Should you break blisters from a burn?',
        options: ['Yes, always', 'No, never', 'Only if they are large', 'Only if they are painful'],
        correct: 1
      },
      {
        question: 'When should you seek medical help for a burn?',
        options: ['Only if it hurts', 'Only if it is large or deep', 'For all burns', 'Never'],
        correct: 1
      }
    ]
  },
  choking: {
    title: 'Choking Emergency Response',
    content: `
      <h3>Recognizing Choking</h3>
      <h4>Universal Sign of Choking</h4>
      <ul>
        <li>Hands clutching the throat</li>
        <li>Inability to talk, breathe, or cough</li>
        <li>Face turning blue or purple</li>
        <li>Panic and distress</li>
      </ul>
      
      <h3>What to Do If Someone Is Choking</h3>
      <h4>Step 1: Assess the Situation</h4>
      <ul>
        <li>Ask "Are you choking?"</li>
        <li>If they can speak or cough forcefully, encourage them to keep coughing</li>
        <li>If they cannot speak, breathe, or cough - ACT IMMEDIATELY</li>
      </ul>
      
      <h4>Step 2: Call for Help</h4>
      <ul>
        <li>Shout for help or call emergency services (911)</li>
        <li>Don't leave the person alone</li>
      </ul>
      
      <h4>Step 3: Perform the Heimlich Maneuver</h4>
      <ul>
        <li>Stand behind the person</li>
        <li>Wrap your arms around their waist</li>
        <li>Make a fist with one hand</li>
        <li>Place it just above the navel</li>
        <li>Grasp the fist with your other hand</li>
        <li>Give quick, upward thrusts</li>
        <li>Continue until the object is expelled</li>
      </ul>
      
      <h3>If Person Becomes Unconscious</h3>
      <ul>
        <li>Lower them to the ground</li>
        <li>Begin CPR immediately</li>
        <li>Check airway before giving breaths</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is the universal sign of choking?',
        options: ['Coughing loudly', 'Hands clutching the throat', 'Crying', 'Running in circles'],
        correct: 1
      },
      {
        question: 'Where should you place your fist for the Heimlich maneuver?',
        options: ['On the chest', 'Below the ribs, just above the navel', 'On the back', 'On the shoulder'],
        correct: 1
      },
      {
        question: 'What should you do if the person can still speak or cough?',
        options: ['Perform Heimlich immediately', 'Encourage them to keep coughing', 'Give them water', 'Call 911'],
        correct: 1
      },
      {
        question: 'What direction should the Heimlich thrusts go?',
        options: ['Downward', 'Sideways', 'Upward and inward', 'In a circular motion'],
        correct: 2
      },
      {
        question: 'What should you do if the choking person becomes unconscious?',
        options: ['Leave them and call 911', 'Perform CPR', 'Wait for help to arrive', 'Shake them awake'],
        correct: 1
      }
    ]
  },
  wounds: {
    title: 'Wound Care',
    content: `
      <h3>Types of Wounds</h3>
      <h4>Abrasions (Scrapes)</h4>
      <ul>
        <li>Superficial damage to the skin</li>
        <li>Often painful due to exposed nerve endings</li>
        <li>Common from falls or rubbing</li>
      </ul>
      
      <h4>Lacerations (Cuts)</h4>
      <ul>
        <li>Deep cuts in the skin</li>
        <li>May bleed heavily</li>
        <li>Caused by sharp objects</li>
      </ul>
      
      <h4>Punctures</h4>
      <ul>
        <li>Deep, narrow wounds</li>
        <li>Caused by nails, needles, or teeth</li>
        <li>High risk of infection</li>
      </ul>
      
      <h3>First Aid for Minor Wounds</h3>
      <h4>Step 1: Stop the Bleeding</h4>
      <ul>
        <li>Apply direct pressure with a clean cloth</li>
        <li>Elevate the injured area if possible</li>
        <li>Continue pressure for 5-10 minutes</li>
      </ul>
      
      <h4>Step 2: Clean the Wound</h4>
      <ul>
        <li>Wash your hands first</li>
        <li>Rinse with clean water</li>
        <li>Use mild soap around the wound</li>
        <li>Remove any debris with clean tweezers</li>
      </ul>
      
      <h4>Step 3: Protect the Wound</h4>
      <ul>
        <li>Apply antibiotic ointment if available</li>
        <li>Cover with a sterile bandage</li>
        <li>Change bandage daily or when wet</li>
      </ul>
      
      <h3>When to Seek Medical Help</h3>
      <ul>
        <li>Bleeding doesn't stop after 10 minutes</li>
        <li>Deep cut requiring stitches</li>
        <li>Object embedded in wound</li>
        <li>Signs of infection</li>
      </ul>
    `,
    quiz: [
      {
        question: 'How long should you apply pressure to stop bleeding?',
        options: ['1-2 minutes', '3-5 minutes', '5-10 minutes', '20+ minutes'],
        correct: 2
      },
      {
        question: 'What type of wound is caused by nails or needles?',
        options: ['Abrasion', 'Laceration', 'Puncture', 'Avulsion'],
        correct: 2
      },
      {
        question: 'Should you remove an object embedded in a wound?',
        options: ['Yes, immediately', 'No, leave it and seek medical help', 'Yes, but very carefully', 'Only if it is small'],
        correct: 1
      },
      {
        question: 'How often should you change a bandage?',
        options: ['Every hour', 'Daily or when wet', 'Only when it falls off', 'Never'],
        correct: 1
      },
      {
        question: 'What should you do before cleaning a wound?',
        options: ['Apply antibiotic ointment', 'Wash your hands', 'Cover it immediately', 'Apply pressure'],
        correct: 1
      }
    ]
  },
  fractures: {
    title: 'Fractures and Broken Bones',
    content: `
      <h3>Recognizing Fractures</h3>
      <h4>Common Signs and Symptoms</h4>
      <ul>
        <li>Severe pain</li>
        <li>Swelling and bruising</li>
        <li>Deformity or visible bone</li>
        <li>Inability to move the injured area</li>
        <li>Tenderness to touch</li>
        <li>Crepitus (grinding sound)</li>
      </ul>
      
      <h3>Types of Fractures</h3>
      <h4>Closed Fracture</h4>
      <ul>
        <li>Bone is broken but skin is intact</li>
        <li>Less risk of infection</li>
      </ul>
      
      <h4>Open Fracture</h4>
      <ul>
        <li>Bone breaks through skin</li>
        <li>Visible bone</li>
        <li>High risk of infection</li>
      </ul>
      
      <h3>First Aid for Fractures</h3>
      <h4>Do NOT:</h4>
      <ul>
        <li>Do NOT try to realign the bone</li>
        <li>Do NOT move the person unless necessary</li>
        <li>Do NOT apply ice directly to skin</li>
        <li>Do NOT straighten a deformed limb</li>
      </ul>
      
      <h4>DO:</h4>
      <ul>
        <li>Immobilize the injured area</li>
        <li>Apply a splint if possible</li>
        <li>Apply ice wrapped in cloth</li>
        <li>Elevate the injured area</li>
        <li>Call for emergency help</li>
        <li>Keep the person calm</li>
      </ul>
      
      <h3>When to Call Emergency Services</h3>
      <ul>
        <li>Open fractures</li>
        <li>Severe deformity</li>
        <li>Fracture of head, neck, or spine</li>
        <li>No pulse below injury</li>
        <li>Numbness or paralysis</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is a fracture called when the bone breaks through the skin?',
        options: ['Closed fracture', 'Open fracture', 'Greenstick fracture', 'Hairline fracture'],
        correct: 1
      },
      {
        question: 'Should you try to realign a broken bone?',
        options: ['Yes, gently', 'No, never', 'Only if it's a minor break', 'Ask the person to do it'],
        correct: 1
      },
      {
        question: 'What does crepitus mean in relation to fractures?',
        options: ['Swelling', 'Grinding sound', 'Bruising', 'Pain'],
        correct: 1
      },
      {
        question: 'How should you apply ice to a fractured area?',
        options: ['Directly on the skin', 'Wrapped in cloth', 'On a hot pack', 'Not at all'],
        correct: 1
      },
      {
        question: 'What should you do if there is no pulse below a fracture?',
        options: ['Apply heat', 'Call emergency services immediately', 'Massage the area', 'Exercise the limb'],
        correct: 1
      }
    ]
  }
};

let currentLesson = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupLessonCards();
  setupModal();
  setupBackButton();
});

function checkAuth() {
  const token = localStorage.getItem('y-safe-token');
  if (!token) {
    window.location.href = 'index.html';
  }
}

function setupLessonCards() {
  const lessonCards = document.querySelectorAll('.lesson-card');
  
  lessonCards.forEach(card => {
    card.querySelector('.btn-lesson').addEventListener('click', (e) => {
      e.stopPropagation();
      const lessonId = card.dataset.lesson;
      openLesson(lessonId);
    });
  });
}

function openLesson(lessonId) {
  currentLesson = lessons[lessonId];
  document.getElementById('modalTitle').textContent = currentLesson.title;
  document.getElementById('modalBody').innerHTML = currentLesson.content;
  document.getElementById('lessonModal').classList.add('active');
}

function setupModal() {
  const modal = document.getElementById('lessonModal');
  const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });

  document.getElementById('startQuizBtn').addEventListener('click', () => {
    modal.classList.remove('active');
    startQuiz();
  });
}

function setupBackButton() {
  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
}

function startQuiz() {
  currentQuiz = [...currentLesson.quiz];
  currentQuestionIndex = 0;
  correctAnswers = 0;
  
  document.getElementById('quizTitle').textContent = `${currentLesson.title} Quiz`;
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
  document.querySelector('.quiz-progress-bar').style.setProperty('--progress', `${progressPercent}%`);
  document.querySelector('.quiz-progress-bar::before').style.width = `${progressPercent}%`;
  
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

document.getElementById('nextQuestionBtn').addEventListener('click', () => {
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

document.getElementById('submitQuizBtn').addEventListener('click', () => {
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
    message = 'Perfect! You\'re a first aid expert!';
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
  
  saveQuizProgress(currentLesson.title, correctAnswers, total);
}

function saveQuizProgress(quizId, score, totalQuestions) {
  const token = localStorage.getItem('y-safe-token');
  
  fetch(`${API_URL}/quiz-progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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

document.querySelector('#quizResultModal .modal-close-btn').addEventListener('click', () => {
  document.getElementById('quizResultModal').classList.remove('active');
});

document.querySelector('#quizResultModal .modal-close').addEventListener('click', () => {
  document.getElementById('quizResultModal').classList.remove('active');
});
