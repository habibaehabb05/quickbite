const Menu = require('./Models/menu');
const Restaurant = require('../Models/Restaurant');

// Get all menus
const getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find().populate('restaurant');
        res.json(menus);
    } catch (error) {
        res.status(500).json({ message: 'Error getting menus' });
    }
};

// Get menu by restaurant
const getMenuByRestaurant = async (req, res) => {
    try {
        const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Error getting menu' });
    }
};

// Get menu categories
const getMenuCategories = async (req, res) => {
    try {
        const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        
        const categories = [];
        menu.items.forEach(item => {
            if (!categories.includes(item.category)) {
                categories.push(item.category);
            }
        });
        
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error getting categories' });
    }
};

// Get menu items by category
const getMenuItemsByCategory = async (req, res) => {
    try {
        const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        
        const categoryItems = menu.items.filter(item => 
            item.category === req.params.category
        );
        
        res.json(categoryItems);
    } catch (error) {
        res.status(500).json({ message: 'Error getting menu items' });
    }
};

// Get single menu item
const getMenuItem = async (req, res) => {
    try {
        const menu = await Menu.findOne({ 'items._id': req.params.itemId });
        if (!menu) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        const item = menu.items.find(item => item._id.toString() === req.params.itemId);
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error getting menu item' });
    }
};

// Search menu items
const searchMenuItems = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({ message: 'Search term required' });
        }
        
        const menus = await Menu.find().populate('restaurant');
        const results = [];
        
        menus.forEach(menu => {
            menu.items.forEach(item => {
                if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push({
                        ...item.toObject(),
                        restaurant: menu.restaurant
                    });
                }
            });
        });
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error searching items' });
    }
};

// Render restaurant page
const renderRestaurantPage = async (req, res) => {
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
            if (!menuCategories[item.category]) {
                menuCategories[item.category] = [];
            }
            menuCategories[item.category].push(item);
        });
        
        restaurant.menuCategories = menuCategories;
        
        res.render('Restaurant', {
            restaurant: restaurant,
            menu: menu,
            cartCount: 0,
            cartTotal: 0,
            currentPage: 'restaurant'
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllMenus,
    getMenuByRestaurant,
    getMenuCategories,
    getMenuItemsByCategory,
    getMenuItem,
    searchMenuItems,
    renderRestaurantPage
};