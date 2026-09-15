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
          name: form.name,
          phone: form.phone,
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
    <div className="auth-page">
      <div className="auth-card">
        <h1>ایجاد حساب</h1>
        <p>در مهندسینو حساب کاربری بسازید</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="نام و نام خانوادگی"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="شماره موبایل"
            value={form.phone}
            onChange={handleChange}
            dir="ltr"
          />

          <input
            type="password"
            name="password"
            placeholder="رمز عبور"
            value={form.password}
            onChange={handleChange}
            dir="ltr"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="تکرار رمز عبور"
            value={form.confirmPassword}
            onChange={handleChange}
            dir="ltr"
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>

        <p>
          قبلاً حساب دارید؟{" "}
          <Link to="/login">ورود به حساب</Link>
        </p>
      </div>
    </div>
  );
}
