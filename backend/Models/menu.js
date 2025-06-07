const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String
});

const MenuSchema = new mongoose.Schema({
  restaurant: {
    type: String,
    required: true
  },
  categories: [{
    type: String
  }],
  items: [MenuItemSchema]
});

module.exports = mongoose.model('Menu', MenuSchema);
module.exports = mongoose.model('MenuItem', MenuItemSchema);
