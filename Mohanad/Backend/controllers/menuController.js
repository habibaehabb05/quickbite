const fs = require('fs');
const path = require('path');
const menuData = require('../Data/menu.json');

// Get all menu items
exports.getAllMenuItems = (req, res) => {
  res.status(200).json(menuData);
};

// Add a new menu item
exports.addMenuItem = (req, res) => {
  const newItem = { id: menuData.length + 1, ...req.body };
  menuData.push(newItem);
  
  fs.writeFileSync(
    path.join(__dirname, '../Data/menu.json'),
    JSON.stringify(menuData, null, 2)
  );
  
  res.status(201).json(newItem);
};