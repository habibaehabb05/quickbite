const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const restaurantValidation = [
    body('name').notEmpty().withMessage('Restaurant name is required'),
    body('description').notEmpty().withMessage('Description is required')
];

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/search', restaurantController.searchRestaurants);
router.get('/:restaurantId', restaurantController.getRestaurantById);

// Protected routes
router.post('/', auth, restaurantValidation, restaurantController.createRestaurant);
router.put('/:restaurantId', auth, restaurantValidation, restaurantController.updateRestaurant);
router.put('/:restaurantId/status', auth, restaurantController.updateRestaurantStatus);
router.delete('/:restaurantId', auth, restaurantController.deleteRestaurant);

// Restaurant analytics (restaurant owners only)
router.get('/:restaurantId/analytics', auth, restaurantController.getRestaurantAnalytics);

module.exports = router;