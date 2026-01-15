const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'y-safe-secret-key-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-password';
const DATABASE_PATH = process.env.DATABASE_PATH || './database.sqlite';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database(DATABASE_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Database connection error:', err);
    console.error('Database path:', DATABASE_PATH);
  } else {
    console.log('Connected to database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      section TEXT,
      is_guest INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS quiz_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_type TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, lesson_id)
    )`);
  });
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: 'admin' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.post('/api/register', (req, res) => {
  const { name, section, isGuest } = req.body;
  
  // For guests, name is optional
  if (!isGuest && (!name || name.trim() === '')) {
    return res.status(400).json({ error: 'Name is required for registered users' });
  }

  // For guests, don't save to database
  if (isGuest) {
    const guestName = name && name.trim() !== '' ? name.trim() : 'Guest';
    const token = jwt.sign(
      { userId: null, name: guestName, isGuest: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: null, name: guestName, section, isGuest: true }
    });
  }

  // For registered users, save to database
  const stmt = db.prepare('INSERT INTO users (name, section, is_guest) VALUES (?, ?, ?)');
  stmt.run(name, section || null, 0, function(err) {
    if (err) {
      console.error('Register database error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }

    const token = jwt.sign(
      { userId: this.lastID, name, isGuest: false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: this.lastID, name, section, isGuest: false }
    });
  });
});

app.post('/api/login', (req, res) => {
  const { name, section, isGuest } = req.body;
  
  // For guests, name is optional
  if (!isGuest && (!name || name.trim() === '')) {
    return res.status(400).json({ error: 'Name is required for registered users' });
  }

  // For guests, don't save to database
  if (isGuest) {
    const guestName = name && name.trim() !== '' ? name.trim() : 'Guest';
    const token = jwt.sign(
      { userId: null, name: guestName, isGuest: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: null, name: guestName, section, isGuest: true }
    });
  }

  // For registered users, save to database
  const stmt = db.prepare('INSERT INTO users (name, section, is_guest) VALUES (?, ?, ?)');
  stmt.run(name, section || null, 0, function(err) {
    if (err) {
      console.error('Login database error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }

    const token = jwt.sign(
      { userId: this.lastID, name, isGuest: false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: this.lastID, name, section, isGuest: false }
    });
  });
});

app.get('/api/user', (req, res) => {
  // No authentication required - return guest user info
  res.json({ 
    user: { 
      name: 'Guest', 
      isGuest: true 
    } 
  });
});

app.post('/api/quiz-progress', (req, res) => {
  // No authentication required - direct access
  const { quizType, quizId, score, totalQuestions } = req.body;
  
  // Always return success but don't record to database
  res.json({ 
    success: true, 
    message: 'Progress received (not recorded in public mode)' 
  });
});

app.get('/api/quiz-progress/:quizType', (req, res) => {
  // No authentication required - return empty progress for public mode
  res.json({ progress: [] });
});

app.post('/api/lesson-progress', (req, res) => {
  // No authentication required - direct access
  const { lessonId } = req.body;
  
  // Always return success but don't record to database
  res.json({ 
    success: true, 
    message: 'Progress received (not recorded in public mode)' 
  });
});

app.get('/api/lesson-progress', (req, res) => {
  // No authentication required - return empty progress for public mode
  res.json({ progress: [] });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
