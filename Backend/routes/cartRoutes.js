const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const cartItemValidation = [
    body('menuItem').notEmpty().withMessage('Menu item is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// All cart routes require authentication
router.use(auth);

router.get('/', cartController.getCart);
router.post('/add', cartItemValidation, cartController.addToCart);
router.put('/update/:itemId', cartItemValidation, cartController.updateCartItem);
router.delete('/remove/:itemId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;