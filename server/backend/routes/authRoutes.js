const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "capstone-super-secret-jwt-key-2026";

// In-memory test user store fallback if DB is mocked
const users = [];

// Register Endpoint
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }
  const newUser = { id: users.length + 1, name: name || "User", email, password, role: role || "user" };
  users.push(newUser);
  res.status(201).json({ status: "success", message: "User registered successfully!", user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
});

// Login Endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  let user = users.find(u => u.email === email);
  
  // Default mock fallback for testing
  if (!user && email.includes('admin')) {
    user = { id: 99, name: "Admin User", email, role: "admin" };
  } else if (!user) {
    user = { id: 1, name: "Normal User", email, role: "user" };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.status(200).json({
    status: "success",
    message: "Login successful!",
    token,
    user: { id: user.id, email: user.email, role: user.role }
  });
});

// Auth Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "401 Unauthorized: Token missing or malformed." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "403 Forbidden: Invalid or expired token." });
  }
};

// Protected User Route
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({ status: "success", message: "Access granted to User Profile!", user: req.user });
});

// Protected Admin-Only Route
router.get('/admin-dashboard', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "403 Forbidden: Admin privileges required." });
  }
  res.status(200).json({ status: "success", message: "Welcome Admin! Access granted to Admin Dashboard.", user: req.user });
});

module.exports = router;
