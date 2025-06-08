const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const { body, param } = require('express-validator');

// Validation middleware
const menuItemValidation = [
    body('name').notEmpty().withMessage('Item name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required')
];

// Public routes
router.get('/', menuController.getAllMenus);
router.get('/restaurant/:restaurantId', menuController.getMenuByRestaurant);
router.get('/restaurant/:restaurantId/categories', menuController.getMenuCategories);
router.get('/restaurant/:restaurantId/category/:category', menuController.getMenuItemsByCategory);
router.get('/item/:itemId', menuController.getMenuItem);
router.get('/search', menuController.searchMenuItems);

// Protected routes (restaurant owners only)
router.post('/restaurant/:restaurantId/item', auth, menuItemValidation, menuController.addMenuItem);
router.put('/item/:itemId', auth, menuItemValidation, menuController.updateMenuItem);
router.delete('/item/:itemId', auth, menuController.deleteMenuItem);
router.put('/item/:itemId/availability', auth, menuController.toggleItemAvailability);

// Menu management
router.post('/restaurant/:restaurantId/category', auth, menuController.addCategory);
router.put('/restaurant/:restaurantId/category/:categoryId', auth, menuController.updateCategory);
router.delete('/restaurant/:restaurantId/category/:categoryId', auth, menuController.deleteCategory);

module.exports = router;