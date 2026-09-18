import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const API = API_BASE;

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.trim();

    if (!/^09\d{9}$/.test(cleanPhone)) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }

    if (!password) {
      setError("لطفاً رمز عبور را وارد کنید.");
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
          phone: cleanPhone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "شماره موبایل یا رمز عبور اشتباه است.");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

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
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                  strokeLinecap="round"
                />
                <path
                  d="m10 17 5-5-5-5M15 12H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2>ورود به حساب</h2>
            <p>برای ادامه یادگیری وارد حساب خود شوید</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-modern">

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
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  placeholder="رمز عبور خود را وارد کنید"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
                      <path
                        d="M3 3l18 18"
                        strokeLinecap="round"
                      />
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
                      <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                      />
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
                  در حال ورود...
                </>
              ) : (
                <>
                  ورود به حساب
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
            حساب کاربری ندارید؟
            <Link to="/signup" className="auth-footer-link">
              ثبت‌نام کنید
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
