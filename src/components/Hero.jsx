function Hero() {
  return (
    <section className="hero">
      <h1>
        به <span>مهندسینو</span> خوش آمدید 👋
      </h1>

      <p>
        آموزش ریاضی، فیزیک و دروس مهندسی
        <br />
        از دبیرستان تا دانشگاه
      </p>

      <div className="badge">🎯 آموزش ساده و کاربردی</div>

      <div className="cta-btns">
        <a href="#courses" className="btn-primary">
          🚀 مشاهده دوره‌ها
        </a>

        <a href="#contact" className="btn-secondary">
          📞 مشاوره رایگان
        </a>
      </div>
    </section>
  );
}

export default Hero;