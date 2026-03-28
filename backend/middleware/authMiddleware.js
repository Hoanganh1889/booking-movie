const User = require("../Models/User");
const { verifyToken } = require("../utils/auth");

async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Bạn cần đăng nhập" });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message || "Xác thực thất bại" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
