const express = require('express');
const mongoose = require('mongoose');
const menuRoutes = require('./routes/menuRoutes');
const path = require('path');

const app = express();
const PORT = 8080;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/orderingSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(express.json());

app.use('/api', authRoutes);

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, '../frontend')));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend', 'index.html'));
});
// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Export the app for testing
module.exports = app; // This allows the app to be imported in test files
