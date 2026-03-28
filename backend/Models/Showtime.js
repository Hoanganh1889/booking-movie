const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: false
  },
  room: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  availableSeats: { type: Number, required: true, default: 50 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Showtime", showtimeSchema);