document.addEventListener('DOMContentLoaded', () => {
  console.log('Y-SAFE Index Page loaded');
  
  // Check if user is already logged in
  checkExistingUser();
  
  const registrationForm = document.getElementById('registrationForm');
  const guestBtn = document.getElementById('guestBtn');
  const API_URL = window.location.origin + '/api';

  function checkExistingUser() {
    const token = localStorage.getItem('user-token');
    const userInfo = localStorage.getItem('user-info');
    
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log('User already logged in:', user);
        window.location.href = 'dashboard.html';
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-info');
      }
    }
  }

  if (registrationForm) {
    registrationForm.addEventListener('submit', handleRegistration);
  }
  
  if (guestBtn) {
    guestBtn.addEventListener('click', handleGuestLogin);
  }

  function handleRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const section = document.getElementById('userSection').value.trim();
    const nameError = document.getElementById('nameError');
    const submitBtn = registrationForm.querySelector('button[type="submit"]');
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
      if (data.token) {
        localStorage.setItem('user-token', data.token);
        localStorage.setItem('user-info', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    })
    .catch(error => {
      console.error('Registration error:', error);
      nameError.textContent = error.message || 'Registration failed';
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    });
  }

  function handleGuestLogin() {
    guestBtn.textContent = 'Loading...';
    guestBtn.disabled = true;

    fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: 'Guest', 
        section: '', 
        isGuest: true 
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('user-token', data.token);
        localStorage.setItem('user-info', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } else {
        throw new Error(data.error || 'Guest login failed');
      }
    })
    .catch(error => {
      console.error('Guest login error:', error);
      guestBtn.textContent = 'Continue as Guest';
      guestBtn.disabled = false;
    });
  }
});