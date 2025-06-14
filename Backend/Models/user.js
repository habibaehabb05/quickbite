const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Using bcryptjs is fine and lightweight

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['student', 'restaurant', 'admin'],
        default: 'student'
    },
    profile: {
        firstName: { type: String },
        lastName: { type: String },
        phone: { type: String },
        studentId: { type: String } // Only applies to students
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

// 🔍 Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// 🧼 Hide password when returning user data
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema); // Export after schema is defined
