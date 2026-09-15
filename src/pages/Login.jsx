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
    <div className="auth-page">
      <div className="auth-card">
        <h1>ورود به حساب</h1>
        <p>به مهندسینو خوش آمدید</p>

        <form onSubmit={handleLogin}>
          <input
            type="tel"
            placeholder="شماره موبایل"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            autoComplete="tel"
          />

          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
            autoComplete="current-password"
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <p>
          حساب کاربری ندارید؟{" "}
          <Link to="/signup">ثبت‌نام کنید</Link>
        </p>
      </div>
    </div>
  );
}
