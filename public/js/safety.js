const API_URL = window.location.origin + '/api';

let currentUserId = null;
let completedTopics = {};

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

// Track completed topics
try {
    completedTopics = JSON.parse(localStorage.getItem('y-safe-completed-topics') || '{}');
} catch (e) {
    console.error('Error loading completed topics:', e);
    completedTopics = {};
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


// Main lesson quiz data
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

const lessons = {
    fire: {
        title: 'Fire Safety',
        content: `
      <h3>Fire Safety</h3>
      <p>Fire safety is important to prevent injuries and loss of life during fire incidents.</p>
      
      <h4>Basic Safety Tips:</h4>
      <ul>
        <li>Keep flammable materials away from heat and open flames.</li>
        <li>Do not overload electrical outlets or use damaged wires.</li>
        <li>Turn off appliances when not in use.</li>
        <li>Know the location of fire exits and fire extinguishers.</li>
        <li>Stay calm during a fire and avoid using elevators.</li>
        <li>If there is smoke, stay low and cover your nose and mouth with a cloth.</li>
      </ul>
    `,
        quiz: [{
                question: 'What should you do if there is smoke during a fire?',
                options: ['Stand up and run', 'Stay low and cover your nose and mouth', 'Open windows', 'Use the elevator'],
                correct: 1
            },
            {
                question: 'Should you use elevators during a fire?',
                options: ['Yes, they are faster', 'No, never use elevators', 'Only if stairs are blocked', 'Only on lower floors'],
                correct: 1
            },
            {
                question: 'What should you do with flammable materials?',
                options: ['Keep them near heat', 'Keep them away from heat and open flames', 'Store them in your room', 'Leave them anywhere'],
                correct: 1
            },
            {
                question: 'Is it safe to overload electrical outlets?',
                options: ['Yes, if you need more power', 'No, never overload outlets', 'Only with extension cords', 'Only at night'],
                correct: 1
            },
            {
                question: 'What should you know about fire safety?',
                options: ['Only the location of exits', 'Only where fire extinguishers are', 'The location of fire exits and fire extinguishers', 'Nothing, just stay calm'],
                correct: 2
            }
        ]
    },
    earthquake: {
        title: 'Earthquake Warning Signs',
        content: `
      <h3>Earthquake Warning Signs</h3>
      <p>Earthquake warning signs help people prepare and respond quickly before and during shaking.</p>
      
      <h4>Basic Safety Tips:</h4>
      <ul>
        <li>Be alert to unusual ground movement or rumbling sounds.</li>
        <li>Secure heavy objects and furniture to prevent falling.</li>
        <li>Learn and practice the "Duck, Cover, and Hold" procedure.</li>
        <li>Stay away from windows, shelves, and hanging objects.</li>
        <li>After the shaking stops, move carefully to a safe area.</li>
      </ul>
    `,
        quiz: [{
                question: 'What procedure should you learn for earthquakes?',
                options: ['Run, Hide, Scream', 'Duck, Cover, and Hold', 'Jump, Roll, Run', 'Stand, Watch, Wait'],
                correct: 1
            },
            {
                question: 'What should you stay away from during an earthquake?',
                options: ['Doors', 'Windows, shelves, and hanging objects', 'Floors', 'Walls'],
                correct: 1
            },
            {
                question: 'What should you do with heavy furniture?',
                options: ['Leave it as is', 'Secure it to prevent falling', 'Move it during earthquake', 'Put it near windows'],
                correct: 1
            },
            {
                question: 'What are earthquake warning signs?',
                options: ['Loud music', 'Unusual ground movement or rumbling sounds', 'Bright lights', 'Cold weather'],
                correct: 1
            },
            {
                question: 'When should you move to a safe area?',
                options: ['Before the shaking starts', 'During the shaking', 'After the shaking stops', 'Never, stay where you are'],
                correct: 2
            }
        ]
    },
    evacuation: {
        title: 'Importance of Evacuation Plans and Safe Areas for Typhoons',
        content: `
      <h3>Importance of Evacuation Plans and Safe Areas for Typhoons</h3>
      <p>Evacuation plans and safe areas protect lives during strong typhoons and flooding.</p>
      
      <h4>Basic Safety Tips:</h4>
      <ul>
        <li>Know your community's evacuation routes and designated safe areas.</li>
        <li>Follow weather updates and warnings from authorities.</li>
        <li>Prepare an emergency bag with food, water, and first-aid supplies.</li>
        <li>Evacuate early when advised to avoid danger.</li>
        <li>Stay in safe shelters until officials declare it safe to return.</li>
      </ul>
    `,
        quiz: [{
                question: 'What should you know about your community?',
                options: ['Only the weather', 'Evacuation routes and designated safe areas', 'Only where to buy food', 'Nothing'],
                correct: 1
            },
            {
                question: 'When should you evacuate during a typhoon?',
                options: ['When the storm is over', 'Early when advised', 'Only if you see flooding', 'Never, stay home'],
                correct: 1
            },
            {
                question: 'What should you have in your emergency bag?',
                options: ['Only clothes', 'Food, water, and first-aid supplies', 'Only electronics', 'Only money'],
                correct: 1
            },
            {
                question: 'Who should you follow for weather updates?',
                options: ['Friends', 'Authorities', 'Social media only', 'No one'],
                correct: 1
            },
            {
                question: 'When can you return from safe shelters?',
                options: ['Whenever you want', 'When officials declare it safe', 'After one day', 'Never'],
                correct: 1
            }
        ]
    },
    'cuts-wounds': {
        title: 'Cuts and Wounds',
        content: `
      <h3>Cuts and Wounds</h3>
      <p>Cuts and wounds are common injuries that require proper first aid to prevent infection and promote healing.</p>
      
      <h4>Types of Cuts and Wounds:</h4>
      <ul>
        <li><strong>Minor cuts:</strong> Small, shallow cuts that affect only the top layer of skin</li>
        <li><strong>Deep cuts (lacerations):</strong> Deep cuts that may damage muscles, tendons, or nerves</li>
        <li><strong>Abrasions (scrapes):</strong> Wounds where skin is scraped off, usually not deep</li>
        <li><strong>Puncture wounds:</strong> Deep, narrow wounds caused by sharp objects like nails or needles</li>
        <li><strong>Avulsions:</strong> Injuries where skin is torn away from the body</li>
        <li><strong>Amputations:</strong> Partial or complete loss of a body part</li>
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
      
      <h4>When to Seek Medical Help:</h4>
      <ul>
        <li>Bleeding doesn't stop after 10-15 minutes of pressure</li>
        <li>Wound is deep or gaping</li>
        <li>There's dirt or debris that can't be removed</li>
        <li>Signs of infection (redness, swelling, warmth, pus)</li>
        <li>Animal or human bite</li>
        <li>Tetanus shot is needed</li>
      </ul>
    `,
        quiz: [{
                question: 'What is the first step in treating a cut?',
                options: ['Apply antibiotic ointment', 'Wash your hands', 'Cover with bandage', 'Apply pressure'],
                correct: 1
            },
            {
                question: 'How should you stop bleeding from a minor cut?',
                options: ['Apply gentle pressure with clean cloth', 'Use a tourniquet', 'Ignore it', 'Apply ice'],
                correct: 0
            },
            {
                question: 'What type of wound is caused by scraping skin off?',
                options: ['Puncture wound', 'Laceration', 'Abrasion', 'Avulsion'],
                correct: 2
            },
            {
                question: 'When should you seek medical help for a cut?',
                options: ['Only if it hurts', 'If bleeding doesn\'t stop after 10-15 minutes', 'Never', 'Only if it\'s small'],
                correct: 1
            },
            {
                question: 'What is a sign of infection in a wound?',
                options: ['Cool skin', 'Redness, swelling, warmth, or pus', 'Pale color', 'No pain'],
                correct: 1
            }
        ]
    },
    bleeding: {
        title: 'Bleeding Injuries',
        content: `
      <h3>Bleeding Injuries</h3>
      <p>Bleeding injuries can range from minor to life-threatening. Proper first aid is crucial to prevent blood loss.</p>
      
      <h4>Types of Bleeding Injuries:</h4>
      <ul>
        <li><strong>Minor bleeding:</strong> Small cuts that stop bleeding quickly with minimal pressure</li>
        <li><strong>Severe bleeding (hemorrhage):</strong> Heavy bleeding that can be life-threatening</li>
        <li><strong>Internal bleeding:</strong> Bleeding inside the body that may not be visible</li>
        <li><strong>Nosebleeds:</strong> Bleeding from the nose, common but can be serious</li>
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
      
      <h4>Signs of Internal Bleeding:</h4>
      <ul>
        <li>Pain, tenderness, or swelling in affected area</li>
        <li>Bruising without obvious injury</li>
        <li>Dizziness, confusion, or fainting</li>
        <li>Rapid heartbeat and breathing</li>
        <li>Pale, cool, clammy skin</li>
        <li>Vomiting blood or coughing up blood</li>
      </ul>
      
      <h4>Nosebleed Treatment:</h4>
      <ul>
        <li>Sit upright and lean forward slightly</li>
        <li>Pinch the soft part of the nose for 10-15 minutes</li>
        <li>Breathe through mouth</li>
        <li>Apply cold compress to nose bridge</li>
        <li>Seek medical help if bleeding doesn't stop after 20 minutes</li>
      </ul>
    `,
        quiz: [{
                question: 'What is the first step for external bleeding?',
                options: ['Apply tourniquet', 'Apply direct pressure', 'Elevate the area', 'Call 911'],
                correct: 1
            },
            {
                question: 'When should you use a tourniquet?',
                options: ['For all bleeding', 'Only as last resort for severe limb bleeding', 'For nosebleeds', 'Never'],
                correct: 1
            },
            {
                question: 'What is a sign of internal bleeding?',
                options: ['Warm, red skin', 'Pale, cool, clammy skin', 'Slow heartbeat', 'No pain'],
                correct: 1
            },
            {
                question: 'How should you treat a nosebleed?',
                options: ['Lie down flat', 'Sit upright and lean forward', 'Stand up', 'Tilt head back'],
                correct: 1
            },
            {
                question: 'What should you do for severe bleeding?',
                options: ['Ignore it', 'Apply pressure and call emergency services', 'Apply ice', 'Wait 30 minutes'],
                correct: 1
            }
        ]
    },
    burns: {
        title: 'Burns and Scalds',
        content: `
      <h3>Burns and Scalds</h3>
      <p>Burns and scalds are injuries to body tissues caused by heat, chemicals, electricity, or radiation.</p>
      
      <h4>Types of Burns:</h4>
      <ul>
        <li><strong>First-degree burns:</strong> Red, painful skin that affects only the outer layer</li>
        <li><strong>Second-degree burns:</strong> Blisters, thickened skin, more intense pain</li>
        <li><strong>Third-degree burns:</strong> White, brown, or black skin, may be numb due to nerve damage</li>
        <li><strong>Chemical burns:</strong> Caused by acids, alkalis, or other chemicals</li>
        <li><strong>Electrical burns:</strong> Caused by electricity, may have internal damage</li>
        <li><strong>Sunburns:</strong> Caused by UV radiation from the sun</li>
        <li><strong>Scalds:</strong> Burns from hot liquids or steam</li>
      </ul>
      
      <h4>First Aid for Minor Burns:</h4>
      <ul>
        <li>Cool the burn with cool (not cold) running water for 10-20 minutes</li>
        <li>Remove jewelry or tight clothing from burned area</li>
        <li>Cover the burn with sterile, non-stick bandage</li>
        <li>Take over-the-counter pain medication if needed</li>
        <li>Apply aloe vera gel to sunburns</li>
      </ul>
      
      <h4>For Major Burns:</h4>
      <ul>
        <li>Call emergency services immediately</li>
        <li>Don't immerse large severe burns in water</li>
        <li>Cover with clean, dry cloth</li>
        <li>Don't break blisters</li>
        <li>Keep person warm to prevent hypothermia</li>
      </ul>
      
      <h4>Chemical Burn Treatment:</h4>
      <ul>
        <li>Remove contaminated clothing</li>
        <li>Rinse the area with cool running water for 20 minutes</li>
        <li>Don't apply neutralizing agents</li>
        <li>Cover with sterile dressing</li>
        <li>Seek medical attention</li>
      </ul>
    `,
        quiz: [{
                question: 'How long should you cool a minor burn with water?',
                options: ['1-2 minutes', '5-10 minutes', '10-20 minutes', '30 minutes'],
                correct: 2
            },
            {
                question: 'What is a characteristic of third-degree burns?',
                options: ['Red and painful', 'Blisters', 'May be numb due to nerve damage', 'Only affects outer layer'],
                correct: 2
            },
            {
                question: 'What should you do for chemical burns?',
                options: ['Apply neutralizing agent', 'Rinse with cool water for 20 minutes', 'Cover with plastic', 'Apply ice'],
                correct: 1
            },
            {
                question: 'What is a scald?',
                options: ['Electrical burn', 'Burn from hot liquid or steam', 'Chemical burn', 'Sunburn'],
                correct: 1
            },
            {
                question: 'What should you NOT do for major burns?',
                options: ['Call emergency services', 'Immerse in water', 'Cover with clean cloth', 'Keep person warm'],
                correct: 1
            }
        ]
    },
    'bone-joint': {
        title: 'Bone, Joint, and Muscle Injuries',
        content: `
      <h3>Bone, Joint, and Muscle Injuries</h3>
      <p>These injuries affect the musculoskeletal system and require proper first aid to prevent further damage.</p>
      
      <h4>Types of Injuries:</h4>
      <ul>
        <li><strong>Sprains:</strong> Stretching or tearing of ligaments (tissues connecting bones)</li>
        <li><strong>Strains:</strong> Stretching or tearing of muscles or tendons</li>
        <li><strong>Fractures:</strong> Broken bones, can be complete or partial</li>
        <li><strong>Dislocations:</strong> Bones forced out of normal position at joints</li>
        <li><strong>Muscle cramps:</strong> Sudden, involuntary muscle contractions</li>
      </ul>
      
      <h4>Signs of Fractures:</h4>
      <ul>
        <li>Intense pain at injury site</li>
        <li>Swelling and bruising</li>
        <li>Visible deformity or bone protrusion</li>
        <li>Inability to move affected area</li>
        <li>Grating sound or sensation</li>
      </ul>
      
      <h4>First Aid for Sprains and Strains:</h4>
      <ul>
        <li>Follow RICE method: Rest, Ice, Compression, Elevation</li>
        <li>Rest the injured area and avoid weight-bearing</li>
        <li>Apply ice for 15-20 minutes every 2-3 hours</li>
        <li>Compress with elastic bandage</li>
        <li>Elevate above heart level</li>
      </ul>
      
      <h4>First Aid for Fractures:</h4>
      <ul>
        <li>Immobilize the injured area</li>
        <li>Apply splint above and below injury site</li>
        <li>Apply ice pack to reduce swelling</li>
        <li>Don't try to straighten the bone</li>
        <li>Seek medical attention immediately</li>
      </ul>
      
      <h4>For Dislocations:</h4>
      <ul>
        <li>Don't try to put bone back in place</li>
        <li>Immobilize the joint</li>
        <li>Apply ice to reduce swelling</li>
        <li>Seek immediate medical care</li>
      </ul>
    `,
        quiz: [{
                question: 'What does RICE stand for in treating sprains?',
                options: ['Rest, Ice, Compression, Elevation', 'Recovery, Ice, Care, Exercise', 'Relax, Immobilize, Cool, Elevate', 'Reduce, Inflammation, Compression, Examination'],
                correct: 0
            },
            {
                question: 'What is a sprain?',
                options: ['Broken bone', 'Stretching or tearing of ligaments', 'Muscle tear', 'Joint dislocation'],
                correct: 1
            },
            {
                question: 'What should you NOT do for a fracture?',
                options: ['Apply splint', 'Try to straighten the bone', 'Apply ice', 'Seek medical help'],
                correct: 1
            },
            {
                question: 'How long should you apply ice to sprains?',
                options: ['5 minutes', '15-20 minutes', '1 hour', 'Until pain stops'],
                correct: 1
            },
            {
                question: 'What is a sign of a fracture?',
                options: ['No pain', 'Visible deformity', 'Normal movement', 'No swelling'],
                correct: 1
            }
        ]
    },
    'head-spine': {
        title: 'Head and Spine Injuries',
        content: `
      <h3>Head and Spine Injuries</h3>
      <p>Head and spine injuries are serious and can be life-threatening. Proper handling is crucial to prevent further damage.</p>
      
      <h4>Types of Head Injuries:</h4>
      <ul>
        <li><strong>Minor head injury:</strong> Small bump or cut, no loss of consciousness</li>
        <li><strong>Concussion:</strong> Brain injury causing temporary loss of brain function</li>
        <li><strong>Skull fracture:</strong> Break in the skull bone</li>
        <li><strong>Spinal injury:</strong> Damage to spinal cord or vertebrae</li>
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
      
      <h4>Signs of Spinal Injury:</h4>
      <ul>
        <li>Severe pain in neck or back</li>
        <li>Weakness, numbness, or paralysis</li>
        <li>Loss of bladder or bowel control</li>
        <li>Difficulty breathing</li>
        <li>Twisted or unnatural position of head or back</li>
      </ul>
      
      <h4>First Aid for Head Injuries:</h4>
      <ul>
        <li>Call emergency services for serious injuries</li>
        <li>Keep person still and calm</li>
        <li>Apply cold compress to swelling</li>
        <li>Don't remove helmet if wearing one</li>
        <li>Monitor for changes in consciousness</li>
      </ul>
      
      <h4>First Aid for Spinal Injuries:</h4>
      <ul>
        <li>Call emergency services immediately</li>
        <li>Keep person absolutely still</li>
        <li>Don't move the person unless in danger</li>
        <li>Immobilize head and neck with rolled towels</li>
        <li>Don't remove helmet or protective gear</li>
        <li>Monitor breathing and consciousness</li>
      </ul>
    `,
        quiz: [{
                question: 'What is a key sign of concussion?',
                options: ['No symptoms', 'Confusion or disorientation', 'Normal speech', 'No headache'],
                correct: 1
            },
            {
                question: 'What should you do for suspected spinal injury?',
                options: ['Move person to comfortable position', 'Keep person absolutely still', 'Help them stand up', 'Rotate their head'],
                correct: 1
            },
            {
                question: 'What is a sign of serious head injury?',
                options: ['No pain', 'Loss of consciousness', 'Normal vision', 'No headache'],
                correct: 1
            },
            {
                question: 'How should you immobilize a neck injury?',
                options: ['With pillows', 'With rolled towels on sides', 'By moving head', 'No immobilization needed'],
                correct: 1
            },
            {
                question: 'What should you NOT do for head injury?',
                options: ['Apply cold compress', 'Remove helmet if wearing one', 'Monitor consciousness', 'Call for help'],
                correct: 1
            }
        ]
    },
    'breathing-chest': {
        title: 'Breathing and Chest Injuries',
        content: `
      <h3>Breathing and Chest Injuries</h3>
      <p>Breathing and chest injuries can quickly become life-threatening. Immediate action is essential.</p>
      
      <h4>Types of Breathing Emergencies:</h4>
      <ul>
        <li><strong>Choking:</strong> Airway blocked by foreign object</li>
        <li><strong>Chest wounds:</strong> Open or closed injuries to chest</li>
        <li><strong>Collapsed lung:</strong> Air enters chest cavity, compressing lung</li>
        <li><strong>Asthma attack:</strong> Severe difficulty breathing due to asthma</li>
      </ul>
      
      <h4>Signs of Choking:</h4>
      <ul>
        <li>Cannot speak, breathe, or cough</li>
        <li>Universal choking sign (hands clutching throat)</li>
        <li>Blue lips or skin</li>
        <li>High-pitched wheezing or no sound at all</li>
      </ul>
      
      <h4>Heimlich Maneuver for Choking:</h4>
      <ul>
        <li>Stand behind person and wrap arms around waist</li>
        <li>Make fist with one hand, place above navel</li>
        <li>Grasp fist with other hand</li>
        <li>Perform quick, upward thrusts</li>
        <li>Continue until object expelled or person becomes unconscious</li>
      </ul>
      
      <h4>Chest Wound Treatment:</h4>
      <ul>
        <li>For open wounds, seal with plastic or foil</li>
        <li>Tape on three sides, leaving one side open for air escape</li>
        <li>Monitor breathing</li>
        <li>Keep person in semi-sitting position</li>
        <li>Call emergency services</li>
      </ul>
      
      <h4>Asthma Attack First Aid:</h4>
      <ul>
        <li>Help person use rescue inhaler</li>
        <li>Keep person calm and upright</li>
        <li>Loosen tight clothing</li>
        <li>Move away from triggers</li>
        <li>Call emergency services if no improvement</li>
      </ul>
    `,
        quiz: [{
                question: 'What is the universal sign for choking?',
                options: ['Waving hands', 'Hands clutching throat', 'Pointing to mouth', 'Coughing loudly'],
                correct: 1
            },
            {
                question: 'Where should you place your hands for Heimlich maneuver?',
                options: ['On chest', 'Above navel', 'Below navel', 'On back'],
                correct: 1
            },
            {
                question: 'How should you seal an open chest wound?',
                options: ['With gauze', 'With plastic or foil taped on three sides', 'With bandage', 'Leave open'],
                correct: 1
            },
            {
                question: 'What should you do for asthma attack?',
                options: ['Lay person flat', 'Help use rescue inhaler', 'Give water', 'Make them exercise'],
                correct: 1
            },
            {
                question: 'What is a sign of severe choking?',
                options: ['Loud coughing', 'Cannot speak or breathe', 'Mild discomfort', 'Normal breathing'],
                correct: 1
            }
        ]
    },
    'heat-cold': {
        title: 'Heat and Cold Injuries',
        content: `
      <h3>Heat and Cold Injuries</h3>
      <p>Extreme temperatures can cause serious injuries. Prevention and proper first aid are essential.</p>
      
      <h4>Heat-Related Injuries:</h4>
      <ul>
        <li><strong>Heat exhaustion:</strong> Body overheats due to excessive heat exposure</li>
        <li><strong>Heat stroke:</strong> Life-threatening condition where body temperature regulation fails</li>
      </ul>
      
      <h4>Signs of Heat Exhaustion:</h4>
      <ul>
        <li>Heavy sweating</li>
        <li>Weakness or fatigue</li>
        <li>Dizziness or confusion</li>
        <li>Nausea or vomiting</li>
        <li>Headache</li>
        <li>Cool, moist skin</li>
      </ul>
      
      <h4>Signs of Heat Stroke:</h4>
      <ul>
        <li>High body temperature (103°F or higher)</li>
        <li>Hot, dry skin (no sweating)</li>
        <li>Rapid pulse</li>
        <li>Confusion or loss of consciousness</li>
        <li>Seizures</li>
      </ul>
      
      <h4>Cold-Related Injuries:</h4>
      <ul>
        <li><strong>Hypothermia:</strong> Dangerous drop in body temperature</li>
        <li><strong>Frostbite:</strong> Freezing of body tissues, usually extremities</li>
      </ul>
      
      <h4>Signs of Hypothermia:</h4>
      <ul>
        <li>Shivering (may stop as condition worsens)</li>
        <li>Slurred speech</li>
        <li>Confusion or memory loss</li>
        <li>Drowsiness</li>
        <li>Loss of coordination</li>
      </ul>
      
      <h4>Signs of Frostbite:</h4>
      <ul>
        <li>Cold, numb skin</li>
        <li>White or grayish skin</li>
        <li>Hard or waxy skin</li>
        <li>Blisters (in severe cases)</li>
      </ul>
      
      <h4>First Aid Treatment:</h4>
      <ul>
        <li><strong>Heat exhaustion:</strong> Move to cool place, drink water, apply cool compresses</li>
        <li><strong>Heat stroke:</strong> Call 911, cool body rapidly with water and fans</li>
        <li><strong>Hypothermia:</strong> Move to warm place, remove wet clothes, warm with blankets</li>
        <li><strong>Frostbite:</strong> Warm area gently, don't rub, seek medical care</li>
      </ul>
    `,
        quiz: [{
                question: 'What is a key difference between heat exhaustion and heat stroke?',
                options: ['Heat stroke has no sweating', 'Heat exhaustion is more serious', 'Both are the same', 'Heat stroke has low temperature'],
                correct: 0
            },
            {
                question: 'What is a sign of hypothermia?',
                options: ['Hot, dry skin', 'Shivering and slurred speech', 'Heavy sweating', 'Rapid movement'],
                correct: 1
            },
            {
                question: 'How should you treat frostbite?',
                options: ['Rub the area vigorously', 'Warm gently and don\'t rub', 'Apply ice', 'Ignore it'],
                correct: 1
            },
            {
                question: 'What should you do for heat stroke?',
                options: ['Give hot coffee', 'Call 911 and cool body rapidly', 'Wrap in blankets', 'Exercise'],
                correct: 1
            },
            {
                question: 'What is a sign of frostbite?',
                options: ['Red, hot skin', 'White, cold, numb skin', 'Sweating', 'Normal sensation'],
                correct: 1
            }
        ]
    },
    'poisoning-bites': {
        title: 'Poisoning and Bites',
        content: `
      <h3>Poisoning and Bites</h3>
      <p>Poisoning and animal bites can be serious emergencies requiring immediate action.</p>
      
      <h4>Types of Poisoning:</h4>
      <ul>
        <li><strong>Food poisoning:</strong> Illness from contaminated food</li>
        <li><strong>Chemical poisoning:</strong> Exposure to toxic chemicals</li>
        <li><strong>Drug overdose:</strong> Excessive medication or drug intake</li>
      </ul>
      
      <h4>Animal Bites and Stings:</h4>
      <ul>
        <li><strong>Insect bites and stings:</strong> Bees, wasps, ants, spiders</li>
        <li><strong>Animal bites:</strong> Dogs, cats, other animals</li>
        <li><strong>Snake bites:</strong> Venomous or non-venomous snakes</li>
      </ul>
      
      <h4>Signs of Poisoning:</h4>
      <ul>
        <li>Nausea, vomiting, diarrhea</li>
        <li>Abdominal pain</li>
        <li>Dizziness or confusion</li>
        <li>Difficulty breathing</li>
        <li>Unusual odor on breath</li>
        <li>Burns around mouth</li>
        <li>Drowsiness or loss of consciousness</li>
      </ul>
      
      <h4>First Aid for Poisoning:</h4>
      <ul>
        <li>Call poison control center immediately</li>
        <li>Don't induce vomiting unless instructed</li>
        <li>Have person sip water if conscious</li>
        <li>Preserve container or substance for identification</li>
        <li>Follow specific instructions from poison control</li>
      </ul>
      
      <h4>Insect Sting Treatment:</h4>
      <ul>
        <li>Remove stinger by scraping with credit card</li>
        <li>Wash area with soap and water</li>
        <li>Apply cold compress</li>
        <li>Watch for allergic reaction</li>
        <li>Seek emergency care for severe reactions</li>
      </ul>
      
      <h4>Animal Bite Treatment:</h4>
      <ul>
        <li>Wash wound with soap and water</li>
        <li>Apply antibiotic ointment</li>
        <li>Cover with clean bandage</li>
        <li>Seek medical care for deep bites</li>
        <li>Report animal bites to authorities</li>
      </ul>
      
      <h4>Snake Bite First Aid:</h4>
      <ul>
        <li>Call emergency services</li>
        <li>Keep calm and still</li>
        <li>Remove tight clothing and jewelry</li>
        <li>Don't cut wound or apply suction</li>
        <li>Don't apply tourniquet</li>
        <li>Keep bite below heart level</li>
      </ul>
    `,
        quiz: [{
                question: 'What should you do first for poisoning?',
                options: ['Induce vomiting', 'Call poison control center', 'Give water', 'Apply ice'],
                correct: 1
            },
            {
                question: 'How should you remove a bee stinger?',
                options: ['Pull with tweezers', 'Scrape with credit card', 'Squeeze out', 'Leave it in'],
                correct: 1
            },
            {
                question: 'What should you NOT do for snake bites?',
                options: ['Call emergency services', 'Cut wound or apply suction', 'Keep calm', 'Remove tight clothing'],
                correct: 1
            },
            {
                question: 'What is a sign of severe allergic reaction to insect sting?',
                options: ['Minor redness', 'Difficulty breathing', 'Small swelling', 'No symptoms'],
                correct: 1
            },
            {
                question: 'What should you do for animal bites?',
                options: ['Ignore it', 'Wash with soap and water', 'Apply heat', 'Cover without cleaning'],
                correct: 1
            }
        ]
    },
    'medical-emergencies': {
        title: 'Medical Emergencies',
        content: `
      <h3>Medical Emergencies</h3>
      <p>Medical emergencies require immediate recognition and response to save lives.</p>
      
      <h4>Types of Medical Emergencies:</h4>
      <ul>
        <li><strong>Fainting:</strong> Temporary loss of consciousness</li>
        <li><strong>Seizures:</strong> Uncontrolled electrical activity in brain</li>
        <li><strong>Heart attack:</strong> Blockage of blood flow to heart muscle</li>
        <li><strong>Stroke:</strong> Interruption of blood flow to brain</li>
        <li><strong>Diabetic emergency:</strong> Very high or low blood sugar</li>
        <li><strong>Allergic reaction (anaphylaxis):</strong> Severe, life-threatening allergic response</li>
      </ul>
      
      <h4>Heart Attack Signs:</h4>
      <ul>
        <li>Chest pain or pressure</li>
        <li>Pain spreading to arms, back, neck, jaw</li>
        <li>Shortness of breath</li>
        <li>Cold sweat, nausea, lightheadedness</li>
      </ul>
      
      <h4>Stroke Signs (FAST):</h4>
      <ul>
        <li><strong>F</strong>ace drooping</li>
        <li><strong>A</strong>rm weakness</li>
        <li><strong>S</strong>peech difficulty</li>
        <li><strong>T</strong>ime to call emergency services</li>
      </ul>
      
      <h4>Seizure First Aid:</h4>
      <ul>
        <li>Protect person from injury</li>
        <li>Don't restrain or hold down</li>
        <li>Don't put anything in mouth</li>
        <li>Time the seizure</li>
        <li>Place on side if possible</li>
        <li>Stay with person until fully awake</li>
      </ul>
      
      <h4>Anaphylaxis Signs:</h4>
      <ul>
        <li>Difficulty breathing</li>
        <li>Swelling of face, lips, tongue</li>
        <li>Hives or rash</li>
        <li>Dizziness or fainting</li>
        <li>Rapid heartbeat</li>
      </ul>
      
      <h4>Emergency Response:</h4>
      <ul>
        <li><strong>Heart attack:</strong> Call 911, give aspirin if available, keep person calm</li>
        <li><strong>Stroke:</strong> Call 911 immediately, note time symptoms started</li>
        <li><strong>Seizure:</strong> Protect from injury, call 911 if lasts >5 minutes</li>
        <li><strong>Anaphylaxis:</strong> Use EpiPen if available, call 911</li>
        <li><strong>Fainting:</strong> Lay person flat, elevate legs, check breathing</li>
      </ul>
    `,
        quiz: [{
                question: 'What does FAST stand for in stroke recognition?',
                options: ['Face, Arm, Speech, Time', 'Fast, Action, Save, Treat', 'Feel, Ask, See, Tell', 'First, Aid, Safety, Treatment'],
                correct: 0
            },
            {
                question: 'What should you NOT do during a seizure?',
                options: ['Protect from injury', 'Don\'t restrain', 'Don\'t put anything in mouth', 'Hold person down'],
                correct: 3
            },
            {
                question: 'What is a sign of anaphylaxis?',
                options: ['Mild itching', 'Difficulty breathing and swelling', 'Small rash', 'No symptoms'],
                correct: 1
            },
            {
                question: 'What should you do for heart attack?',
                options: ['Wait to see if it passes', 'Call 911 and give aspirin', 'Exercise', 'Give cold drink'],
                correct: 1
            },
            {
                question: 'How should you treat fainting?',
                options: ['Sit person up', 'Lay flat and elevate legs', 'Give water', 'Slap face'],
                correct: 1
            }
        ]
    },
    'eye-ear-dental': {
        title: 'Eye, Ear, and Dental Injuries',
        content: `
      <h3>Eye, Ear, and Dental Injuries</h3>
      <p>Injuries to eyes, ears, and teeth require careful first aid to prevent permanent damage.</p>
      
      <h4>Eye Injuries:</h4>
      <ul>
        <li><strong>Foreign object in eye:</strong> Dust, sand, metal, or other particles</li>
        <li><strong>Chemical splashes:</strong> Acids, alkalis, or other chemicals</li>
        <li><strong>Blows to eye:</strong> Direct impact causing swelling or damage</li>
        <li><strong>Cuts or punctures:</strong> Sharp object injuries to eye</li>
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
      
      <h4>Chemical Splash in Eye:</h4>
      <ul>
        <li>Immediately flush eye with clean water for 15-20 minutes</li>
        <li>Hold eyelid open while flushing</li>
        <li>Don't put any drops in eye</li>
        <li>Remove contact lenses if wearing them</li>
        <li>Seek emergency medical care</li>
      </ul>
      
      <h4>Ear Injuries:</h4>
      <ul>
        <li><strong>Foreign object in ear:</strong> Small items, insects, or earwax buildup</li>
        <li><strong>Cuts or punctures:</strong> Injuries to ear canal or outer ear</li>
        <li><strong>Barotrauma:</strong> Pressure changes from flying or diving</li>
      </ul>
      
      <h4>Ear Injury First Aid:</h4>
      <ul>
        <li>Don't try to remove objects with tools</li>
        <li>Let gravity help - tilt head to side</li>
        <li>Use tweezers only if object is visible and easy to grasp</li>
        <li>Seek medical care for embedded objects</li>
        <li>For cuts, apply gentle pressure and seek medical care</li>
      </ul>
      
      <h4>Dental Injuries:</h4>
      <ul>
        <li><strong>Tooth fracture:</strong> Broken or cracked tooth</li>
        <li><strong>Knocked-out tooth:</strong> Complete displacement of tooth</li>
        <li><strong>Loose tooth:</strong> Tooth moved from normal position</li>
      </ul>
      
      <h4>Dental Emergency Treatment:</h4>
      <ul>
        <li><strong>Knocked-out tooth:</strong> Find tooth, handle by crown only, rinse if dirty, try to reinsert or store in milk</li>
        <li><strong>Broken tooth:</strong> Rinse mouth, save broken pieces, apply cold compress</li>
        <li><strong>Loose tooth:</strong> Gently push back into position, bite down to keep in place</li>
        <li>See dentist within 30 minutes for best results</li>
      </ul>
    `,
        quiz: [{
                question: 'What should you do for foreign object in eye?',
                options: ['Rub vigorously', 'Don\'t rub, let tears wash it out', 'Use tweezers', 'Apply pressure'],
                correct: 1
            },
            {
                question: 'How long should you flush eye after chemical splash?',
                options: ['1-2 minutes', '5-10 minutes', '15-20 minutes', '30 minutes'],
                correct: 2
            },
            {
                question: 'What should you do for knocked-out tooth?',
                options: ['Handle by root', 'Handle by crown only, store in milk', 'Throw away', 'Clean with soap'],
                correct: 1
            },
            {
                question: 'What should you NOT do for ear foreign object?',
                options: ['Tilt head', 'Try to remove with tools', 'Seek medical care', 'Leave alone'],
                correct: 1
            },
            {
                question: 'What is the best time to see dentist for knocked-out tooth?',
                options: ['Within 24 hours', 'Within 30 minutes', 'Next week', 'Never'],
                correct: 1
            }
        ]
    }
};

// Test if JavaScript is loading
console.log('Safety.js loaded successfully');

syncCompletedTopicsWithDatabase();

let currentLesson = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

// Global functions for inline onclick handlers
function openLesson(lessonId) {
    console.log('openLesson called with:', lessonId);
    
    // Simple test - alert to verify function is called
    alert('Lesson clicked: ' + lessonId);
    
    currentLesson = lessonId;
    
    if (!lessons[lessonId]) {
        console.error('Lesson not found:', lessonId);
        alert('Lesson not found: ' + lessonId);
        return;
    }
    
    const lesson = lessons[lessonId];
    console.log('Found lesson:', lesson.title);
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('lessonModal');
    
    console.log('Modal elements:', {modalTitle, modalBody, modal});
    
    if (!modalTitle || !modalBody || !modal) {
        console.error('Modal elements not found');
        alert('Modal elements not found');
        return;
    }
    
    modalTitle.textContent = lesson.title;
    modalBody.innerHTML = lesson.content;
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Update Mark as Completed button state
    const markBtn = document.getElementById('markCompletedBtn');
    if (markBtn) {
        if (completedTopics[lessonId]) {
            markBtn.textContent = 'Completed';
            markBtn.disabled = true;
            markBtn.classList.add('btn-secondary');
            markBtn.classList.remove('btn-success');
        } else {
            markBtn.textContent = 'Mark as Completed';
            markBtn.disabled = false;
            markBtn.classList.add('btn-success');
            markBtn.classList.remove('btn-secondary');
        }
    }
    
    console.log('Lesson opened successfully');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function startMainQuiz(lessonType) {
    console.log('Starting main quiz:', lessonType);
    currentQuiz = [...mainLessonQuiz[lessonType].questions];
    currentQuestionIndex = 0;
    correctAnswers = 0;

    const quizTitle = document.getElementById('quizTitle');
    const totalQuestions = document.getElementById('totalQuestions');
    const quizModal = document.getElementById('quizModal');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitQuizBtn');
    
    if (!quizTitle || !totalQuestions || !quizModal || !nextBtn || !submitBtn) {
        console.error('Quiz elements not found');
        return;
    }
    
    quizTitle.textContent = mainLessonQuiz[lessonType].title;
    totalQuestions.textContent = currentQuiz.length;
    quizModal.classList.add('active');
    quizModal.style.display = 'flex';

    showQuestion();
    nextBtn.style.display = 'inline-flex';
    submitBtn.style.display = 'none';
}

function goToDashboard() {
    console.log('goToDashboard called');
    alert('Going to dashboard');
    window.location.href = 'dashboard.html';
}

async function markTopicCompleted() {
    const lessonId = currentLesson;
    if (!lessonId || completedTopics[lessonId]) return;

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
                    lessonId: lessonId,
                    completed: true
                })
            });
            const data = await response.json();
            console.log('Lesson progress saved:', data);
        } catch (error) {
            console.error('Error saving lesson progress:', error);
        }
    }

    completedTopics[lessonId] = true;
    localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));

    // Update the lesson card
    updateLessonCard(lessonId, true);

    // Update button
    const markBtn = document.getElementById('markCompletedBtn');
    if (markBtn) {
        markBtn.textContent = 'Completed';
        markBtn.disabled = true;
        markBtn.classList.add('btn-secondary');
        markBtn.classList.remove('btn-success');
    }

    // Update quiz button
    updateQuizButton();
    updateCompletedTopics();
}

    // Update button
    const markBtn = document.getElementById('markCompletedBtn');
    if (markBtn) {
        markBtn.textContent = 'Completed';
        markBtn.disabled = true;
        markBtn.classList.add('btn-secondary');
        markBtn.classList.remove('btn-success');
    }

    // Update quiz button
    updateQuizButton();
    updateCompletedTopics();
}

// Method 1: Direct event listeners for all buttons (most reliable)
function attachDirectEventListeners() {
    // View lesson buttons
    const lessonButtons = document.querySelectorAll('.btn-lesson');
    lessonButtons.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const card = this.closest('.lesson-card');
            if (card && card.dataset.lesson) {
                console.log('Direct click - Opening lesson:', card.dataset.lesson);
                openLesson(card.dataset.lesson);
            }
        };
    });
    
    // Dashboard button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Direct click - Going to dashboard');
            window.location.href = 'dashboard.html';
        };
    }
    
    // Quiz button
    const quizBtn = document.getElementById('safetyQuizBtn');
    if (quizBtn) {
        quizBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Direct click - Starting quiz');
            startMainQuiz('safety');
        };
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        };
    });
    
    // Mark completed button
    const markBtn = document.getElementById('markCompletedBtn');
    if (markBtn) {
        markBtn.onclick = function(e) {
            e.preventDefault();
            markTopicCompleted();
        };
    }
    
    // Next question button
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.onclick = function(e) {
            e.preventDefault();
            handleNextQuestion();
        };
    }
    
    // Submit quiz button
    const submitBtn = document.getElementById('submitQuizBtn');
    if (submitBtn) {
        submitBtn.onclick = function(e) {
            e.preventDefault();
            document.getElementById('quizModal').classList.remove('active');
            showResults();
        };
    }
    
    // Quiz options
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach((option, index) => {
        option.onclick = function(e) {
            e.preventDefault();
            selectOption(index, this);
        };
    });
}

// Method 2: Event delegation as backup
document.addEventListener('click', function(e) {
    const target = e.target;
    
    // View lesson buttons
    if (target.classList.contains('btn-lesson') || target.closest('.btn-lesson')) {
        const btn = target.classList.contains('btn-lesson') ? target : target.closest('.btn-lesson');
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.lesson-card');
        if (card && card.dataset.lesson) {
            console.log('Delegation - Opening lesson:', card.dataset.lesson);
            openLesson(card.dataset.lesson);
        }
    }
    
    // Dashboard button
    if (target.id === 'backBtn' || target.classList.contains('btn-back') || 
        target.closest('#backBtn') || target.closest('.btn-back')) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Delegation - Going to dashboard');
        window.location.href = 'dashboard.html';
    }
    
    // Quiz button
    if (target.id === 'safetyQuizBtn' || target.closest('#safetyQuizBtn')) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Delegation - Starting quiz');
        startMainQuiz('safety');
    }
    
    // Modal close buttons
    if (target.classList.contains('modal-close') || target.classList.contains('modal-close-btn') ||
        target.closest('.modal-close') || target.closest('.modal-close-btn')) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
    
    // Mark completed button
    if (target.id === 'markCompletedBtn' || target.closest('#markCompletedBtn')) {
        e.preventDefault();
        e.stopPropagation();
        markTopicCompleted();
    }
    
    // Next question button
    if (target.id === 'nextQuestionBtn' || target.closest('#nextQuestionBtn')) {
        e.preventDefault();
        e.stopPropagation();
        handleNextQuestion();
    }
    
    // Submit quiz button
    if (target.id === 'submitQuizBtn' || target.closest('#submitQuizBtn')) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('quizModal').classList.remove('active');
        showResults();
    }
    
    // Quiz options
    if (target.classList.contains('quiz-option') || target.closest('.quiz-option')) {
        e.preventDefault();
        e.stopPropagation();
        const option = target.classList.contains('quiz-option') ? target : target.closest('.quiz-option');
        const options = document.querySelectorAll('.quiz-option');
        const index = Array.from(options).indexOf(option);
        selectOption(index, option);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Safety page loaded - attaching event listeners');
        
        setupLessonCards();
        setupModal();
        setupBackButton();
        updateQuizButton();
        updateCompletedTopics();
        
        // Attach direct listeners
        attachDirectEventListeners();
        
        // Re-attach listeners after a short delay to ensure everything is loaded
        setTimeout(() => {
            attachDirectEventListeners();
            console.log('Event listeners re-attached');
        }, 500);
        
    } catch (error) {
        console.error('Error initializing safety page:', error);
    }
});
        document.body.style.overflow = 'auto';
    }
    
    // Mark as completed button
    if (target.matches('#markCompletedBtn') || target.closest('#markCompletedBtn')) {
        e.preventDefault();
        e.stopPropagation();
        markTopicCompleted();
    }
    
    // Start quiz button
    if (target.matches('#safetyQuizBtn') || target.closest('#safetyQuizBtn')) {
        e.preventDefault();
        e.stopPropagation();
        startMainQuiz('safety');
    }
    
    // Next question button
    if (target.matches('#nextQuestionBtn') || target.closest('#nextQuestionBtn')) {
        e.preventDefault();
        e.stopPropagation();
        handleNextQuestion();
    }
    
    // Submit quiz button
    if (target.matches('#submitQuizBtn') || target.closest('#submitQuizBtn')) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('quizModal').classList.remove('active');
        showResults();
    }
    
    // Quiz options
    if (target.matches('.quiz-option') || target.closest('.quiz-option')) {
        e.preventDefault();
        e.stopPropagation();
        
        const option = target.matches('.quiz-option') ? target : target.closest('.quiz-option');
        const options = document.querySelectorAll('.quiz-option');
        const index = Array.from(options).indexOf(option);
        
        selectOption(index, option);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Safety page loaded');
        
        setupLessonCards();
        setupModal();
        setupBackButton();
        updateQuizButton();
        updateCompletedTopics();
        
    } catch (error) {
        console.error('Error initializing safety page:', error);
    }
});

// Authentication check removed - no longer needed

function setupLessonCards() {
    // Mark completed topics
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach(card => {
        const lessonId = card.dataset.lesson;
        if (completedTopics[lessonId]) {
            card.classList.add('completed');
        }
    });
}

function openLesson(lessonId) {
    console.log('Opening lesson:', lessonId);
    currentLesson = lessonId;
    
    const lesson = lessons[lessonId];
    if (!lesson) {
        console.error('Lesson not found:', lessonId);
        return;
    }
    
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
    modal.style.display = 'flex';
    
    console.log('Lesson opened successfully');
}
}

function setupModal() {
    // Handled by attachDirectEventListeners and event delegation
}

function setupBackButton() {
    // Handled by attachDirectEventListeners and event delegation
}

function setupBackButton() {
    // Handled by main event delegation
}

function startQuiz() {
    currentQuiz = [...lessons[currentLesson].quiz];
    currentQuestionIndex = 0;
    correctAnswers = 0;

    document.getElementById('quizTitle').textContent = `${lessons[currentLesson].title} Quiz`;
    document.getElementById('totalQuestions').textContent = currentQuiz.length;
    const quizModal = document.getElementById('quizModal');
    quizModal.classList.add('active');
    quizModal.style.display = 'flex';

    showQuestion();
    document.getElementById('nextQuestionBtn').style.display = 'inline-flex';
    document.getElementById('submitQuizBtn').style.display = 'none';
}

function showQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('quizQuestion').textContent = question.question;

    const progressPercent = ((currentQuestionIndex) / currentQuiz.length) * 100;
    const progressBar = document.querySelector('.quiz-progress-bar');
    if (progressBar) {
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
    }

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index, optionElement));
        optionsContainer.appendChild(optionElement);
    });

    document.getElementById('nextQuestionBtn').disabled = true;
}

let selectedOption = null;

function selectOption(index, element) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));

    element.classList.add('selected');
    selectedOption = index;
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.disabled = false;
}

function handleNextQuestion() {
    const correctAnswer = currentQuiz[currentQuestionIndex].correct;

    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, idx) => {
        opt.style.pointerEvents = 'none';
        if (idx === correctAnswer) {
            opt.classList.add('correct');
        } else if (idx === selectedOption && idx !== correctAnswer) {
            opt.classList.add('incorrect');
        }
    });

    if (selectedOption === correctAnswer) {
        correctAnswers++;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        selectedOption = null;

        if (currentQuestionIndex < currentQuiz.length) {
            showQuestion();
        } else {
            document.getElementById('nextQuestionBtn').style.display = 'none';
            document.getElementById('submitQuizBtn').style.display = 'inline-flex';
        }
    }, 1500);
}

function showResults() {
    const score = Math.round((correctAnswers / currentQuiz.length) * 100);
    const total = currentQuiz.length;
    
    document.getElementById('resultScore').textContent = `${score}%`;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('totalCount').textContent = total;
    
    let message = '';
    if (score === 100) {
        message = 'Perfect! You\'re a safety expert!';
        document.querySelector('.result-icon').textContent = '🏆';
    } else if (score >= 80) {
        message = 'Excellent work! You have great knowledge!';
        document.querySelector('.result-icon').textContent = '🎉';
    } else if (score >= 60) {
        message = 'Good job! Keep learning to improve!';
        document.querySelector('.result-icon').textContent = '👍';
    } else {
        message = 'Keep practicing! Review the lesson and try again.';
        document.querySelector('.result-icon').textContent = '📚';
    }
    
    document.getElementById('resultMessage').textContent = message;
    const resultModal = document.getElementById('quizResultModal');
    resultModal.classList.add('active');
    resultModal.style.display = 'flex';
    
    saveQuizProgress(lessons[currentLesson].title, correctAnswers, total);
    markTopicCompleted();
    syncCompletedTopicsWithDatabase();
}

    document.getElementById('resultMessage').textContent = message;
    const resultModal = document.getElementById('quizResultModal');
    resultModal.classList.add('active');
    resultModal.style.display = 'flex';

    saveQuizProgress(lessons[currentLesson].title, correctAnswers, total);
}

function markTopicCompleted() {
    const lessonId = getCurrentLessonId();
    if (!lessonId || completedTopics[lessonId]) return;
    
    completedTopics[lessonId] = true;
    localStorage.setItem('y-safe-completed-topics', JSON.stringify(completedTopics));
    
    // Update lesson card
    updateLessonCard(lessonId, true);
    
    // Update button
    const markBtn = document.getElementById('markCompletedBtn');
    markBtn.textContent = 'Completed';
    markBtn.disabled = true;
    markBtn.classList.add('btn-secondary');
    markBtn.classList.remove('btn-success');
    
    // Update quiz button
    updateQuizButton();
    syncCompletedTopicsWithDatabase();
}

function getCurrentLessonId() {
    // currentLesson is already the lesson ID
    return currentLesson;
}

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

function updateQuizButton() {
    const allSafetyTopics = Object.keys(lessons);
    const completedCount = allSafetyTopics.filter(id => completedTopics[id]).length;

    const quizBtn = document.getElementById('safetyQuizBtn');
    if (quizBtn) {
        if (completedCount === allSafetyTopics.length) {
            quizBtn.disabled = false;
            quizBtn.textContent = 'Start Quiz';
        } else {
            quizBtn.disabled = true;
            quizBtn.textContent = `Complete ${allSafetyTopics.length - completedCount} more topic${allSafetyTopics.length - completedCount > 1 ? 's' : ''}`;
        }
    }
}

function updateCompletedTopics() {
    const safetyTopics = Object.keys(lessons).filter(id => id.startsWith('cuts-') || id.startsWith('bleeding') || id.startsWith('burns') || id.startsWith('bone-') || id.startsWith('head-') || id.startsWith('breathing-') || id.startsWith('heat-') || id.startsWith('poisoning-') || id.startsWith('medical-') || id.startsWith('eye-') || id === 'fire' || id === 'earthquake' || id === 'evacuation');
    const completedCount = safetyTopics.filter(id => completedTopics[id]).length;

    const completedSpan = document.getElementById('completedTopics');
    const totalSpan = document.getElementById('totalTopics');
    if (completedSpan && totalSpan) {
        completedSpan.textContent = completedCount;
        totalSpan.textContent = safetyTopics.length;
    }
}

function startMainQuiz(lessonType) {
    try {
        // Validate required elements
        const quizModal = document.getElementById('quizModal');
        const quizTitle = document.getElementById('quizTitle');
        const totalQuestions = document.getElementById('totalQuestions');
        const currentQuestionEl = document.getElementById('currentQuestion');
        const quizQuestionEl = document.getElementById('quizQuestion');
        const quizOptionsEl = document.getElementById('quizOptions');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const submitBtn = document.getElementById('submitQuizBtn');

        if (!quizModal || !quizTitle || !totalQuestions || !currentQuestionEl || !quizQuestionEl || !quizOptionsEl || !nextBtn || !submitBtn) {
            throw new Error('Required quiz elements not found');
        }

        currentQuiz = [...mainLessonQuiz[lessonType].questions];
        currentQuestionIndex = 0;
        correctAnswers = 0;

        quizTitle.textContent = mainLessonQuiz[lessonType].title;
        totalQuestions.textContent = currentQuiz.length;
        quizModal.classList.add('active');
        quizModal.style.display = 'flex';

        showQuestion();
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    } catch (error) {
        console.error('Error starting quiz:', error);
        alert('Quiz system error. Please refresh the page and try again.');
    }
}

function saveQuizProgress(quizId, score, totalQuestions) {
    fetch(`${API_URL}/quiz-progress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('y-safe-token')}`
        },
        body: JSON.stringify({
            quizType: 'safety',
            quizId: quizId.toLowerCase(),
            score,
            totalQuestions
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Quiz progress saved:', data);
        })
        .catch(error => {
            console.error('Error saving quiz progress:', error);
        });
}

document.querySelector('#quizResultModal .modal-close-btn').addEventListener('click', () => {
    document.getElementById('quizResultModal').classList.remove('active');
});

document.querySelector('#quizResultModal .modal-close').addEventListener('click', () => {
    document.getElementById('quizResultModal').classList.remove('active');
});