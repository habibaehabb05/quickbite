// Delete and Put

const mongoose = require("mongoose");
const menu = require("../Models/menu");

const fs = require('fs');
const path = require('path');

const menuDataPath = path.join(__dirname, '../Data/menu.json');
let menu = require(menuDataPath);

// GET all menus

exports.getAllMenus = async (req, res) => {
  try {
    const Menu = await menu.find();
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving orders", error: err });
  }
};

// GET menu for a restaurant
exports.getMenuByRestaurant = (req, res) => {
  const restaurant = req.params.restaurant;
  const Menu = menu[restaurant];

  if (!menu) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  res.json(menu);
};

// POST add menu item
exports.addMenuItem = (req, res) => {
  const { restaurant, category, item } = req.body;

  if (!restaurant || !category || !item) {
    return res.status(400).json({ message: 'Missing data' });
  }

  if (!menu[restaurant]) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  if (!menu[restaurant].categories[category]) {
    menu[restaurant].categories[category] = [];
  }

  const items = menu[restaurant].categories[category];
  const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
  const newItem = { id: newId, ...item };

  items.push(newItem);
  fs.writeFileSync(menuDataPath, JSON.stringify(menu, null, 2));

  res.status(201).json({ message: 'Item added', item: newItem });
};

/*module.exports = {
  getAllMenus,
  getMenuByRestaurant,
  addMenuItem
};*/
