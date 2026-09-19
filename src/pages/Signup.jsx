import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const API = API_BASE;

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name) {
      setError("لطفاً نام و نام خانوادگی را وارد کنید.");
      return;
    }

    if (!/^09\d{9}$/.test(phone)) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }

    if (form.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
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
          name,
          phone,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "ثبت‌نام انجام نشد. دوباره تلاش کنید."
        );
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("currentUser", JSON.stringify({ ...data.user, isAdmin: data.user.is_admin }));

      navigate("/");
    } catch (err) {
      setError(err.message || "خطایی رخ داد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-modern">
      <div className="auth-wrapper">

        <div className="auth-brand">
          <div className="auth-brand-icon">
            🎓
          </div>

          <div>
            <h1>مهندسینو</h1>
            <p>آموزش مهندسی، ساده و کاربردی</p>
          </div>
        </div>

        <div className="auth-card-modern">

          <div className="auth-card-header">
            <div className="auth-card-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                width="24"
                height="24"
              >
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  strokeLinecap="round"
                />
                <circle cx="9" cy="7" r="4" />
                <path
                  d="M19 8v6M22 11h-6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2>ایجاد حساب کاربری</h2>
            <p>برای شروع یادگیری، حساب خود را بسازید</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-modern">

            <div className="auth-input-group">
              <label htmlFor="name">نام و نام خانوادگی</label>

              <div className="auth-input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  width="20"
                  height="20"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path
                    d="M4 21a8 8 0 0 1 16 0"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="مثلاً محمد رضایی"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="phone">شماره موبایل</label>

              <div className="auth-input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  width="20"
                  height="20"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M9 18h6" strokeLinecap="round" />
                </svg>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="09123456789"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">رمز عبور</label>

              <div className="auth-input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  width="20"
                  height="20"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  placeholder="حداقل ۶ کاراکتر"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "مخفی کردن رمز عبور"
                      : "نمایش رمز عبور"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      width="19"
                      height="19"
                    >
                      <path d="M3 3l18 18" strokeLinecap="round" />
                      <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.2 0 9 4 10 8-0.4 1.5-1.2 2.8-2.2 3.9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.6 6.6C4.7 8 3.4 9.8 2 12c1 4 4.8 8 10 8 1.3 0 2.5-.2 3.6-.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      width="19"
                      height="19"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirmPassword">تکرار رمز عبور</label>

              <div className="auth-input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  width="20"
                  height="20"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  dir="ltr"
                  placeholder="رمز عبور را دوباره وارد کنید"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "مخفی کردن رمز عبور"
                      : "نمایش رمز عبور"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      width="19"
                      height="19"
                    >
                      <path d="M3 3l18 18" strokeLinecap="round" />
                      <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.2 0 9 4 10 8-0.4 1.5-1.2 2.8-2.2 3.9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.6 6.6C4.7 8 3.4 9.8 2 12c1 4 4.8 8 10 8 1.3 0 2.5-.2 3.6-.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      width="19"
                      height="19"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error-box" role="alert">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="19"
                  height="19"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    d="M12 8v5M12 16h.01"
                    strokeLinecap="round"
                  />
                </svg>

                <span>{error}</span>
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
                  در حال ایجاد حساب...
                </>
              ) : (
                <>
                  ایجاد حساب
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="19"
                    height="19"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

          </form>

          <div className="auth-divider-line">
            <span>یا</span>
          </div>

          <div className="auth-footer-text">
            قبلاً حساب دارید؟
            <Link to="/login" className="auth-footer-link">
              وارد شوید
            </Link>
          </div>

        </div>

        <div className="auth-back-home">
          <Link to="/">← بازگشت به صفحه اصلی</Link>
        </div>

      </div>
    </div>
  );
}
