const User = require('../Models/user');
const bcrypt = require('bcrypt');

// Signup

exports.signup = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        // Save user to session
        req.session.user = {
            id: user._id,
            role: user.role,
            email: user.email
        };

        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else if (user.role === 'restaurant') {
            return res.redirect('/restaurant/dashboard');
        } else {
            return res.redirect('/dashboard');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};


// Get profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.userId, { profile: req.body.profile }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Admin: Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Admin: Update user active status
exports.updateUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { isActive } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User status updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
