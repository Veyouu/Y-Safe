// Safety Module - Fixed and Working
const API_URL = window.location.origin;

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
        loadCompletedTopics();
        await syncCompletedTopicsWithDatabase();
        setupEventListeners();
        updateUI();
    } catch (error) {
        console.error('Error initializing safety page:', error);
    }
});

// Database synchronization
async function syncCompletedTopicsWithDatabase() {
    const token = localStorage.getItem('y-safe-token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/lesson-progress`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return;
        
        const data = await response.json();
        const dbProgress = data.progress || {};
        
        const syncedTopics = {};
        dbProgress.forEach(lesson => {
            if (lesson.completed) {
                syncedTopics[lesson.lesson_id] = true;
            }
        });
        
        completedTopics = { ...completedTopics, ...syncedTopics };
        localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
        updateUI();
    } catch (e) {
        console.error('Error syncing completed topics:', e);
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

// Save lesson progress
async function saveLessonProgress(lessonId, completed) {
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

// Save quiz progress
async function saveQuizProgress(quizType, quizId, score, totalQuestions) {
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

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Update functions
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

function updateCompletedTopicsCount(completedCount, totalCount) {
    const element = document.getElementById('completedTopics');
    if (element) {
        element.textContent = completedCount;
    }
}

function updateQuizButton(quizBtnId, completedCount, totalCount) {
    const quizBtn = document.getElementById(quizBtnId);
    if (quizBtn) {
        quizBtn.disabled = completedCount < totalCount;
    }
}

function checkAuth() {
    const token = localStorage.getItem('y-safe-token');
    return !!token;
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Lesson cards - Direct attachment for better reliability
    const lessonButtons = document.querySelectorAll('.btn-lesson');
    console.log('Found lesson buttons:', lessonButtons.length);
    
    lessonButtons.forEach((btn, index) => {
        const card = btn.closest('.lesson-card');
        const lessonId = card ? card.dataset.lesson : 'unknown';
        
        console.log(`Setting up button ${index} for lesson:`, lessonId);
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Lesson button clicked:', lessonId);
            
            if (lessonId !== 'unknown') {
                openLesson(lessonId);
            } else {
                console.error('Could not determine lesson ID for button');
            }
        });
    });
    
    // Fallback event delegation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-lesson') || e.target.closest('.btn-lesson')) {
            e.preventDefault();
            const lessonBtn = e.target.classList.contains('btn-lesson') ? e.target : e.target.closest('.btn-lesson');
            const card = lessonBtn.closest('.lesson-card');
            
            if (card && card.dataset.lesson) {
                console.log('Fallback: Lesson button clicked:', card.dataset.lesson);
                openLesson(card.dataset.lesson);
            }
        }
    });
    
    // Mark completed button
    const markBtn = document.getElementById('markCompletedBtn');
    if (markBtn) {
        markBtn.addEventListener('click', markTopicCompleted);
        console.log('Mark completed button attached');
    }
    
    // Quiz button
    const quizBtn = document.getElementById('safetyQuizBtn');
    if (quizBtn) {
        quizBtn.addEventListener('click', () => {
            console.log('Quiz button clicked');
            startMainQuiz('safety');
        });
        console.log('Quiz button attached');
    }
    
    // Next question button
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextQuestion);
        console.log('Next button attached');
    }
    
    // Submit quiz button
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', showResults);
        console.log('Submit button attached');
    }
    
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
    
    console.log('Event listeners setup complete');
}

// Update UI
function updateUI() {
    const completedCount = Object.keys(completedTopics).filter(key => 
        Object.keys(lessons).includes(key)).length;
    const totalLessons = Object.keys(lessons).length;
    
    updateCompletedTopicsCount(completedCount, totalLessons);
    updateQuizButton('safetyQuizBtn', completedCount, totalLessons);
    
    // Update lesson cards
    Object.keys(completedTopics).forEach(lessonId => {
        if (lessons[lessonId] && completedTopics[lessonId]) {
            updateLessonCard(lessonId, true);
        }
    });
}

// Lesson data
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
    },
    'cuts-wounds': {
        title: 'Cuts and Wounds',
        content: `
            <h3>Cuts and Wounds</h3>
            <p>Cuts and wounds are common injuries that require proper first aid to prevent infection and promote healing.</p>
            
            <h4>Types of Cuts and Wounds:</h4>
            <ul>
                <li>Minor cuts: Small, shallow cuts that affect only the top layer of skin</li>
                <li>Deep cuts (lacerations): Deep cuts that may damage muscles, tendons, or nerves</li>
                <li>Abrasions (scrapes): Wounds where skin is scraped off, usually not deep</li>
                <li>Puncture wounds: Deep, narrow wounds caused by sharp objects like nails or needles</li>
            </ul>
            
            <h4>First Aid Treatment:</h4>
            <ul>
                <li>Wash your hands before treating the wound</li>
                <li>Apply gentle pressure with clean cloth to stop bleeding</li>
                <li>Clean the wound with clean water or saline solution</li>
                <li>Apply antibiotic ointment to prevent infection</li>
                <li>Cover the wound with sterile bandage or dressing</li>
                <li>Seek medical help for deep cuts, puncture wounds, or if bleeding doesn't stop</li>
            </ul>
        `
    },
    bleeding: {
        title: 'Bleeding Injuries',
        content: `
            <h3>Bleeding Injuries</h3>
            <p>Bleeding injuries can range from minor to life-threatening. Proper first aid is crucial to prevent blood loss.</p>
            
            <h4>Types of Bleeding Injuries:</h4>
            <ul>
                <li>Minor bleeding: Small cuts that stop bleeding quickly with minimal pressure</li>
                <li>Severe bleeding (hemorrhage): Heavy bleeding that can be life-threatening</li>
                <li>Internal bleeding: Bleeding inside the body that may not be visible</li>
            </ul>
            
            <h4>First Aid for External Bleeding:</h4>
            <ul>
                <li>Apply direct pressure with clean cloth or bandage</li>
                <li>Elevate the injured area above heart level if possible</li>
                <li>Apply pressure to pressure points if direct pressure fails</li>
                <li>Use a tourniquet only as last resort for severe limb bleeding</li>
                <li>Keep the person warm and calm</li>
                <li>Call emergency services for severe bleeding</li>
            </ul>
        `
    },
    burns: {
        title: 'Burns and Scalds',
        content: `
            <h3>Burns and Scalds</h3>
            <p>Burns and scalds are injuries to body tissues caused by heat, chemicals, electricity, or radiation.</p>
            
            <h4>Types of Burns:</h4>
            <ul>
                <li>First-degree burns: Red, painful skin that affects only the outer layer</li>
                <li>Second-degree burns: Blisters, thickened skin, more intense pain</li>
                <li>Third-degree burns: White, brown, or black skin, may be numb due to nerve damage</li>
                <li>Chemical burns: Caused by acids, alkalis, or other chemicals</li>
                <li>Electrical burns: Caused by electricity, may have internal damage</li>
                <li>Sunburns: Caused by UV radiation from the sun</li>
                <li>Scalds: Burns from hot liquids or steam</li>
            </ul>
            
            <h4>First Aid for Minor Burns:</h4>
            <ul>
                <li>Cool the burn with cool (not cold) running water for 10-20 minutes</li>
                <li>Remove jewelry or tight clothing from burned area</li>
                <li>Cover the burn with sterile, non-stick bandage</li>
                <li>Take over-the-counter pain medication if needed</li>
                <li>Apply aloe vera gel to sunburns</li>
            </ul>
        `
    },
    'bone-joint': {
        title: 'Bone, Joint, and Muscle Injuries',
        content: `
            <h3>Bone, Joint, and Muscle Injuries</h3>
            <p>These injuries affect the musculoskeletal system and require proper first aid to prevent further damage.</p>
            
            <h4>Types of Injuries:</h4>
            <ul>
                <li>Sprains: Stretching or tearing of ligaments (tissues connecting bones)</li>
                <li>Strains: Stretching or tearing of muscles or tendons</li>
                <li>Fractures: Broken bones, can be complete or partial</li>
                <li>Dislocations: Bones forced out of normal position at joints</li>
                <li>Muscle cramps: Sudden, involuntary muscle contractions</li>
            </ul>
            
            <h4>First Aid for Sprains and Strains:</h4>
            <ul>
                <li>Follow RICE method: Rest, Ice, Compression, Elevation</li>
                <li>Rest the injured area and avoid weight-bearing</li>
                <li>Apply ice for 15-20 minutes every 2-3 hours</li>
                <li>Compress with elastic bandage</li>
                <li>Elevate above heart level</li>
            </ul>
        `
    },
    'head-spine': {
        title: 'Head and Spine Injuries',
        content: `
            <h3>Head and Spine Injuries</h3>
            <p>Head and spine injuries are serious and can be life-threatening. Proper handling is crucial to prevent further damage.</p>
            
            <h4>Types of Head Injuries:</h4>
            <ul>
                <li>Minor head injury: Small bump or cut, no loss of consciousness</li>
                <li>Concussion: Brain injury causing temporary loss of brain function</li>
                <li>Skull fracture: Break in the skull bone</li>
                <li>Spinal injury: Damage to spinal cord or vertebrae</li>
            </ul>
            
            <h4>Signs of Serious Head Injury:</h4>
            <ul>
                <li>Loss of consciousness, even briefly</li>
                <li>Confusion or disorientation</li>
                <li>Severe headache</li>
                <li>Nausea or vomiting</li>
                <li>Slurred speech</li>
                <li>Vision changes</li>
                <li>Seizures</li>
                <li>Blood or fluid from ears or nose</li>
            </ul>
        `
    },
    'breathing-chest': {
        title: 'Breathing and Chest Injuries',
        content: `
            <h3>Breathing and Chest Injuries</h3>
            <p>Breathing and chest injuries can quickly become life-threatening. Immediate action is essential.</p>
            
            <h4>Types of Breathing Emergencies:</h4>
            <ul>
                <li>Choking: Airway blocked by foreign object</li>
                <li>Chest wounds: Open or closed injuries to chest</li>
                <li>Collapsed lung: Air enters chest cavity, compressing lung</li>
                <li>Asthma attack: Severe difficulty breathing due to asthma</li>
            </ul>
            
            <h4>Signs of Choking:</h4>
            <ul>
                <li>Cannot speak, breathe, or cough</li>
                <li>Universal choking sign (hands clutching throat)</li>
                <li>Blue lips or skin</li>
                <li>High-pitched wheezing or no sound at all</li>
            </ul>
        `
    },
    'heat-cold': {
        title: 'Heat and Cold Injuries',
        content: `
            <h3>Heat and Cold Injuries</h3>
            <p>Extreme temperatures can cause serious injuries. Prevention and proper first aid are essential.</p>
            
            <h4>Heat-Related Injuries:</h4>
            <ul>
                <li>Heat exhaustion: Body overheats due to excessive heat exposure</li>
                <li>Heat stroke: Life-threatening condition where body temperature regulation fails</li>
            </ul>
            
            <h4>Cold-Related Injuries:</h4>
            <ul>
                <li>Hypothermia: Dangerous drop in body temperature</li>
                <li>Frostbite: Freezing of body tissues, usually extremities</li>
            </ul>
            
            <h4>First Aid Treatment:</h4>
            <ul>
                <li>Heat exhaustion: Move to cool place, drink water, apply cool compresses</li>
                <li>Heat stroke: Call 911, cool body rapidly with water and fans</li>
                <li>Hypothermia: Move to warm place, remove wet clothes, warm with blankets</li>
                <li>Frostbite: Warm area gently, don't rub, seek medical care</li>
            </ul>
        `
    },
    'poisoning-bites': {
        title: 'Poisoning and Bites',
        content: `
            <h3>Poisoning and Bites</h3>
            <p>Poisoning and animal bites can be serious emergencies requiring immediate action.</p>
            
            <h4>Types of Poisoning:</h4>
            <ul>
                <li>Food poisoning: Illness from contaminated food</li>
                <li>Chemical poisoning: Exposure to toxic chemicals</li>
                <li>Drug overdose: Excessive medication or drug intake</li>
            </ul>
            
            <h4>Animal Bites and Stings:</h4>
            <ul>
                <li>Insect bites and stings: Bees, wasps, ants, spiders</li>
                <li>Animal bites: Dogs, cats, other animals</li>
                <li>Snake bites: Venomous or non-venomous snakes</li>
            </ul>
            
            <h4>First Aid for Poisoning:</h4>
            <ul>
                <li>Call poison control center immediately</li>
                <li>Don't induce vomiting unless instructed</li>
                <li>Have person sip water if conscious</li>
                <li>Preserve container or substance for identification</li>
                <li>Follow specific instructions from poison control</li>
            </ul>
        `
    },
    'medical-emergencies': {
        title: 'Medical Emergencies',
        content: `
            <h3>Medical Emergencies</h3>
            <p>Medical emergencies require immediate recognition and response to save lives.</p>
            
            <h4>Types of Medical Emergencies:</h4>
            <ul>
                <li>Fainting: Temporary loss of consciousness</li>
                <li>Seizures: Uncontrolled electrical activity in brain</li>
                <li>Heart attack: Blockage of blood flow to heart muscle</li>
                <li>Stroke: Interruption of blood flow to brain</li>
                <li>Diabetic emergency: Very high or low blood sugar</li>
                <li>Allergic reaction (anaphylaxis): Severe, life-threatening allergic response</li>
            </ul>
            
            <h4>Heart Attack Signs:</h4>
            <ul>
                <li>Chest pain or pressure</li>
                <li>Pain spreading to arms, back, neck, jaw</li>
                <li>Shortness of breath</li>
                <li>Cold sweat, nausea, lightheadedness</li>
            </ul>
        `
    },
    'eye-ear-dental': {
        title: 'Eye, Ear, and Dental Injuries',
        content: `
            <h3>Eye, Ear, and Dental Injuries</h3>
            <p>Injuries to eyes, ears, and teeth require careful first aid to prevent permanent damage.</p>
            
            <h4>Eye Injuries:</h4>
            <ul>
                <li>Foreign object in eye: Dust, sand, metal, or other particles</li>
                <li>Chemical splashes: Acids, alkalis, or other chemicals</li>
                <li>Blows to eye: Direct impact causing swelling or damage</li>
                <li>Cuts or punctures: Sharp object injuries to eye</li>
            </ul>
            
            <h4>Foreign Object in Eye Treatment:</h4>
            <ul>
                <li>Don't rub the eye</li>
                <li>Let tears wash out object</li>
                <li>Lift upper eyelid over lower eyelid</li>
                <li>Use eye wash or clean water to rinse</li>
                <li>Don't use tweezers or cotton swabs</li>
                <li>Seek medical care if object doesn't come out</li>
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
                options: ['Run fast', 'Stay low and cover your nose and mouth', 'Use the elevator', 'Hide under a table'],
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
    console.log('Opening lesson:', lessonId);
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
    console.log('Mark topic completed called for:', currentLesson);
    
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
    console.log('Starting quiz:', lessonType);
    const quizData = mainLessonQuiz[lessonType];
    if (!quizData) {
        console.error('Quiz not found:', lessonType);
        return;
    }

    currentQuiz = [...quizData.questions];
    currentQuestionIndex = 0;
    correctAnswers = 0;

    const quizTitle = document.getElementById('quizTitle');
    const totalQuestions = document.getElementById('totalQuestions');
    
    if (quizTitle) quizTitle.textContent = quizData.title;
    if (totalQuestions) totalQuestions.textContent = currentQuiz.length;
    
    openModal('quizModal');
    showCurrentQuestion();
}

// Show current question
function showCurrentQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    if (!question) return;

    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const currentEl = document.getElementById('currentQuestion');
    
    if (!questionEl || !optionsEl || !currentEl) return;
    
    questionEl.textContent = question.question;
    currentEl.textContent = currentQuestionIndex + 1;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option';
        optionEl.textContent = option;
        optionEl.onclick = () => selectQuizOption(index, optionEl);
        optionsEl.appendChild(optionEl);
    });
    
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = true;
    
    selectedOption = null;
}

// Select quiz option
function selectQuizOption(index, element) {
    document.querySelectorAll('.quiz-option').forEach(opt => 
        opt.classList.remove('selected'));
    
    element.classList.add('selected');
    selectedOption = index;
    
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = false;
    
    return index;
}

// Handle next question
function handleNextQuestion() {
    console.log('Next question clicked');
    
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
    console.log('Showing quiz results');
    const total = currentQuiz.length;
    const percentage = Math.round((correctAnswers / total) * 100);
    
    const correctEl = document.getElementById('correctCount');
    const totalEl = document.getElementById('totalCount');
    const scoreEl = document.getElementById('resultScore');
    const messageEl = document.getElementById('resultMessage');
    
    if (correctEl) correctEl.textContent = correctAnswers;
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
    openModal('quizResultModal');
    
    // Save quiz progress
    if (checkAuth()) {
        saveQuizProgress('safety', 'safety', correctAnswers, total);
    }
}