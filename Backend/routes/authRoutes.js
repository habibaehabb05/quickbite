const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  auth,
  adminOnly,
  studentOnly,
  restaurantOnly
} = require('../middleware/auth');

const authController = require('../controllers/authController');

// Validation middleware
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .matches(/^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/)
    .withMessage('Email must be from @miuegypt.edu.eg domain'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['student', 'restaurant', 'admin'])
    .withMessage('Role must be student, restaurant, or admin')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Auth routes
router.post('/signup', registerValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/change-password', auth, authController.changePassword);

// Admin routes
router.get('/users', auth, authController.getAllUsers); // Admin only
router.put('/users/:userId/status', auth, authController.updateUserStatus); // Admin only

module.exports = router;
