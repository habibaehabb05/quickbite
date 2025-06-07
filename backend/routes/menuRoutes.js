const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getAllMenus);
router.get('/:restaurant', menuController.getMenuByRestaurant);
router.get('/:restaurant/categories', menuController.getMenuCategories);
router.get('/:restaurant/category/:category', menuController.getMenuItemsByCategory);
router.post('/', menuController.addMenuItem);
router.put('/', menuController.updateMenuItem);
router.delete('/', menuController.deleteMenuItem);

module.exports = router;
