const API_URL = window.location.origin + '/api';

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  setupFeatureCardListeners();
  setupAdminLogin();
  setupLogout();
  setupTutorial();
  setupWelcomeBanner();
});

function setupWelcomeBanner() {
  const closeBtn = document.getElementById('closeBanner');
  const welcomeBanner = document.getElementById('welcomeBanner');

  closeBtn.addEventListener('click', () => {
    welcomeBanner.style.display = 'none';
    // Save preference to localStorage
    localStorage.setItem('y-safe-banner-closed', 'true');
  });

  // Check if user has already closed banner
  if (localStorage.getItem('y-safe-banner-closed') === 'true') {
    welcomeBanner.style.display = 'none';
  }
}

function setupTutorial() {
  const closeBtn = document.getElementById('closeTutorial');
  const tutorialSection = document.querySelector('.tutorial-section');

  closeBtn.addEventListener('click', () => {
    tutorialSection.style.display = 'none';
    // Save preference to localStorage
    localStorage.setItem('y-safe-tutorial-closed', 'true');
  });

  // Check if user has already closed tutorial - only hide if they have taken quizzes
  const quizzesTaken = parseInt(document.getElementById('quizzesTaken')?.textContent || '0');
  if (localStorage.getItem('y-safe-tutorial-closed') === 'true' && quizzesTaken > 0) {
    tutorialSection.style.display = 'none';
  }
}

function loadDashboard() {
  const token = localStorage.getItem('y-safe-token');
  if (!token) {
    document.getElementById('userName').textContent = 'Guest';
    document.getElementById('welcomeMessage').textContent = 'Welcome to Y-SAFE!';
    document.getElementById('lessonsCompleted').textContent = '0';
    document.getElementById('quizzesTaken').textContent = '0';
    document.getElementById('averageScore').textContent = '0%';
    return;
  }
  fetch(`${API_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('userName').textContent = data.user.name;
    document.getElementById('welcomeMessage').textContent = `Welcome, ${data.user.name}!`;
    fetchProgress(token);
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
    localStorage.removeItem('y-safe-token');
    localStorage.removeItem('y-safe-user');
    window.location.href = '/';
  });
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
  fetch(`${API_URL}/quiz-progress`, {
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

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // Clear ALL storage items
      localStorage.removeItem('y-safe-token');
      localStorage.removeItem('y-safe-user');
      localStorage.removeItem('y-safe-completed-topics');
      localStorage.removeItem('y-safe-banner-closed');
      
      // Clear any session storage
      sessionStorage.clear();
      
      console.log('User logged out successfully');
      window.location.href = '/';
    });
  }
}
