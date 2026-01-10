const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'y-safe-secret-key-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATABASE_PATH = process.env.DATABASE_PATH || './database.sqlite';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database(DATABASE_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err);
    console.error('Database path:', DATABASE_PATH);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database at:', DATABASE_PATH);
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

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { isAdmin: true, name: 'Admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/admin/users', adminAuth, (req, res) => {
  db.all(
    'SELECT * FROM users ORDER BY created_at DESC',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ users: rows });
    }
  );
});

app.get('/api/admin/quizzes', adminAuth, (req, res) => {
  db.all(
    `SELECT qp.*, u.name as user_name, u.section 
     FROM quiz_progress qp 
     JOIN users u ON qp.user_id = u.id 
     ORDER BY qp.completed_at DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ quizzes: rows });
    }
  );
});

app.get('/api/admin/lessons', adminAuth, (req, res) => {
  db.all(
    `SELECT lp.*, u.name as user_name, u.section 
     FROM lesson_progress lp 
     JOIN users u ON lp.user_id = u.id 
     ORDER BY lp.completed_at DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ lessons: rows });
    }
  );
});

app.get('/api/admin/user/:id', adminAuth, (req, res) => {
  const userId = req.params.id;
  
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.all(
      'SELECT * FROM quiz_progress WHERE user_id = ? ORDER BY completed_at DESC',
      [userId],
      (err, quizzes) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        db.all(
          'SELECT * FROM lesson_progress WHERE user_id = ? ORDER BY completed_at DESC',
          [userId],
          (err, lessons) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            res.json({
              user,
              quizzes,
              lessons
            });
          }
        );
      }
    );
  });
});

app.get('/api/admin/stats', adminAuth, (req, res) => {
  db.get('SELECT COUNT(*) as count FROM users', (err, usersResult) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    db.get('SELECT COUNT(*) as count FROM quiz_progress', (err, quizzesResult) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      db.get('SELECT COUNT(*) as count FROM lesson_progress', (err, lessonsResult) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        db.get('SELECT AVG(CAST(score AS FLOAT) / CAST(total_questions AS FLOAT)) * 100 as avg FROM quiz_progress', (err, scoreResult) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          const avgScore = scoreResult.avg ? Math.round(scoreResult.avg) : 0;

          res.json({
            totalUsers: usersResult.count,
            totalQuizzes: quizzesResult.count,
            totalLessons: lessonsResult.count,
            averageScore: avgScore
          });
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Y-SAFE Web server running on http://localhost:${PORT}`);
});
