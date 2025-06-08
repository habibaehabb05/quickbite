const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String // URL للصورة
    },
    available: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number, // بالدقائق
        default: 15
    }
});

const MenuSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    categories: [{
        name: String,
        description: String
    }],
    items: [MenuItemSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

MenuSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// الـ export الصحيح
const Menu = mongoose.model('Menu', MenuSchema);
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

module.exports = { Menu, MenuItem };