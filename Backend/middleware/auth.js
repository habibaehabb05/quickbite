// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../Models/user');//خلى بالك كدا لو فيه ايرور

// Basic authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided, authorization denied' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token is not valid' 
            });
        }

        if (!user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Token is not valid' 
        });
    }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Admin privileges required.' 
            });
        }
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Restaurant owner middleware
const restaurantOnly = async (req, res, next) => {
    try {
        if (req.user.role !== 'restaurant' && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Restaurant privileges required.' 
            });
        }
        next();
    } catch (error) {
        console.error('Restaurant middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Student only middleware
const studentOnly = async (req, res, next) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Student privileges required.' 
            });
        }
        next();
    } catch (error) {
        console.error('Student middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Restaurant owner verification middleware
const verifyRestaurantOwner = async (req, res, next) => {
    try {
        const Restaurant = require('../Models/Dashboard');
        const restaurantId = req.params.restaurantId;
        
        if (!restaurantId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Restaurant ID is required' 
            });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        
        if (!restaurant) {
            return res.status(404).json({ 
                success: false, 
                message: 'Restaurant not found' 
            });
        }

        // Admin can access any restaurant
        if (req.user.role === 'admin') {
            req.restaurant = restaurant;
            return next();
        }

        // Restaurant owner can only access their own restaurant
        if (req.user.role === 'restaurant' && restaurant.createdBy.toString() === req.user._id.toString()) {
            req.restaurant = restaurant;
            return next();
        }

        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. You can only manage your own restaurant.' 
        });
    } catch (error) {
        console.error('Restaurant verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Different rate limits for different endpoints
const authRateLimit = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many authentication attempts, please try again later'
);

const generalRateLimit = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests
    'Too many requests, please try again later'
);

const orderRateLimit = createRateLimiter(
    60 * 1000, // 1 minute
    5, // 5 orders per minute
    'Too many orders, please slow down'
);

module.exports = {
    auth,
    adminOnly,
    restaurantOnly,
    studentOnly,
    verifyRestaurantOwner,
    authRateLimit,
    generalRateLimit,
    orderRateLimit
};