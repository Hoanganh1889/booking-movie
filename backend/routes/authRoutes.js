const express = require("express");
const User = require("../Models/User");
const { requireAuth } = require("../middleware/authMiddleware");
const { hashPassword, signToken, verifyPassword } = require("../utils/auth");

const router = express.Router();

function buildAuthResponse(user) {
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return {
    token: signToken({ userId: user._id.toString(), role: user.role }),
    user: safeUser,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const isFirstUser = (await User.countDocuments()) === 0;

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: isFirstUser ? "admin" : "user",
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
