const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'y-safe-secret-key-2026';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    section TEXT,
    is_guest INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS quiz_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    quiz_type TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    score INTEGER,
    total_questions INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lesson_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    lesson_id TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
}

app.post('/api/register', (req, res) => {
  const { name, section, isGuest } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const stmt = db.prepare('INSERT INTO users (name, section, is_guest) VALUES (?, ?, ?)');
  stmt.run(name, section || null, isGuest ? 1 : 0, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const token = jwt.sign(
      { userId: this.lastID, name, isGuest: !!isGuest },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: this.lastID, name, section, isGuest: !!isGuest }
    });
  });
});

app.post('/api/login', (req, res) => {
  const { name, section, isGuest } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const stmt = db.prepare('INSERT INTO users (name, section, is_guest) VALUES (?, ?, ?)');
  stmt.run(name, section || null, isGuest ? 1 : 0, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const token = jwt.sign(
      { userId: this.lastID, name, isGuest: !!isGuest },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: this.lastID, name, section, isGuest: !!isGuest }
    });
  });
});

app.get('/api/user', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/api/quiz-progress', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { quizType, quizId, score, totalQuestions } = req.body;

    const stmt = db.prepare(
      'INSERT INTO quiz_progress (user_id, quiz_type, quiz_id, score, total_questions) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(decoded.userId, quizType, quizId, score, totalQuestions, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, id: this.lastID });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/quiz-progress/:quizType', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { quizType } = req.params;

    db.all(
      'SELECT * FROM quiz_progress WHERE user_id = ? AND quiz_type = ? ORDER BY completed_at DESC',
      [decoded.userId, quizType],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ progress: rows });
      }
    );
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/api/lesson-progress', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { lessonId } = req.body;

    const stmt = db.prepare(
      'INSERT OR REPLACE INTO lesson_progress (user_id, lesson_id, completed, completed_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP)'
    );
    stmt.run(decoded.userId, lessonId, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/lesson-progress', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    db.all(
      'SELECT * FROM lesson_progress WHERE user_id = ?',
      [decoded.userId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ progress: rows });
      }
    );
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Y-SAFE Web server running on http://localhost:${PORT}`);
});
