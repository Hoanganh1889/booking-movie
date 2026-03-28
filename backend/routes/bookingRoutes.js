const express = require("express");
const Booking = require("../Models/Booking");
const Showtime = require("../Models/Showtime");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { showtimeId, customerName, phone, movieTitle, showtime, seats, total } = req.body;

    const st = await Showtime.findById(showtimeId);

    if (!st) {
      return res.status(404).json({ message: "Không tìm thấy suất chiếu" });
    }

    const seatCount = Number(seats);

    if (st.availableSeats < seatCount) {
      return res.status(400).json({ message: "Không đủ ghế" });
    }

    st.availableSeats -= seatCount;
    await st.save();

    const booking = new Booking({
      userId: req.user._id,
      showtimeId,
      customerName,
      phone,
      movieTitle,
      showtime,
      seats: seatCount,
      total: Number(total),
      status: "pending",
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    const oldStatus = booking.status;

    if (oldStatus === status) {
      return res.json(booking);
    }

    const showtime = await Showtime.findById(booking.showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: "Không tìm thấy suất chiếu" });
    }

    const seatCount = Number(booking.seats);

    if ((oldStatus === "pending" || oldStatus === "confirmed") && status === "cancelled") {
      showtime.availableSeats += seatCount;
      await showtime.save();
    }

    if (oldStatus === "cancelled" && (status === "pending" || status === "confirmed")) {
      if (showtime.availableSeats < seatCount) {
        return res.status(400).json({ message: "Không đủ ghế để khôi phục booking" });
      }

      showtime.availableSeats -= seatCount;
      await showtime.save();
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
