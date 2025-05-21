const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getAllMenus);
router.get('/:restaurant', menuController.getMenuByRestaurant);
router.post('/', menuController.addMenuItem); 

module.exports = router;
