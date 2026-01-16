const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Basic authentication middleware (token-based)
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try { req.user = jwt.verify(token, JWT_SECRET); } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
  next();
}


// Optional authentication middleware (token-based) loaded early for quick routing guards
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) { req.user = null; return next(); }
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try { req.user = jwt.verify(token, JWT_SECRET); } catch (e) { req.user = null; }
  next();
};
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'y-safe-secret-key-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-password';
const ADMIN_HASH = process.env.ADMIN_HASH || bcrypt.hashSync(ADMIN_PASSWORD, 10);
const DATABASE_PATH = process.env.DATABASE_PATH || './database.sqlite';

// Simple CORS policy: allow same-origin during development; adjust for prod
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'https://*.vercel.app'];
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV === 'production') {
      const allowed = ALLOWED_ORIGINS.some(allowed => origin.includes(allowed) || allowed === '*');
      callback(null, allowed);
    } else {
      callback(null, true);
    }
  },
  credentials: true 
}));
// Body parser with JSON support and limit to mitigate DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// Lightweight input validation placeholder (to be expanded with a proper lib in Phase 0)

const db = new sqlite3.Database(DATABASE_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Database connection error:', err);
    console.error('Database path:', DATABASE_PATH);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database at:', DATABASE_PATH);
    // Ensure foreign keys are enforced
    db.exec('PRAGMA foreign_keys = ON;', (err2) => {
      if (err2) {
        console.error('Failed to enable foreign keys:', err2);
      }
      initializeDatabase();
    });
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
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, lesson_id)
  )`);
  
}

app.post('/api/register', (req, res) => {
  const { name, section, isGuest } = req.body;
  // Basic input check
  if (typeof isGuest !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request: isGuest required' });
  }
  // For guests, name is optional
  if (!isGuest && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Name is required for registered users' });
  }
  // For guests, don't save to database
  if (isGuest) {
    const guestName = typeof name === 'string' && name.trim() !== '' ? name.trim() : 'Guest';
    const token = jwt.sign(
      { userId: null, name: guestName, isGuest: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ token, user: { id: null, name: guestName, section, isGuest: true } });
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
    res.json({ token, user: { id: this.lastID, name, section, isGuest: false } });
  });
});

app.post('/api/login', (req, res) => {
  const { name, section, isGuest } = req.body;
  // Basic input check
  if (typeof isGuest !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request: isGuest required' });
  }
  if (!isGuest && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Name is required for registered users' });
  }
  if (isGuest) {
    const guestName = typeof name === 'string' && name.trim() !== '' ? name.trim() : 'Guest';
    const token = jwt.sign(
      { userId: null, name: guestName, isGuest: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ token, user: { id: null, name: guestName, section, isGuest: true } });
  }
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
    res.json({ token, user: { id: this.lastID, name, section, isGuest: false } });
  });
});

app.get('/api/user', (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.json({ user: { name: 'Guest', isGuest: true } });
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) return res.json({ user: { name: 'Guest', isGuest: true } });
    db.get('SELECT * FROM users WHERE id = ?', [decoded.userId], (err, user) => {
      if (err) {
        console.error('Database error fetching user:', err);
        return res.json({ user: { name: 'Guest', isGuest: true } });
      }
      if (!user) {
        console.error('User not found for ID:', decoded.userId);
        return res.json({ user: { name: 'Guest', isGuest: true } });
      }
      res.json({ user: { id: user.id, name: user.name, section: user.section, isGuest: !!user.is_guest } });
    });
  } catch (e) {
    console.error('Token verification error:', e);
    res.json({ user: { name: 'Guest', isGuest: true } });
  }
});

app.post('/api/quiz-progress', requireAuth, (req, res) => {
  const { quizType, quizId, score, totalQuestions } = req.body;
  const userId = req.user.userId;
  if (!userId) return res.status(400).json({ error: 'Invalid user' });
  if (!quizType || typeof quizType !== 'string' || quizType.trim() === '') {
    return res.status(400).json({ error: 'Quiz type required' });
  }
  if (!quizId || typeof quizId !== 'string' || quizId.trim() === '') {
    return res.status(400).json({ error: 'Quiz ID required' });
  }
  if (typeof score !== 'number' || score < 0 || score > totalQuestions) {
    return res.status(400).json({ error: 'Invalid score' });
  }
  if (typeof totalQuestions !== 'number' || totalQuestions <= 0) {
    return res.status(400).json({ error: 'Total questions must be positive' });
  }
  const stmt = db.prepare('INSERT INTO quiz_progress (user_id, quiz_type, quiz_id, score, total_questions) VALUES (?, ?, ?, ?, ?)');
  stmt.run(userId, quizType, quizId, score, totalQuestions, function(err) {
    if (err) {
      console.error('Quiz progress error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json({ success: true, message: 'Quiz progress saved' });
  });
});

app.get('/api/quiz-progress/:quizType', requireAuth, (req, res) => {
  const quizType = req.params.quizType;
  const userId = req.user.userId;
  if (!userId) return res.status(400).json({ error: 'Invalid user' });
  db.all('SELECT * FROM quiz_progress WHERE user_id = ? AND quiz_type = ? ORDER BY completed_at DESC', [userId, quizType], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ progress: rows });
  });
});

app.post('/api/lesson-progress', requireAuth, (req, res) => {
  const { lessonId, completed } = req.body;
  const userId = req.user.userId;
  if (!userId) return res.status(400).json({ error: 'Invalid user' });
  if (!lessonId || typeof lessonId !== 'string' || lessonId.trim() === '') {
    return res.status(400).json({ error: 'Lesson ID required' });
  }
  const completedVal = completed ? 1 : 0;
  const stmt = db.prepare('INSERT OR REPLACE INTO lesson_progress (user_id, lesson_id, completed, completed_at) VALUES (?, ?, ?, ?)');
  stmt.run(userId, lessonId, completedVal, new Date().toISOString(), function(err) {
    if (err) {
      console.error('Lesson progress error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json({ success: true, message: 'Lesson progress saved' });
  });
});
});

app.get('/api/lesson-progress', requireAuth, (req, res) => {
  const userId = req.user.userId;
  if (!userId) return res.status(400).json({ error: 'Invalid user' });
  db.all('SELECT * FROM lesson_progress WHERE user_id = ? ORDER BY completed_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ progress: rows });
  });
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
  if (typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({ error: 'Password required' });
  }
  if (bcrypt.compareSync(password, ADMIN_HASH)) {
    const token = jwt.sign({ isAdmin: true, name: 'Admin' }, JWT_SECRET, { expiresIn: '1d' });
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

// 404 handler
app.use((req, res, next) => { res.status(404).json({ error: 'Not Found' }); });
// Basic error handler
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Internal Server Error' }); });

app.listen(PORT, () => {
  console.log(`Y-SAFE Web server running on http://localhost:${PORT}`);
});
