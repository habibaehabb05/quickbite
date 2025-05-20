const fs = require('fs');
const path = require('path');

const menuDataPath = path.join(__dirname, '../Data/menu.json');
let menuData = require(menuDataPath);

// GET all menus
const getAllMenus = (req, res) => {
  res.json(menuData);
};

// GET menu for a restaurant
const getMenuByRestaurant = (req, res) => {
  const restaurant = req.params.restaurant;
  const menu = menuData[restaurant];

  if (!menu) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  res.json(menu);
};

// POST add menu item
const addMenuItem = (req, res) => {
  const { restaurant, category, item } = req.body;

  if (!restaurant || !category || !item) {
    return res.status(400).json({ message: 'Missing data' });
  }

  if (!menuData[restaurant]) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  if (!menuData[restaurant].categories[category]) {
    menuData[restaurant].categories[category] = [];
  }

  const items = menuData[restaurant].categories[category];
  const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
  const newItem = { id: newId, ...item };

  items.push(newItem);
  fs.writeFileSync(menuDataPath, JSON.stringify(menuData, null, 2));

  res.status(201).json({ message: 'Item added', item: newItem });
};

module.exports = {
  getAllMenus,
  getMenuByRestaurant,
  addMenuItem
};
