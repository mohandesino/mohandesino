import { useEffect, useState } from "react";
import { API_BASE } from "../config.js";
import "../admin-new.css";

function AdminNew() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false);
  const [error, setError] = useState("");
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "",
    level: "مقدماتی",
    price: "",
    image: "",
    description: "",
    is_free: true,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/courses`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در دریافت دوره‌ها");
      }

      setCourses(data.courses || []);
    } catch (err) {
      setError(err.message || "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const openCourse = async (courseId) => {
    try {
      setCourseLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/courses/${courseId}/full`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "خطا در دریافت دوره");
      }

      setSelectedCourse({
        ...data.course,
        chapters: data.chapters || [],
      });
    } catch (err) {
      setError(err.message || "خطا در دریافت دوره");
    } finally {
      setCourseLoading(false);
    }
  };

  const closeCourse = () => {
    setSelectedCourse(null);
    setError("");
  };

  const createCourse = async () => {
    if (!courseForm.title.trim()) {
      setError("عنوان دوره را وارد کنید.");
      return;
    }

    if (!courseForm.is_free && (!courseForm.price || Number(courseForm.price) <= 0)) {
      setError("برای دوره پولی، قیمت معتبر وارد کنید.");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_BASE}/api/admin/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: courseForm.title.trim(),
          category: courseForm.category.trim(),
          level: courseForm.level,
          price: courseForm.is_free ? 0 : Number(courseForm.price),
          is_free: courseForm.is_free ? 1 : 0,
          image: courseForm.image.trim(),
          description: courseForm.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "ایجاد دوره انجام نشد.");
      }

      setCourseForm({
        title: "",
        category: "",
        level: "مقدماتی",
        price: "",
        image: "",
        description: "",
        is_free: true,
      });

      setShowCourseForm(false);
      await loadCourses();
    } catch (err) {
      setError(err.message || "خطا در ایجاد دوره");
    }
  };

  const addChapter = async () => {
    if (!selectedCourse?.id) {
      setError("دوره‌ای برای افزودن فصل انتخاب نشده است.");
      return;
    }

    if (!chapterTitle.trim()) {
      setError("عنوان فصل را وارد کنید.");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_BASE}/api/chapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: selectedCourse.id,
          title: chapterTitle.trim(),
          sort_order: (selectedCourse.chapters?.length || 0) + 1,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "ذخیره فصل انجام نشد.");
      }

      setChapterTitle("");
      setShowChapterForm(false);

      await openCourse(selectedCourse.id);
    } catch (err) {
      setError(err.message || "خطا در ذخیره فصل");
    }
  };

  const menuTitle = {
    dashboard: "داشبورد",
    courses: "دوره‌ها",
    users: "کاربران",
    orders: "سفارش‌ها",
    settings: "تنظیمات",
  };

  return (
    <main className="admin-new-page" dir="rtl">
      <aside className="admin-new-sidebar">
        <div className="admin-new-brand">
          <div className="admin-new-logo">🎓</div>

          <div>
            <strong>مهندسینو</strong>
            <span>پنل مدیریت</span>
          </div>
        </div>

        <nav className="admin-new-nav">
          {[
            ["dashboard", "📊 داشبورد"],
            ["courses", "📚 دوره‌ها"],
            ["users", "👤 کاربران"],
            ["orders", "🛒 سفارش‌ها"],
            ["settings", "⚙️ تنظیمات"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={activeMenu === key ? "active" : ""}
              onClick={() => {
                setActiveMenu(key);
                setSelectedCourse(null);
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="admin-new-content">
        <header className="admin-new-topbar">
          <div>
            <span>پنل مدیریت</span>
            <h1>
              {selectedCourse
                ? selectedCourse.title
                : menuTitle[activeMenu]}
            </h1>
          </div>

          <div className="admin-new-user">
            <span>مدیر مهندسینو</span>
            <div>👤</div>
          </div>
        </header>

        <div className="admin-new-body">

          {error && (
            <div className="admin-new-error">
              ❌ {error}
            </div>
          )}

          {/* ================= دوره انتخاب شده ================= */}

          {selectedCourse ? (
            <div className="admin-new-panel">

              <div className="admin-new-panel-header">
                <div>
                  <span>مدیریت دوره</span>
                  <h2>{selectedCourse.title}</h2>
                </div>

                <button
                  type="button"
                  className="admin-new-secondary-btn"
                  onClick={closeCourse}
                >
                  ← بازگشت به دوره‌ها
                </button>
              </div>

              <div className="admin-new-course-detail">

                <div className="admin-new-detail-card">
                  <span>دسته‌بندی</span>
                  <strong>
                    {selectedCourse.category || "بدون دسته‌بندی"}
                  </strong>
                </div>

                <div className="admin-new-detail-card">
                  <span>سطح</span>
                  <strong>
                    {selectedCourse.level || "نامشخص"}
                  </strong>
                </div>

                <div className="admin-new-detail-card">
                  <span>وضعیت</span>
                  <strong>
                    {Boolean(selectedCourse.is_free)
                      ? "رایگان"
                      : "دوره پولی"}
                  </strong>
                </div>

                <div className="admin-new-detail-card">
                  <span>تعداد فصل‌ها</span>
                  <strong>
                    {selectedCourse.chapters?.length || 0}
                  </strong>
                </div>

              </div>

              <div className="admin-new-course-description">
                <span>توضیحات دوره</span>
                <p>
                  {selectedCourse.description ||
                    "برای این دوره توضیحاتی ثبت نشده است."}
                </p>
              </div>

              <div className="admin-new-content-section">

                <div className="admin-new-content-section-header">
                  <div>
                    <span>ساختار آموزشی</span>
                    <h3>فصل‌ها و درس‌ها</h3>
                  </div>

                  <button
                    type="button"
                    className="admin-new-primary-btn"
                    onClick={() => setShowChapterForm((value) => !value)}
                  >
                    {showChapterForm ? "بستن فرم" : "+ افزودن فصل"}
                  </button>
                </div>

                {showChapterForm && (
                  <div className="admin-new-chapter-form">
                    <div className="admin-new-form-group">
                      <label htmlFor="chapter-title">عنوان فصل</label>
                      <input
                        id="chapter-title"
                        type="text"
                        value={chapterTitle}
                        onChange={(event) => setChapterTitle(event.target.value)}
                        placeholder="مثلاً: مفاهیم پایه"
                      />
                    </div>

                    <div className="admin-new-form-actions">
                      <button
                        type="button"
                        className="admin-new-primary-btn"
                        onClick={addChapter}
                      >
                        ذخیره فصل
                      </button>

                      <button
                        type="button"
                        className="admin-new-secondary-btn"
                        onClick={() => {
                          setShowChapterForm(false);
                          setChapterTitle("");
                        }}
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                )}

                {courseLoading ? (
                  <div className="admin-new-empty">
                    <div>⏳</div>
                    <h3>در حال دریافت اطلاعات دوره...</h3>
                  </div>
                ) : selectedCourse.chapters?.length === 0 ? (
                  <div className="admin-new-empty">
                    <div>📖</div>
                    <h3>هنوز فصلی برای این دوره ایجاد نشده</h3>
                    <p>
                      برای شروع، اولین فصل دوره را ایجاد کنید.
                    </p>
                  </div>
                ) : (
                  <div className="admin-new-chapters">

                    {selectedCourse.chapters.map((chapter, index) => (
                      <div
                        className="admin-new-chapter"
                        key={chapter.id}
                      >
                        <div className="admin-new-chapter-header">

                          <div className="admin-new-chapter-title">
                            <span>
                              فصل {index + 1}
                            </span>

                            <strong>
                              {chapter.title}
                            </strong>
                          </div>

                          <div className="admin-new-chapter-meta">
                            {chapter.lessons?.length || 0} درس
                          </div>

                        </div>

                        {chapter.lessons?.length > 0 && (
                          <div className="admin-new-lessons">

                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <div
                                className="admin-new-lesson"
                                key={lesson.id}
                              >
                                <div className="admin-new-lesson-number">
                                  {lessonIndex + 1}
                                </div>

                                <div className="admin-new-lesson-info">
                                  <strong>
                                    {lesson.title}
                                  </strong>

                                  <span>
                                    {lesson.duration || "مدت نامشخص"}
                                    {" · "}
                                    {Boolean(lesson.free)
                                      ? "رایگان"
                                      : "پولی"}
                                  </span>
                                </div>
                              </div>
                            ))}

                          </div>
                        )}

                      </div>
                    ))}

                  </div>
                )}

              </div>

            </div>
          ) : (
            <>
              {/* ================= داشبورد ================= */}

              {activeMenu === "dashboard" && (
                <>
                  <div className="admin-new-welcome">
                    <div>
                      <span>خوش آمدید 👋</span>
                      <h2>مدیریت مهندسینو</h2>
                      <p>
                        دوره‌ها، فصل‌ها و درس‌های آموزشی را از اینجا مدیریت کنید.
                      </p>
                    </div>
                  </div>

                  <div className="admin-new-stats">

                    <div className="admin-new-stat-card">
                      <span>📚</span>
                      <div>
                        <small>دوره‌ها</small>
                        <strong>
                          {loading ? "…" : courses.length}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-new-stat-card">
                      <span>👤</span>
                      <div>
                        <small>کاربران</small>
                        <strong>—</strong>
                      </div>
                    </div>

                    <div className="admin-new-stat-card">
                      <span>🛒</span>
                      <div>
                        <small>سفارش‌ها</small>
                        <strong>—</strong>
                      </div>
                    </div>

                  </div>

                  <div className="admin-new-panel">

                    <div className="admin-new-panel-header">
                      <div>
                        <span>محتوای آموزشی</span>
                        <h2>دوره‌های اخیر</h2>
                      </div>

                      <button
                        type="button"
                        className="admin-new-primary-btn"
                        onClick={() => setActiveMenu("courses")}
                      >
                        مشاهده دوره‌ها
                      </button>
                    </div>

                    {loading ? (
                      <div className="admin-new-empty">
                        <div>⏳</div>
                        <h3>در حال دریافت دوره‌ها...</h3>
                      </div>
                    ) : (
                      <div className="admin-new-course-list">

                        {courses.map((item) => (
                          <div
                            className="admin-new-course-row"
                            key={item.id}
                          >
                            <div className="admin-new-course-icon">
                              📚
                            </div>

                            <div className="admin-new-course-info">
                              <strong>{item.title}</strong>
                              <span>
                                {item.category || "بدون دسته‌بندی"}
                              </span>
                            </div>

                            <div className="admin-new-course-price">
                              {Boolean(item.is_free)
                                ? "رایگان"
                                : `${Number(
                                    item.price || 0
                                  ).toLocaleString("fa-IR")} تومان`}
                            </div>

                            <button
                              type="button"
                              className="admin-new-secondary-btn"
                              onClick={() => openCourse(item.id)}
                            >
                              مدیریت
                            </button>
                          </div>
                        ))}

                      </div>
                    )}

                  </div>
                </>
              )}

              {/* ================= دوره‌ها ================= */}

              {activeMenu === "courses" && (
                <div className="admin-new-panel">

                  <div className="admin-new-panel-header">
                    <div>
                      <span>مدیریت محتوا</span>
                      <h2>دوره‌های آموزشی</h2>
                    </div>

                    <button
                      type="button"
                      className="admin-new-primary-btn"
                      onClick={() => setShowCourseForm((value) => !value)}
                    >
                      {showCourseForm ? "بستن فرم" : "+ ایجاد دوره جدید"}
                    </button>
                  </div>

                  {showCourseForm && (
                    <div className="admin-new-course-form">
                      <div className="admin-new-form-grid">
                        <div className="admin-new-form-group">
                          <label>عنوان دوره</label>
                          <input
                            type="text"
                            value={courseForm.title}
                            onChange={(event) =>
                              setCourseForm({
                                ...courseForm,
                                title: event.target.value,
                              })
                            }
                            placeholder="مثلاً آموزش اکسل برای مهندسی صنایع"
                          />
                        </div>

                        <div className="admin-new-form-group">
                          <label>دسته‌بندی</label>
                          <input
                            type="text"
                            value={courseForm.category}
                            onChange={(event) =>
                              setCourseForm({
                                ...courseForm,
                                category: event.target.value,
                              })
                            }
                            placeholder="مثلاً مهندسی صنایع"
                          />
                        </div>

                        <div className="admin-new-form-group">
                          <label>سطح دوره</label>
                          <select
                            value={courseForm.level}
                            onChange={(event) =>
                              setCourseForm({
                                ...courseForm,
                                level: event.target.value,
                              })
                            }
                          >
                            <option value="مقدماتی">مقدماتی</option>
                            <option value="متوسط">متوسط</option>
                            <option value="پیشرفته">پیشرفته</option>
                          </select>
                        </div>

                        <div className="admin-new-form-group">
                          <label>قیمت (تومان)</label>
                          <input
                            type="number"
                            value={courseForm.price}
                            disabled={courseForm.is_free}
                            onChange={(event) =>
                              setCourseForm({
                                ...courseForm,
                                price: event.target.value,
                              })
                            }
                            placeholder="مثلاً 399000"
                          />
                        </div>

                        <div className="admin-new-form-group admin-new-form-full">
                          <label>لینک تصویر دوره</label>
                          <input
                            type="text"
                            value={courseForm.image}
                            onChange={(event) =>
                              setCourseForm({
                                ...courseForm,
                                image: event.target.value,
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>

                        <div className="admin-new-form-group admin-new-form-full">
                          <label>توضیحات دوره</label>
                          <textarea
                            value={courseForm.description}
                            onChange={(event) =>
                              setCourseForm({
                                ...courseForm,
                                description: event.target.value,
                              })
                            }
                            placeholder="توضیح کوتاهی درباره محتوای دوره..."
                            rows="5"
                          />
                        </div>

                        <label className="admin-new-checkbox">
                          <input
                            type="checkbox"
                            checked={courseForm.is_free}
                            onChange={(event) =>
                              setCourseForm({
                                ...courseForm,
                                is_free: event.target.checked,
                                price: event.target.checked
                                  ? ""
                                  : courseForm.price,
                              })
                            }
                          />
                          <span>این دوره رایگان است</span>
                        </label>
                      </div>

                      <div className="admin-new-form-actions">
                        <button
                          type="button"
                          className="admin-new-primary-btn"
                          onClick={createCourse}
                        >
                          ایجاد دوره
                        </button>

                        <button
                          type="button"
                          className="admin-new-secondary-btn"
                          onClick={() => {
                            setShowCourseForm(false);
                            setCourseForm({
                              title: "",
                              category: "",
                              level: "مقدماتی",
                              price: "",
                              image: "",
                              description: "",
                              is_free: true,
                            });
                          }}
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  )}

                  {loading ? (
                    <div className="admin-new-empty">
                      <div>⏳</div>
                      <h3>در حال دریافت دوره‌ها...</h3>
                    </div>
                  ) : (
                    <div className="admin-new-course-list">

                      {courses.map((item) => (
                        <div
                          className="admin-new-course-row"
                          key={item.id}
                        >
                          <div className="admin-new-course-icon">
                            📚
                          </div>

                          <div className="admin-new-course-info">
                            <strong>{item.title}</strong>
                            <span>
                              {item.category || "بدون دسته‌بندی"}
                            </span>
                          </div>

                          <div className="admin-new-course-price">
                            {Boolean(item.is_free)
                              ? "رایگان"
                              : `${Number(
                                  item.price || 0
                                ).toLocaleString("fa-IR")} تومان`}
                          </div>

                          <button
                            type="button"
                            className="admin-new-secondary-btn"
                            onClick={() => openCourse(item.id)}
                          >
                            مدیریت
                          </button>
                        </div>
                      ))}

                    </div>
                  )}

                </div>
              )}

              {/* ================= سایر بخش‌ها ================= */}

              {activeMenu !== "dashboard" &&
                activeMenu !== "courses" && (
                  <div className="admin-new-panel">
                    <div className="admin-new-empty">
                      <div>🚧</div>
                      <h3>این بخش در حال آماده‌سازی است</h3>
                      <p>
                        فعلاً روی مدیریت دوره‌ها تمرکز می‌کنیم.
                      </p>
                    </div>
                  </div>
                )}
            </>
          )}

        </div>
      </section>
    </main>
  );
}

export default AdminNew;
