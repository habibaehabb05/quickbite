const express = require('express');
const router = express.Router();
const {
  getAllMenus,
  getMenuByRestaurant,
  addMenuItem
} = require('../controllers/menuController');

router.get('/', getAllMenus);
router.get('/:restaurant', getMenuByRestaurant);
router.post('/', addMenuItem); 

module.exports = router;
