import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const [settings, setSettings] = useState({
    siteTitle: "مهندسینو",
    aboutText: "مهندسینو یک پلتفرم آموزشی برای یادگیری ساده، مفهومی و کاربردی مباحث مهندسی است.",
    telegram: "https://t.me/mohandesino",
    instagram: "https://instagram.com/mohandesino",
    email: "info@mohandesino.ir",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸"
  });

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <footer className="site-footer-pro" dir="rtl">

      {/* ===== منوی پایین حرفه‌ای (موبایل و دسکتاپ) ===== */}
      <div className="footer-nav-pro">
        <Link to="/" className={`footer-nav-item-pro ${isActive("/")}`}>
          <span className="footer-nav-icon-pro">🏠</span>
          <span className="footer-nav-label-pro">خانه</span>
        </Link>
        <Link to="/courses" className={`footer-nav-item-pro ${isActive("/courses")}`}>
          <span className="footer-nav-icon-pro">📚</span>
          <span className="footer-nav-label-pro">دسته‌بندی</span>
        </Link>
        <Link to="/cart" className={`footer-nav-item-pro ${isActive("/cart")}`}>
          <span className="footer-nav-icon-pro">🛒</span>
          <span className="footer-nav-label-pro">سبد خرید</span>
        </Link>
        <Link to="/my-courses" className={`footer-nav-item-pro ${isActive("/my-courses")}`}>
          <span className="footer-nav-icon-pro">📖</span>
          <span className="footer-nav-label-pro">آموزش‌های من</span>
        </Link>
        <Link to="/profile" className={`footer-nav-item-pro ${isActive("/profile")}`}>
          <span className="footer-nav-icon-pro">👤</span>
          <span className="footer-nav-label-pro">پروفایل</span>
        </Link>
      </div>

      {/* ===== فوتر اصلی ===== */}
      <div className="footer-container-pro">
        <div className="footer-about-pro">
          <h3>🎓 {settings.siteTitle}</h3>
          <p>{settings.aboutText}</p>
          <div className="footer-socials-pro">
            <a href={settings.telegram} target="_blank" rel="noopener">📱 تلگرام</a>
            <a href={settings.instagram} target="_blank" rel="noopener">📸 اینستاگرام</a>
            <a href={`mailto:${settings.email}`}>📧 ایمیل</a>
          </div>
        </div>

        <div className="footer-links-pro">
          <h4>دسترسی سریع</h4>
          <Link to="/">🏠 خانه</Link>
          <Link to="/courses">📚 دوره‌ها</Link>
          <Link to="/my-courses">📖 دوره‌های من</Link>
          <Link to="/about">ℹ️ درباره ما</Link>
          <Link to="/contact">📞 تماس با ما</Link>
          <Link to="/blog">📝 مجله</Link>
        </div>

        <div className="footer-contact-pro">
          <h4>اطلاعات تماس</h4>
          <p>📞 {settings.phone}</p>
          <p>📧 {settings.email}</p>
          <p>📍 تهران، خیابان مهندسینو</p>
        </div>
      </div>

      <div className="footer-bottom-pro">
        <p>© {new Date().getFullYear()} {settings.siteTitle}. تمام حقوق محفوظ است.</p>
      </div>
    </footer>
  );
}

export default Footer;