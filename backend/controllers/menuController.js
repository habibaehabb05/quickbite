const Menu = require('../Models/menu');

// GET all menus
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving menus', error: err });
  }
};

// GET menu by restaurant ID
exports.getMenuByRestaurantId = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const menu = await Menu.findOne({ restaurantId });

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
  const { restaurantId, name, description, price, category } = req.body;

  if (!restaurantId || !name || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let menu = await Menu.findOne({ restaurantId });

    const newItem = { name, description, price, category };

    if (!menu) {
      // If restaurant doesn't have a menu yet, create a new one
      menu = new Menu({
        restaurantId,
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
  const { restaurantId, itemId, name, description, price, category } = req.body;

  if (!restaurantId || !itemId || !name || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const menu = await Menu.findOne({ restaurantId });

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
  const { restaurantId, itemId } = req.body;

  if (!restaurantId || !itemId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const menu = await Menu.findOne({ restaurantId });

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
  const { restaurantId, category } = req.params;

  if (!restaurantId || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const menu = await Menu.findOne({ restaurantId });

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
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const menu = await Menu.findOne({ restaurantId });

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }

    res.json(menu.categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories', error: err });
  }
};