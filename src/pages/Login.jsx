import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config.js";

const API = API_BASE;

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^09\d{9}$/.test(phone.trim())) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    if (!password) {
      setError("رمز عبور را وارد کنید");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "ورود انجام نشد");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.message || "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page-modern" dir="rtl">
      <div className="auth-wrapper">

        <div className="auth-brand">
          <div className="auth-brand-icon">🎓</div>
          <h2>مهندسینو</h2>
          <p>آموزش ریاضی و فیزیک به زبان ساده و مفهومی</p>
        </div>

        <div className="auth-card-modern">

          <div className="auth-card-header">
            <div className="auth-card-icon">🔐</div>
            <h1>ورود به حساب</h1>
            <p>برای ادامه وارد حساب کاربری خود شوید</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form-modern">

            <div className="auth-input-group">
              <label>📱 شماره موبایل</label>
              <input
                type="tel"
                placeholder="مثلاً 09123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                autoComplete="tel"
              />
            </div>

            <div className="auth-input-group">
              <label>🔑 رمز عبور</label>
              <input
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="auth-error-box">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  در حال ورود...
                </>
              ) : (
                "ورود به حساب"
              )}
            </button>
          </form>

          <div className="auth-divider-line">
            <span>یا</span>
          </div>

          <div className="auth-footer-text">
            <p>
              حساب کاربری ندارید؟{" "}
              <Link to="/signup" className="auth-footer-link">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
