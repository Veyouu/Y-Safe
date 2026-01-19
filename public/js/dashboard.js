const API_URL = window.location.origin + '/api';

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  setupFeatureCardListeners();
  setupAdminLogin();
  setupTutorial();
});

function setupTutorial() {
  const closeBtn = document.getElementById('closeTutorial');
  const tutorialSection = document.querySelector('.tutorial-section');

  closeBtn.addEventListener('click', () => {
    tutorialSection.style.display = 'none';
    // Save preference to localStorage
    localStorage.setItem('y-safe-tutorial-closed', 'true');
  });

  // Check if user has already closed tutorial
  if (localStorage.getItem('y-safe-tutorial-closed') === 'true') {
    tutorialSection.style.display = 'none';
  }
}

function loadDashboard() {
  // Get user data from localStorage (from login.js)
  const userStr = localStorage.getItem('y-safe-user');
  const token = localStorage.getItem('y-safe-token');
  
  let userName = 'Guest';
  let userSection = '';
  let isGuest = true;
  
  if (userStr && token) {
    try {
      const user = JSON.parse(userStr);
      userName = user.name || 'Guest';
      userSection = user.section || '';
      isGuest = user.isGuest || false;
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  // Set user name in header
  document.getElementById('userName').textContent = userName;
  
  // Set welcome message
  if (isGuest) {
    document.getElementById('welcomeMessage').textContent = 'Welcome to Y-SAFE!';
  } else if (userSection) {
    document.getElementById('welcomeMessage').textContent = `Welcome to Y-SAFE, ${userName} from ${userSection}!`;
  } else {
    document.getElementById('welcomeMessage').textContent = `Welcome to Y-SAFE, ${userName}!`;
  }
  
  // Set default progress to 0 (will be updated by API if available)
  document.getElementById('lessonsCompleted').textContent = '0';
  document.getElementById('quizzesTaken').textContent = '0';
  document.getElementById('averageScore').textContent = '0%';
  
  // If we have a token, try to fetch progress from API
  if (token) {
    fetchProgress(token);
  }
}

function fetchProgress(token) {
  fetch(`${API_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    fetchLessonProgress(token);
    fetchQuizProgress(token);
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
  });
}

function fetchLessonProgress(token) {
  fetch(`${API_URL}/lesson-progress`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const lessonsCompleted = data.progress ? data.progress.length : 0;
    document.getElementById('lessonsCompleted').textContent = lessonsCompleted;
  })
  .catch(error => {
    console.error('Error fetching lesson progress:', error);
    document.getElementById('lessonsCompleted').textContent = '0';
  });
}

function fetchQuizProgress(token) {
  fetch(`${API_URL}/quiz-progress/first-aid`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const quizzesTaken = data.progress ? data.progress.length : 0;
    let averageScore = 0;

    if (data.progress && data.progress.length > 0) {
      const totalScore = data.progress.reduce((sum, p) => sum + p.score, 0);
      const totalPossible = data.progress.reduce((sum, p) => sum + p.total_questions, 0);
      averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    }

    document.getElementById('quizzesTaken').textContent = quizzesTaken;
    document.getElementById('averageScore').textContent = `${averageScore}%`;
  })
  .catch(error => {
    console.error('Error fetching quiz progress:', error);
    document.getElementById('quizzesTaken').textContent = '0';
    document.getElementById('averageScore').textContent = '0%';
  });
}

function setupFeatureCardListeners() {
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      const page = card.dataset.page;
      window.location.href = `${page}.html`;
    });
  });
}

// Admin Login Button Function
function setupAdminLogin() {
  const adminBtn = document.getElementById('adminLoginBtn');

  adminBtn.addEventListener('click', () => {
    window.location.href = 'admin-login.html';
  });
}
