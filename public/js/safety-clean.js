// Safety Module - Clean and Organized
import { 
    syncCompletedTopicsWithDatabase, 
    loadCompletedTopics,
    saveLessonProgress,
    saveQuizProgress,
    closeModal,
    openModal,
    closeAllModals,
    updateLessonCard,
    updateCompletedTopicsCount,
    updateQuizButton,
    showQuestion,
    selectQuizOption,
    showQuizResults,
    setupCommonEventListeners,
    checkAuth
} from './utils.js';

let currentLesson = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let selectedOption = null;
let completedTopics = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Safety page loaded');
        completedTopics = await syncCompletedTopicsWithDatabase() || loadCompletedTopics();
        setupEventListeners();
        updateUI();
    } catch (error) {
        console.error('Error initializing safety page:', error);
    }
});

// Setup event listeners specific to safety page
function setupEventListeners() {
    setupCommonEventListeners();
    
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

    // Next question button
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextQuestion);
    }

    // Submit quiz button
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', showResults);
    }

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
}

// Update UI elements
function updateUI() {
    const completedCount = Object.keys(completedTopics).filter(key => 
        Object.keys(lessons).includes(key)).length;
    const totalLessons = Object.keys(lessons).length;
    
    updateCompletedTopicsCount(completedCount, totalLessons);
    updateQuizButton('safetyQuizBtn', completedCount, totalLessons);
    
    // Update lesson cards
    Object.keys(completedTopics).forEach(lessonId => {
        if (lessons[lessonId]) {
            updateLessonCard(lessonId, true);
        }
    });
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
        `
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
        `
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
        `
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
            }
        ]
    }
};

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
    
    if (!modalTitle || !modalBody) {
        console.error('Modal elements not found');
        return;
    }

    modalTitle.textContent = lesson.title;
    modalBody.innerHTML = lesson.content;
    openModal('lessonModal');
}

// Mark topic as completed
async function markTopicCompleted() {
    if (!currentLesson || completedTopics[currentLesson]) return;

    // Save to database
    if (checkAuth()) {
        await saveLessonProgress(currentLesson, true);
    }

    // Update local state
    completedTopics[currentLesson] = true;
    localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
    
    updateUI();
    
    // Update button state
    const markBtn = document.getElementById('markCompletedBtn');
    if (markBtn) {
        markBtn.textContent = 'Completed';
        markBtn.disabled = true;
        markBtn.classList.add('btn-secondary');
        markBtn.classList.remove('btn-success');
    }
}

// Start main quiz
function startMainQuiz(lessonType) {
    const quizData = mainLessonQuiz[lessonType];
    if (!quizData) {
        console.error('Quiz not found:', lessonType);
        return;
    }

    currentQuiz = [...quizData.questions];
    currentQuestionIndex = 0;
    correctAnswers = 0;

    startQuiz(currentQuiz, quizData.title, 'quizModal');
    showCurrentQuestion();
}

// Show current quiz question
function showCurrentQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    if (!question) return;

    showQuestion(question.question, question.options, currentQuestionIndex, currentQuiz.length);
    selectedOption = null;
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
        showCurrentQuestion();
    }
}

// Show quiz results
function showResults() {
    const total = currentQuiz.length;
    showQuizResults(correctAnswers, total, 'quizResultModal');
    
    // Save quiz progress
    if (checkAuth()) {
        saveQuizProgress('safety', 'safety', correctAnswers, total);
    }
}

// Handle quiz option selection
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quiz-option')) {
        const options = document.querySelectorAll('.quiz-option');
        const index = Array.from(options).indexOf(e.target);
        selectedOption = selectQuizOption(index, e.target);
    }
});