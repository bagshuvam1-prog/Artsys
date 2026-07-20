const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersPath = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  const raw = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are all required' });
  }

  const users = readUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    email,
    password: hashedPassword
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ id: newUser.id, username: newUser.username, email: newUser.email });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordMatches = bcrypt.compareSync(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ id: user.id, username: user.username, email: user.email });
});

module.exports = router;
