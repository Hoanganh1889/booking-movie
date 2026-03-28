const express = require("express");
const Showtime = require("../Models/Showtime");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { movieId } = req.query;
    const filter = movieId ? { movieId } : {};

    const showtimes = await Showtime.find(filter).sort({ createdAt: -1 });
    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { movieId, room, date, time, availableSeats } = req.body;

    const showtime = new Showtime({
      movieId,
      room,
      date,
      time,
      availableSeats: Number(availableSeats),
    });

    await showtime.save();
    res.status(201).json(showtime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { movieId, room, date, time, availableSeats } = req.body;

    const updated = await Showtime.findByIdAndUpdate(
      req.params.id,
      {
        movieId,
        room,
        date,
        time,
        availableSeats: Number(availableSeats),
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy suất chiếu" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Showtime.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy suất chiếu" });
    }

    res.json({ message: "Xóa suất chiếu thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
