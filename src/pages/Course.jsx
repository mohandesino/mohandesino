import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CourseComments from "../components/CourseComments";

function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_courses");
    const savedMy = localStorage.getItem("mohandesino_my_courses");

    if (saved) {
      const allCourses = JSON.parse(saved);
      const found = allCourses.find(c => c.id === id);
      if (found) {
        setCourse(found);
      } else {
        navigate("/courses");
      }
    } else {
      navigate("/courses");
    }

    if (savedMy) {
      const my = JSON.parse(savedMy);
      setMyCourses(my);
      const purchased = my.some(c => c.id === id);
      setIsPurchased(purchased);
    }
  }, [id, navigate]);

  const handlePurchase = () => {
    if (!course) return;

    if (course.isFree || Number(course.price) === 0) {
      const updated = [...myCourses, course];
      localStorage.setItem("mohandesino_my_courses", JSON.stringify(updated));
      setMyCourses(updated);
      setIsPurchased(true);
      alert("🎁 دوره رایگان به دوره‌های من اضافه شد!");
      return;
    }

    navigate(`/checkout/${course.id}`);
  };

  if (!course) {
    return (
      <main className="course-page" dir="rtl">
        <div className="course-loading">در حال بارگذاری...</div>
      </main>
    );
  }

  const totalLessons = course.chapters?.reduce(
    (total, chapter) => total + (chapter.lessons?.length || 0), 0
  ) || 0;

  return (
    <main className="course-page" dir="rtl">
      <div className="course-container">

        {/* ===== هدر دوره ===== */}
        <div className="course-hero-modern">
          <div className="course-hero-backdrop">
            <div className="course-hero-pattern"></div>
          </div>
          <div className="course-hero-content">
            <div className="course-hero-image">
              {course.image ? (
                <img src={course.image} alt={course.title} />
              ) : (
                <span>📐</span>
              )}
            </div>
            <div className="course-hero-text">
              <span className="course-badge-modern">{course.category}</span>
              <h1>{course.title}</h1>
              <p className="course-description-modern">{course.description}</p>
              <div className="course-stats-modern">
                <div className="stat-item">
                  <span className="stat-number">{course.chapters?.length || 0}</span>
                  <span className="stat-label">فصل</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">{totalLessons}</span>
                  <span className="stat-label">درس</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">{course.level}</span>
                  <span className="stat-label">سطح</span>
                </div>
              </div>
              <div className="course-purchase-box-modern">
                <div className="course-price-modern">
                  {course.isFree || Number(course.price) === 0 ? (
                    <span className="free-price">🎁 رایگان</span>
                  ) : (
                    <>
                      <span className="price-amount">{Number(course.price).toLocaleString()}</span>
                      <span className="price-currency">تومان</span>
                    </>
                  )}
                </div>
                {isPurchased ? (
                  <Link to={`/course/${id}/learn`} className="btn-start-learning">
                    ▶ شروع یادگیری
                  </Link>
                ) : (
                  <button onClick={handlePurchase} className="btn-purchase">
                    {course.isFree || Number(course.price) === 0 ? "🎁 دریافت رایگان" : "💰 خرید دوره"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== سرفصل‌ها ===== */}
        <div className="course-syllabus-modern">
          <div className="syllabus-header">
            <div className="syllabus-title">
              <span className="syllabus-icon">📖</span>
              <h2>محتوای آموزشی</h2>
            </div>
            <span className="syllabus-count">{course.chapters?.length || 0} فصل</span>
          </div>

          <div className="course-chapters-modern">
            {course.chapters?.map((chapter, chapterIndex) => (
              <details className="chapter-item" key={chapter.id} open={chapterIndex === 0}>
                <summary className="chapter-summary">
                  <div className="chapter-title-modern">
                    <span className="chapter-number">{String(chapterIndex + 1).padStart(2, "0")}</span>
                    <strong>{chapter.title}</strong>
                  </div>
                  <span className="chapter-arrow-modern">⌄</span>
                </summary>
                <div className="chapter-lessons-modern">
                  {chapter.lessons?.map((lesson, lessonIndex) => {
                    const unlocked = isPurchased || lesson.free;
                    return (
                      <div className="lesson-item-modern" key={lesson.id}>
                        <div className="lesson-icon-modern">
                          {unlocked ? "▶" : "🔒"}
                        </div>
                        <div className="lesson-info-modern">
                          <span className="lesson-number">{lessonIndex + 1}</span>
                          <strong>{lesson.title}</strong>
                          <span className="lesson-duration">{lesson.duration || "ویدئو آموزشی"}</span>
                        </div>
                        {lesson.free && <span className="lesson-free-badge-modern">رایگان</span>}
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ===== سایدبار ===== */}
        <aside className="course-sidebar-modern">
          <div className="sidebar-card">
            <div className="sidebar-icon">🎓</div>
            <h3>آماده‌ای شروع کنی؟</h3>
            <p>همین حالا یادگیری رو شروع کن و مهارتت رو قدم‌به‌قدم افزایش بده.</p>
            {isPurchased ? (
              <Link to={`/course/${id}/learn`} className="sidebar-btn primary">
                ▶ ادامه یادگیری
              </Link>
            ) : (
              <button onClick={handlePurchase} className="sidebar-btn primary">
                {course.isFree ? "دریافت رایگان" : "خرید دوره"}
              </button>
            )}
          </div>
        </aside>

        {/* ===== بخش نظرات (جدید) ===== */}
        <div className="course-comments-section">
          <CourseComments courseId={id} />
        </div>

      </div>
    </main>
  );
}

export default Course;