const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  poster: { type: String, default: "" },
  description: { type: String, default: "" },
  isShowing: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movie", movieSchema);