const API_URL = window.location.origin + '/api';

document.addEventListener('DOMContentLoaded', () => {
  checkAuthAndLoadData();
  setupFeatureCardListeners();
  setupLogoutButton();
});

function checkAuthAndLoadData() {
  const token = localStorage.getItem('y-safe-token');
  const user = localStorage.getItem('y-safe-user');

  if (!token || !user) {
    window.location.href = 'index.html';
    return;
  }

  const userData = JSON.parse(user);
  document.getElementById('userName').textContent = userData.name;
  document.getElementById('welcomeMessage').textContent = `Welcome, ${userData.name}!`;

  fetchProgress(token);
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

function setupLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('y-safe-token');
    localStorage.removeItem('y-safe-user');
    window.location.href = 'index.html';
  });
}

function getUserData() {
  const user = localStorage.getItem('y-safe-user');
  return user ? JSON.parse(user) : null;
}

function getToken() {
  return localStorage.getItem('y-safe-token');
}
