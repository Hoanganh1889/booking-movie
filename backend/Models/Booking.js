const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showtime",
    required: true,
  },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  movieTitle: { type: String, required: true },
  showtime: { type: String, required: true },
  seats: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
