import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Certificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedCourses = localStorage.getItem("mohandesino_courses");
    const savedUser = localStorage.getItem("mohandesino_user");
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCourses) {
      const allCourses = JSON.parse(savedCourses);
      const found = allCourses.find(c => c.id === id);
      if (found) setCourse(found);
    }
  }, [id]);

  if (!course || !user) {
    return (
      <main className="certificate-page" dir="rtl">
        <div className="certificate-loading">در حال بارگذاری...</div>
      </main>
    );
  }

  return (
    <main className="certificate-page" dir="rtl">
      <div className="certificate-wrapper">
        <div className="certificate">
          <div className="certificate-border">
            <div className="certificate-inner">
              <div className="certificate-header">
                <span className="certificate-badge">🎓</span>
                <h1>گواهی پایان دوره</h1>
              </div>

              <div className="certificate-body">
                <p>این گواهی به</p>
                <h2>{user.name || "کاربر"}</h2>
                <p>به دلیل گذراندن موفقیت‌آمیز دوره</p>
                <h3>{course.title}</h3>
                <p>اعطا می‌شود.</p>
                <div className="certificate-details">
                  <span>تاریخ: {new Date().toLocaleDateString("fa-IR")}</span>
                  <span>مدت دوره: {course.chapters?.length || 0} فصل</span>
                </div>
              </div>

              <div className="certificate-footer">
                <div className="certificate-signature">
                  <div className="signature-line"></div>
                  <span>محمدرضا فاضلی‌نیا</span>
                  <small>مدرس و تولیدکننده محتوای ریاضی و فیزیک</small>
                </div>
                <div className="certificate-id">
                  <span>شماره گواهی: #MOH-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="certificate-actions">
          <button onClick={() => window.print()} className="certificate-print-btn">
            🖨️ چاپ گواهی
          </button>
          <button onClick={() => navigate(`/course/${id}/learn`)} className="certificate-back-btn">
            ← بازگشت به دوره
          </button>
        </div>
      </div>
    </main>
  );
}

export default Certificate;