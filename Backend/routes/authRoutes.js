const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../Models/mydataSchema');
const authController = require('../controllers/authController');

const {
  auth,
  adminOnly,
  studentOnly,
  restaurantOnly
} = require('../middleware/auth');

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .matches(/^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/)
    .withMessage('Email must be from @miuegypt.edu.eg domain'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// ✅ POST /auth/signup
router.post('/signup', registerValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: 'student' // ثابت
    });

    await newUser.save();

    return res.status(201).json({ message: 'Signup successful', role: 'student' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /auth/login
router.post('/login', loginValidation, authController.login);

// GET login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Other protected/profile/admin routes can stay
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/change-password', auth, authController.changePassword);
router.get('/users', auth, authController.getAllUsers);
router.put('/users/:userId/status', auth, authController.updateUserStatus);

module.exports = router;
