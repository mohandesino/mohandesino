import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizePhone = (value) => value.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const normalizedPhone = normalizePhone(phone);

    if (!phone || !password) {
      setError("لطفاً همه فیلدها را پر کنید.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("mohandesino_users") || "[]");
      const foundUser = users.find(u => normalizePhone(u.phone) === normalizedPhone);

      if (!foundUser) {
        setError("❌ این شماره ثبت‌نام نشده است. لطفاً ابتدا ثبت‌نام کنید.");
        setLoading(false);
        return;
      }

      const adminPhones = ["09927533272", "09051627714"];
      const user = {
        name: foundUser.name || "کاربر",
        phone: normalizedPhone,
        isAdmin: adminPhones.includes(normalizedPhone),
      };

      localStorage.setItem("mohandesino_user", JSON.stringify(user));
      
      // ===== پیام خوش‌آمدگویی به کاربر جدید =====
      const isNewUser = !localStorage.getItem("mohandesino_welcome_shown");
      if (isNewUser) {
        alert("🎉 به مهندسینو خوش آمدی! اولین دوره‌ات رو همین حالا شروع کن.");
        localStorage.setItem("mohandesino_welcome_shown", "true");
      }

      setPhone("");
      setPassword("");
      setLoading(false);

      if (user.isAdmin) {
        alert("🛡️ خوش آمدید، مدیر محترم!");
      } else {
        alert("👋 خوش برگشتی! به جمع مهندسینو خوش اومدی.");
      }

      navigate("/");
      window.location.reload();
    }, 800);
  };

  return (
    <main className="auth-page" dir="rtl">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🔐</div>
            <h1>خوش برگشتی 👋</h1>
            <p>برای ورود، شماره موبایل و رمز عبور خود را وارد کن</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <div className="auth-field">
              <label>📱 شماره موبایل</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                required
                autoComplete="off"
              />
            </div>

            <div className="auth-field">
              <label>🔑 رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                required
                autoComplete="off"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" />
                <span>مرا به خاطر بسپار</span>
              </label>
              <Link to="/forgot-password" className="auth-forgot">فراموشی رمز؟</Link>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  در حال ورود...
                </>
              ) : (
                '🚀 ورود به حساب'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>یا</span>
          </div>

          <div className="auth-footer">
            <p>حساب کاربری نداری؟ <Link to="/signup" className="auth-link">ثبت‌نام کن</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;