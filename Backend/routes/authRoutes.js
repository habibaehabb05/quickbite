const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const {
  auth,
  adminOnly,
  studentOnly,
  restaurantOnly
} = require('../middleware/auth');

// POST /auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'student' // ثابت لطالب
        });

        await newUser.save();

        return res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

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
// GET login page
router.get('/login', (req, res) => {
    res.render('login'); // يرندر صفحة login.ejs
});
router.post('/signup', registerValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/change-password', auth, authController.changePassword);

// Admin routes
router.get('/users', auth, authController.getAllUsers); // Admin only
router.put('/users/:userId/status', auth, authController.updateUserStatus); // Admin only

module.exports = router;
