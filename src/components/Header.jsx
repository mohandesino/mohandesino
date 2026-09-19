import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    siteTitle: "مهندسینو",
    showFaq: true, // ===== جدید: نمایش یا مخفی کردن FAQ
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedSettings = localStorage.getItem("mohandesino_settings");
    if (savedSettings) {
      const data = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...data }));
    } else {
      localStorage.setItem("mohandesino_settings", JSON.stringify(settings));
    }
  }, []);

  const isActive = (path) => location.pathname === path ? "active" : "";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("auth_token");
    setUser(null);
    setProfileOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header className={`site-header ${dark ? 'dark' : ''}`} dir="rtl">
      <div className="header-container">

        <button className="mobile-menu-btn" onClick={toggleMenu} type="button">
          ☰
        </button>

        <Link to="/" className="header-logo">
          <span className="logo-icon">{settings.siteTitle || "مهندسینو"}</span>
        </Link>

        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" className={isActive("/")} onClick={closeMenu}>خانه</Link>
          <Link to="/courses" className={isActive("/courses")} onClick={closeMenu}>دوره‌ها</Link>
          <Link to="/my-courses" className={isActive("/my-courses")} onClick={closeMenu}>دوره‌های من</Link>
          <Link to="/about" className={isActive("/about")} onClick={closeMenu}>درباره ما</Link>
          <Link to="/contact" className={isActive("/contact")} onClick={closeMenu}>تماس با ما</Link>
          <Link to="/blog" className={isActive("/blog")} onClick={closeMenu}>مجله</Link>
          
          {/* ===== جدید: نمایش FAQ فقط در صورتی که فعال باشه ===== */}
          {settings.showFaq !== false && (
            <Link to="/faq" className={isActive("/faq")} onClick={closeMenu}>❓ سوالات متداول</Link>
          )}

          {user?.is_admin && (
            <Link to="/admin" className={isActive("/admin")} onClick={closeMenu}>مدیریت</Link>
          )}
        </nav>

        <div className="header-actions">
          <Link to="/search" className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          <button onClick={toggleTheme} className="theme-toggle" type="button">
            {dark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="profile-wrapper">
              <button className="profile-btn" onClick={toggleProfile} type="button">
                <span className="profile-avatar">{user.name?.[0] || "👤"}</span>
                <span className="profile-name">{user.name || "کاربر"}</span>
                <span className="profile-arrow">▼</span>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" onClick={() => setProfileOpen(false)}>👤 پروفایل من</Link>
                  <Link to="/my-courses" onClick={() => setProfileOpen(false)}>📚 دوره‌های من</Link>
                  <Link to="/cart" onClick={() => setProfileOpen(false)}>🛒 سبد خرید</Link>
                  <hr />
                  <button onClick={handleLogout} type="button">🚪 خروج</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">ورود</Link>
              <Link to="/signup" className="signup-btn">ثبت‌نام</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;