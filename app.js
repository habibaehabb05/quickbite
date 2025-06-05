const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

// Add both middleware for form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

const Mydata = require("./models/mydataSchema");

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const allData = await Mydata.find();
    let recentData = null;

    if (req.query.confirmId) {
      recentData = await Mydata.findById(req.query.confirmId);
    }

    res.render("payment", {
      arr: allData,
      recent: recentData // This will be null unless there's a confirmId
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving data");
  }
});

app.post("/", async (req, res) => {
  try {
    // Log the received data to terminal
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
    
    // Redirect with the ID of the saved transaction
    res.redirect(`/?confirmId=${savedData._id}`);
  } catch (err) {
    console.log("Error saving:", err);
    res.status(500).send("Failed to save data");
  }
});

mongoose
  .connect(
    "mongodb+srv://salma:z.A_8G-w9LFqF2J@cluster0.sucfvca.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });