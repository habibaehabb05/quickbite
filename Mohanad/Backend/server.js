const express = require('express');
const app = express();
const menuRoutes = require('./routes/menuRoutes');

app.use(express.json());
app.use('/api/menu', menuRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});