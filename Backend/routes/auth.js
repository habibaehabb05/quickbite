const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

 
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("DB Connection Error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

 
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)`);

 
function validateEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@miuegypt\.edu\.eg$/;
  return pattern.test(email);
}

 
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email must end with @miuegypt.edu.eg" });
  }

  
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Server error" });

     
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(query, [email, hash], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ message: "Email already registered" });
        }
        return res.status(500).json({ message: "Database error" });
      }

      return res.status(201).json({ message: "User registered successfully" });
    });
  });
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email must end with @miuegypt.edu.eg" });
  }

  
  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (result) {
        
        return res.json({ message: "Login successful" });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    });
  });
});

module.exports = router;
