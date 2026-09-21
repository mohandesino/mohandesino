import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config.js";

function MyCourses() {
  const [myCourses, setMyCourses] = useState([]);
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadMyCourses = async () => {
      const saved = localStorage.getItem("mohandesino_my_courses");
      const localCourses = saved ? JSON.parse(saved) : [];

      try {
        const token = localStorage.getItem("auth_token");

        if (token) {
          const response = await fetch(
            `${API_BASE}/api/my-courses`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json().catch(() => null);

          if (response.ok && data?.success && Array.isArray(data.courses)) {
            const backendCourses = data.courses;

            const merged = [
              ...backendCourses,
              ...localCourses.filter(
                localCourse =>
                  !backendCourses.some(
                    backendCourse =>
                      String(backendCourse.id) === String(localCourse.id)
                  )
              ),
            ];

            setMyCourses(merged);

            const progress = {};
            merged.forEach(c => {
              const savedProgress = localStorage.getItem(
                `mohandesino_progress_${c.id}`
              );

              if (savedProgress) {
                const p = JSON.parse(savedProgress);
                const total = p.total || 1;
                const done = p.completed?.length || 0;
                progress[c.id] = Math.round((done / total) * 100);
              } else {
                progress[c.id] = 0;
              }
            });

            setProgressData(progress);
            return;
          }
        }
      } catch (error) {
        console.error("خطا در دریافت دوره‌های من:", error);
      }

      setMyCourses(localCourses);

      const progress = {};
      localCourses.forEach(c => {
        const savedProgress = localStorage.getItem(
          `mohandesino_progress_${c.id}`
        );

        if (savedProgress) {
          const p = JSON.parse(savedProgress);
          const total = p.total || 1;
          const done = p.completed?.length || 0;
          progress[c.id] = Math.round((done / total) * 100);
        } else {
          progress[c.id] = 0;
        }
      });

      setProgressData(progress);
    };

    loadMyCourses();
  }, []);

  return (
    <main className="page-container" dir="rtl" style={{ padding: "40px 20px", minHeight: "60vh" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px" }}>📚 دوره‌های من</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>دوره‌هایی که در اختیار شما قرار گرفته‌اند.</p>

      {myCourses.length === 0 ? (
        <div className="empty-state">
          <span className="icon">📖</span>
          <h3>هنوز دوره‌ای نداری</h3>
          <p>بعد از خرید دوره، دوره‌های شما اینجا نمایش داده می‌شوند.</p>
          <Link to="/courses">مشاهده دوره‌ها</Link>
        </div>
      ) : (
        <div className="course-grid">
          {myCourses.map(item => {
            const progress = progressData[item.id] || 0;
            return (
              <div className="home-course-card" key={item.id}>
                <div className="course-thumbnail">
                  <span className="course-thumbnail-icon">📐</span>
                  {item.isFree && <span className="free-badge">رایگان</span>}
                  <div className="progress-overlay">
                    <span className="progress-percent">{progress}%</span>
                  </div>
                </div>
                <div className="course-card-body">
                  <span className="course-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <div className="course-progress-mini">
                    <div className="mini-bar">
                      <div className="mini-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="mini-text">{progress}%</span>
                  </div>
                  <Link to={`/course/${item.id}/learn`} className="course-view-button">
                    {progress === 100 ? "✅ تکمیل شده" : "▶ ادامه یادگیری"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default MyCourses;