import crypto from "crypto";

const ADMIN_PHONES = ["09927533272", "09051627714"];

const sessions = new Map();

export function adminLogin(phone, password) {
  if (!ADMIN_PHONES.includes(phone)) {
    return null;
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return null;
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    phone,
    createdAt: Date.now(),
  });

  return token;
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : "";

  if (!token || !sessions.has(token)) {
    return res.status(401).json({
      success: false,
      message: "دسترسی غیرمجاز",
    });
  }

  req.admin = sessions.get(token);
  next();
}
