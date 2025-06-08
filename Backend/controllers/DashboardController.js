const mongoose = require('mongoose');
const Restaurant = require('../Models/Dashboard');

// GET all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('menuId');
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving restaurants', error: err.message });
  }
};

// GET restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ restaurantId: req.params.restaurantId }).populate('menuId');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving restaurant', error: err.message });
  }
};

// Search restaurants by name or description
exports.searchRestaurants = async (req, res) => {
  try {
    const searchTerm = req.query.q?.toLowerCase().trim();
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const restaurants = await Restaurant.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    }).populate('menuId');

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found matching your search' });
    }

    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error searching restaurants', error: err.message });
  }
};

// Update restaurant status
exports.updateRestaurantStatus = async (req, res) => {
  try {
    const { restaurantId, status } = req.body;
    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { restaurantId },
      { status },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant status updated', restaurant });
  } catch (err) {
    res.status(500).json({ message: 'Error updating restaurant status', error: err.message });
  }
};