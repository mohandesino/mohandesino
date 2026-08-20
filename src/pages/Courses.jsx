import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");
  const [filterType, setFilterType] = useState("همه");
  const [categories, setCategories] = useState(["همه", "ریاضی", "برق", "برنامه‌نویسی", "مهندسی صنایع", "سایر"]);

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_courses");
    if (saved) {
      setCourses(JSON.parse(saved));
    } else {
      const defaultCourses = [
        {
          id: "1",
          title: "آموزش جامع توان و رادیکال",
          category: "ریاضی",
          level: "مقدماتی تا پیشرفته",
          price: 0,
          isFree: true,
          image: "",
          description: "آموزش کامل مبحث توان و رادیکال از مفاهیم پایه تا حل مسائل پیشرفته.",
          chapters: []
        },
        {
          id: "2",
          title: "آموزش انتگرال از پایه تا دانشگاه",
          category: "ریاضی",
          level: "مقدماتی تا پیشرفته",
          price: 0,
          isFree: true,
          image: "",
          description: "آموزش کامل انتگرال شامل انتگرال معین، نامعین، روش‌های حل انتگرال.",
          chapters: []
        },
        {
          id: "3",
          title: "Excel برای مهندسان",
          category: "مهندسی صنایع",
          level: "کاربردی",
          price: 0,
          isFree: true,
          image: "",
          description: "آموزش کامل Excel با تمرکز بر کاربردهای مهندسی.",
          chapters: []
        }
      ];
      localStorage.setItem("mohandesino_courses", JSON.stringify(defaultCourses));
      setCourses(defaultCourses);
    }

    const savedCategories = localStorage.getItem("mohandesino_categories");
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      if (parsed.length > 0) {
        setCategories(["همه", ...parsed]);
        return;
      }
    }
    localStorage.setItem("mohandesino_categories", JSON.stringify(["ریاضی", "برق", "برنامه‌نویسی", "مهندسی صنایع", "سایر"]));
    setCategories(["همه", "ریاضی", "برق", "برنامه‌نویسی", "مهندسی صنایع", "سایر"]);
  }, []);

  const filtered = courses.filter(item => {
    const matchSearch = item.title.includes(search) || item.description.includes(search);
    const matchCategory = category === "همه" || item.category === category;
    const matchType = filterType === "همه" ||
      (filterType === "🎁 رایگان" && (item.isFree === true || Number(item.price) === 0)) ||
      (filterType === "💰 پولی" && item.isFree === false && Number(item.price) > 0);
    return matchSearch && matchCategory && matchType;
  });

  const filterTypes = ["همه", "🎁 رایگان", "💰 پولی"];

  return (
    <main className="courses-page" dir="rtl">
      <section className="courses-hero">
        <span>مهندسینو</span>
        <h1>دوره‌های آموزشی</h1>
        <p>مسیر یادگیری مهندسی را از اینجا شروع کن.</p>
      </section>

      <section className="courses-filter-section">
        <input type="text" placeholder="جستجوی دوره..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="search-input" />

        <div className="filter-group">
          <div className="filter-label">دسته‌بندی:</div>
          <div className="category-filters">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={category === cat ? "active-filter" : ""}
                type="button">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-label">وضعیت:</div>
          <div className="category-filters">
            {filterTypes.map(type => (
              <button key={type} onClick={() => setFilterType(type)}
                className={filterType === type ? "active-filter" : ""}
                type="button">
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="courses-content">
        {filtered.length === 0 ? (
          <div className="courses-empty"><div>📚</div><h2>دوره‌ای یافت نشد</h2><p>سعی کن با کلمات دیگه جستجو کنی.</p></div>
        ) : (
          <div className="course-grid">
            {filtered.map(item => (
              <article className={`home-course-card ${item.isFree ? "free" : "paid"}`} key={item.id}>
                <div className="course-thumbnail">
                  <span className="course-thumbnail-icon">{item.image ? <img src={item.image} alt={item.title} /> : "📐"}</span>
                  {item.isFree ? <span className="free-badge">🎁 رایگان</span> : <span className="paid-badge">💰 پولی</span>}
                </div>
                <div className="course-card-body">
                  <span className="course-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="course-card-bottom">
                    <span>{item.level}</span>
                    <strong>{item.isFree ? "رایگان" : `${Number(item.price).toLocaleString()} تومان`}</strong>
                  </div>
                  <Link to={`/course/${item.id}`} className="course-view-button">مشاهده دوره ←</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Courses;