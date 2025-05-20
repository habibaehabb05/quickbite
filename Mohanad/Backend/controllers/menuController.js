const menuData = require('../Data/menu.json');

// Get all menu items
exports.getAllMenuItems = (req, res) => {
    res.json(menuData);
};

// Add a new menu item
exports.addMenuItem = (req, res) => {
    const newItem = req.body;
    menuData.push(newItem);
    // Save to menu.json (you'll need fs module)
    res.status(201).json(newItem);
};