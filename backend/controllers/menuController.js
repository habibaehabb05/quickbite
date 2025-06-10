const Menu = require('../Models/Menu');
const Restaurant = require('../Models/restaurant');

// GET all menus
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate('restaurant');
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving menus', error: err });
  }
};

// GET menu by restaurant ID
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving menu', error: err });
  }
};

// GET menu categories
exports.getMenuCategories = async (req, res) => {
  try {
    const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }
    const categories = [...new Set(menu.items.map(item => item.category))];
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories', error: err });
  }
};

// GET menu items by category
exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }
    const items = menu.items.filter(item => item.category === req.params.category);
    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found in this category' });
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving items', error: err });
  }
};

// GET single menu item
exports.getMenuItem = async (req, res) => {
  try {
    const menu = await Menu.findOne({ 'items._id': req.params.itemId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    const item = menu.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving item', error: err });
  }
};

// Search menu items
exports.searchMenuItems = async (req, res) => {
  const { q } = req.query;
  try {
    const menus = await Menu.find({ 'items.name': { $regex: q, $options: 'i' } });
    let results = [];
    menus.forEach(menu => {
      results = results.concat(menu.items.filter(item => item.name.toLowerCase().includes(q.toLowerCase())));
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error searching items', error: err });
  }
};

// Render restaurant menu page by slug
exports.renderRestaurantPage = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) {
      return res.status(404).send('Restaurant not found');
    }
    const menu = await Menu.findOne({ restaurant: restaurant._id });
    if (!menu) {
      return res.status(404).send('Menu not found');
    }
    // Group items by category
    const menuCategories = {};
    menu.items.forEach(item => {
      if (!menuCategories[item.category]) menuCategories[item.category] = [];
      menuCategories[item.category].push(item);
    });

    res.render('Restaurant', {
      restaurant: {
        ...restaurant.toObject(),
        menuCategories,
        currency: restaurant.currency || 'EGP'
      },
      currentPage: 'home',
      cartCount: 0,
      cartTotal: 0
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
