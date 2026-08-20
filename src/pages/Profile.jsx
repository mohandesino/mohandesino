import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Profile() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("mohandesino_user");
    const savedMy = localStorage.getItem("mohandesino_my_courses");

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setEditName(userData.name || "");
    }

    if (savedMy) {
      setMyCourses(JSON.parse(savedMy));
    }
  }, []);

  const handleSaveName = () => {
    if (user) {
      const updatedUser = { ...user, name: editName };
      localStorage.setItem("mohandesino_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mohandesino_user");
    navigate("/");
    window.location.reload();
  };

  if (!user) {
    return (
      <main className="profile-page-new" dir="rtl">
        <div className="profile-login-box">
          <div className="profile-login-icon">👤</div>
          <h2>لطفاً وارد حساب خود شوید</h2>
          <p>برای مشاهده پروفایل، ابتدا وارد شوید.</p>
          <Link to="/login" className="profile-login-btn">ورود به حساب</Link>
        </div>
      </main>
    );
  }

  const completedCourses = myCourses.filter(c => {
    const progress = localStorage.getItem(`mohandesino_progress_${c.id}`);
    if (progress) {
      const p = JSON.parse(progress);
      const total = p.total || 1;
      const done = p.completed?.length || 0;
      return done === total;
    }
    return false;
  });

  return (
    <main className={`profile-page-new ${dark ? 'dark' : ''}`} dir="rtl">
      <div className="profile-banner">
        <div className="profile-banner-bg"></div>
        <div className="profile-banner-content">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-new">
              {user.name?.[0] || "👤"}
            </div>
            {user.isAdmin && <span className="profile-badge-admin">🛡️ ادمین</span>}
          </div>
          <div className="profile-banner-info">
            {isEditing ? (
              <div className="profile-edit-row">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="profile-edit-input"
                />
                <button onClick={handleSaveName} className="profile-save-btn">💾</button>
                <button onClick={() => setIsEditing(false)} className="profile-cancel-btn">✖</button>
              </div>
            ) : (
              <div className="profile-name-row">
                <h1>{user.name || "کاربر"}</h1>
                <button onClick={() => setIsEditing(true)} className="profile-edit-btn">✏️</button>
              </div>
            )}
            <div className="profile-meta">
              <span>📱 {user.phone || "شماره موبایل ثبت نشده"}</span>
              <span>📅 عضویت از {new Date().toLocaleDateString("fa-IR")}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="profile-logout-btn">🚪 خروج</button>
        </div>
      </div>

      <div className="profile-stats-new">
        <div className="profile-stat-item">
          <span className="profile-stat-number">{myCourses.length}</span>
          <span className="profile-stat-label">دوره خریداری شده</span>
        </div>
        <div className="profile-stat-item">
          <span className="profile-stat-number">{completedCourses.length}</span>
          <span className="profile-stat-label">دوره تکمیل شده</span>
        </div>
        <div className="profile-stat-item">
          <span className="profile-stat-number">⭐</span>
          <span className="profile-stat-label">امتیاز شما</span>
        </div>
      </div>

      <div className="profile-courses-new">
        <div className="profile-courses-header">
          <h3>📚 دوره‌های من</h3>
          <span className="profile-courses-count">{myCourses.length} دوره</span>
        </div>

        {myCourses.length === 0 ? (
          <div className="profile-empty-state">
            <span className="profile-empty-icon">📖</span>
            <h4>هنوز دوره‌ای نداری</h4>
            <p>بعد از خرید دوره، دوره‌های شما اینجا نمایش داده می‌شوند.</p>
            <Link to="/courses" className="profile-empty-btn">مشاهده دوره‌ها</Link>
          </div>
        ) : (
          <div className="profile-courses-grid">
            {myCourses.map(course => {
              const progressData = localStorage.getItem(`mohandesino_progress_${course.id}`);
              let progress = 0;
              if (progressData) {
                const p = JSON.parse(progressData);
                const total = p.total || 1;
                const done = p.completed?.length || 0;
                progress = Math.round((done / total) * 100);
              }
              return (
                <div className="profile-course-card" key={course.id}>
                  <div className="profile-course-icon">📐</div>
                  <div className="profile-course-info">
                    <span className="profile-course-category">{course.category}</span>
                    <h4>{course.title}</h4>
                    <div className="profile-course-progress">
                      <div className="profile-course-bar">
                        <div className="profile-course-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="profile-course-percent">{progress}%</span>
                    </div>
                    <Link to={`/course/${course.id}/learn`} className="profile-course-link">
                      {progress === 100 ? "✅ تکمیل شده" : "▶ ادامه یادگیری"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;