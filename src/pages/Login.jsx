import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== پاک کردن فرم هنگام بارگذاری صفحه =====
  useEffect(() => {
    setPhone("");
    setPassword("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!phone || !password) {
      setError("لطفاً همه فیلدها را پر کنید.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("mohandesino_users") || "[]");
      const foundUser = users.find(u => u.phone === phone);

      if (!foundUser) {
        setError("❌ این شماره ثبت‌نام نشده است. لطفاً ابتدا ثبت‌نام کنید.");
        setLoading(false);
        return;
      }

      const adminPhones = ["09927533272", "09051627714"];
      const user = {
        name: foundUser.name || "کاربر",
        phone: phone,
        isAdmin: adminPhones.includes(phone),
      };

      localStorage.setItem("mohandesino_user", JSON.stringify(user));
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
    <main className="auth-page-modern" dir="rtl">
      <div className="auth-wrapper">
        <div className="auth-brand">
          <div className="auth-brand-icon">🎓</div>
          <h2>مهندسینو</h2>
          <p>آموزش مهندسی، کاربردی و ساده</p>
        </div>

        <div className="auth-card-modern">
          <div className="auth-card-header">
            <div className="auth-card-icon">🔐</div>
            <h1>خوش برگشتی</h1>
            <p>برای ورود، شماره موبایل و رمز عبور خود را وارد کن</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-modern" autoComplete="off">
            <div className="auth-input-group">
              <label>📱 شماره موبایل</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                required
                autoComplete="off"
                name="phone_field"
                id="phone_field"
              />
            </div>

            <div className="auth-input-group">
              <label>🔑 رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                required
                autoComplete="new-password"
                name="password_field"
                id="password_field"
              />
            </div>

            {error && <div className="auth-error-box">{error}</div>}

            <div className="auth-extra">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>مرا به خاطر بسپار</span>
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">فراموشی رمز؟</Link>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  در حال ورود...
                </>
              ) : (
                '🚀 ورود به حساب'
              )}
            </button>
          </form>

          <div className="auth-divider-line">
            <span>یا</span>
          </div>

          <div className="auth-footer-text">
            <p>حساب کاربری نداری؟ <Link to="/signup" className="auth-footer-link">ثبت‌نام کن</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;