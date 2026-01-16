const API_URL = window.location.origin + '/api';

document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('guestBtn').addEventListener('click', handleGuestLogin);

function handleLogin(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const section = document.getElementById('section').value.trim();
  const nameError = document.getElementById('nameError');
  const submitBtn = document.querySelector('#loginForm button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');

  nameError.textContent = '';

  if (!name) {
    nameError.textContent = 'Please enter your name';
    return;
  }

  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';

  fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      section,
      isGuest: false
    })
  })
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('y-safe-token', data.token);
    localStorage.setItem('y-safe-user', JSON.stringify(data.user));
    localStorage.removeItem('y-safe-completed-topics');
    window.location.href = 'dashboard.html';
  })
  .catch(error => {
    console.error('Login error:', error);
    nameError.textContent = 'Connection error. Please check your internet and try again.';
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  });
}

function handleGuestLogin() {
  const name = document.getElementById('name').value.trim();
  const section = document.getElementById('section').value.trim();
  const nameError = document.getElementById('nameError');
  const guestBtn = document.getElementById('guestBtn');

  nameError.textContent = '';

  // Name is optional for guests - no validation needed

  guestBtn.textContent = 'Loading...';

  fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      section,
      isGuest: true
    })
  })
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('y-safe-token', data.token);
    localStorage.setItem('y-safe-user', JSON.stringify(data.user));
    localStorage.removeItem('y-safe-completed-topics');
    window.location.href = 'dashboard.html';
  })
  .catch(error => {
    console.error('Guest login error:', error);
    nameError.textContent = 'Connection error. Please check your internet and try again.';
    guestBtn.textContent = 'Continue as Guest';
  });
}

function checkAuth() {
  const token = localStorage.getItem('y-safe-token');
  const user = localStorage.getItem('y-safe-user');
  
  if (token && user) {
    return JSON.parse(user);
  }
  return null;
}

document.addEventListener('DOMContentLoaded', () => {
  const user = checkAuth();
  if (user && window.location.pathname.endsWith('index.html') || user && window.location.pathname === '/') {
    window.location.href = 'dashboard.html';
  }
});
