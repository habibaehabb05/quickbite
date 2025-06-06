 
require('dotenv').config(); // لو بتستخدمي .env
const express = require('express');
const connectDB = require('./MongoDb/connect'); // أو المسار الصحيح
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

connectDB(); // 🟢 اتصلي بقاعدة البيانات

app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
