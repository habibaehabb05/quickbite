const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const orderValidation = [
    body('restaurant').notEmpty().withMessage('Restaurant is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.menuItem').notEmpty().withMessage('Menu item is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Customer routes
router.post('/', auth, orderValidation, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/:orderId', auth, orderController.getOrderById);
router.put('/:orderId/cancel', auth, orderController.cancelOrder);

// Restaurant routes
router.get('/restaurant/:restaurantId', auth, orderController.getRestaurantOrders);
router.put('/:orderId/status', auth, orderController.updateOrderStatus);
router.put('/:orderId/confirm', auth, orderController.confirmOrder);

// Admin routes
router.get('/admin/all', auth, orderController.getAllOrders);
router.get('/admin/analytics', auth, orderController.getOrderAnalytics);

module.exports = router;