const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const Mydata = require('./models/mydataSchema');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// === Set view engine ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === API routes ===
app.use('/api', authRoutes);

// === Rendered pages ===
app.get('/', async (req, res) => {
  try {
    const allData = await Mydata.find();
    let recentData = null;

    if (req.query.confirmId) {
      recentData = await Mydata.findById(req.query.confirmId);
    }

    res.render('index', {
      arr: allData,
      recent: recentData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data');
  }
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

// === SPA fallback or custom 404 page ===
app.use((req, res) => {
  res.status(404).render('layout', { message: 'Page not found' });
});

// === Error handler ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// === Connect DB & Start server ===
mongoose.connect(process.env.MONGODB_URI, {
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
