const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.getAllRestaurants);
router.get('/:restaurantId', restaurantController.getRestaurantById);
router.get('/search', restaurantController.searchRestaurants);
router.put('/status', restaurantController.updateRestaurantStatus);

module.exports = router;