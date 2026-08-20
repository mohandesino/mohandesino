import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
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
      const exists = users.some(u => u.phone === phone);

      if (exists) {
        alert("❌ این شماره قبلاً ثبت‌نام شده است. لطفاً وارد شوید.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const newUser = { name: name || "کاربر", phone };
      users.push(newUser);
      localStorage.setItem("mohandesino_users", JSON.stringify(users));

      const adminPhones = ["09927533272", "09051627714"];
      const user = {
        name: newUser.name,
        phone: phone,
        isAdmin: adminPhones.includes(phone),
      };
      localStorage.setItem("mohandesino_user", JSON.stringify(user));

      setLoading(false);
      alert("🎉 تبریک! ثبت‌نام شما با موفقیت انجام شد. به جمع مهندسینو خوش آمدی.");
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
            <div className="auth-card-icon">{step === 1 ? "🚀" : "📱"}</div>
            <h1>{step === 1 ? "عضو جدید؟" : "تأیید شماره"}</h1>
            <p>
              {step === 1
                ? "شماره موبایل خود را وارد کن تا ثبت‌نام را شروع کنی"
                : `کد ۶ رقمی ارسال‌شده به ${phone} را وارد کن`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={sendCode} className="auth-form-modern" autoComplete="off">
              <div className="auth-input-group">
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

              <div className="auth-input-group">
                <label>👤 نام و نام خانوادگی (اختیاری)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام خود را وارد کنید..."
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                📨 دریافت کد تأیید
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="auth-form-modern" autoComplete="off">
              <div className="auth-input-group">
                <label>🔑 کد تأیید</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  maxLength="6"
                  className="auth-code-input"
                  required
                  autoComplete="off"
                />
                <small className="auth-code-hint">کد تأیید: <strong>۱۲۳۴۵۶</strong> (برای تست)</small>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="auth-spinner"></span>
                    در حال تأیید...
                  </>
                ) : (
                  '✅ تأیید و ورود'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="auth-back-btn"
              >
                ← برگشت به مرحله قبل
              </button>
            </form>
          )}

          <div className="auth-divider-line">
            <span>یا</span>
          </div>

          <div className="auth-footer-text">
            <p>قبلاً حساب داری؟ <Link to="/login" className="auth-footer-link">وارد شو</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signup;