import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import "../admin-new.css";

const TOKEN_KEY = "mohandesino_admin_token";
const USER_KEY = "mohandesino_admin_user";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString("fa-IR");
}

function AdminNew() {
  const [token, setToken] = useState(getToken());
  const [admin, setAdmin] = useState(getSavedUser());

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [section, setSection] = useState("dashboard");

  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "سایر",
    level: "مقدماتی",
    price: "",
    is_free: true,
    image: "",
    description: "",
  });

  const [editingCourseId, setEditingCourseId] = useState(null);

  const [chapterTitle, setChapterTitle] = useState("");
  const [editingChapterId, setEditingChapterId] = useState(null);

  const [lessonForm, setLessonForm] = useState({
    chapter_id: "",
    title: "",
    video: "",
    free: false,
    duration: "",
    description: "",
  });

  const [editingLessonId, setEditingLessonId] = useState(null);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || getToken()}`,
  });

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/api/admin/logout`, {
          method: "POST",
          headers: authHeaders(),
        });
      }
    } catch {}

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setAdmin(null);
    setSelectedCourse(null);
    setSection("dashboard");
  };

  const api = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token || getToken()}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      await logout();
      throw new Error("جلسه مدیریت منقضی شده است.");
    }

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "خطا در ارتباط با سرور");
    }

    return data;
  };

  const login = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: loginPhone.trim(),
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "ورود ناموفق بود");
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      setToken(data.token);
      setAdmin(data.user);
      setLoginPassword("");
      setMessage("ورود با موفقیت انجام شد.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const data = await api(`${API_BASE}/api/admin/dashboard`);
      setDashboard(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await api(`${API_BASE}/api/admin/courses`);
      setCourses(data.courses || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const openCourse = async (courseId) => {
    setLoading(true);

    try {
      const data = await api(`${API_BASE}/api/courses/${courseId}/full`);
      setSelectedCourse(data);
      setSection("courses");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      category: "سایر",
      level: "مقدماتی",
      price: "",
      is_free: true,
      image: "",
      description: "",
    });
    setEditingCourseId(null);
  };

  const editCourse = (course) => {
    setCourseForm({
      title: course.title || "",
      category: course.category || "سایر",
      level: course.level || "مقدماتی",
      price: course.price || "",
      is_free: Boolean(course.is_free),
      image: course.image || "",
      description: course.description || "",
    });

    setEditingCourseId(course.id);
    setSelectedCourse(null);
    setSection("courses");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveCourse = async () => {
    if (!courseForm.title.trim()) {
      setMessage("نام دوره را وارد کنید.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const body = {
        title: courseForm.title.trim(),
        category: courseForm.category,
        level: courseForm.level,
        price: Number(courseForm.price || 0),
        is_free: courseForm.is_free ? 1 : 0,
        image: courseForm.image.trim(),
        description: courseForm.description.trim(),
      };

      if (editingCourseId) {
        await api(`${API_BASE}/api/admin/courses/${editingCourseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        setMessage("دوره با موفقیت ویرایش شد.");
      } else {
        await api(`${API_BASE}/api/admin/courses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        setMessage("دوره جدید ایجاد شد.");
      }

      resetCourseForm();
      await loadCourses();
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("این دوره و تمام فصل‌ها و درس‌های آن حذف می‌شوند. ادامه می‌دهید؟")) {
      return;
    }

    setLoading(true);

    try {
      await api(`${API_BASE}/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });

      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }

      setMessage("دوره حذف شد.");
      await loadCourses();
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveChapter = async () => {
    if (!selectedCourse) return;

    if (!chapterTitle.trim()) {
      setMessage("نام فصل را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      if (editingChapterId) {
        await api(`${API_BASE}/api/chapters/${editingChapterId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: chapterTitle.trim(),
          }),
        });

        setMessage("فصل ویرایش شد.");
      } else {
        await api(`${API_BASE}/api/chapters`, {
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

        setMessage("فصل اضافه شد.");
      }

      setChapterTitle("");
      setEditingChapterId(null);
      await openCourse(selectedCourse.id);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editChapter = (chapter) => {
    setChapterTitle(chapter.title || "");
    setEditingChapterId(chapter.id);
  };

  const deleteChapter = async (chapterId) => {
    if (!window.confirm("این فصل و درس‌های آن حذف می‌شوند. ادامه می‌دهید؟")) {
      return;
    }

    setLoading(true);

    try {
      await api(`${API_BASE}/api/chapters/${chapterId}`, {
        method: "DELETE",
      });

      setMessage("فصل حذف شد.");
      await openCourse(selectedCourse.id);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetLessonForm = () => {
    setLessonForm({
      chapter_id: "",
      title: "",
      video: "",
      free: false,
      duration: "",
      description: "",
    });
    setEditingLessonId(null);
  };

  const editLesson = (lesson, chapterId) => {
    setLessonForm({
      chapter_id: chapterId,
      title: lesson.title || "",
      video: lesson.video || "",
      free: Boolean(lesson.free),
      duration: lesson.duration || "",
      description: lesson.description || "",
    });

    setEditingLessonId(lesson.id);
  };

  const saveLesson = async () => {
    if (!lessonForm.chapter_id) {
      setMessage("فصل درس را انتخاب کنید.");
      return;
    }

    if (!lessonForm.title.trim()) {
      setMessage("نام درس را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      const body = {
        chapter_id: Number(lessonForm.chapter_id),
        title: lessonForm.title.trim(),
        video: lessonForm.video.trim(),
        free: lessonForm.free ? 1 : 0,
        duration: lessonForm.duration.trim(),
        description: lessonForm.description.trim(),
      };

      if (editingLessonId) {
        await api(`${API_BASE}/api/lessons/${editingLessonId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        setMessage("درس ویرایش شد.");
      } else {
        await api(`${API_BASE}/api/lessons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        setMessage("درس اضافه شد.");
      }

      resetLessonForm();
      await openCourse(selectedCourse.id);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm("این درس حذف شود؟")) {
      return;
    }

    setLoading(true);

    try {
      await api(`${API_BASE}/api/lessons/${lessonId}`, {
        method: "DELETE",
      });

      setMessage("درس حذف شد.");
      await openCourse(selectedCourse.id);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    loadDashboard();
    loadCourses();
  }, [token]);

  if (!token) {
    return (
      <div className="admin-new-page">
        <div className="admin-new-login">
          <div className="admin-new-login-logo">مهندسینو</div>

          <h1>ورود مدیریت</h1>
          <p>برای ورود به پنل مدیریت اطلاعات مدیر را وارد کنید.</p>

          <form onSubmit={login}>
            <label>شماره موبایل</label>
            <input
              type="tel"
              dir="ltr"
              placeholder="09123456789"
              value={loginPhone}
              onChange={(e) => setLoginPhone(e.target.value)}
            />

            <label>رمز عبور</label>
            <input
              type="password"
              dir="ltr"
              placeholder="رمز عبور"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            {message && <div className="admin-new-message">{message}</div>}

            <button type="submit" disabled={loading}>
              {loading ? "در حال ورود..." : "ورود به پنل"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-new-page" dir="rtl">
      <aside className="admin-new-sidebar">
        <div className="admin-new-brand">
          <strong>مهندسینو</strong>
          <span>پنل مدیریت</span>
        </div>

        <nav>
          <button
            className={section === "dashboard" ? "active" : ""}
            onClick={() => {
              setSection("dashboard");
              setSelectedCourse(null);
              loadDashboard();
            }}
          >
            داشبورد
          </button>

          <button
            className={section === "courses" ? "active" : ""}
            onClick={() => {
              setSection("courses");
              setSelectedCourse(null);
              loadCourses();
            }}
          >
            دوره‌ها
          </button>

          <button
            className={section === "users" ? "active" : ""}
            onClick={() => setSection("users")}
          >
            کاربران
          </button>

          <button
            className={section === "orders" ? "active" : ""}
            onClick={() => setSection("orders")}
          >
            سفارش‌ها
          </button>
        </nav>

        <div className="admin-new-sidebar-bottom">
          <div className="admin-new-admin-name">
            {admin?.name || "مدیر"}
          </div>

          <button onClick={logout}>خروج</button>
        </div>
      </aside>

      <main className="admin-new-main">
        <header className="admin-new-header">
          <div>
            <h1>
              {section === "dashboard" && "داشبورد"}
              {section === "courses" && "مدیریت دوره‌ها"}
              {section === "users" && "کاربران"}
              {section === "orders" && "سفارش‌ها"}
            </h1>

            <span>مدیریت محتوای مهندسینو</span>
          </div>

          {loading && <div className="admin-new-loading">در حال پردازش...</div>}
        </header>

        {message && (
          <div className="admin-new-message admin-new-message-top">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {section === "dashboard" && (
          <section className="admin-new-section">
            <div className="admin-new-stats">
              <div className="admin-new-stat">
                <span>دوره‌ها</span>
                <strong>{dashboard?.courses ?? "—"}</strong>
              </div>

              <div className="admin-new-stat">
                <span>کاربران</span>
                <strong>{dashboard?.users ?? "—"}</strong>
              </div>

              <div className="admin-new-stat">
                <span>سفارش‌ها</span>
                <strong>{dashboard?.orders ?? "—"}</strong>
              </div>

              <div className="admin-new-stat">
                <span>فروش</span>
                <strong>
                  {dashboard?.sales != null
                    ? `${formatPrice(dashboard.sales)} تومان`
                    : "—"}
                </strong>
              </div>
            </div>

            <div className="admin-new-card">
              <div className="admin-new-card-head">
                <div>
                  <h2>دسترسی سریع</h2>
                  <p>مدیریت محتوای آموزشی از همین بخش انجام می‌شود.</p>
                </div>

                <button
                  className="admin-new-primary"
                  onClick={() => setSection("courses")}
                >
                  مدیریت دوره‌ها
                </button>
              </div>
            </div>
          </section>
        )}

        {section === "courses" && !selectedCourse && (
          <section className="admin-new-section">
            <div className="admin-new-card">
              <div className="admin-new-card-head">
                <div>
                  <h2>{editingCourseId ? "ویرایش دوره" : "ایجاد دوره جدید"}</h2>
                  <p>
                    اطلاعات اصلی دوره را وارد کنید.
                  </p>
                </div>

                {editingCourseId && (
                  <button
                    className="admin-new-secondary"
                    onClick={resetCourseForm}
                  >
                    لغو ویرایش
                  </button>
                )}
              </div>

              <div className="admin-new-form-grid">
                <div>
                  <label>عنوان دوره</label>
                  <input
                    value={courseForm.title}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="مثلاً ریاضی ۱"
                  />
                </div>

                <div>
                  <label>دسته‌بندی</label>
                  <input
                    value={courseForm.category}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        category: e.target.value,
                      })
                    }
                    placeholder="مهندسی"
                  />
                </div>

                <div>
                  <label>سطح</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        level: e.target.value,
                      })
                    }
                  >
                    <option value="مقدماتی">مقدماتی</option>
                    <option value="متوسط">متوسط</option>
                    <option value="پیشرفته">پیشرفته</option>
                  </select>
                </div>

                <div>
                  <label>قیمت</label>
                  <input
                    type="number"
                    min="0"
                    value={courseForm.price}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        price: e.target.value,
                      })
                    }
                    placeholder="تومان"
                    disabled={courseForm.is_free}
                  />
                </div>

                <div className="admin-new-full">
                  <label>آدرس تصویر</label>
                  <input
                    value={courseForm.image}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="admin-new-full">
                  <label>توضیحات</label>
                  <textarea
                    rows="4"
                    value={courseForm.description}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="توضیحات کوتاه دوره..."
                  />
                </div>

                <label className="admin-new-check">
                  <input
                    type="checkbox"
                    checked={courseForm.is_free}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        is_free: e.target.checked,
                      })
                    }
                  />
                  دوره رایگان است
                </label>
              </div>

              <button
                className="admin-new-primary"
                onClick={saveCourse}
                disabled={loading}
              >
                {editingCourseId ? "ذخیره تغییرات" : "ایجاد دوره"}
              </button>
            </div>

            <div className="admin-new-card">
              <div className="admin-new-card-head">
                <div>
                  <h2>دوره‌ها</h2>
                  <p>{courses.length} دوره در سیستم</p>
                </div>
              </div>

              {courses.length === 0 ? (
                <div className="admin-new-empty">
                  هنوز دوره‌ای ثبت نشده است.
                </div>
              ) : (
                <div className="admin-new-course-list">
                  {courses.map((course) => (
                    <div className="admin-new-course-row" key={course.id}>
                      <div
                        className="admin-new-course-main"
                        onClick={() => openCourse(course.id)}
                      >
                        <div className="admin-new-course-icon">📚</div>

                        <div>
                          <strong>{course.title}</strong>
                          <span>
                            {course.category || "سایر"} ·{" "}
                            {course.is_free
                              ? "رایگان"
                              : `${formatPrice(course.price)} تومان`}
                          </span>
                        </div>
                      </div>

                      <div className="admin-new-course-actions">
                        <button
                          className="admin-new-secondary"
                          onClick={() => openCourse(course.id)}
                        >
                          مدیریت
                        </button>

                        <button
                          className="admin-new-secondary"
                          onClick={() => editCourse(course)}
                        >
                          ویرایش
                        </button>

                        <button
                          className="admin-new-danger"
                          onClick={() => deleteCourse(course.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {section === "courses" && selectedCourse && (
          <section className="admin-new-section">
            <div className="admin-new-card">
              <div className="admin-new-card-head">
                <div>
                  <button
                    className="admin-new-back"
                    onClick={() => {
                      setSelectedCourse(null);
                      resetLessonForm();
                    }}
                  >
                    ← بازگشت به دوره‌ها
                  </button>

                  <h2>{selectedCourse.title}</h2>

                  <p>
                    {selectedCourse.category || "سایر"} ·{" "}
                    {selectedCourse.is_free
                      ? "رایگان"
                      : `${formatPrice(selectedCourse.price)} تومان`}
                  </p>
                </div>

                <button
                  className="admin-new-secondary"
                  onClick={() => {
                    const course = courses.find(
                      (item) => item.id === selectedCourse.id
                    );

                    if (course) editCourse(course);
                  }}
                >
                  ویرایش دوره
                </button>
              </div>
            </div>

            <div className="admin-new-card">
              <div className="admin-new-card-head">
                <div>
                  <h2>
                    {editingChapterId ? "ویرایش فصل" : "افزودن فصل"}
                  </h2>
                  <p>فصل‌های دوره را مدیریت کنید.</p>
                </div>

                {editingChapterId && (
                  <button
                    className="admin-new-secondary"
                    onClick={() => {
                      setEditingChapterId(null);
                      setChapterTitle("");
                    }}
                  >
                    لغو
                  </button>
                )}
              </div>

              <div className="admin-new-inline-form">
                <input
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="نام فصل"
                />

                <button
                  className="admin-new-primary"
                  onClick={saveChapter}
                  disabled={loading}
                >
                  {editingChapterId ? "ذخیره فصل" : "افزودن فصل"}
                </button>
              </div>
            </div>

            <div className="admin-new-card">
              <div className="admin-new-card-head">
                <div>
                  <h2>فصل‌ها و درس‌ها</h2>
                  <p>
                    {selectedCourse.chapters?.length || 0} فصل
                  </p>
                </div>
              </div>

              {selectedCourse.chapters?.length === 0 ? (
                <div className="admin-new-empty">
                  هنوز فصلی برای این دوره ساخته نشده است.
                </div>
              ) : (
                <div className="admin-new-chapters">
                  {selectedCourse.chapters.map((chapter, index) => (
                    <div className="admin-new-chapter" key={chapter.id}>
                      <div className="admin-new-chapter-head">
                        <div>
                          <span className="admin-new-number">{index + 1}</span>
                          <strong>{chapter.title}</strong>
                          <small>
                            {chapter.lessons?.length || 0} درس
                          </small>
                        </div>

                        <div className="admin-new-course-actions">
                          <button
                            className="admin-new-secondary"
                            onClick={() => editChapter(chapter)}
                          >
                            ویرایش
                          </button>

                          <button
                            className="admin-new-danger"
                            onClick={() => deleteChapter(chapter.id)}
                          >
                            حذف
                          </button>
                        </div>
                      </div>

                      <div className="admin-new-lessons">
                        {chapter.lessons?.map((lesson, lessonIndex) => (
                          <div
                            className="admin-new-lesson"
                            key={lesson.id}
                          >
                            <div className="admin-new-lesson-number">
                              {lessonIndex + 1}
                            </div>

                            <div className="admin-new-lesson-info">
                              <strong>{lesson.title}</strong>

                              <span>
                                {lesson.duration || "مدت نامشخص"}
                                {Boolean(lesson.free) && " · رایگان"}
                              </span>
                            </div>

                            <div className="admin-new-course-actions">
                              <button
                                className="admin-new-secondary"
                                onClick={() =>
                                  editLesson(lesson, chapter.id)
                                }
                              >
                                ویرایش
                              </button>

                              <button
                                className="admin-new-danger"
                                onClick={() => deleteLesson(lesson.id)}
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}

                        {(!chapter.lessons ||
                          chapter.lessons.length === 0) && (
                          <div className="admin-new-empty-small">
                            این فصل هنوز درسی ندارد.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-new-card">
              <div className="admin-new-card-head">
                <div>
                  <h2>
                    {editingLessonId ? "ویرایش درس" : "افزودن درس"}
                  </h2>
                  <p>محتوای هر درس را ثبت کنید.</p>
                </div>

                {editingLessonId && (
                  <button
                    className="admin-new-secondary"
                    onClick={resetLessonForm}
                  >
                    لغو
                  </button>
                )}
              </div>

              <div className="admin-new-form-grid">
                <div>
                  <label>فصل</label>
                  <select
                    value={lessonForm.chapter_id}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        chapter_id: e.target.value,
                      })
                    }
                  >
                    <option value="">انتخاب فصل</option>

                    {selectedCourse.chapters?.map((chapter) => (
                      <option value={chapter.id} key={chapter.id}>
                        {chapter.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>عنوان درس</label>
                  <input
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="مثلاً تابع و دامنه"
                  />
                </div>

                <div>
                  <label>لینک ویدیو</label>
                  <input
                    dir="ltr"
                    value={lessonForm.video}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        video: e.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label>مدت</label>
                  <input
                    value={lessonForm.duration}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        duration: e.target.value,
                      })
                    }
                    placeholder="مثلاً 18:30"
                  />
                </div>

                <div className="admin-new-full">
                  <label>توضیحات درس</label>
                  <textarea
                    rows="3"
                    value={lessonForm.description}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="توضیحات..."
                  />
                </div>

                <label className="admin-new-check">
                  <input
                    type="checkbox"
                    checked={lessonForm.free}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        free: e.target.checked,
                      })
                    }
                  />
                  این درس رایگان باشد
                </label>
              </div>

              <button
                className="admin-new-primary"
                onClick={saveLesson}
                disabled={loading}
              >
                {editingLessonId ? "ذخیره تغییرات درس" : "افزودن درس"}
              </button>
            </div>
          </section>
        )}

        {section === "users" && (
          <section className="admin-new-section">
            <div className="admin-new-card">
              <h2>کاربران</h2>
              <p className="admin-new-muted">
                بخش مدیریت کاربران در مرحله بعد به API کاربران متصل می‌شود.
              </p>
            </div>
          </section>
        )}

        {section === "orders" && (
          <section className="admin-new-section">
            <div className="admin-new-card">
              <h2>سفارش‌ها</h2>
              <p className="admin-new-muted">
                بخش سفارش‌ها و پرداخت‌ها در مرحله بعد به D1 متصل می‌شود.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminNew;
