//ay code h3melo 3shan at3amel m3a mongoDB lazem asta5dem mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the article)
const articleSchema = new Schema({
  cardholderName: String,
  total: String,
  date: {
    type: Date,
    default: Date.now
  }
});



// Create a model based on that schema
const Mydata = mongoose.model("Mydata", articleSchema);
 //Mydata dah esm mn 3ndy awel letter is cap

 // export the model 3shan app.js yeshof el model el 3mlto 
module.exports = Mydata;