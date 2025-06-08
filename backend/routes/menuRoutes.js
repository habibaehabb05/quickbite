const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Public routes
router.get('/', menuController.getAllMenus);
router.get('/restaurant/:restaurantId', menuController.getMenuByRestaurant);
router.get('/restaurant/:restaurantId/categories', menuController.getMenuCategories);
router.get('/restaurant/:restaurantId/category/:category', menuController.getMenuItemsByCategory);
router.get('/item/:itemId', menuController.getMenuItem);
router.get('/search', menuController.searchMenuItems);

// Render restaurant menu page by slug (main frontend route)
router.get('/:slug', menuController.renderRestaurantPage);

// (Optional) Protected routes for menu management can be added here

module.exports = router;