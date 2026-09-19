import { API_BASE } from "../config.js";
import { useEffect, useState } from "react";
import AdminBlog from "./AdminBlog";

const emptyCourse = {
  id: "",
  title: "",
  description: "",
  category: "ریاضی",
  level: "مقدماتی",
  price: 0,
  isFree: true,
  image: "",
  chapters: [],
};

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchAdmin, setSearchAdmin] = useState("");

  const [course, setCourse] = useState(emptyCourse);

  const [chapterTitle, setChapterTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [lessonFree, setLessonFree] = useState(false);

  const [activeChapter, setActiveChapter] = useState(null);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState("");

  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState("");
  const [editingLessonVideo, setEditingLessonVideo] = useState("");
  const [editingLessonFree, setEditingLessonFree] = useState(false);
const [editingLessonDuration, setEditingLessonDuration] = useState("");
const [editingLessonDescription, setEditingLessonDescription] = useState("");
const [editingLessonSortOrder, setEditingLessonSortOrder] = useState(1);

const [lessonDuration, setLessonDuration] = useState("");
const [lessonDescription, setLessonDescription] = useState("");
const [lessonSortOrder, setLessonSortOrder] = useState(1);

  const [settings, setSettings] = useState({
    slogan: "ریاضی و فیزیک را ساده و مفهومی یاد بگیر",
    aboutText: "مهندسینو یک پلتفرم آموزشی برای یادگیری ساده و مفهومی است.",
    teacherTitle: "مدرس و تولیدکننده محتوای آموزشی مهندسینو", // ===== جدید
    telegram: "https://t.me/mohandesino2026",
    instagram: "https://instagram.com/mohandesino",
    email: "info@mohandesino.ir",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸",
    address: "",
    showFaq: true,
  });

  // ===== مدیریت دسته‌بندی‌ها =====
  const [categories, setCategories] = useState(["ریاضی", "فیزیک"]);
  const [newCategory, setNewCategory] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("auth_token");

    if (!token) {
      setError("ابتدا وارد حساب کاربری شوید.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "دسترسی مدیریت ندارید");
        return;
      }

      localStorage.setItem("mohandesino_admin_token", token);
      setIsLoggedIn(true);
      setPassword("");
    } catch (err) {
      setError("ارتباط با سرور برقرار نشد.");
    }
  };

  const adminFetch = async (url, options = {}) => {
    const token = localStorage.getItem("mohandesino_admin_token");

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("mohandesino_admin_token");
      setIsLoggedIn(false);
      setError("نشست مدیریت منقضی یا نامعتبر است. دوباره وارد شوید.");
    }

    return response;
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/courses`)
      .then(res => res.json())
      .then(async data => {
        const list = data.courses || [];
        const full = await Promise.all(list.map(async item => {
          const res = await fetch(`${API_BASE}/api/courses/${item.id}/full`);
          const data = await res.json();
          return data.course || item;
        }));
        setCourses(full.map(item => ({
          ...item,
          isFree: Boolean(item.is_free),
          chapters: (item.chapters || []).map(ch => ({
            ...ch,
            lessons: (ch.lessons || []).map(l => ({
              ...l,
              free: Boolean(l.free)
            }))
          }))
        })));
      })
      .catch(() => setCourses([]));

    const savedSettings = localStorage.getItem("mohandesino_settings");
    if (savedSettings) {
      const data = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...data }));
    } else {
      localStorage.setItem("mohandesino_settings", JSON.stringify(settings));
    }

    const savedCategories = localStorage.getItem("mohandesino_categories");
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      if (parsed.length > 0) setCategories(parsed);
    }
  }, []);

  const saveCourses = (newCourses) => {
    setCourses(newCourses);
    localStorage.setItem("mohandesino_courses", JSON.stringify(newCourses));
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("mohandesino_settings", JSON.stringify(newSettings));
    alert("✅ تنظیمات با موفقیت ذخیره شد!");
  };

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "price" ? value : value)
    }));
  };

  const startNewCourse = () => {
    setEditingId(null);
    setCourse({ ...emptyCourse, id: "" });
    setChapterTitle("");
    setLessonTitle("");
    setLessonVideo("");
    setLessonFree(false);
    setActiveChapter(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editCourse = (item) => {
    setEditingId(item.id);
    setCourse({ ...item, chapters: item.chapters || [] });
    setChapterTitle("");
    setLessonTitle("");
    setLessonVideo("");
    setLessonFree(false);
    setActiveChapter(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("آیا از حذف این دوره مطمئن هستید؟")) return;

    try {
      const response = await adminFetch(`${API_BASE}/api/courses/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در حذف دوره");
      }

      setCourses(prev => prev.filter(item => item.id !== id));

      if (editingId === id) {
        setEditingId(null);
        setCourse(emptyCourse);
      }

      alert("✅ دوره با موفقیت حذف شد.");
    } catch (error) {
      alert("❌ خطا در حذف دوره: " + error.message);
    }
  };

  const addChapter = async () => {
    if (!chapterTitle.trim()) { alert("عنوان فصل را وارد کنید."); return; }
    if (!course.id) { alert("اول دوره را ذخیره کنید، سپس فصل اضافه کنید."); return; }

    try {
      const response = await adminFetch(`${API_BASE}/api/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: course.id,
          title: chapterTitle.trim(),
          sort_order: (course.chapters?.length || 0) + 1
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "خطا در افزودن فصل");

      const newChapter = {
        id: data.id,
        course_id: course.id,
        title: chapterTitle.trim(),
        sort_order: (course.chapters?.length || 0) + 1,
        lessons: []
      };

      setCourse(prev => ({
        ...prev,
        chapters: [...(prev.chapters || []), newChapter]
      }));

      setChapterTitle("");
      alert("✅ فصل با موفقیت اضافه شد.");
    } catch (error) {
      alert("❌ خطا در افزودن فصل: " + error.message);
    }
  };

  const editChapter = (chapter) => {
    setEditingChapterId(chapter.id);
    setEditingChapterTitle(chapter.title);
  };

  const saveChapterEdit = async (chapterId) => {
    if (!editingChapterTitle.trim()) {
      alert("عنوان فصل را وارد کنید.");
      return;
    }

    try {
      const response = await adminFetch(`${API_BASE}/api/chapters/${chapterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingChapterTitle.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "خطا در ویرایش فصل");

      setCourse(prev => ({
        ...prev,
        chapters: prev.chapters.map(ch =>
          ch.id === chapterId
            ? { ...ch, title: editingChapterTitle.trim() }
            : ch
        )
      }));

      setEditingChapterId(null);
      setEditingChapterTitle("");
      alert("✅ فصل با موفقیت ویرایش شد.");
    } catch (error) {
      alert("❌ خطا در ویرایش فصل: " + error.message);
    }
  };

  const deleteChapter = async (chapterId) => {
    if (!window.confirm("آیا از حذف این فصل و درس‌های آن مطمئن هستید؟")) return;

    try {
      const response = await adminFetch(`${API_BASE}/api/chapters/${chapterId}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "خطا در حذف فصل");

      setCourse(prev => ({
        ...prev,
        chapters: prev.chapters.filter(ch => ch.id !== chapterId)
      }));

      if (activeChapter === chapterId) setActiveChapter(null);
      alert("✅ فصل با موفقیت حذف شد.");
    } catch (error) {
      alert("❌ خطا در حذف فصل: " + error.message);
    }
  };

  const addLesson = async () => {
    if (!activeChapter) { alert("اول یک فصل را انتخاب کنید."); return; }
    if (!lessonTitle.trim()) { alert("عنوان درس را وارد کنید."); return; }

    try {
      const chapter = course.chapters?.find(ch => ch.id === activeChapter);
      if (!chapter) { alert("فصل پیدا نشد."); return; }

      const response = await adminFetch(`${API_BASE}/api/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter_id: chapter.id,
          title: lessonTitle.trim(),
          video: lessonVideo.trim(),
          free: lessonFree ? 1 : 0,
          duration: lessonDuration.trim(),
          description: lessonDescription.trim(),
          sort_order: Number(lessonSortOrder) || (chapter.lessons?.length || 0) + 1
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "خطا در افزودن درس");

      const newLesson = {
        id: data.id,
        chapter_id: chapter.id,
        title: lessonTitle.trim(),
        video: lessonVideo.trim(),
        free: lessonFree,
        duration: lessonDuration.trim(),
        description: lessonDescription.trim(),
        sort_order: Number(lessonSortOrder) || (chapter.lessons?.length || 0) + 1
      };

      setCourse(prev => ({
        ...prev,
        chapters: prev.chapters.map(ch =>
          ch.id === activeChapter
            ? { ...ch, lessons: [...(ch.lessons || []), newLesson] }
            : ch
        )
      }));

      setLessonTitle("");
      setLessonVideo("");
      setLessonDuration("");
      setLessonDescription("");
      setLessonSortOrder((chapter.lessons?.length || 0) + 2);
      setLessonFree(false);
      alert("✅ درس با موفقیت اضافه شد.");
    } catch (error) {
      alert("❌ خطا در افزودن درس: " + error.message);
    }
  };

  const editLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setEditingLessonTitle(lesson.title || "");
    setEditingLessonVideo(lesson.video || "");
    setEditingLessonFree(Boolean(lesson.free));
  };

  const saveLessonEdit = async (chapterId, lessonId) => {
    if (!editingLessonTitle.trim()) {
      alert("عنوان درس را وارد کنید.");
      return;
    }

    try {
      const response = await adminFetch(`${API_BASE}/api/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingLessonTitle.trim(),
          video: editingLessonVideo.trim(),
          free: editingLessonFree ? 1 : 0
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "خطا در ویرایش درس");

      setCourse(prev => ({
        ...prev,
        chapters: prev.chapters.map(ch =>
          ch.id === chapterId
            ? {
                ...ch,
                lessons: ch.lessons.map(lesson =>
                  lesson.id === lessonId
                    ? {
                        ...lesson,
                        title: editingLessonTitle.trim(),
                        video: editingLessonVideo.trim(),
                        free: editingLessonFree
                      }
                    : lesson
                )
              }
            : ch
        )
      }));

      setEditingLessonId(null);
      setEditingLessonTitle("");
      setEditingLessonVideo("");
      setEditingLessonFree(false);

      alert("✅ درس با موفقیت ویرایش شد.");
    } catch (error) {
      alert("❌ خطا در ویرایش درس: " + error.message);
    }
  };

  const deleteLesson = async (chapterId, lessonId) => {
    if (!window.confirm("آیا از حذف این درس مطمئن هستید؟")) return;

    try {
      const response = await adminFetch(`${API_BASE}/api/lessons/${lessonId}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "خطا در حذف درس");

      setCourse(prev => ({
        ...prev,
        chapters: prev.chapters.map(ch =>
          ch.id === chapterId
            ? { ...ch, lessons: ch.lessons.filter(l => l.id !== lessonId) }
            : ch
        )
      }));

      alert("✅ درس با موفقیت حذف شد.");
    } catch (error) {
      alert("❌ خطا در حذف درس: " + error.message);
    }
  };

  const saveCourse = async () => {
    if (!course.title.trim()) { alert("عنوان دوره را وارد کنید."); return; }
    if (!course.description.trim()) { alert("توضیحات دوره را وارد کنید."); return; }

    try {
      const payload = {
        title: course.title,
        category: course.category,
        level: course.level,
        price: course.isFree ? 0 : Number(course.price || 0),
        is_free: course.isFree ? 1 : 0,
        image: course.image || "",
        description: course.description
      };

      let courseId = course.id;

      if (courseId) {
        const response = await adminFetch(`${API_BASE}/api/courses/${courseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("خطا در ویرایش دوره");
      } else {
        const response = await adminFetch(`${API_BASE}/api/courses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "خطا در ایجاد دوره");
        courseId = data.id;
      }

      const fullResponse = await fetch(`${API_BASE}/api/courses/${courseId}/full`);
      const fullData = await fullResponse.json();

      setCourse({
        ...course,
        ...fullData.course,
        id: courseId,
        isFree: Boolean(fullData.course?.is_free),
        chapters: fullData.course?.chapters || []
      });

      const listResponse = await fetch(`${API_BASE}/api/courses`);
      const listData = await listResponse.json();
      const fullCourses = await Promise.all((listData.courses || []).map(async item => {
        const r = await fetch(`${API_BASE}/api/courses/${item.id}/full`);
        const d = await r.json();
        return {
          ...d.course,
          isFree: Boolean(d.course?.is_free),
          chapters: (d.course?.chapters || []).map(ch => ({
            ...ch,
            lessons: (ch.lessons || []).map(l => ({ ...l, free: Boolean(l.free) }))
          }))
        };
      }));
      setCourses(fullCourses);
      setEditingId(courseId);

      alert(course.id ? "✅ دوره با موفقیت ویرایش شد." : "✅ دوره با موفقیت اضافه شد.");
    } catch (error) {
      alert("❌ خطا در ذخیره دوره: " + error.message);
    }
  };

  const filteredCourses = courses.filter(item =>
    item.title.includes(searchAdmin) || item.category.includes(searchAdmin)
  );

  // ===== مدیریت دسته‌بندی‌ها =====
  const addCategory = () => {
    if (!newCategory.trim()) { alert("نام دسته‌بندی را وارد کنید."); return; }
    if (categories.includes(newCategory.trim())) { alert("این دسته‌بندی قبلاً وجود دارد."); return; }
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    localStorage.setItem("mohandesino_categories", JSON.stringify(updated));
    setNewCategory("");
    alert("✅ دسته‌بندی با موفقیت اضافه شد!");
  };

  const deleteCategory = (cat) => {
    if (!window.confirm(`آیا از حذف دسته‌بندی "${cat}" مطمئن هستید؟`)) return;
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem("mohandesino_categories", JSON.stringify(updated));
    alert("✅ دسته‌بندی با موفقیت حذف شد!");
  };

  // ===== صفحه لاگین =====
  if (!isLoggedIn) {
    return (
      <main className="admin-page" dir="rtl">
        <div className="admin-login-box">
          <div className="admin-login-icon">🔐</div>
          <h2>ورود به پنل مدیریت</h2>
          <p>رمز عبور را وارد کنید</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور را وارد کنید..."
              className="admin-login-input"
            />
            {error && <p className="admin-login-error">{error}</p>}
            <button type="submit" className="admin-login-btn">ورود به مدیریت</button>
          </form>
        </div>
      </main>
    );
  }

  // ===== صفحه اصلی ادمین =====
  return (
    <main className="admin-page" dir="rtl">
      <div className="admin-container">

        {/* ===== تنظیمات سایت ===== */}
        <section className="admin-settings-section">
          <div className="admin-section-header">
            <div className="admin-section-icon">⚙️</div>
            <div>
              <span className="admin-section-label">تنظیمات</span>
              <h2>تنظیمات سایت</h2>
            </div>
          </div>
          <div className="admin-settings-grid">
            <div className="admin-field-full">
              <label>شعار سایت</label>
              <input name="slogan" value={settings.slogan} onChange={handleSettingChange} placeholder="شعار سایت..." />
            </div>
            <div className="admin-field-full">
              <label>متن درباره ما</label>
              <textarea name="aboutText" value={settings.aboutText} onChange={handleSettingChange} rows="3" placeholder="متن درباره ما..." />
            </div>

            {/* ===== جدید: فیلد عنوان مدرس ===== */}
            <div className="admin-field-full">
              <label>عنوان مدرس (زیر شعار)</label>
              <input 
                name="teacherTitle" 
                value={settings.teacherTitle || ""} 
                onChange={handleSettingChange} 
                placeholder="مثلاً: مدرس و تولیدکننده محتوای آموزشی مهندسینو" 
              />
            </div>

            <div className="admin-field-half">
              <label>تلگرام</label>
              <input name="telegram" value={settings.telegram} onChange={handleSettingChange} placeholder="https://t.me/..." />
            </div>
            <div className="admin-field-half">
              <label>اینستاگرام</label>
              <input name="instagram" value={settings.instagram} onChange={handleSettingChange} placeholder="https://instagram.com/..." />
            </div>
            <div className="admin-field-half">
              <label>ایمیل</label>
              <input name="email" value={settings.email} onChange={handleSettingChange} placeholder="info@..." />
            </div>
            <div className="admin-field-half">
              <label>تلفن</label>
              <input name="phone" value={settings.phone} onChange={handleSettingChange} placeholder="۰۲۱-..." />
            </div>

            {/* ===== نمایش/مخفی کردن FAQ ===== */}
            <div className="admin-field-half">
              <label>نمایش سوالات متداول در منو</label>
              <select
                name="showFaq"
                value={settings.showFaq !== false ? "yes" : "no"}
                onChange={(e) => {
                  const value = e.target.value === "yes";
                  setSettings(prev => ({ ...prev, showFaq: value }));
                }}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "2px solid #e2e8f0" }}
              >
                <option value="yes">✅ نمایش داده شود</option>
                <option value="no">❌ نمایش داده نشود</option>
              </select>
            </div>
          </div>
          <button className="admin-save-btn" onClick={() => saveSettings(settings)} type="button">
            💾 ذخیره تنظیمات
          </button>
        </section>

        <hr style={{ margin: "40px 0", border: "1px solid #e2e8f0" }} />

        {/* ===== مدیریت دسته‌بندی‌ها ===== */}
        <section className="admin-settings-section">
          <div className="admin-section-header">
            <div className="admin-section-icon">🏷️</div>
            <div>
              <span className="admin-section-label">دسته‌بندی‌ها</span>
              <h2>مدیریت دسته‌بندی دوره‌ها</h2>
            </div>
          </div>
          <div className="admin-settings-grid">
            <div className="admin-field-full">
              <label>دسته‌بندی‌های موجود</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {categories.map((cat, index) => (
                  <span key={index} style={{
                    background: "#f1f5f9",
                    padding: "4px 14px",
                    borderRadius: "30px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px"
                  }}>
                    {cat}
                    <button onClick={() => deleteCategory(cat)} style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}>✕</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="admin-field-half">
              <label>افزودن دسته‌بندی جدید</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="مثلاً فیزیک"
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: "2px solid #e2e8f0" }}
                />
                <button onClick={addCategory} className="admin-add-btn" type="button">+ افزودن</button>
              </div>
            </div>
          </div>
        </section>

        <hr style={{ margin: "40px 0", border: "1px solid #e2e8f0" }} />

        {/* ===== مدیریت مقالات ===== */}
        <AdminBlog />

        <hr style={{ margin: "40px 0", border: "1px solid #e2e8f0" }} />

        {/* ===== مدیریت دوره‌ها ===== */}
        <div className="admin-header">
          <div>
            <span className="admin-label">پنل مدیریت</span>
            <h1>مدیریت دوره‌ها</h1>
            <p>دوره‌های مهندسینو را مدیریت کنید.</p>
          </div>
          <button className="admin-add-btn" onClick={startNewCourse} type="button">
            + افزودن دوره جدید
          </button>
        </div>

        <section className="admin-editor">
          <div className="admin-editor-header">
            <div>
              <span>{editingId ? "ویرایش دوره" : "دوره جدید"}</span>
              <h2>اطلاعات دوره</h2>
            </div>
            {editingId && (
              <button className="admin-cancel-button" onClick={startNewCourse} type="button">
                + دوره جدید
              </button>
            )}
          </div>

          <div className="admin-form-grid">
            <div className="admin-field-full">
              <label>عنوان دوره</label>
              <input name="title" value={course.title} onChange={handleChange} placeholder="عنوان دوره..." />
            </div>
            <div className="admin-field-half">
              <label>دسته‌بندی</label>
              <select name="category" value={course.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="admin-field-half">
              <label>سطح دوره</label>
              <select name="level" value={course.level} onChange={handleChange}>
                <option>مقدماتی</option><option>متوسط</option><option>پیشرفته</option>
              </select>
            </div>
            <div className="admin-field-half">
              <label>وضعیت دوره</label>
              <select name="isFree" value={course.isFree ? "free" : "paid"} onChange={(e) => {
                const isFree = e.target.value === "free";
                setCourse(prev => ({ ...prev, isFree }));
              }}>
                <option value="free">🎁 رایگان</option>
                <option value="paid">💰 پولی</option>
              </select>
            </div>
            <div className="admin-field-half">
              <label>قیمت دوره</label>
              <input type="number" name="price" min="0" value={course.price} onChange={handleChange}
                placeholder="قیمت به تومان" />
              <small>{course.isFree ? "دوره رایگان است" : "برای دوره پولی قیمت را وارد کنید"}</small>
            </div>
            <div className="admin-field-full">
              <label>لینک تصویر دوره</label>
              <input name="image" value={course.image} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="admin-field-full">
              <label>توضیحات دوره</label>
              <textarea name="description" value={course.description} onChange={handleChange} rows="5" placeholder="توضیحات کامل..." />
            </div>
          </div>

          <div className="admin-chapters-section">
            <div className="admin-chapters-header">
              <div>
                <span className="admin-chapters-icon">📖</span>
                <h4>فصل‌ها و درس‌ها</h4>
              </div>
              <strong>{course.chapters?.length || 0} فصل</strong>
            </div>
            
            <div className="admin-chapter-add">
              <input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} placeholder="عنوان فصل جدید..." />
              <button onClick={addChapter} type="button">+ افزودن فصل</button>
            </div>

            <div className="admin-chapters-list">
              {course.chapters?.length === 0 ? (
                <div className="admin-empty-state">هنوز فصلی اضافه نشده است.</div>
              ) : (
                course.chapters.map((chapter, index) => (
                  <div className="admin-chapter-item" key={chapter.id}>
                    <div className="admin-chapter-header">
                      <div className="admin-chapter-title" onClick={() => setActiveChapter(activeChapter === chapter.id ? null : chapter.id)}>
                        <span className="admin-chapter-number">{index + 1}</span>
                        <div>
                          {editingChapterId === chapter.id ? (
                            <div className="admin-inline-edit">
                              <input
                                value={editingChapterTitle}
                                onChange={(e) => setEditingChapterTitle(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveChapterEdit(chapter.id);
                                }}
                              >💾</button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingChapterId(null);
                                  setEditingChapterTitle("");
                                }}
                              >✖</button>
                            </div>
                          ) : (
                            <>
                              <strong>{chapter.title}</strong>
                              <small>{chapter.lessons?.length || 0} درس</small>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="admin-chapter-actions">
                        <button onClick={(e) => { e.stopPropagation(); editChapter(chapter); }} type="button">✏️</button>
                        <button className="admin-chapter-delete" onClick={(e) => { e.stopPropagation(); deleteChapter(chapter.id); }} type="button">🗑</button>
                      </div>
                    </div>
                    {activeChapter === chapter.id && (
                      <div className="admin-lessons-section">
                        <div className="admin-lesson-add">
                          <h5>➕ افزودن درس</h5>
                          <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="عنوان درس..." />
                          <input value={lessonVideo} onChange={(e) => setLessonVideo(e.target.value)} placeholder="لینک ویدئو..." />
                          <input value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} placeholder="مدت زمان درس، مثلاً 12:30" />
                          <textarea value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} placeholder="توضیحات درس..." />
                          <input type="number" min="1" value={lessonSortOrder} onChange={(e) => setLessonSortOrder(e.target.value)} placeholder="ترتیب درس" />
                          <label className="admin-lesson-free">
                            <input type="checkbox" checked={lessonFree} onChange={(e) => setLessonFree(e.target.checked)} />
                            <span>🔓 این درس رایگان است</span>
                          </label>
                          <button onClick={addLesson} type="button">+ افزودن درس</button>
                        </div>
                        <div className="admin-lessons-list">
                          {chapter.lessons?.length === 0 ? (
                            <p className="admin-empty-lessons">هنوز درسی اضافه نشده.</p>
                          ) : (
                            chapter.lessons.map((lesson, li) => (
                              <div className="admin-lesson-item" key={lesson.id}>
                                {editingLessonId === lesson.id ? (
                                  <div className="admin-lesson-edit">
                                    <input
                                      value={editingLessonTitle}
                                      onChange={(e) => setEditingLessonTitle(e.target.value)}
                                      placeholder="عنوان درس..."
                                    />
                                    <input
                                      value={editingLessonVideo}
                                      onChange={(e) => setEditingLessonVideo(e.target.value)}
                                      placeholder="لینک ویدئو..."
                                    />
                                    <input
                                      value={editingLessonDuration}
                                      onChange={(e) => setEditingLessonDuration(e.target.value)}
                                      placeholder="مدت زمان درس، مثلاً 12:30"
                                    />
                                    <textarea
                                      value={editingLessonDescription}
                                      onChange={(e) => setEditingLessonDescription(e.target.value)}
                                      placeholder="توضیحات درس..."
                                    />
                                    <input
                                      type="number"
                                      min="1"
                                      value={editingLessonSortOrder}
                                      onChange={(e) => setEditingLessonSortOrder(e.target.value)}
                                      placeholder="ترتیب درس"
                                    />
                                    <label className="admin-lesson-free">
                                      <input
                                        type="checkbox"
                                        checked={editingLessonFree}
                                        onChange={(e) => setEditingLessonFree(e.target.checked)}
                                      />
                                      <span>🔓 این درس رایگان است</span>
                                    </label>
                                    <div>
                                      <button onClick={() => saveLessonEdit(chapter.id, lesson.id)} type="button">💾 ذخیره</button>
                                      <button
                                        onClick={() => {
                                          setEditingLessonId(null);
                                          setEditingLessonTitle("");
                                          setEditingLessonVideo("");
                                          setEditingLessonFree(false);
                                        }}
                                        type="button"
                                      >✖ انصراف</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="admin-lesson-info">
                                      <span className="admin-lesson-number">{li + 1}</span>
                                      <strong>{lesson.title}</strong>
                                      {lesson.video && <span className="admin-lesson-video">🎬 {lesson.video}</span>}
                                    </div>
                                    <div className="admin-lesson-actions">
                                      {lesson.free && <span className="admin-lesson-free-badge">رایگان</span>}
                                      <button onClick={() => editLesson(lesson)} type="button">✏️</button>
                                      <button onClick={() => deleteLesson(chapter.id, lesson.id)} type="button">🗑</button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <button className="admin-save-course-btn" onClick={saveCourse} type="button">
            {editingId ? "💾 ذخیره تغییرات" : "➕ ذخیره و ایجاد دوره"}
          </button>
        </section>

        <section className="admin-list-section">
          <div className="admin-list-header">
            <div>
              <span className="admin-list-icon">📋</span>
              <h3>دوره‌های ساخته‌شده</h3>
            </div>
            <strong>{courses.length} دوره</strong>
          </div>

          <input 
            type="text" 
            placeholder="🔍 جستجو در دوره‌ها..." 
            value={searchAdmin}
            onChange={(e) => setSearchAdmin(e.target.value)}
            className="admin-search-input"
          />

          {filteredCourses.length === 0 ? (
            <div className="admin-empty-state">
              {searchAdmin ? "دوره‌ای با این جستجو پیدا نشد." : "هنوز دوره‌ای ساخته نشده است."}
            </div>
          ) : (
            <div className="admin-courses-grid">
              {filteredCourses.map(item => (
                <div className="admin-course-card" key={item.id}>
                  <div className="admin-course-thumb">
                    {item.image ? <img src={item.image} alt={item.title} /> : <span>{item.isFree ? "🎁" : "💎"}</span>}
                  </div>
                  <div className="admin-course-details">
                    <span className="admin-course-category">{item.category}</span>
                    <h4>{item.title}</h4>
                    <p className="admin-course-price">{item.isFree ? "🎁 رایگان" : `${Number(item.price).toLocaleString()} تومان`}</p>
                    <div className="admin-course-actions">
                      <button className="admin-edit-btn" onClick={() => editCourse(item)} type="button">✏️ ویرایش</button>
                      <button className="admin-delete-btn" onClick={() => deleteCourse(item.id)} type="button">🗑 حذف</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Admin;
