const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: String,
    slug: { type: String, unique: true }, // e.g. 'gyros', 'mycorner', 'cinnabon'
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
    currency: { type: String, default: 'EGP' }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);