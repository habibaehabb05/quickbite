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
const connectDB = require("./MongoDb/connect");
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

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

// ✅ ملفات static زي CSS, JS, images من مجلد public

 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // ← هنا لازم views بحروف صغيرة

// تأكد إن مجلد public موجود في نفس مسار server.js
app.use(express.static(path.join(__dirname, "views"))); // ← هنا لازم views بحروف صغيرة

// تأكد إن مجلد Views موجود في نفس مسار server.js
app.use(express.static(path.join(__dirname, "public")));

  

// ✅ عرض صفحة Login
/*app.get("/login", (req, res) => {
  res.render("Login"); // تأكد إن Login.ejs موجود في مجلد views
});

app.get("/signup", (req, res) => {
  res.render("Signup"); // تأكد إن Signup.ejs موجود في مجلد views
} );

app.get("/dashboard", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  
  res.render("Dashboard", { userId: req.session.userId }); // تأكد إن Dashboard.ejs موجود في مجلد views
});*/

// ✅ إعداد CORS            
app.use(cors({
  origin: "http://localhost:3000", // استبدل بالمنشأ الصحيح
  credentials: true, // للسماح بالكوكيز
}));

// ✅ إعداد body-parser
app.use(bodyParser.json()); // لتحليل JSON في الطلبات 

app.use(bodyParser.urlencoded({ extended: true })); // لتحليل بيانات النماذج

app.use(express.urlencoded({ extended: true })); // لتحليل بيانات النماذج
// ✅ إعدادات الجلسات
app.use(session({
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false, // لا تحفظ الجلسات غير المبدوءة
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions", // اسم مجموعة الجلسات في MongoDB
  }),           
// ✅ إعداد الجلسات
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // مدة الجلسة 24 ساعة
    secure: false, // يجب أن يكون true في بيئة الإنتاج مع HTTPS
    httpOnly: true, // يمنع الوصول إلى الكوكيز من JavaScript
  },
}));

// ✅ عرض صفحة Dashboard
app.get("/", (req, res) => {
  /*if (!req.session.userId) {
    return res.redirect("/login");
  }
  // إذا كان المستخدم مسجل الدخول، عرض Dashboard
  // تأكد من وجود ملف Dashboard.ejs في مجلد views
  // ويمرر userId إلى الصفحة
  if (!req.session.userId) {
    return res.redirect("/login");
  }*/
  res.render("dashboard"); // تأكد إن Dashboard.ejs موجود في مجلد views
});

// ✅ عرض صفحة تسجيل الدخول
app.get("/login", (req, res) => {
  res.render("Login"); // تأكد إن Login.ejs موجود في مجلد views
});



//عرض صفحة المطعم
  app.get("/MyCorner", (req, res) => {
  res.render("MyCorner"); // تأكد إن MyCorner.ejs موجود في مجلد views 
});

// عرض صفحة المطعم
app.get("/Cinnabon", (req, res) => {
  res.render("Cinnabon"); // تأكد إن Cinnabon.ejs موجود في مجلد views

});

// عرض صفحة المطعم
app.get("/Gyros", (req, res) => {
  res.render("Gyros"); // تأكد إن Gyros.ejs موجود في مجلد views
});

// عرض صفحة المطعم
app.get("/Restaurant", (req, res) => {
  res.render("Restaurant"); // تأكد إن Restaurant.ejs موجود في مجلد views
});

//عرض صفحة الدفع
app.get("/payment", (req, res) => {
  res.render("payment"); // تأكد إن Payment.ejs موجود في مجلد views
});
// عرض صفحة الطلبات
app.get("/orders", (req, res) => {
  res.render("orders"); // تأكد إن Orders.ejs موجود في مجلد views
});

//عرض صفحة ال
app.get("/aboutus",  (req, res) => {  
  res.render("aboutus"); // تأكد إن aboutus.ejs موجود في مجلد views
} );  

app.get("/admin", (req, res) => {
  res.render("admin"); // تأكدي إن admin.ejs موجودة في مجلد views
});
app.get("/account", (req, res) => {
  res.render("account"); // تأكد إن account.ejs موجود في مجلد views
});
 
// ✅ تسجيل مستخدم جديد
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

// ✅ تسجيل دخول
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


// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
