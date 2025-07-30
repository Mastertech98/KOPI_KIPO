const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET all users (admin only, ideally)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, role FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', 
      [username, email, hashedPassword, role || 'user']
    );
    res.status(201).json({ message: 'User registered', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login (simplified: no token, just check)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'No User!' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // generate token, ganti 'your-secret-key' dengan secret yang aman di environment variable
    const token = jwt.sign(payload, 'E-Commerce', { expiresIn: '1h' });
    //localStorage.setItem('token', data.token);

    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
