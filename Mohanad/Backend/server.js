const express = require('express');
const menuRoutes = require('../../backend/routes/menuRoutes');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);

// Serve frontend (optional, if needed)
app.use(express.static(path.join(__dirname, '../Frontend')));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
