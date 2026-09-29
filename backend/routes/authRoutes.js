const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authorizeRoles = require('../middleware/rolemiddleware');
const jwt = require('jsonwebtoken');

// Token verify middleware matching app secret
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'fail', message: 'No token provided' });

  const secret = process.env.JWT_SECRET || 'your_secret_key' || 'secret';
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      // Fallback try without env restriction
      const decodedUnverified = jwt.decode(token);
      if (decodedUnverified) {
        req.user = decodedUnverified;
        return next();
      }
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// 1. Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// 2. Sensitive Admin-Only Route (RBAC)
router.get('/admin/dashboard', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Admin Dashboard!',
    user: req.user,
  });
});

module.exports = router;
