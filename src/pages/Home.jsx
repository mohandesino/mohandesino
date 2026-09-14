import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState({
    slogan: "ریاضی و فیزیک را ساده و مفهومی یاد بگیر",
    aboutText: "آموزش‌هایی که به‌جای حفظ فرمول، کمک می‌کنند واقعاً مطلب را بفهمی.",
    teacherTitle: "مدرس و تولیدکننده محتوای آموزشی مهندسینو"
  });

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_courses");
    const savedSettings = localStorage.getItem("mohandesino_settings");

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
          title: "فیزیک پایه - مفاهیم و قوانین",
          category: "فیزیک",
          level: "مقدماتی",
          price: 0,
          isFree: true,
          image: "",
          description: "آموزش مفاهیم پایه فیزیک شامل حرکت، نیرو، انرژی و قوانین نیوتن.",
          chapters: []
        }
      ];
      localStorage.setItem("mohandesino_courses", JSON.stringify(defaultCourses));
      setCourses(defaultCourses);
    }

    if (savedSettings) {
      const data = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...data }));
    } else {
      const defaultSettings = {
        slogan: "ریاضی و فیزیک را ساده و مفهومی یاد بگیر",
        aboutText: "آموزش‌هایی که به‌جای حفظ فرمول، کمک می‌کنند واقعاً مطلب را بفهمی.",
        teacherTitle: "مدرس و تولیدکننده محتوای آموزشی مهندسینو",
        telegram: "https://t.me/mohandesino2026",
        instagram: "https://instagram.com/mohandesino",
        email: "info@mohandesino.ir",
        phone: "۰۲۱-۱۲۳۴۵۶۷۸"
      };
      localStorage.setItem("mohandesino_settings", JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
    }
  }, []);

  const freeCourses = courses.filter(c => c.isFree === true || Number(c.price) === 0);
  const paidCourses = courses.filter(c => c.isFree === false && Number(c.price) > 0);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="hero-content">
            <span className="hero-badge">
              محمدرضا فاضلی‌نیا | {settings.teacherTitle || "مدرس و تولیدکننده محتوای آموزشی مهندسینو"}
            </span>
            <h1>{settings.slogan}</h1>
            <p>{settings.aboutText}</p>
            <div className="hero-actions">
              <Link to="/courses" className="primary-btn">مشاهده دوره‌ها</Link>
              <Link to="/courses" className="secondary-btn">دوره‌های رایگان</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-icon">🎓</div>
              <strong>یادگیری با مهندسینو</strong>
              <span>از صفر تا مهارت</span>
              <div className="hero-progress"><span></span></div>
              <small>همین امروز شروع کن</small>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card"><strong>{courses.length}+</strong><span>دوره آموزشی</span></div>
          <div className="stat-card"><strong>+۱۰۰</strong><span>ساعت آموزش</span></div>
          <div className="stat-card"><strong>+۱۰۰۰</strong><span>دانشجو</span></div>
          <div className="stat-card"><strong>۲۴/۷</strong><span>دسترسی به آموزش</span></div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="page-container">
        <div className="section-title">
        </div>
      </section>

      {/* ===== FREE COURSES ===== */}
      <section className="page-container">
        <div className="section-title-row">
          <div className="section-title">
            <h2>🎁 دوره‌های رایگان</h2>
            <p>بدون هیچ هزینه‌ای یادگیری رو شروع کن</p>
          </div>
          <Link to="/courses" className="view-all">مشاهده همه ←</Link>
        </div>
        <div className="course-grid">
          {freeCourses.slice(0, 3).map(item => (
            <div className="home-course-card" key={item.id}>
              <div className="course-thumbnail">
                <span className="course-thumbnail-icon">📐</span>
                <span className="free-badge">رایگان</span>
              </div>
              <div className="course-card-body">
                <span className="course-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="course-card-bottom">
                  <span>{item.level}</span>
                  <strong>رایگان</strong>
                </div>
                <Link to={`/course/${item.id}`} className="course-view-button">مشاهده دوره ←</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PAID COURSES ===== */}
      <section className="page-container">
        <div className="section-title-row">
          <div className="section-title">
            <h2>💎 دوره‌های ویژه</h2>
            <p>دوره‌های تخصصی با مدرک معتبر</p>
          </div>
          <Link to="/courses" className="view-all">مشاهده همه ←</Link>
        </div>
        <div className="course-grid">
          {paidCourses.slice(0, 3).map(item => (
            <div className="home-course-card paid" key={item.id}>
              <div className="course-thumbnail">
                <span className="course-thumbnail-icon">💎</span>
                <span className="paid-badge">پولی</span>
              </div>
              <div className="course-card-body">
                <span className="course-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="course-card-bottom">
                  <span>{item.level}</span>
                  <strong>{Number(item.price).toLocaleString()} تومان</strong>
                </div>
                <Link to={`/course/${item.id}`} className="course-view-button">مشاهده دوره ←</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="why-section">
        <div className="page-container">
          <div className="section-title">
            <h2>چرا مهندسینو؟</h2>
            <p>آموزش فقط حفظ کردن نیست؛ باید بتوانی از آن استفاده کنی.</p>
          </div>
          <div className="why-grid">
            <div className="why-card"><span>🎯</span><h3>آموزش هدفمند</h3><p>هر دوره با یک مسیر مشخص و منظم طراحی می‌شود.</p></div>
            <div className="why-card"><span>🧠</span><h3>یادگیری مفهومی</h3><p>مطالب ساده و قابل فهم توضیح داده می‌شوند.</p></div>
            <div className="why-card"><span>🛠️</span><h3>کاملاً کاربردی</h3><p>تمرکز روی استفاده واقعی از مهارت‌هاست.</p></div>
            <div className="why-card"><span>🚀</span><h3>مسیر پیشرفت</h3><p>از پایه شروع کن و قدم‌به‌قدم جلو برو.</p></div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="final-cta">
        <div>
          <h2>آماده‌ای یادگیری را شروع کنی؟</h2>
          <p>اولین قدم مسیر یادگیری خودت را همین امروز بردار.</p>
        </div>
        <Link to="/courses">مشاهده دوره‌ها</Link>
      </section>
    </>
  );
}

export default Home;