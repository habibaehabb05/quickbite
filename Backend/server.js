const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = require("./MongoDb/connect"); // ✅ أضف هذا السطر
connectDB(); // ✅ واتصل بقاعدة البيانات

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ استخدمي require بيرجع الموديل نفسه
const userModel = require("./Models/mydataSchema");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); // ✅ استخدمي express.static لتقديم الملفات الثابتة')));

// ✅ إعداد عرض الصفحات باستخدام EJS
app.set("view engine", "ejs");
app.set("Views", path.join(__dirname, "Views"));

// ✅ Route تجريبي للتأكد إن السيرفر شغال
app.get("/", (req, res) => {
  res.send("✅ QuickBite backend is alive!");
});

// ✅ Route يعرض صفحة Login
app.get("/login", (req, res) => {
  res.render("Login"); // تأكدي إن Login.ejs موجود في مجلد views
});

// جلسات
app.use(session({
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
}));

// تسجيل مستخدم جديد
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({ email, password: hashedPassword });

  await newUser.save();
  res.status(200).send("User created successfully");
});

// تسجيل دخول
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).send("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).send("Incorrect password");
  }

  req.session.userId = user._id;
  res.status(200).send("Login successful");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
