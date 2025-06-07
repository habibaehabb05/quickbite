const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  logoImage: {
    type: String, // URL to restaurant logo
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model (if applicable)
    required: true,
  },
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu', // Link to Menu model
  },
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;