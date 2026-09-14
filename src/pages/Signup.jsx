import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const normalizePhone = (value) => value.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632));

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = (e) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone.length < 10) {
      alert("📱 لطفاً شماره موبایل معتبر وارد کنید.");
      return;
    }
    setStep(2);
  };

  const verifyCode = (e) => {
    e.preventDefault();
    setLoading(true);

    if (code.length !== 6) {
      alert("🔑 کد تأیید باید ۶ رقمی باشد.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("mohandesino_users") || "[]");
      const exists = users.some(u => normalizePhone(u.phone) === normalizedPhone);

      if (exists) {
        alert("❌ این شماره قبلاً ثبت‌نام شده است. لطفاً وارد شوید.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const newUser = { name: name || "کاربر", phone: normalizedPhone };
      users.push(newUser);
      localStorage.setItem("mohandesino_users", JSON.stringify(users));

      const adminPhones = ["09927533272", "09051627714"];
      const user = {
        name: newUser.name,
        phone: normalizedPhone,
        isAdmin: adminPhones.includes(normalizedPhone),
      };
      localStorage.setItem("mohandesino_user", JSON.stringify(user));

      // ===== پیام خوش‌آمدگویی به کاربر جدید =====
      localStorage.setItem("mohandesino_welcome_shown", "true");
      alert("🎉 تبریک! ثبت‌نام تو با موفقیت انجام شد. به جمع مهندسینو خوش آمدی.");

      setLoading(false);
      navigate("/");
      window.location.reload();
    }, 800);
  };

  return (
    <main className="auth-page" dir="rtl">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🚀</div>
            <h1>{step === 1 ? "ساخت حساب جدید" : "تأیید شماره"}</h1>
            <p>
              {step === 1
                ? "برای شروع یادگیری شماره موبایلت رو وارد کن"
                : `کد ۶ رقمی ارسال‌شده به ${phone} را وارد کن`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={sendCode} className="auth-form" autoComplete="off">
              <div className="auth-field">
                <label>📱 شماره موبایل</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  maxLength="11"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="auth-field">
                <label>👤 نام و نام خانوادگی (اختیاری)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام خود را وارد کنید..."
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="auth-button">دریافت کد تأیید</button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="auth-form" autoComplete="off">
              <div className="auth-field">
                <label>🔑 کد تأیید</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  maxLength="6"
                  className="code-input"
                  required
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    در حال تأیید...
                  </>
                ) : (
                  '✅ تأیید و ورود'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="auth-back"
              >
                ← برگشت به مرحله قبل
              </button>
            </form>
          )}

          <div className="auth-divider">
            <span>یا</span>
          </div>

          <div className="auth-footer">
            <p>قبلاً حساب داری؟ <Link to="/login" className="auth-link">ورود</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signup;