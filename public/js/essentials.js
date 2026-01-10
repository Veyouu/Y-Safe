document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupBackButton();
  initializeMatchingQuiz();
});

function checkAuth() {
  const token = localStorage.getItem('y-safe-token');
  if (!token) {
    window.location.href = 'index.html';
  }
}

function setupBackButton() {
  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
}

const matchingData = [
  {
    item: 'bandages',
    icon: '🩹',
    name: 'Bandages',
    use: 'Covering and protecting wounds',
    options: ['Covering wounds', 'Cleaning wounds', 'Cutting supplies', 'Measuring temperature']
  },
  {
    item: 'antiseptic',
    icon: '💊',
    name: 'Antiseptic',
    use: 'Cleaning and disinfecting wounds',
    options: ['Cleaning wounds', 'Stopping bleeding', 'Covering cuts', 'Removing splinters']
  },
  {
    item: 'gauze',
    icon: '🧻',
    name: 'Gauze Pads',
    use: 'Dressing larger wounds',
    options: ['Dressing wounds', 'Measuring temperature', 'Cutting bandages', 'Removing debris']
  },
  {
    item: 'scissors',
    icon: '✂️',
    name: 'Scissors',
    use: 'Cutting bandages and dressings',
    options: ['Cutting supplies', 'Cleaning wounds', 'Applying pressure', 'Taking temperature']
  },
  {
    item: 'tweezers',
    icon: '🥢',
    name: 'Tweezers',
    use: 'Removing splinters and debris',
    options: ['Removing splinters', 'Stopping bleeding', 'Measuring temperature', 'Applying bandages']
  },
  {
    item: 'gloves',
    icon: '🧤',
    name: 'Gloves',
    use: 'Protection from germs and contamination',
    options: ['Protection', 'Cutting supplies', 'Measuring temperature', 'Cleaning wounds']
  }
];

let selectedMatches = {};
let checked = false;

function initializeMatchingQuiz() {
  const container = document.getElementById('matchingQuiz');
  container.innerHTML = '';
  
  matchingData.forEach((item, index) => {
    const matchingItem = document.createElement('div');
    matchingItem.className = 'matching-item';
    matchingItem.dataset.item = item.item;
    
    const shuffledOptions = shuffleArray([...item.options]);
    
    matchingItem.innerHTML = `
      <div class="matching-left">
        <div class="kit-icon">${item.icon}</div>
        <div>
          <h4>${item.name}</h4>
          <p class="item-use">${item.use}</p>
        </div>
      </div>
      <div class="matching-options" data-index="${index}">
        ${shuffledOptions.map((opt, optIndex) => `
          <button class="matching-option" data-option="${opt}" data-item="${item.item}">${opt}</button>
        `).join('')}
      </div>
    `;
    
    container.appendChild(matchingItem);
  });
  
  container.querySelectorAll('.matching-option').forEach(option => {
    option.addEventListener('click', handleOptionClick);
  });
  
  document.getElementById('checkMatchingBtn').addEventListener('click', checkMatches);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function handleOptionClick(e) {
  if (checked) return;
  
  const option = e.target;
  const itemKey = option.dataset.item;
  const container = option.closest('.matching-options');
  const index = container.dataset.index;
  
  const options = container.querySelectorAll('.matching-option');
  options.forEach(opt => opt.classList.remove('selected'));
  
  option.classList.add('selected');
  selectedMatches[itemKey] = option.dataset.option;
  
  if (Object.keys(selectedMatches).length === matchingData.length) {
    document.getElementById('checkMatchingBtn').style.display = 'inline-flex';
  }
}

function checkMatches() {
  if (checked) return;
  
  checked = true;
  
  let correctCount = 0;
  const total = matchingData.length;
  
  matchingData.forEach(item => {
    const optionsContainer = document.querySelector(`.matching-options[data-index="${matchingData.findIndex(m => m.item === item.item)}"]`);
    const selectedOption = optionsContainer.querySelector('.matching-option.selected');
    
    if (selectedOption) {
      const selectedText = selectedOption.dataset.option;
      
      optionsContainer.querySelectorAll('.matching-option').forEach(opt => {
        const correctOption = item.options[0];
        
        if (opt.dataset.option === correctOption) {
          opt.classList.add('correct');
        } else if (opt.classList.contains('selected')) {
          opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
      });
      
      if (selectedText === item.options[0]) {
        correctCount++;
      }
    }
  });
  
  const score = Math.round((correctCount / total) * 100);
  const resultContainer = document.getElementById('matchingResult');
  resultContainer.style.display = 'block';
  
  if (score === 100) {
    resultContainer.className = 'matching-result success';
    resultContainer.innerHTML = `🎉 Perfect! You got ${correctCount}/${total} correct!`;
  } else if (score >= 60) {
    resultContainer.className = 'matching-result success';
    resultContainer.innerHTML = `👍 Good job! You got ${correctCount}/${total} correct. Keep practicing!`;
  } else {
    resultContainer.className = 'matching-result error';
    resultContainer.innerHTML = `📚 You got ${correctCount}/${total} correct. Review the items and try again!`;
    setTimeout(resetMatchingQuiz, 3000);
  }
  
  document.getElementById('checkMatchingBtn').style.display = 'none';
}

function resetMatchingQuiz() {
  selectedMatches = {};
  checked = false;
  initializeMatchingQuiz();
}
