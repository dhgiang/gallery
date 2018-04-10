const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ArtSchema = new Schema({
  filename: String,
  description: String,
  price: Number,
  status: String
});

mongoose.model("arts", ArtSchema);
