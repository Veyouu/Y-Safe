// Shared Utilities for Y-SAFE Application
const API_URL = window.location.origin + '/api';

// Common database operations
export async function syncCompletedTopicsWithDatabase() {
    const token = localStorage.getItem('y-safe-token');
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_URL}/lesson-progress`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return false;
        
        const data = await response.json();
        const dbProgress = data.progress || {};
        
        const completedTopics = {};
        dbProgress.forEach(lesson => {
            if (lesson.completed) {
                completedTopics[lesson.lesson_id] = true;
            }
        });
        
        localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
        return completedTopics;
    } catch (e) {
        console.error('Error syncing completed topics:', e);
        return false;
    }
}

// Get current user ID from token
export async function getCurrentUserId() {
    const token = localStorage.getItem('y-safe-token');
    if (!token) return null;
    
    try {
        const response = await fetch(`${API_URL}/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.user?.id || null;
    } catch (e) {
        console.error('Error getting user:', e);
        return null;
    }
}

// Load completed topics from localStorage
export function loadCompletedTopics() {
    try {
        return JSON.parse(localStorage.getItem('y-safe-completed-topics') || '{}');
    } catch (e) {
        console.error('Error loading completed topics:', e);
        return {};
    }
}

// Save lesson progress to database
export async function saveLessonProgress(lessonId, completed) {
    const token = localStorage.getItem('y-safe-token');
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_URL}/lesson-progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ lessonId, completed })
        });
        return response.ok;
    } catch (error) {
        console.error('Error saving lesson progress:', error);
        return false;
    }
}

// Save quiz progress to database
export async function saveQuizProgress(quizType, quizId, score, totalQuestions) {
    const token = localStorage.getItem('y-safe-token');
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_URL}/quiz-progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quizType, quizId, score, totalQuestions })
        });
        return response.ok;
    } catch (error) {
        console.error('Error saving quiz progress:', error);
        return false;
    }
}

// Common modal functions
export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
}

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

export function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Common UI updates
export function updateLessonCard(lessonId, isCompleted) {
    const card = document.querySelector(`[data-lesson="${lessonId}"]`);
    if (card) {
        if (isCompleted) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    }
}

export function updateCompletedTopicsCount(completedTopics, totalTopics, elementId = 'completedTopics') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = completedTopics;
    }
}

export function updateQuizButton(quizBtnId = 'safetyQuizBtn', completedCount, totalCount) {
    const quizBtn = document.getElementById(quizBtnId);
    if (quizBtn) {
        quizBtn.disabled = completedCount < totalCount;
    }
}

// Common quiz functions
export function startQuiz(quizData, title, modalId = 'quizModal') {
    openModal(modalId);
    
    const quizTitle = document.getElementById('quizTitle');
    const totalQuestions = document.getElementById('totalQuestions');
    
    if (quizTitle) quizTitle.textContent = title;
    if (totalQuestions) totalQuestions.textContent = quizData.length;
}

export function showQuestion(question, options, currentIndex, total) {
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const currentEl = document.getElementById('currentQuestion');
    
    if (!questionEl || !optionsEl || !currentEl) return;
    
    questionEl.textContent = question;
    currentEl.textContent = currentIndex + 1;
    
    optionsEl.innerHTML = '';
    options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option';
        optionEl.textContent = option;
        optionEl.onclick = () => selectQuizOption(index, optionEl);
        optionsEl.appendChild(optionEl);
    });
    
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = true;
}

export function selectQuizOption(index, element) {
    document.querySelectorAll('.quiz-option').forEach(opt => 
        opt.classList.remove('selected'));
    
    element.classList.add('selected');
    
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = false;
    
    return index;
}

export function showQuizResults(correct, total, modalId = 'quizResultModal') {
    const percentage = Math.round((correct / total) * 100);
    
    const correctEl = document.getElementById('correctCount');
    const totalEl = document.getElementById('totalCount');
    const scoreEl = document.getElementById('resultScore');
    const messageEl = document.getElementById('resultMessage');
    
    if (correctEl) correctEl.textContent = correct;
    if (totalEl) totalEl.textContent = total;
    if (scoreEl) scoreEl.textContent = `${percentage}%`;
    
    if (messageEl) {
        let message = '';
        if (percentage >= 80) {
            message = 'Excellent! You have mastered this topic!';
        } else if (percentage >= 60) {
            message = 'Good job! You understand the basics well.';
        } else {
            message = 'Keep learning! Review the lessons and try again.';
        }
        messageEl.textContent = message;
    }
    
    closeModal('quizModal');
    openModal(modalId);
}

// Common event listeners
export function setupCommonEventListeners() {
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Modal close buttons with class
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
}

// Utility functions
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Authentication utilities
export function checkAuth() {
    const token = localStorage.getItem('y-safe-token');
    return !!token;
}

export function logout() {
    localStorage.removeItem('y-safe-token');
    localStorage.removeItem('y-safe-user');
    window.location.href = 'index.html';
}