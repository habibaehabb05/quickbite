const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Optional: assuming menus are managed by users/admins
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  categoryTags: [{
    type: String
  }],
  description: {
    type: String
  },
  coverImage: {
    type: String // URL to menu image
  }
});

const Menu = mongoose8.model('Menu', MenuSchema);
module.exports = Menu;