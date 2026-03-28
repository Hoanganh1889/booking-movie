const express = require("express");
const Movie = require("../Models/Movie");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const { keyword, genre } = req.query;
    const filter = {};

    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    if (genre && genre !== "all") {
      filter.genre = genre;
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", requireAuth, requireAdmin, upload.single("posterFile"), async (req, res) => {
  try {
    const { title, genre, duration, price, poster, description, isShowing } = req.body;

    const posterPath = req.file ? `/uploads/${req.file.filename}` : poster || "";

    const movie = new Movie({
      title,
      genre,
      duration: Number(duration),
      price: Number(price),
      poster: posterPath,
      description,
      isShowing: isShowing === "true" || isShowing === true,
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", requireAuth, requireAdmin, upload.single("posterFile"), async (req, res) => {
  try {
    const { title, genre, duration, price, poster, description, isShowing } = req.body;

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }

    movie.title = title;
    movie.genre = genre;
    movie.duration = Number(duration);
    movie.price = Number(price);
    movie.description = description;
    movie.isShowing = isShowing === "true" || isShowing === true;

    if (req.file) {
      movie.poster = `/uploads/${req.file.filename}`;
    } else if (poster) {
      movie.poster = poster;
    }

    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }
    res.json({ message: "Xóa phim thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
