import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState({
    slogan: "مهندسی را کاربردی یاد بگیر",
    aboutText: "مهندسینو یک پلتفرم آموزشی برای یادگیری ساده، مفهومی و کاربردی مباحث مهندسی است."
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
          description: "آموزش کامل مبحث توان و رادیکال از مفاهیم پایه تا حل مسائل پیشرفته دانشگاهی.",
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
          title: "Excel برای مهندسان و تحلیل‌گران داده",
          category: "مهندسی صنایع",
          level: "کاربردی",
          price: 0,
          isFree: true,
          image: "",
          description: "آموزش کامل نرم‌افزار Excel با تمرکز بر کاربردهای مهندسی.",
          chapters: []
        }
      ];
      localStorage.setItem("mohandesino_courses", JSON.stringify(defaultCourses));
      setCourses(defaultCourses);
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      const defaultSettings = {
        slogan: "مهندسی را کاربردی یاد بگیر",
        aboutText: "مهندسینو یک پلتفرم آموزشی برای یادگیری ساده، مفهومی و کاربردی مباحث مهندسی است.",
        telegram: "https://t.me/mohandesino",
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
      {/* HERO - با شعار قابل تغییر */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="hero-content">
            <span className="hero-badge">🔥 پلتفرم آموزش مهندسی</span>
            <h1>{settings.slogan}</h1>
            <p>{settings.aboutText}</p>
            <div className="hero-actions">
              <Link to="/courses" className="primary-btn">مشاهده دوره‌ها</Link>
              <Link to="/#free-courses" className="secondary-btn">دوره‌های رایگان</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-icon">🎓</div>
              <strong>مسیر یادگیری تو</strong>
              <span>از صفر تا مهارت</span>
              <div className="hero-progress"><span></span></div>
              <small>یادگیری را همین امروز شروع کن</small>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card"><strong>{courses.length}+</strong><span>دوره آموزشی</span></div>
          <div className="stat-card"><strong>+100</strong><span>ساعت آموزش</span></div>
          <div className="stat-card"><strong>+1000</strong><span>دانشجو</span></div>
          <div className="stat-card"><strong>24/7</strong><span>دسترسی به آموزش</span></div>
        </div>
      </section>

      {/* FREE COURSES */}
      <section className="page-container" id="free-courses">
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

      {/* PAID COURSES */}
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

      {/* CTA */}
      <section className="final-cta">
        <div>
          <h2>آماده‌ای یادگیری را شروع کنی؟</h2>
          <p>اولین قدم مسیر مهندسی خودت را همین امروز بردار.</p>
        </div>
        <Link to="/courses">مشاهده دوره‌ها</Link>
      </section>
    </>
  );
}

export default Home;