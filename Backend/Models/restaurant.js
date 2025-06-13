const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    tagline: String,
    description: String,
    keywords: [String],
    about: String,
    phone: String,
    email: String,
    address: String,
    hours: [String],
    social: {
        facebook: String,
        instagram: String,
        twitter: String,
        whatsapp: String
    },
    currency: {
        type: String,
        default: 'EGP'
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    rating: {
        type: Number,
        default: 4.5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    logoImage: String,
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);