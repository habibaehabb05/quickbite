const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const connectDB = require('./MongoDb/connect');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use API routes
app.use('/api', authRoutes);

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, '../frontend')));

//const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server is running on http://localhost:${PORT}`));
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// 404 handler for frontend (SPA fallback)
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;
