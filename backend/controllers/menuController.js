const Menu = require('../models/menu');

// GET all menus
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving menus', error: err });
  }
};

// GET menu by restaurant name
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const restaurant = req.params.restaurant;
    const menu = await Menu.findOne({ restaurant });

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }

    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving menu', error: err });
  }
};

// POST add new menu item
exports.addMenuItem = async (req, res) => {
  const { restaurant, name, description, price, category } = req.body;

  if (!restaurant || !name || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let menu = await Menu.findOne({ restaurant });

    const newItem = { name, description, price, category };

    if (!menu) {
      // If restaurant doesn't have a menu yet, create a new one
      menu = new Menu({
        restaurant,
        categories: [category],
        items: [newItem]
      });
    } else {
      // If exists, push item
      menu.items.push(newItem);

      // Update categories if new
      if (!menu.categories.includes(category)) {
        menu.categories.push(category);
      }
    }

    await menu.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding item', error: err });
  }
};
// PUT update menu item
exports.updateMenuItem = async (req, res) => {
  const { restaurant, itemId, name, description, price, category } = req.body;

  if (!restaurant || !itemId || !name || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const menu = await Menu.findOne({ restaurant });

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }

    const itemIndex = menu.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update item
    menu.items[itemIndex] = { _id: menu.items[itemIndex]._id, name, description, price, category };

    // Update categories if new
    if (!menu.categories.includes(category)) {
      menu.categories.push(category);
    }

    await menu.save();
    res.status(200).json({ message: 'Item updated successfully', item: menu.items[itemIndex] });
  } catch (err) {
    res.status(500).json({ message: 'Error updating item', error: err });
  }
};
// DELETE menu item
exports.deleteMenuItem = async (req, res) => {
  const { restaurant, itemId } = req.body;

  if (!restaurant || !itemId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const menu = await Menu.findOne({ restaurant });

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }

    const itemIndex = menu.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Remove item
    menu.items.splice(itemIndex, 1);

    // Check if category is still used
    const categoriesUsed = new Set(menu.items.map(item => item.category));
    menu.categories = menu.categories.filter(cat => categoriesUsed.has(cat));

    await menu.save();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err });
  }
};
// GET menu items by category
exports.getMenuItemsByCategory = async (req, res) => {
  const { restaurant, category } = req.params;

  if (!restaurant || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const menu = await Menu.findOne({ restaurant });

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }

    const items = menu.items.filter(item => item.category === category);

    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found in this category' });
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving items', error: err });
  }
};
// GET menu categories
exports.getMenuCategories = async (req, res) => {
  const { restaurant } = req.params;

  if (!restaurant) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const menu = await Menu.findOne({ restaurant });

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }

    res.json(menu.categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories', error: err });
  }
};
