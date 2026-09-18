import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config.js";

const API = API_BASE;

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("نام و نام خانوادگی را وارد کنید");
      return;
    }

    if (!/^09\d{9}$/.test(form.phone.trim())) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    if (form.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("تکرار رمز عبور صحیح نیست");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "ثبت‌نام انجام نشد");
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
            <div className="auth-card-icon">✨</div>
            <h1>ایجاد حساب کاربری</h1>
            <p>برای شروع یادگیری، حساب خود را بسازید</p>
          </div>

          <form onSubmit={handleSignup} className="auth-form-modern">

            <div className="auth-input-group">
              <label>👤 نام و نام خانوادگی</label>
              <input
                type="text"
                name="name"
                placeholder="نام و نام خانوادگی"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="auth-input-group">
              <label>📱 شماره موبایل</label>
              <input
                type="tel"
                name="phone"
                placeholder="مثلاً 09123456789"
                value={form.phone}
                onChange={handleChange}
                dir="ltr"
                autoComplete="tel"
              />
            </div>

            <div className="auth-input-group">
              <label>🔑 رمز عبور</label>
              <input
                type="password"
                name="password"
                placeholder="حداقل ۶ کاراکتر"
                value={form.password}
                onChange={handleChange}
                dir="ltr"
                autoComplete="new-password"
              />
            </div>

            <div className="auth-input-group">
              <label>🔐 تکرار رمز عبور</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="رمز عبور را دوباره وارد کنید"
                value={form.confirmPassword}
                onChange={handleChange}
                dir="ltr"
                autoComplete="new-password"
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
                  در حال ثبت‌نام...
                </>
              ) : (
                "ایجاد حساب"
              )}
            </button>
          </form>

          <div className="auth-divider-line">
            <span>یا</span>
          </div>

          <div className="auth-footer-text">
            <p>
              قبلاً حساب دارید؟{" "}
              <Link to="/login" className="auth-footer-link">
                وارد شوید
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
