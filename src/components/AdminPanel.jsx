import { useState } from "react";

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

  const [courses, setCourses] = useState(getCourses);

  const [showForm, setShowForm] = useState(false);

  const [course, setCourse] = useState({
    title: "",
    level: "",
    price: "",
    description: "",
  });

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
            <section className="admin-empty">

              <div>🎬</div>

              <h2>
                مدیریت جلسات
              </h2>

              <p>
                بعد از ساخت دوره، جلسات و ویدیوهای آن
                را از این قسمت اضافه می‌کنیم.
              </p>

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