const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/rolemiddleware');

// 1. Public Authentication Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// 2. Protected Route (Any Logged-in User can access)
router.get('/profile', authMiddleware, authController.getProfile);

// 3. Sensitive Admin-Only Route (RBAC Check)
router.get('/admin/dashboard', authMiddleware, authorizeRoles('admin'), (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Admin Dashboard!',
    user: req.user,
  });
});

module.exports = router;
