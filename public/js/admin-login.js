const API_URL = window.location.origin + '/api/admin';

document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

function handleAdminLogin(e) {
  e.preventDefault();
  
  const password = document.getElementById('adminPassword').value;
  const passwordError = document.getElementById('passwordError');
  const submitBtn = document.querySelector('#adminLoginForm button[type="submit"]');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');

  passwordError.textContent = '';

  if (!password) {
    passwordError.textContent = 'Please enter a password';
    return;
  }

  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';

  fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem('admin-token', data.token);
      window.location.href = 'admin.html';
    } else {
      throw new Error(data.error || 'Login failed');
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    passwordError.textContent = error.message || 'Invalid password';
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  });
}

function checkAdminAuth() {
  const token = localStorage.getItem('admin-token');
  if (token) {
    return token;
  }
  return null;
}
