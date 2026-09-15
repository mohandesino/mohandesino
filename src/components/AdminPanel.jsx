import { useEffect, useState } from "react";

const defaultCourses = [
  {
    id: 1,
    title: "ریاضی دهم",
    level: "دبیرستان",
    price: "رایگان",
    description: "آموزش کامل ریاضی دهم",
  },
  {
    id: 2,
    title: "ریاضی ۱ دانشگاه",
    level: "دانشگاه",
    price: "۲۹۹,۰۰۰ تومان",
    description: "آموزش حد، مشتق و کاربردها",
  },
];

function getCourses() {
  const saved = localStorage.getItem("mohandessino_courses");

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultCourses;
    }
  }

  return defaultCourses;
}

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [lessonForm, setLessonForm] = useState({
    title: "",
    video: "",
    free: 0,
    duration: "",
    description: "",
    sort_order: 0,
  });

  const [courses, setCourses] = useState(getCourses);

  const [showForm, setShowForm] = useState(false);

  const [course, setCourse] = useState({
    title: "",
    level: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (!selectedCourse) {
      setChapters([]);
      return;
    }

    fetch(`http://localhost:3000/api/courses/${selectedCourse}/chapters`)
      .then((res) => res.json())
      .then((data) => setChapters(data.chapters || []))
      .catch(() => setChapters([]));
  }, [selectedCourse]);

  const loadLessons = (chapterId) => {
    fetch(`http://localhost:3000/api/chapters/${chapterId}/lessons`)
      .then((res) => res.json())
      .then((data) => setLessons(data.lessons || []))
      .catch(() => setLessons([]));
  };

  const addChapter = async () => {
    if (!selectedCourse || !chapterTitle.trim()) return;

    const res = await fetch("http://localhost:3000/api/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_id: Number(selectedCourse),
        title: chapterTitle,
        sort_order: chapters.length,
      }),
    });

    if (res.ok) {
      setChapterTitle("");
      setShowChapterForm(false);
      const data = await fetch(
        `http://localhost:3000/api/courses/${selectedCourse}/chapters`
      ).then((r) => r.json());
      setChapters(data.chapters || []);
    }
  };

  const addLesson = async (chapterId) => {
    if (!lessonForm.title.trim()) return;

    const res = await fetch("http://localhost:3000/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapter_id: Number(chapterId),
        ...lessonForm,
        free: Number(lessonForm.free),
        sort_order: lessons.length,
      }),
    });

    if (res.ok) {
      setLessonForm({
        title: "",
        video: "",
        free: 0,
        duration: "",
        description: "",
        sort_order: 0,
      });
      setShowLessonForm(false);
      loadLessons(chapterId);
    }
  };

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!course.title || !course.level) {
      alert("لطفاً عنوان دوره و مقطع را وارد کن.");
      return;
    }

    const newCourse = {
      id: Date.now(),
      title: course.title,
      level: course.level,
      price: course.price || "رایگان",
      description:
        course.description || "دوره آموزشی مهندسینو",
    };

    const updatedCourses = [...courses, newCourse];

    setCourses(updatedCourses);

    localStorage.setItem(
      "mohandessino_courses",
      JSON.stringify(updatedCourses)
    );

    setCourse({
      title: "",
      level: "",
      price: "",
      description: "",
    });

    setShowForm(false);

    alert("✅ دوره با موفقیت ذخیره شد.");
  };

  const deleteCourse = (id) => {
    const confirmed = window.confirm(
      "آیا از حذف این دوره مطمئنی؟"
    );

    if (!confirmed) {
      return;
    }

    const updatedCourses = courses.filter(
      (item) => item.id !== id
    );

    setCourses(updatedCourses);

    localStorage.setItem(
      "mohandessino_courses",
      JSON.stringify(updatedCourses)
    );
  };

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div>
          <h1>⚙️ پنل مدیریت مهندسینو</h1>

          <p>
            مدیریت دوره‌ها، جلسات و محتوای آموزشی
          </p>
        </div>

        <a href="/" className="admin-home">
          🏠 مشاهده سایت
        </a>

      </header>

      <div className="admin-container">

        <aside className="admin-sidebar">

          <button
            className={
              activeTab === "courses" ? "active" : ""
            }
            onClick={() => setActiveTab("courses")}
          >
            📚 دوره‌ها
          </button>

          <button
            className={
              activeTab === "lessons" ? "active" : ""
            }
            onClick={() => setActiveTab("lessons")}
          >
            🎬 جلسات
          </button>

          <button
            className={
              activeTab === "settings" ? "active" : ""
            }
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ تنظیمات
          </button>

        </aside>

        <main className="admin-content">

          {activeTab === "courses" && (
            <section>

              <div className="admin-title">

                <div>
                  <h2>📚 مدیریت دوره‌ها</h2>

                  <p>
                    دوره‌های آموزشی خود را مدیریت کنید.
                  </p>
                </div>

                <button
                  className="admin-primary"
                  onClick={() => setShowForm(true)}
                >
                  ➕ افزودن دوره
                </button>

              </div>

              {!showForm && (
                <>

                  <div className="admin-stats">

                    <div className="stat-card">
                      <span>📚</span>

                      <strong>
                        {courses.length}
                      </strong>

                      <small>
                        دوره
                      </small>
                    </div>

                    <div className="stat-card">
                      <span>🎬</span>

                      <strong>
                        ۰
                      </strong>

                      <small>
                        جلسه
                      </small>
                    </div>

                    <div className="stat-card">
                      <span>👨‍🎓</span>

                      <strong>
                        ۰
                      </strong>

                      <small>
                        دانشجو
                      </small>
                    </div>

                  </div>

                  <div className="admin-course-list">

                    {courses.map((item) => (

                      <div
                        className="admin-course-item"
                        key={item.id}
                      >

                        <div className="admin-course-icon">
                          📚
                        </div>

                        <div className="admin-course-info">

                          <h3>
                            {item.title}
                          </h3>

                          <p>
                            {item.level} • {item.price}
                          </p>

                          <small>
                            {item.description}
                          </small>

                        </div>

                        <button
                          className="course-delete"
                          onClick={() =>
                            deleteCourse(item.id)
                          }
                        >
                          🗑️ حذف
                        </button>

                      </div>

                    ))}

                  </div>

                </>
              )}

              {showForm && (
                <form
                  className="course-form"
                  onSubmit={handleSubmit}
                >

                  <div className="form-header">

                    <div>
                      <h2>
                        ➕ ایجاد دوره جدید
                      </h2>

                      <p>
                        اطلاعات دوره را وارد کن.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="form-close"
                      onClick={() =>
                        setShowForm(false)
                      }
                    >
                      ✕
                    </button>

                  </div>

                  <label>
                    عنوان دوره
                  </label>

                  <input
                    name="title"
                    value={course.title}
                    onChange={handleChange}
                    placeholder="مثلاً آموزش کامل ریاضی ۱"
                  />

                  <label>
                    مقطع
                  </label>

                  <select
                    name="level"
                    value={course.level}
                    onChange={handleChange}
                  >
                    <option value="">
                      انتخاب مقطع
                    </option>

                    <option value="دبیرستان">
                      دبیرستان
                    </option>

                    <option value="دانشگاه">
                      دانشگاه
                    </option>

                    <option value="عمومی">
                      عمومی
                    </option>
                  </select>

                  <label>
                    قیمت
                  </label>

                  <input
                    name="price"
                    value={course.price}
                    onChange={handleChange}
                    placeholder="مثلاً ۲۹۹,۰۰۰ تومان"
                  />

                  <label>
                    توضیحات دوره
                  </label>

                  <textarea
                    name="description"
                    value={course.description}
                    onChange={handleChange}
                    placeholder="توضیح کوتاهی درباره دوره..."
                    rows="5"
                  />

                  <button
                    type="submit"
                    className="form-save"
                  >
                    💾 ذخیره دوره
                  </button>

                </form>
              )}

            </section>
          )}

          {activeTab === "lessons" && (
            <section className="admin-lessons">

              <div className="admin-title">
                <div>
                  <h2>🎬 مدیریت جلسات</h2>
                  <p>فصل‌ها و درس‌های هر دوره را مدیریت کنید.</p>
                </div>
              </div>

              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">انتخاب دوره</option>
                {courses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>

              {selectedCourse && (
                <>
                  <button
                    className="form-save"
                    onClick={() => setShowChapterForm(!showChapterForm)}
                  >
                    ➕ افزودن فصل
                  </button>

                  {showChapterForm && (
                    <div className="admin-form">
                      <input
                        value={chapterTitle}
                        onChange={(e) => setChapterTitle(e.target.value)}
                        placeholder="عنوان فصل"
                      />
                      <button className="form-save" onClick={addChapter}>
                        ذخیره فصل
                      </button>
                    </div>
                  )}

                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="admin-chapter">
                      <h3>📁 {chapter.title}</h3>

                      <button
                        className="form-save"
                        onClick={() => {
                          setShowLessonForm(true);
                          loadLessons(chapter.id);
                        }}
                      >
                        ➕ افزودن درس
                      </button>

                      {showLessonForm && (
                        <div className="admin-form">
                          <input
                            placeholder="عنوان درس"
                            value={lessonForm.title}
                            onChange={(e) =>
                              setLessonForm({
                                ...lessonForm,
                                title: e.target.value,
                              })
                            }
                          />

                          <input
                            placeholder="لینک ویدئو"
                            value={lessonForm.video}
                            onChange={(e) =>
                              setLessonForm({
                                ...lessonForm,
                                video: e.target.value,
                              })
                            }
                          />

                          <input
                            placeholder="مدت زمان"
                            value={lessonForm.duration}
                            onChange={(e) =>
                              setLessonForm({
                                ...lessonForm,
                                duration: e.target.value,
                              })
                            }
                          />

                          <label>
                            <input
                              type="checkbox"
                              checked={Number(lessonForm.free) === 1}
                              onChange={(e) =>
                                setLessonForm({
                                  ...lessonForm,
                                  free: e.target.checked ? 1 : 0,
                                })
                              }
                            />
                            درس رایگان
                          </label>

                          <button
                            className="form-save"
                            onClick={() => addLesson(chapter.id)}
                          >
                            ذخیره درس
                          </button>
                        </div>
                      )}

                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="admin-lesson">
                          🎬 {lesson.title}
                          {lesson.duration && ` — ${lesson.duration}`}
                          {Number(lesson.free) === 1 && " — رایگان"}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}

            </section>
          )}

          {activeTab === "settings" && (
            <section className="admin-empty">

              <div>⚙️</div>

              <h2>
                تنظیمات سایت
              </h2>

              <p>
                تنظیمات اصلی مهندسینو در این قسمت قرار می‌گیرد.
              </p>

            </section>
          )}

        </main>

      </div>

    </div>
  );
}

export default AdminPanel;