// ✅ server.js (مُحدَّث)
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
mongoose.connection.once("open", () => {
  console.log("✅ Connected to DB:", mongoose.connection.name);
});


const app = express();
const PORT = process.env.PORT || 3000;

const userModel = require("./Models/mydataSchema");
const authRoutes = require("./routes/authRoutes"); // ✅ NEW

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  },
}));

// ✅ استخدمي راوتر authRoutes بدل المسارات المتكررة
app.use("/auth", authRoutes);

// Pages Routes
app.get("/", (req, res) => res.render("dashboard"));
app.get("/login", (req, res) => res.render("Login"));
app.get("/MyCorner", (req, res) => res.render("MyCorner"));
app.get("/Cinnabon", (req, res) => res.render("Cinnabon"));
app.get("/Gyros", (req, res) => res.render("Gyros"));
app.get("/Restaurant", (req, res) => res.render("Restaurant"));
app.get("/payment", (req, res) => res.render("payment"));
app.get("/orders", (req, res) => res.render("orders"));
app.get("/aboutus", (req, res) => res.render("aboutus"));
app.get("/admin", (req, res) => res.render("admin"));
app.get("/account", (req, res) => res.render("account"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
