import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({ siteTitle: "مهندسینو" });

  useEffect(() => {
    const savedUser = localStorage.getItem("mohandesino_user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedSettings = localStorage.getItem("mohandesino_settings");
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    localStorage.removeItem("mohandesino_user");
    setUser(null);
    setProfileOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header className={`site-header-mobile ${dark ? 'dark' : ''}`} dir="rtl">
      <div className="header-container-mobile">

        <Link to="/" className="header-logo-mobile">
          <span className="logo-icon-mobile">🎓 {settings.siteTitle || "مهندسینو"}</span>
        </Link>

        <div className="header-actions-mobile">
          <Link to="/search" className="header-icon-mobile search-icon-mobile">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          <button onClick={toggleTheme} className="header-icon-mobile theme-icon-mobile" type="button">
            {dark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="profile-wrapper-mobile">
              <button className="profile-btn-mobile" onClick={toggleProfile} type="button">
                <span className="profile-avatar-mobile">{user.name?.[0] || "👤"}</span>
              </button>
              {profileOpen && (
                <div className="profile-dropdown-mobile">
                  <Link to="/profile" onClick={() => setProfileOpen(false)}>👤 پروفایل من</Link>
                  <Link to="/my-courses" onClick={() => setProfileOpen(false)}>📚 دوره‌های من</Link>
                  <Link to="/cart" onClick={() => setProfileOpen(false)}>🛒 سبد خرید</Link>
                  <hr />
                  <button onClick={handleLogout} type="button">🚪 خروج</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-icon-mobile">
              <span className="login-icon-text-mobile">👤</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;