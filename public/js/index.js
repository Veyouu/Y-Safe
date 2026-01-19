document.addEventListener('DOMContentLoaded', () => {
  console.log('Y-SAFE Index Page loaded');
  
  // Check if user is already logged in
  checkExistingUser();
  
  const registrationForm = document.getElementById('registrationForm');
  const guestBtn = document.getElementById('guestBtn');
  const API_URL = window.location.origin + '/api';

  function checkExistingUser() {
    const token = localStorage.getItem('y-safe-token');
    const userInfo = localStorage.getItem('y-safe-user');
    
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log('User already logged in:', user);
        // Redirect to dashboard if user has valid token
        window.location.href = 'dashboard.html';
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('y-safe-token');
        localStorage.removeItem('y-safe-user');
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
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const section = document.getElementById('section').value.trim();
    const name = `${firstName} ${lastName}`.trim();
    
    if (!firstName || !lastName) {
      alert('Please enter both first and last name');
      return;
    }

    const submitBtn = registrationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Loading...';
    submitBtn.disabled = true;

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
        localStorage.setItem('y-safe-token', data.token);
        localStorage.setItem('y-safe-user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    })
    .catch(error => {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  }

  function handleGuestLogin() {
    const originalText = guestBtn.textContent;
    guestBtn.textContent = 'Loading...';
    guestBtn.disabled = true;

    fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: 'Guest User', 
        section: 'N/A', 
        isGuest: true 
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('y-safe-token', data.token);
        localStorage.setItem('y-safe-user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } else {
        throw new Error(data.error || 'Guest login failed');
      }
    })
    .catch(error => {
      console.error('Guest login error:', error);
      alert(error.message || 'Guest login failed');
      guestBtn.textContent = originalText;
      guestBtn.disabled = false;
    });
  }
});