import crypto from "crypto";
import db from "./database.js";

const ADMIN_PHONES = ["09927533272", "09051627714"];
const sessions = new Map();

function normalizePhone(value = "") {
  return String(value)
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632))
    .replace(/\s+/g, "")
    .trim();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  try {
    const [salt, originalHash] = storedHash.split(":");
    if (!salt || !originalHash) return false;

    const hash = crypto.scryptSync(password, salt, 64).toString("hex");

    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(originalHash, "hex")
    );
  } catch {
    return false;
  }
}

function createSession(user) {
  const token = crypto.randomBytes(32).toString("hex");

  sessions.set(token, {
    userId: user.id,
    phone: user.phone,
    isAdmin: Boolean(user.is_admin),
    createdAt: Date.now(),
  });

  return token;
}

export function registerUser(phone, password, name = "") {
  const normalizedPhone = normalizePhone(phone);

  if (!/^09\d{9}$/.test(normalizedPhone)) {
    return {
      success: false,
      message: "شماره موبایل معتبر نیست",
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
    };
  }

  return new Promise((resolve) => {
    db.get(
      "SELECT id FROM users WHERE phone = ?",
      [normalizedPhone],
      (err, existing) => {
        if (err) {
          resolve({
            success: false,
            message: err.message,
          });
          return;
        }

        if (existing) {
          resolve({
            success: false,
            message: "این شماره قبلاً ثبت‌نام شده است",
          });
          return;
        }

        const passwordHash = hashPassword(password);
        const isAdmin = ADMIN_PHONES.includes(normalizedPhone) ? 1 : 0;

        db.run(
          `INSERT INTO users
           (phone, name, password_hash, is_admin)
           VALUES (?, ?, ?, ?)`,
          [
            normalizedPhone,
            String(name || "").trim(),
            passwordHash,
            isAdmin,
          ],
          function (insertErr) {
            if (insertErr) {
              resolve({
                success: false,
                message: insertErr.message,
              });
              return;
            }

            db.get(
              "SELECT id, phone, name, is_admin, created_at FROM users WHERE id = ?",
              [this.lastID],
              (selectErr, user) => {
                if (selectErr || !user) {
                  resolve({
                    success: false,
                    message: selectErr?.message || "خطا در ساخت حساب",
                  });
                  return;
                }

                const token = createSession(user);

                resolve({
                  success: true,
                  token,
                  user: {
                    id: user.id,
                    phone: user.phone,
                    name: user.name || "کاربر",
                    isAdmin: Boolean(user.is_admin),
                    createdAt: user.created_at,
                  },
                });
              }
            );
          }
        );
      }
    );
  });
}

export function loginUser(phone, password) {
  const normalizedPhone = normalizePhone(phone);

  return new Promise((resolve) => {
    db.get(
      `SELECT id, phone, name, password_hash, is_admin, created_at
       FROM users
       WHERE phone = ?`,
      [normalizedPhone],
      (err, user) => {
        if (err) {
          resolve({
            success: false,
            message: err.message,
          });
          return;
        }

        if (!user || !verifyPassword(password, user.password_hash)) {
          resolve({
            success: false,
            message: "شماره موبایل یا رمز عبور اشتباه است",
          });
          return;
        }

        const token = createSession(user);

        resolve({
          success: true,
          token,
          user: {
            id: user.id,
            phone: user.phone,
            name: user.name || "کاربر",
            isAdmin: Boolean(user.is_admin),
            createdAt: user.created_at,
          },
        });
      }
    );
  });
}

export function adminLogin(phone, password) {
  const normalizedPhone = normalizePhone(phone);

  if (!ADMIN_PHONES.includes(normalizedPhone)) {
    return null;
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return null;
  }

  return createSession({
    id: null,
    phone: normalizedPhone,
    is_admin: 1,
  });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : "";

  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "لطفاً وارد حساب شوید",
    });
  }

  req.user = session;
  next();
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : "";

  const session = sessions.get(token);

  if (!session || !session.isAdmin) {
    return res.status(401).json({
      success: false,
      message: "دسترسی غیرمجاز",
    });
  }

  req.admin = session;
  req.user = session;
  next();
}
