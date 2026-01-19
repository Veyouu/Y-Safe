// Safety Module - Clean and Organized
const API_URL = window.location.origin + '/api';

let currentUserId = null;
let completedTopics = {};
let currentLesson = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let selectedOption = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Safety page loaded');
        await syncCompletedTopicsWithDatabase();
        setupEventListeners();
        updateCompletedTopics();
        updateQuizButton();
    } catch (error) {
        console.error('Error initializing safety page:', error);
    }
});

// Database synchronization
async function syncCompletedTopicsWithDatabase() {
    const token = localStorage.getItem('y-safe-token');
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_URL}/lesson-progress`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return false;
        
        const data = await response.json();
        const dbProgress = data.progress || {};
        
        completedTopics = {};
        dbProgress.forEach(lesson => {
            if (lesson.completed) {
                completedTopics[lesson.lesson_id] = true;
            }
        });
        
        localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
        return true;
    } catch (e) {
        console.error('Error syncing completed topics:', e);
        return false;
    }
}

// Get current user ID from token
async function getCurrentUserId() {
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
function loadCompletedTopics() {
    try {
        completedTopics = JSON.parse(localStorage.getItem('y-safe-completed-topics') || '{}');
    } catch (e) {
        console.error('Error loading completed topics:', e);
        completedTopics = {};
    }
}

// Lesson data with complete Do's and Don'ts
const lessons = {
    fire: {
        title: 'Fire Safety',
        content: `
            <h3>Fire Safety</h3>
            <p>Fire safety is important to prevent injuries and loss of life during fire incidents.</p>
            
            <h4>Do's</h4>
            <ul>
                <li>Do keep flammable materials away from heat, stoves, and open flames.</li>
                <li>Do unplug appliances when not in use.</li>
                <li>Do check electrical wires regularly for damage.</li>
                <li>Do install smoke alarms and keep them working.</li>
                <li>Do know fire exit routes in your home, school, or workplace.</li>
                <li>Do keep a fire extinguisher in accessible areas.</li>
                <li>Do stay calm and think clearly during a fire emergency.</li>
                <li>Do crawl low if there is heavy smoke.</li>
                <li>Do cover your nose and mouth with a wet cloth if possible.</li>
                <li>Do help children, elderly, and PWDs during evacuation if safe to do so.</li>
                <li>Do call emergency services once you are in a safe place.</li>
            </ul>
            
            <h4>Don'ts</h4>
            <ul>
                <li>Don't overload electrical outlets or extension cords.</li>
                <li>Don't use damaged wires or appliances.</li>
                <li>Don't leave cooking unattended.</li>
                <li>Don't play with matches, lighters, or candles.</li>
                <li>Don't block fire exits or stairways.</li>
                <li>Don't use elevators during a fire.</li>
                <li>Don't panic or push others while evacuating.</li>
                <li>Don't re-enter a burning building to get belongings.</li>
                <li>Don't throw water on electrical or oil fires.</li>
                <li>Don't hide in rooms—always move toward an exit if safe.</li>
            </ul>
        `,
        quiz: []
    },
    earthquake: {
        title: 'Earthquake Warning Signs',
        content: `
            <h3>Earthquake Warning Signs</h3>
            <p>Earthquake warning signs help people prepare and respond quickly before and during shaking.</p>
            
            <h4>Do's</h4>
            <ul>
                <li>Do stay alert if you feel unusual ground movement or hear rumbling sounds.</li>
                <li>Do secure heavy furniture, cabinets, and appliances to walls.</li>
                <li>Do practice "Duck, Cover, and Hold" regularly at home and school.</li>
                <li>Do stay indoors during shaking if you are already inside.</li>
                <li>Do protect your head and neck using your arms or a pillow.</li>
                <li>Do move to an open and safe area after the shaking stops.</li>
                <li>Do check for injuries and help others if it is safe.</li>
                <li>Do turn off gas, water, and electricity if there are signs of damage.</li>
                <li>Do follow official announcements and emergency instructions.</li>
            </ul>
            
            <h4>Don'ts</h4>
            <ul>
                <li>Don't panic or run while the ground is shaking.</li>
                <li>Don't use elevators during or after an earthquake.</li>
                <li>Don't stand near windows, mirrors, shelves, or hanging objects.</li>
                <li>Don't go outside immediately during strong shaking.</li>
                <li>Don't light matches or candles if you smell gas.</li>
                <li>Don't spread rumors or false information.</li>
                <li>Don't re-enter damaged buildings until authorities say it is safe.</li>
                <li>Don't ignore aftershocks—they can be as dangerous as the first quake.</li>
            </ul>
        `,
        quiz: []
    },
    evacuation: {
        title: 'Importance of Evacuation Plans and Safe Areas for Typhoons',
        content: `
            <h3>Importance of Evacuation Plans and Safe Areas for Typhoons</h3>
            <p>Evacuation plans and safe areas protect lives during strong typhoons and flooding.</p>
            
            <h4>Do's</h4>
            <ul>
                <li>Do know your community's evacuation routes and nearest safe shelters.</li>
                <li>Do follow weather advisories and warnings from official authorities.</li>
                <li>Do prepare an emergency go-bag with food, water, medicines, flashlight, and important documents.</li>
                <li>Do evacuate early when instructed, especially if you live in flood-prone or coastal areas.</li>
                <li>Do assist children, elderly, pregnant women, and PWDs during evacuation.</li>
                <li>Do turn off electricity and gas before leaving your home if advised.</li>
                <li>Do stay inside evacuation centers until officials declare it safe to return.</li>
                <li>Do keep calm and cooperate with local disaster response teams.</li>
            </ul>
            
            <h4>Don'ts</h4>
            <ul>
                <li>Don't ignore typhoon warnings or evacuation orders.</li>
                <li>Don't wait until flooding becomes severe before evacuating.</li>
                <li>Don't cross flooded roads or rivers.</li>
                <li>Don't bring too many belongings—prioritize safety and essentials.</li>
                <li>Don't spread unverified information or rumors.</li>
                <li>Don't return home early without clearance from authorities.</li>
                <li>Don't stay in weak structures during strong winds and heavy rain.</li>
            </ul>
        `,
        quiz: []
    },
    electrical_safety: {
        title: 'Electrical Safety',
        content: `
            <h3>Electrical Safety</h3>
            <p>Electrical safety prevents accidents and injuries caused by electricity.</p>
            
            <h4>Do's</h4>
            <ul>
                <li>Do keep electrical appliances away from water.</li>
                <li>Do use proper electrical cords and extension cords.</li>
                <li>Do check for damaged wires before using appliances.</li>
                <li>Do turn off electricity before repairing electrical items.</li>
                <li>Do use circuit breakers and fuses correctly.</li>
                <li>Do keep flammable materials away from electrical sources.</li>
                <li>Do teach children about electrical safety.</li>
                <li>Do call a professional for major electrical repairs.</li>
            </ul>
            
            <h4>Don'ts</h4>
            <ul>
                <li>Don't touch electrical items with wet hands.</li>
                <li>Don't overload electrical outlets.</li>
                <li>Don't use damaged electrical cords.</li>
                <li>Don't attempt electrical repairs without proper knowledge.</li>
                <li>Don't use electrical appliances near water sources.</li>
                <li>Don't ignore burning smells from electrical items.</li>
                <li>Don't put metal objects in electrical outlets.</li>
            </ul>
        `,
        quiz: []
    },
    water_safety: {
        title: 'Water Safety',
        content: `
            <h3>Water Safety</h3>
            <p>Water safety prevents drowning and water-related accidents.</p>
            
            <h4>Do's</h4>
            <ul>
                <li>Do learn how to swim if you frequently go near water.</li>
                <li>Do wear life jackets when boating or in deep water.</li>
                <li>Do supervise children near water at all times.</li>
                <li>Do check water depth before diving or jumping.</li>
                <li>Do learn basic rescue techniques.</li>
                <li>Do follow posted warning signs near water bodies.</li>
                <li>Do swim with a buddy when possible.</li>
                <li>Do learn CPR and first aid for water emergencies.</li>
            </ul>
            
            <h4>Don'ts</h4>
            <ul>
                <li>Don't swim alone in unfamiliar areas.</li>
                <li>Don't swim during bad weather or storms.</li>
                <li>Don't dive in shallow or unknown waters.</li>
                <li>Don't ignore warning signs or barriers.</li>
                <li>Don't consume alcohol before swimming.</li>
                <li>Don't overestimate your swimming ability.</li>
                <li>Don't leave children unattended near water.</li>
            </ul>
        `,
        quiz: []
    },
    road_safety: {
        title: 'Road Safety',
        content: `
            <h3>Road Safety</h3>
            <p>Road safety prevents accidents and injuries on streets and highways.</p>
            
            <h4>Do's</h4>
            <ul>
                <li>Do follow traffic rules and signs at all times.</li>
                <li>Do use pedestrian crossings when walking.</li>
                <li>Do wear seatbelts when in vehicles.</li>
                <li>Do wear helmets when riding motorcycles or bicycles.</li>
                <li>Do check both ways before crossing streets.</li>
                <li>Do use appropriate signals when turning.</li>
                <li>Do maintain safe distance from other vehicles.</li>
                <li>Do avoid using mobile phones while driving or walking.</li>
            </ul>
            
            <h4>Don'ts</h4>
            <ul>
                <li>Don't jaywalk or cross roads illegally.</li>
                <li>Don't drink and drive.</li>
                <li>Don't exceed speed limits.</li>
                <li>Don't use mobile phones while driving.</li>
                <li>Don't ignore traffic signals and signs.</li>
                <li>Don't drive when tired or sleepy.</li>
                <li>Don't overload vehicles beyond capacity.</li>
            </ul>
        `,
        quiz: []
    }
};

// Main quiz data
const mainLessonQuiz = {
    safety: {
        title: 'Safety Awareness Quiz',
        questions: [{
                question: 'Safety awareness helps people avoid accidents and injuries. Which statement best explains why being aware of risks can save lives?',
                options: ['It encourages people to rely on emergency responders at all times', 'It allows individuals to focus less on warning signs', 'It helps people recognize danger early and take right action', 'It guarantees that accidents will never happen'],
                correct: 2
            },
            {
                question: 'Fire accidents often happen due to unsafe practices at home or school. Which action helps reduce the risk of fire incidents?',
                options: ['Using multiple extension cords for convenience', 'Repairing appliances only after damage occurs', 'Keeping flammable materials away from heat and open flames', 'Leaving electrical devices on standby mode'],
                correct: 2
            },
            {
                question: 'During a fire, smoke inhalation can be very dangerous. What is the safest action to do when there is thick smoke in the area?',
                options: ['Run fast', 'Stay low and cover your nose and mouth', 'Use elevator', 'Hide under a table'],
                correct: 1
            },
            {
                question: 'Being prepared before a fire emergency is important. What information should every person know in advance?',
                options: ['Where to buy firecrackers', 'Location of fire exits and extinguishers', 'Where to park vehicles', 'Where to charge phones'],
                correct: 1
            },
            {
                question: 'Earthquakes may happen without warning, but there are signs that can alert people. Which of the following may indicate an approaching earthquake?',
                options: ['Heavy rain', 'Strong wind', 'Unusual ground movement or rumbling', 'Brownout'],
                correct: 2
            },
            {
                question: 'Electrical accidents can cause serious injuries. Which action helps prevent electrical hazards at home?',
                options: ['Using electrical devices with wet hands', 'Overloading power outlets with many devices', 'Keeping appliances away from water sources', 'Ignoring damaged electrical cords'],
                correct: 2
            },
            {
                question: 'Water safety is important for preventing drowning. What should you always do when participating in water activities?',
                options: ['Swim alone to practice freely', 'Wear appropriate life jackets when needed', 'Ignore depth warnings', 'Consume alcohol before swimming'],
                correct: 1
            },
            {
                question: 'Road safety rules help prevent accidents. Which practice is most important for pedestrian safety?',
                options: ['Crossing streets anywhere convenient', 'Using designated pedestrian crossings', 'Walking while using mobile phone', 'Ignoring traffic signals to save time'],
                correct: 1
            },
            {
                question: 'During typhoon season, preparedness is crucial. What should families do to stay safe during strong typhoons?',
                options: ['Wait until flooding starts before evacuating', 'Ignore weather warnings if they seem exaggerated', 'Prepare emergency kits and follow evacuation orders', 'Stay in weak structures to protect belongings'],
                correct: 2
            }
        ]
    }
};

// Event setup
function setupEventListeners() {
    // Lesson cards
    document.querySelectorAll('.btn-lesson').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.lesson-card');
            if (card && card.dataset.lesson) {
                openLesson(card.dataset.lesson);
            }
        });
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Mark completed button
    const markBtn = document.getElementById('markCompletedBtn');
    if (markBtn) {
        markBtn.addEventListener('click', markTopicCompleted);
    }

    // Quiz button
    const quizBtn = document.getElementById('safetyQuizBtn');
    if (quizBtn) {
        quizBtn.addEventListener('click', () => startMainQuiz('safety'));
    }

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
}

// Open lesson modal
function openLesson(lessonId) {
    const lesson = lessons[lessonId];
    if (!lesson) {
        console.error('Lesson not found:', lessonId);
        return;
    }
    
    currentLesson = lessonId;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('lessonModal');
    
    if (!modalTitle || !modalBody || !modal) {
        console.error('Modal elements not found');
        return;
    }

    modalTitle.textContent = lesson.title;
    modalBody.innerHTML = lesson.content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Mark topic as completed
async function markTopicCompleted() {
    if (!currentLesson || completedTopics[currentLesson]) return;

    const token = localStorage.getItem('y-safe-token');
    if (token) {
        try {
            const response = await fetch(`${API_URL}/lesson-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    lessonId: currentLesson,
                    completed: true
                })
            });
        } catch (error) {
            console.error('Error saving lesson progress:', error);
        }
    }

    completedTopics[currentLesson] = true;
    localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
    
    updateLessonCard(currentLesson, true);
    updateCompletedTopics();
    updateQuizButton();
    
    // Update button
    const markBtn = document.getElementById('markCompletedBtn');
    if (markBtn) {
        markBtn.textContent = 'Completed';
        markBtn.disabled = true;
        markBtn.classList.add('btn-secondary');
        markBtn.classList.remove('btn-success');
    }
}

// Update lesson card UI
function updateLessonCard(lessonId, isCompleted) {
    const card = document.querySelector(`[data-lesson="${lessonId}"]`);
    if (card) {
        if (isCompleted) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    }
}

// Update completed topics count
function updateCompletedTopics() {
    const completedCount = document.getElementById('completedTopics');
    if (completedCount) {
        completedCount.textContent = Object.keys(completedTopics).filter(key => 
            Object.keys(lessons).includes(key)).length;
    }
}

// Update quiz button
function updateQuizButton() {
    const quizBtn = document.getElementById('safetyQuizBtn');
    const completedCount = Object.keys(completedTopics).filter(key => 
        Object.keys(lessons).includes(key)).length;
    const totalLessons = Object.keys(lessons).length;
    
    if (quizBtn) {
        quizBtn.disabled = completedCount < totalLessons;
    }
}

// Start main quiz
function startMainQuiz(lessonType) {
    currentQuiz = [...mainLessonQuiz[lessonType].questions];
    currentQuestionIndex = 0;
    correctAnswers = 0;

    const quizTitle = document.getElementById('quizTitle');
    const totalQuestions = document.getElementById('totalQuestions');
    const quizModal = document.getElementById('quizModal');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitQuizBtn');

    if (!quizModal || !quizTitle || !totalQuestions) {
        console.error('Quiz modal elements not found');
        return;
    }

    quizTitle.textContent = mainLessonQuiz[lessonType].title;
    totalQuestions.textContent = currentQuiz.length;
    quizModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    showQuestion();
    if (nextBtn) nextBtn.style.display = 'inline-flex';
    if (submitBtn) submitBtn.style.display = 'none';
}

// Show quiz question
function showQuestion() {
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const currentEl = document.getElementById('currentQuestion');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitQuizBtn');

    if (!questionEl || !optionsEl || !currentEl) {
        console.error('Quiz elements not found');
        return;
    }

    const question = currentQuiz[currentQuestionIndex];
    if (!question) return;

    questionEl.textContent = question.question;
    currentEl.textContent = currentQuestionIndex + 1;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option';
        optionEl.textContent = option;
        optionEl.onclick = () => selectOption(index, optionEl);
        optionsEl.appendChild(optionEl);
    });

    if (nextBtn) nextBtn.disabled = true;
    selectedOption = null;
}

// Select quiz option
function selectOption(index, element) {
    document.querySelectorAll('.quiz-option').forEach(opt => 
        opt.classList.remove('selected'));
    
    element.classList.add('selected');
    selectedOption = index;
    
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = false;
}

// Handle next question
function handleNextQuestion() {
    if (selectedOption === null) return;

    if (selectedOption === currentQuiz[currentQuestionIndex].correct) {
        correctAnswers++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex >= currentQuiz.length) {
        showResults();
    } else {
        showQuestion();
    }
}

// Show quiz results
function showResults() {
    const quizModal = document.getElementById('quizModal');
    const resultModal = document.getElementById('quizResultModal');
    
    if (!resultModal || !quizModal) {
        console.error('Result modal not found');
        return;
    }

    const total = currentQuiz.length;
    const percentage = Math.round((correctAnswers / total) * 100);

    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('resultScore').textContent = `${percentage}%`;

    let message = '';
    if (percentage >= 80) {
        message = 'Excellent! You have mastered this topic!';
    } else if (percentage >= 60) {
        message = 'Good job! You understand the basics well.';
    } else {
        message = 'Keep learning! Review the lessons and try again.';
    }

    document.getElementById('resultMessage').textContent = message;

    quizModal.classList.remove('active');
    resultModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    saveQuizProgress('safety', correctAnswers, total);
}

// Save quiz progress
async function saveQuizProgress(quizId, score, totalQuestions) {
    const token = localStorage.getItem('y-safe-token');
    if (!token) return;
    
    try {
        await fetch(`${API_URL}/quiz-progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                quizType: quizId,
                quizId: quizId,
                score,
                totalQuestions
            })
        });
    } catch (error) {
        console.error('Error saving quiz progress:', error);
    }
}

// Setup next question button
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitQuizBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextQuestion);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (selectedOption !== null && 
                selectedOption === currentQuiz[currentQuestionIndex].correct) {
                correctAnswers++;
            }
            showResults();
        });
    }
});