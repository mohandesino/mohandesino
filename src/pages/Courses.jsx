import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config.js";

const Icon = ({ children }) => (
  <span className="courses-icon" aria-hidden="true">
    {children}
  </span>
);

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/courses`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "خطا در دریافت دوره‌ها");
        }

        setCourses(data.courses || []);
      } catch (err) {
        console.error("Courses load error:", err);
        setError("دریافت دوره‌ها با مشکل مواجه شد.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const categories = useMemo(
    () => ["همه", ...new Set(courses.map((c) => c.category).filter(Boolean))],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();

    return courses.filter((course) => {
      const categoryMatch =
        category === "همه" || course.category === category;

      const text = [
        course.title,
        course.description,
        course.category,
        course.level,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return categoryMatch && (!q || text.includes(q));
    });
  }, [courses, search, category]);

  const formatPrice = (value) =>
    new Intl.NumberFormat("fa-IR").format(Number(value || 0));

  if (loading) {
    return (
      <main className="courses-page courses-state" dir="rtl">
        <div className="courses-state-card">
          <div className="courses-loader" />
          <h2>در حال آماده‌سازی دوره‌ها</h2>
          <p>لطفاً چند لحظه صبر کنید...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="courses-page courses-state" dir="rtl">
        <div className="courses-state-card">
          <div className="courses-state-icon">!</div>
          <h2>خطا در دریافت اطلاعات</h2>
          <p>{error}</p>
          <button
            className="courses-retry"
            onClick={() => window.location.reload()}
          >
            تلاش مجدد
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="courses-page" dir="rtl">
      <section className="courses-hero">
        <div className="courses-hero-glow courses-hero-glow-one" />
        <div className="courses-hero-glow courses-hero-glow-two" />

        <div className="page-container courses-hero-content">
          <div className="courses-badge">
            🎓 آموزش ساده و کاربردی
          </div>

          <h1>
            دوره‌های آموزشی <span>مهندسینو</span>
          </h1>

          <p>
            مسیر یادگیری مناسب خودت را انتخاب کن و مهارت‌هایت را
            قدم‌به‌قدم توسعه بده.
          </p>

          <div className="courses-hero-stats">
            <div>
              <strong>{courses.length.toLocaleString("fa-IR")}</strong>
              <span>دوره آموزشی</span>
            </div>

            <div>
              <strong>۲۴/۷</strong>
              <span>دسترسی آنلاین</span>
            </div>

            <div>
              <strong>🎯</strong>
              <span>یادگیری هدفمند</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container courses-catalog">
        <div className="courses-heading">
          <div>
            <span>📚 کتابخانه آموزشی</span>
            <h2>همه دوره‌ها</h2>
            <p>دوره موردنظرت را پیدا کن و یادگیری را شروع کن.</p>
          </div>

          <div className="courses-count">
            <strong>
              {filteredCourses.length.toLocaleString("fa-IR")}
            </strong>
            <span>دوره</span>
          </div>
        </div>

        <div className="courses-toolbar">
          <div className="courses-search">
            <Icon>⌕</Icon>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی دوره، موضوع یا مهارت..."
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="پاک کردن جستجو"
              >
                ×
              </button>
            )}
          </div>

          <div className="courses-filters">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="courses-empty">
            <div>🔎</div>
            <h3>دوره‌ای پیدا نشد</h3>
            <p>عبارت جستجو یا دسته‌بندی دیگری را امتحان کنید.</p>
            {(search || category !== "همه") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("همه");
                }}
              >
                نمایش همه دوره‌ها
              </button>
            )}
          </div>
        ) : (
          <div className="course-grid courses-grid">
            {filteredCourses.map((course) => {
              const isFree =
                Boolean(course.is_free) ||
                Boolean(course.isFree) ||
                Number(course.price || 0) === 0;

              const lessons = (course.chapters || []).reduce(
                (total, chapter) =>
                  total + (chapter.lessons || []).length,
                0
              );

              return (
                <article className="home-course-card" key={course.id}>
                  <Link
                    to={`/course/${course.id}`}
                    className="course-thumbnail courses-thumbnail"
                  >
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title || "دوره مهندسینو"}
                      />
                    ) : (
                      <span className="course-thumbnail-icon">
                        {isFree ? "📚" : "💎"}
                      </span>
                    )}

                    <span
                      className={
                        isFree ? "free-badge" : "paid-badge"
                      }
                    >
                      {isFree ? "رایگان" : "پولی"}
                    </span>
                  </Link>

                  <div className="course-card-body">
                    <div className="courses-card-meta">
                      <span className="course-category">
                        {course.category || "آموزشی"}
                      </span>

                      {lessons > 0 && (
                        <span>{lessons.toLocaleString("fa-IR")} درس</span>
                      )}
                    </div>

                    <h3>
                      <Link to={`/course/${course.id}`}>
                        {course.title || "دوره آموزشی مهندسینو"}
                      </Link>
                    </h3>

                    <p>
                      {course.description ||
                        "یک مسیر آموزشی کاربردی برای یادگیری بهتر و رسیدن به مهارت."}
                    </p>

                    <div className="course-card-bottom">
                      <span>{course.level || "مقدماتی"}</span>
                      <strong>
                        {isFree
                          ? "رایگان"
                          : `${formatPrice(course.price)} تومان`}
                      </strong>
                    </div>

                    <Link
                      to={`/course/${course.id}`}
                      className="course-view-button"
                    >
                      مشاهده دوره ←
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
