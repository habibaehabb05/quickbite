const express = require('express');
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express(); // ✅ عرّف app في الأول
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const Mydata = require('./models/mydataSchema');
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey123',
  resave: false,
  saveUninitialized: false,
}));

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// === Set view engine ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === API Routes ===
app.use('/auth', authRoutes); // ✅ دلوقتي ينفع تستخدم app
app.use('/api', authRoutes);

// === Rendered Pages ===
app.get('/', async (req, res) => {
  try {
    const allData = await Mydata.find();
    let recentData = null;

    if (req.query.confirmId) {
      recentData = await Mydata.findById(req.query.confirmId);
    }

    res.render('dashboard', {
      arr: allData,
      recent: recentData,
    });
  } catch (err) {
    console.error("❌ Error retrieving data:", err.message);
  res.status(500).send('Error retrieving data: ' + err.message);
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/Login');
  }

  res.render('dashboard', { user: req.session.user });
});

app.get('/Login', (req, res) => { // ✅ استخدم res.render لعرض صفحة تسجيل الدخول
  res.render('Login'); // login.ejs لازم تكون موجودة في views
});

app.post('/', async (req, res) => {
  try {
    console.log("=== Payment Data Received ===");
    console.log("Cardholder Name:", req.body.cardholderName);
    console.log("Total Amount:", req.body.total);
    console.log("Full request body:", req.body);
    console.log("==============================");

    const mydata = new Mydata(req.body);
    const savedData = await mydata.save();

    console.log("=== Data Saved Successfully ===");
    console.log("Saved ID:", savedData._id);
    console.log("Saved Data:", savedData);
    console.log("===============================");

    res.redirect(`/?confirmId=${savedData._id}`);
  } catch (err) {
    console.error("Error saving:", err);
    res.status(500).send("Failed to save data");
  }
});

// === 404 handler for API routes ===
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// === SPA fallback or 404 page ===
app.use((req, res) => {
  res.status(404).render('layout', { message: 'Page not found' });
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.error("🔥 Global Error:", err);
  res.status(500).json({ error: 'Something broke!' });
});

// === Connect to MongoDB and Start Server ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
