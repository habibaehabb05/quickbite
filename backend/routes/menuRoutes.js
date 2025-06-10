const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// === Public API Routes ===
router.get('/', menuController.getAllMenus);
router.get('/restaurant/:restaurantId', menuController.getMenuByRestaurant);
router.get('/restaurant/:restaurantId/categories', menuController.getMenuCategories);
router.get('/restaurant/:restaurantId/category/:category', menuController.getMenuItemsByCategory);
router.get('/item/:itemId', menuController.getMenuItem);
router.get('/search', menuController.searchMenuItems);

// === Main frontend route: Render restaurant menu page by slug ===
router.get('/:slug', menuController.renderRestaurantPage);

module.exports = router;