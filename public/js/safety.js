const API_URL = 'http://localhost:3000/api';

const lessons = {
  fire: {
    title: 'Fire Safety',
    content: `
      <h3>Fire Prevention</h3>
      <h4>In the Kitchen</h4>
      <ul>
        <li>Never leave cooking unattended</li>
        <li>Keep flammable items away from the stove</li>
        <li>Turn off appliances when not in use</li>
        <li>Check that gas stoves are properly turned off</li>
      </ul>
      
      <h4>Electrical Safety</h4>
      <ul>
        <li>Don't overload electrical outlets</li>
        <li>Replace damaged cords immediately</li>
        <li>Unplug appliances when not in use</li>
        <li>Keep water away from electrical devices</li>
      </ul>
      
      <h4>General Safety</h4>
      <ul>
        <li>Install smoke detectors</li>
        <li>Have fire extinguishers accessible</li>
        <li>Keep matches and lighters away from children</li>
        <li>Know the location of fire exits</li>
      </ul>
      
      <h3>What to Do in Case of Fire</h3>
      <h4>SMALL FIRE (controlled)</h4>
      <ul>
        <li>Use a fire extinguisher (PASS method)</li>
        <li>P - Pull the pin</li>
        <li>A - Aim at the base</li>
        <li>S - Squeeze the handle</li>
        <li>S - Sweep side to side</li>
      </ul>
      
      <h4>LARGE FIRE (uncontrolled)</h4>
      <ul>
        <li>EVACUATE immediately</li>
        <li>Don't try to fight it yourself</li>
        <li>Close doors behind you</li>
        <li>Call emergency services (911)</li>
        <li>Don't use elevators</li>
      </ul>
      
      <h3>If Your Clothes Catch Fire</h3>
      <ul>
        <li>STOP - don't run</li>
        <li>DROP - to the ground</li>
        <li>ROLL - back and forth</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What does PASS stand for when using a fire extinguisher?',
        options: ['Pull, Aim, Spray, Sweep', 'Pull, Aim, Squeeze, Sweep', 'Press, Aim, Squeeze, Sweep', 'Push, Aim, Squeeze, Sweep'],
        correct: 1
      },
      {
        question: 'What should you do if there is a large, uncontrolled fire?',
        options: ['Try to fight it yourself', 'Use water to extinguish it', 'Evacuate immediately', 'Close all windows'],
        correct: 2
      },
      {
        question: 'Should you use elevators during a fire?',
        options: ['Yes, they are faster', 'No, never use elevators', 'Only if stairs are blocked', 'Only on lower floors'],
        correct: 1
      },
      {
        question: 'What should you do if your clothes catch fire?',
        options: ['Run to get help', 'Stop, Drop, and Roll', 'Jump into water', 'Take them off quickly'],
        correct: 1
      },
      {
        question: 'How often should you check smoke detectors?',
        options: ['Once a year', 'Every month', 'Every 6 months', 'Never, they work forever'],
        correct: 1
      }
    ]
  },
  disasters: {
    title: 'Natural Disasters',
    content: `
      <h3>Earthquakes</h3>
      <h4>During an Earthquake</h4>
      <ul>
        <li>Drop to the ground</li>
        <li>Take cover under sturdy furniture</li>
        <li>Hold on to the furniture</li>
        <li>Stay away from windows</li>
        <li>Stay indoors until shaking stops</li>
      </ul>
      
      <h4>If You Are Outside</h4>
      <ul>
        <li>Move to an open area</li>
        <li>Away from buildings, trees, and power lines</li>
        <li>Stay in the open</li>
      </ul>
      
      <h3>Floods</h3>
      <h4>Preparation</h4>
      <ul>
        <li>Know your area's flood risk</li>
        <li>Prepare an emergency kit</li>
        <li>Know evacuation routes</li>
        <li>Monitor weather alerts</li>
      </ul>
      
      <h4>During a Flood</h4>
      <ul>
        <li>Move to higher ground immediately</li>
        <li>Don't walk through moving water</li>
        <li>Don't drive through flooded roads</li>
        <li>Avoid downed power lines</li>
        <li>Follow evacuation orders</li>
      </ul>
      
      <h3>Typhoons</h3>
      <h4>Before a Typhoon</h4>
      <ul>
        <li>Prepare emergency supplies</li>
        <li>Secure your home</li>
        <li>Charge devices</li>
        <li>Stay informed</li>
      </ul>
      
      <h4>During a Typhoon</h4>
      <ul>
        <li>Stay indoors</li>
        <li>Away from windows</li>
        <li>Don't go outside during the eye</li>
        <li>Stay updated on weather reports</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What should you do during an earthquake?',
        options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Stand near windows'],
        correct: 1
      },
      {
        question: 'Should you walk through moving floodwater?',
        options: ['Yes, if it\'s shallow', 'No, never', 'Only with a partner', 'Only if you can swim'],
        correct: 1
      },
      {
        question: 'What should you do if you are outside during an earthquake?',
        options: ['Find a building', 'Go to an open area away from structures', 'Stay where you are', 'Lie down on the ground'],
        correct: 1
      },
      {
        question: 'Is it safe to drive through flooded roads?',
        options: ['Yes, if you drive slowly', 'No, never', 'Only if the water is below the bumper', 'Yes, if you have a big car'],
        correct: 1
      },
      {
        question: 'What should you do during the eye of a typhoon?',
        options: ['Go outside to check', 'Stay indoors', 'Go for a walk', 'Take photos'],
        correct: 1
      }
    ]
  },
  road: {
    title: 'Road Safety',
    content: `
      <h3>Pedestrian Safety</h3>
      <h4>Crossing the Road</h4>
      <ul>
        <li>Always cross at crosswalks</li>
        <li>Look left, right, then left again</li>
        <li>Make eye contact with drivers</li>
        <li>Don't assume drivers see you</li>
        <li>Don't use phones while crossing</li>
      </ul>
      
      <h4>Walking on the Road</h4>
      <ul>
        <li>Walk on sidewalks when available</li>
        <li>If no sidewalk, walk facing traffic</li>
        <li>Wear bright or reflective clothing at night</li>
        <li>Stay alert and aware of surroundings</li>
      </ul>
      
      <h3>Bicycle Safety</h3>
      <h4>Equipment</h4>
      <ul>
        <li>Always wear a helmet</li>
        <li>Use lights and reflectors</li>
        <li>Check brakes regularly</li>
        <li>Keep tires properly inflated</li>
      </ul>
      
      <h4>Riding Rules</h4>
      <ul>
        <li>Follow traffic rules</li>
        <li>Ride with traffic, not against it</li>
        <li>Use hand signals</li>
        <li>Stay in bike lanes when available</li>
        <li>Don't wear headphones</li>
      </ul>
      
      <h3>Passenger Safety</h3>
      <h4>In Vehicles</h4>
      <ul>
        <li>Always wear seatbelt</li>
        <li>Sit properly in your seat</li>
        <li>Don't distract the driver</li>
        <li>Enter and exit safely</li>
        <li>Wait for the vehicle to stop completely</li>
      </ul>
      
      <h4>Public Transportation</h4>
      <ul>
        <li>Wait at designated stops</li>
        <li>Enter and exit safely</li>
        <li>Hold on while vehicle is moving</li>
        <li>Keep belongings secure</li>
      </ul>
    `,
    quiz: [
      {
        question: 'When crossing the road, which direction should you look first?',
        options: ['Right', 'Left', 'Up', 'Behind you'],
        correct: 1
      },
      {
        question: 'If there is no sidewalk, which way should you walk?',
        options: ['With traffic', 'Against traffic', 'In the middle of the road', 'It doesn\'t matter'],
        correct: 1
      },
      {
        question: 'Should you wear headphones while riding a bicycle?',
        options: ['Yes, for music', 'No, never', 'Only if you ride slowly', 'Only in bike lanes'],
        correct: 1
      },
      {
        question: 'When should you fasten your seatbelt in a vehicle?',
        options: ['Only on highways', 'Only when the driver asks', 'Always', 'Only if you feel unsafe'],
        correct: 2
      },
      {
        question: 'What is the most important safety equipment for cyclists?',
        options: ['Gloves', 'Sunglasses', 'Helmet', 'Water bottle'],
        correct: 2
      }
    ]
  },
  school: {
    title: 'School Safety',
    content: `
      <h3>Creating a Safe Learning Environment</h3>
      <h4>In the Classroom</h4>
      <ul>
        <li>Keep walkways clear</li>
        <li>Store backpacks properly</li>
        <li>Report damaged furniture</li>
        <li>Don't run in hallways</li>
        <li>Follow teacher instructions</li>
      </ul>
      
      <h4>Laboratory Safety</h4>
      <ul>
        <li>Always follow safety rules</li>
        <li>Wear protective equipment</li>
        <li>Never eat or drink in labs</li>
        <li>Report accidents immediately</li>
        <li>Know emergency procedures</li>
      </ul>
      
      <h3>Emergency Procedures</h3>
      <h4>Fire Drills</h4>
      <ul>
        <li>Stay calm and quiet</li>
        <li>Follow designated exit routes</li>
        <li>Stay with your class</li>
        <li>Walk, don't run</li>
        <li>Listen to teachers</li>
      </ul>
      
      <h4>Earthquake Drills</h4>
      <ul>
        <li>Drop, Cover, and Hold On</li>
        <li>Stay away from windows</li>
        <li>Don't leave until instructed</li>
        <li>Follow evacuation routes</li>
        <li>Stay with your class</li>
      </ul>
      
      <h3>Personal Safety</h3>
      <h4>With Others</h4>
      <ul>
        <li>Respect personal boundaries</li>
        <li>Report bullying</li>
        <li>Treat others with respect</li>
        <li>Seek help when needed</li>
        <li>Look out for classmates</li>
      </ul>
      
      <h4>Belongings</h4>
      <ul>
        <li>Keep valuable items secure</li>
        <li>Don't share lockers</li>
        <li>Label personal items</li>
        <li>Report theft immediately</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What should you do if you see damaged furniture in school?',
        options: ['Ignore it', 'Move it yourself', 'Report it to a teacher or staff', 'Try to fix it'],
        correct: 2
      },
      {
        question: 'During a fire drill, what should you do?',
        options: ['Run as fast as possible', 'Walk calmly to the exit', 'Stay in the classroom', 'Call your parents'],
        correct: 1
      },
      {
        question: 'Should you eat or drink in a science laboratory?',
        options: ['Yes, if you\'re careful', 'No, never', 'Only water is allowed', 'Only when the teacher isn\'t looking'],
        correct: 1
      },
      {
        question: 'What should you do if you witness bullying?',
        options: ['Join in', 'Ignore it', 'Report it to a teacher', 'Take a video'],
        correct: 2
      },
      {
        question: 'Where should you store your backpack in the classroom?',
        options: ['In the aisle', 'In the designated storage area', 'On your desk', 'Anywhere you want'],
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
      quizType: 'safety',
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
