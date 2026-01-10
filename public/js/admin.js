const API_URL = window.location.origin + '/api/admin';

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupLogout();
  loadStats();
  loadUsers();
  setupSearch();
  setupRefreshButtons();
});

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`${tab}-tab`).classList.add('active');

      if (tab === 'users') loadUsers();
      if (tab === 'quizzes') loadQuizzes();
      if (tab === 'lessons') loadLessons();
    });
  });
}

function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

async function loadStats() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    
    document.getElementById('totalUsers').textContent = data.totalUsers;
    document.getElementById('totalQuizzes').textContent = data.totalQuizzes;
    document.getElementById('totalLessons').textContent = data.totalLessons;
    document.getElementById('averageScore').textContent = `${data.averageScore}%`;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    
    displayUsers(data.users);
  } catch (error) {
    console.error('Error loading users:', error);
    displayNoData('usersTableBody', 'No users yet');
  }
}

function displayUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  
  if (!users || users.length === 0) {
    displayNoData('usersTableBody', 'No users registered yet');
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${escapeHtml(user.name)}</td>
      <td>${user.section ? escapeHtml(user.section) : '-'}</td>
      <td>
        <span class="type-badge ${user.is_guest ? 'guest' : 'registered'}">
          ${user.is_guest ? 'Guest' : 'Registered'}
        </span>
      </td>
      <td>${formatDate(user.created_at)}</td>
      <td>
        <button class="btn-view" onclick="viewUser(${user.id})">View</button>
      </td>
    </tr>
  `).join('');
}

async function viewUser(userId) {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`);
    const data = await response.json();
    
    displayUserModal(data);
  } catch (error) {
    console.error('Error loading user details:', error);
  }
}

function displayUserModal(data) {
  const user = data.user;
  const quizzes = data.quizzes || [];
  const lessons = data.lessons || [];

  const avgScore = quizzes.length > 0 
    ? Math.round(quizzes.reduce((sum, q) => sum + (q.score / q.total_questions) * 100, 0) / quizzes.length)
    : 0;

  document.getElementById('detailName').textContent = user.name;
  document.getElementById('detailSection').textContent = user.section || 'Not specified';
  document.getElementById('detailType').textContent = user.is_guest ? 'Guest' : 'Registered';
  document.getElementById('detailJoined').textContent = formatDate(user.created_at);
  document.getElementById('detailQuizzes').textContent = quizzes.length;
  document.getElementById('detailAvgScore').textContent = `${avgScore}%`;
  document.getElementById('detailLessons').textContent = lessons.length;

  document.getElementById('userModal').classList.add('active');
}

async function loadQuizzes() {
  try {
    const response = await fetch(`${API_URL}/quizzes`);
    const data = await response.json();
    
    displayQuizzes(data.quizzes);
  } catch (error) {
    console.error('Error loading quizzes:', error);
    displayNoData('quizzesTableBody', 'No quiz results yet');
  }
}

function displayQuizzes(quizzes) {
  const tbody = document.getElementById('quizzesTableBody');
  
  if (!quizzes || quizzes.length === 0) {
    displayNoData('quizzesTableBody', 'No quiz results yet');
    return;
  }

  tbody.innerHTML = quizzes.map(quiz => {
    const scorePercent = Math.round((quiz.score / quiz.total_questions) * 100);
    const scoreClass = scorePercent >= 80 ? 'high' : scorePercent >= 60 ? 'medium' : 'low';
    
    return `
      <tr>
        <td>
          <strong>${escapeHtml(quiz.user_name)}</strong>
          ${quiz.section ? `<br><small>${escapeHtml(quiz.section)}</small>` : ''}
        </td>
        <td>${formatQuizName(quiz.quiz_type, quiz.quiz_id)}</td>
        <td>
          <span class="score-badge ${scoreClass}">
            ${quiz.score}/${quiz.total_questions} (${scorePercent}%)
          </span>
        </td>
        <td>${formatDate(quiz.completed_at)}</td>
      </tr>
    `;
  }).join('');
}

async function loadLessons() {
  try {
    const response = await fetch(`${API_URL}/lessons`);
    const data = await response.json();
    
    displayLessons(data.lessons);
  } catch (error) {
    console.error('Error loading lessons:', error);
    displayNoData('lessonsTableBody', 'No lesson progress yet');
  }
}

function displayLessons(lessons) {
  const tbody = document.getElementById('lessonsTableBody');
  
  if (!lessons || lessons.length === 0) {
    displayNoData('lessonsTableBody', 'No lesson progress yet');
    return;
  }

  tbody.innerHTML = lessons.map(lesson => `
    <tr>
      <td>
        <strong>${escapeHtml(lesson.user_name)}</strong>
        ${lesson.section ? `<br><small>${escapeHtml(lesson.section)}</small>` : ''}
      </td>
      <td>${formatLessonName(lesson.lesson_id)}</td>
      <td>${formatDate(lesson.completed_at)}</td>
    </tr>
  `).join('');
}

function displayNoData(tableId, message) {
  const tbody = document.getElementById(tableId);
  tbody.innerHTML = `
    <tr>
      <td colspan="5">
        <div class="no-data">
          <div class="no-data-icon">📭</div>
          <h3>${message}</h3>
          <p>Data will appear here as users interact with the site</p>
        </div>
      </td>
    </tr>
  `;
}

function setupSearch() {
  document.getElementById('userSearch').addEventListener('input', (e) => {
    filterTable('usersTableBody', e.target.value, 0);
  });

  document.getElementById('quizSearch').addEventListener('input', (e) => {
    filterTable('quizzesTableBody', e.target.value, 0);
  });

  document.getElementById('lessonSearch').addEventListener('input', (e) => {
    filterTable('lessonsTableBody', e.target.value, 0);
  });
}

function filterTable(tbodyId, searchTerm, searchColumn) {
  const tbody = document.getElementById(tbodyId);
  const rows = tbody.querySelectorAll('tr');
  const searchLower = searchTerm.toLowerCase();

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    let found = false;

    cells.forEach((cell, index) => {
      if (index === searchColumn && cell.textContent.toLowerCase().includes(searchLower)) {
        found = true;
      }
    });

    row.style.display = found || searchTerm === '' ? '' : 'none';
  });
}

function setupRefreshButtons() {
  document.getElementById('refreshUsersBtn').addEventListener('click', () => {
    loadUsers();
    loadStats();
  });

  document.getElementById('refreshQuizzesBtn').addEventListener('click', () => {
    loadQuizzes();
    loadStats();
  });

  document.getElementById('refreshLessonsBtn').addEventListener('click', () => {
    loadLessons();
    loadStats();
  });
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatQuizName(quizType, quizId) {
  const typeNames = {
    'first-aid': 'First Aid',
    'safety': 'Safety',
    'essentials': 'Essentials'
  };
  
  return `${typeNames[quizType] || quizType} - ${formatLessonName(quizId)}`;
}

function formatLessonName(lessonId) {
  const names = {
    'cpr': 'CPR',
    'burns': 'Burns',
    'choking': 'Choking',
    'wounds': 'Wounds',
    'fractures': 'Fractures',
    'fire': 'Fire Safety',
    'disasters': 'Natural Disasters',
    'road': 'Road Safety',
    'school': 'School Safety'
  };
  
  return names[lessonId] || lessonId;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.querySelector('#userModal .modal-close').addEventListener('click', () => {
  document.getElementById('userModal').classList.remove('active');
});
