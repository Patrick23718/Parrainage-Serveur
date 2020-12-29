const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 255,
  },
  description: {
    type: String,
    required: true,
    min: 6,
  },
  price: {
    type: Number,
    required: false,
    min: 10,
  },
  rating: {
    type: Number,
    required: false,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
