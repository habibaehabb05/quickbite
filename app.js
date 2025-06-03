const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");


app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("./views/payment.html", { root: __dirname });
});


mongoose
  .connect("mongodb+srv://salma:fBRK3PDuwnXYExlG@cluster0.hgwwxkt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
