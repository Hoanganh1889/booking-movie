const crypto = require("crypto");

const TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60;

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, "hex");

  if (derived.length !== stored.length) {
    return false;
  }

  return crypto.timingSafeEqual(derived, stored);
}

function getTokenSecret() {
  return process.env.TOKEN_SECRET || "booking-movie-secret";
}

function signToken(payload) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_IN,
    }),
  );
  const signature = crypto
    .createHmac("sha256", getTokenSecret())
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    throw new Error("Token không hợp lệ");
  }

  const expected = crypto
    .createHmac("sha256", getTokenSecret())
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (signature.length !== expected.length) {
    throw new Error("Token không hợp lệ");
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Token không hợp lệ");
  }

  const payload = JSON.parse(base64UrlDecode(body));

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token đã hết hạn");
  }

  return payload;
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
};
