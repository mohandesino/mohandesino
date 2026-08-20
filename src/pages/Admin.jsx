import { useEffect, useState } from "react";
import AdminBlog from "./AdminBlog";

const ADMIN_PASSWORD = "M12.12.1385m#";

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

  const [settings, setSettings] = useState({
    slogan: "مهندسی را کاربردی یاد بگیر",
    aboutText: "مهندسینو یک پلتفرم آموزشی برای یادگیری ساده، مفهومی و کاربردی مباحث مهندسی است.",
    telegram: "https://t.me/mohandesino",
    instagram: "https://instagram.com/mohandesino",
    email: "info@mohandesino.ir",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸"
  });

  // ===== مدیریت دسته‌بندی‌ها =====
  const [categories, setCategories] = useState(["ریاضی", "برق", "برنامه‌نویسی", "مهندسی صنایع", "سایر"]);
  const [newCategory, setNewCategory] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("mohandesino_user") || '{}');
    const adminPhones = ["09927533272", "09051627714"];
    const isAdmin = adminPhones.includes(userData.phone);

    if (password === ADMIN_PASSWORD && isAdmin) {
      setIsLoggedIn(true);
      setError("");
    } else if (password !== ADMIN_PASSWORD) {
      setError("رمز عبور اشتباه است!");
    } else {
      setError("شما دسترسی به پنل مدیریت ندارید!");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_courses");
    if (saved) setCourses(JSON.parse(saved));

    const savedSettings = localStorage.getItem("mohandesino_settings");
    if (savedSettings) setSettings(JSON.parse(savedSettings));

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
      [name]: type === "checkbox" ? checked : (name === "price" ? Number(value) : value)
    }));
  };

  const startNewCourse = () => {
    setEditingId(null);
    setCourse({ ...emptyCourse, id: Date.now().toString() });
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

  const deleteCourse = (id) => {
    if (!window.confirm("آیا از حذف این دوره مطمئن هستید؟")) return;
    const updated = courses.filter(item => item.id !== id);
    saveCourses(updated);
    if (editingId === id) { setEditingId(null); setCourse(emptyCourse); }
  };

  const addChapter = () => {
    if (!chapterTitle.trim()) { alert("عنوان فصل را وارد کنید."); return; }
    const newChapter = { id: Date.now().toString(), title: chapterTitle.trim(), lessons: [] };
    setCourse(prev => ({ ...prev, chapters: [...(prev.chapters || []), newChapter] }));
    setChapterTitle("");
  };

  const deleteChapter = (chapterId) => {
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.filter(ch => ch.id !== chapterId)
    }));
    if (activeChapter === chapterId) setActiveChapter(null);
  };

  const addLesson = () => {
    if (!activeChapter) { alert("اول یک فصل را انتخاب کنید."); return; }
    if (!lessonTitle.trim()) { alert("عنوان درس را وارد کنید."); return; }
    const newLesson = {
      id: Date.now().toString(),
      title: lessonTitle.trim(),
      video: lessonVideo.trim(),
      free: lessonFree,
      duration: "",
      description: ""
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
    setLessonFree(false);
  };

  const deleteLesson = (chapterId, lessonId) => {
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch =>
        ch.id === chapterId
          ? { ...ch, lessons: ch.lessons.filter(l => l.id !== lessonId) }
          : ch
      )
    }));
  };

  const saveCourse = () => {
    if (!course.title.trim()) { alert("عنوان دوره را وارد کنید."); return; }
    if (!course.description.trim()) { alert("توضیحات دوره را وارد کنید."); return; }
    const finalCourse = { ...course, id: course.id || Date.now().toString() };
    const exists = courses.some(item => item.id === finalCourse.id);
    const updatedCourses = exists
      ? courses.map(item => item.id === finalCourse.id ? finalCourse : item)
      : [...courses, finalCourse];
    saveCourses(updatedCourses);
    setCourse(finalCourse);
    setEditingId(finalCourse.id);
    alert(exists ? "✅ دوره با موفقیت ویرایش شد." : "✅ دوره با موفقیت اضافه شد.");
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
                setCourse(prev => ({ ...prev, isFree, price: isFree ? 0 : prev.price || 0 }));
              }}>
                <option value="free">🎁 رایگان</option>
                <option value="paid">💰 پولی</option>
              </select>
            </div>
            <div className="admin-field-half">
              <label>قیمت دوره</label>
              <input type="number" name="price" min="0" value={course.price} onChange={handleChange}
                placeholder="قیمت به تومان" disabled={course.isFree} />
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
                          <strong>{chapter.title}</strong>
                          <small>{chapter.lessons?.length || 0} درس</small>
                        </div>
                      </div>
                      <button className="admin-chapter-delete" onClick={() => deleteChapter(chapter.id)} type="button">🗑</button>
                    </div>
                    {activeChapter === chapter.id && (
                      <div className="admin-lessons-section">
                        <div className="admin-lesson-add">
                          <h5>➕ افزودن درس</h5>
                          <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="عنوان درس..." />
                          <input value={lessonVideo} onChange={(e) => setLessonVideo(e.target.value)} placeholder="لینک ویدئو..." />
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
                                <div className="admin-lesson-info">
                                  <span className="admin-lesson-number">{li + 1}</span>
                                  <strong>{lesson.title}</strong>
                                  {lesson.video && <span className="admin-lesson-video">🎬 {lesson.video}</span>}
                                </div>
                                <div className="admin-lesson-actions">
                                  {lesson.free && <span className="admin-lesson-free-badge">رایگان</span>}
                                  <button onClick={() => deleteLesson(chapter.id, lesson.id)} type="button">🗑</button>
                                </div>
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