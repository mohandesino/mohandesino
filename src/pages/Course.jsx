import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config.js";

function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/courses/${id}/full`);
        const data = await response.json();

        if (!response.ok || !data.success || !data.course) {
          navigate("/courses");
          return;
        }

        setCourse(data.course);

        const savedMy = localStorage.getItem("mohandesino_my_courses");
        let localPurchased = false;

        if (savedMy) {
          const my = JSON.parse(savedMy);
          setMyCourses(my);
          localPurchased = my.some(c => String(c.id) === String(id));
        }

        const token = localStorage.getItem("auth_token");

        if (token) {
          try {
            const myCoursesResponse = await fetch(
              `${API_BASE}/api/my-courses`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const myCoursesData = await myCoursesResponse.json().catch(() => null);

            if (
              myCoursesResponse.ok &&
              myCoursesData?.success &&
              Array.isArray(myCoursesData.courses)
            ) {
              const backendPurchased = myCoursesData.courses.some(
                c => String(c.id) === String(id)
              );

              if (backendPurchased) {
                setIsPurchased(true);
              } else if (data.course.is_free || Number(data.course.price) === 0) {
                setIsPurchased(localPurchased);
              } else {
                setIsPurchased(false);
              }
            } else {
              setIsPurchased(
                course.isFree || Number(course.price) === 0
                  ? localPurchased
                  : false
              );
            }
          } catch (error) {
            console.error("خطا در بررسی دوره‌های خریداری‌شده:", error);

            setIsPurchased(
              course.isFree || Number(course.price) === 0
                ? localPurchased
                : false
            );
          }
        } else {
          setIsPurchased(
            course.isFree || Number(course.price) === 0
              ? localPurchased
              : false
          );
        }
      } catch (error) {
        console.error("خطا در دریافت دوره:", error);
        navigate("/courses");
      }
    };

    loadCourse();
  }, [id, navigate]);

  const handlePurchase = () => {
    if (!course) return;

    const token = localStorage.getItem("auth_token");
    const currentUser = localStorage.getItem("currentUser");

    if (!token || !currentUser) {
      alert("🔐 ابتدا وارد حساب کاربری خود شوید.");
      navigate("/login");
      return;
    }

    if (course.isFree || Number(course.price) === 0) {
      const updated = [
        ...myCourses.filter((c) => String(c.id) !== String(course.id)),
        course,
      ];

      localStorage.setItem(
        "mohandesino_my_courses",
        JSON.stringify(updated)
      );

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
      </div>
    </main>
  );
}

export default Course;