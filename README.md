# Y-SAFE Web

Essential First Aid & Safety Awareness Website for ELIAS A. SALVADOR NATIONAL HIGH SCHOOL

## Features

- **User Authentication**: Login with name and section, or continue as guest
- **Dashboard**: View progress and navigate to different learning modules
- **Essential First Aid Tutorials**: CPR, Burns, Choking, Wounds, Fractures with interactive quizzes
- **Safety Awareness**: Fire Safety, Natural Disasters, Road Safety, School Safety with quizzes
- **First Aid Essentials**: Emergency numbers, kit items, and matching quiz
- **Progress Tracking**: Save quiz scores and lesson progress to database
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The website will be available at `http://localhost:3000`

## Project Structure

```
Y-Safe Web/
├── server.js                 # Express.js backend server
├── package.json              # Project dependencies
├── database.sqlite           # SQLite database (created automatically)
└── public/
    ├── index.html            # Login page
    ├── dashboard.html        # Main dashboard
    ├── first-aid.html        # First aid tutorials
    ├── safety.html           # Safety awareness
    ├── essentials.html       # First aid essentials
    ├── css/
    │   └── style.css         # Styles with exact color palette
    └── js/
        ├── login.js          # Login functionality
        ├── dashboard.js      # Dashboard logic
        ├── first-aid.js      # First aid lessons & quizzes
        ├── safety.js         # Safety lessons & quizzes
        └── essentials.js     # Essentials & matching quiz
```

## Color Palette

- Trust Blue: #1E88E5
- Header Blue: #1565C0
- Soft Blue: #BBDEFB
- Safety Green: #43A047
- Light Green: #C8E6C9
- Warning Yellow: #FBC02D
- Soft Yellow: #FFF9C4
- Emergency Red: #E53935
- Soft Red: #FFCDD2
- Background White: #FFFFFF
- Card Gray: #F5F7FA
- Primary Text: #263238
- Secondary Text: #607D8B

## API Endpoints

- `POST /api/login` - User login
- `GET /api/user` - Get user info
- `POST /api/quiz-progress` - Save quiz progress
- `GET /api/quiz-progress/:quizType` - Get quiz progress
- `POST /api/lesson-progress` - Save lesson progress
- `GET /api/lesson-progress` - Get lesson progress

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)

## Features Breakdown

### 1. Authentication
- Name and section collection
- Guest access mode
- JWT token authentication
- Session persistence (localStorage)

### 2. First Aid Tutorials
- Step-by-step lessons with expandable content
- Interactive quizzes after each lesson
- Instant feedback on quiz answers
- Score tracking and saving

### 3. Safety Awareness
- Mobile-friendly reading layout
- Interactive quizzes (multiple choice)
- Progress saving and dashboard display

### 4. First Aid Essentials
- Emergency numbers display
- First aid kit items
- Matching quiz with instant feedback

## Development

To run in development mode:
```bash
npm start
```

The server will auto-restart when files change (in production, use a process manager like PM2).

## License

ISC
