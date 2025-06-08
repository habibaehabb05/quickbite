const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const paymentValidation = [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('method').isIn(['cash', 'card', 'digital_wallet']).withMessage('Invalid payment method'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive')
];

const cardPaymentValidation = [
    body('cardDetails.cardholderName').notEmpty().withMessage('Cardholder name is required'),
    body('cardDetails.cardNumber').isCreditCard().withMessage('Invalid card number'),
    body('cardDetails.expiryMonth').isInt({ min: 1, max: 12 }).withMessage('Invalid expiry month'),
    body('cardDetails.expiryYear').isInt({ min: new Date().getFullYear() }).withMessage('Invalid expiry year'),
    body('cardDetails.cvv').isLength({ min: 3, max: 4 }).withMessage('Invalid CVV')
];

// All payment routes require authentication
router.use(auth);

router.post('/process', paymentValidation, paymentController.processPayment);
router.post('/card', [...paymentValidation, ...cardPaymentValidation], paymentController.processCardPayment);
router.get('/history', paymentController.getPaymentHistory);
router.get('/:paymentId', paymentController.getPaymentById);

// Admin routes
router.get('/admin/all', paymentController.getAllPayments);
router.put('/:paymentId/refund', paymentController.refundPayment);

module.exports = router;