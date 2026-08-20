function About() {
  return (
    <main className="about-page" dir="rtl">
      <div className="about-hero">
        <h1>درباره مهندسینو</h1>
        <p>پلتفرم آموزشی برای یادگیری ساده، مفهومی و کاربردی مباحث مهندسی</p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <span className="icon">🎯</span>
          <h3>هدف ما</h3>
          <p>هدف مهندسینو این است که مطالب پیچیده مهندسی را به زبان ساده و قابل فهم آموزش دهد تا دانشجو فقط حفظ نکند، بلکه واقعاً مفهوم را یاد بگیرد.</p>
        </div>

        <div className="about-card">
          <span className="icon">🧠</span>
          <h3>روش آموزش</h3>
          <p>آموزش‌ها از پایه شروع می‌شوند و با مثال، تمرین و حل مسئله ادامه پیدا می‌کند تا یادگیری برای دانشجو کاربردی و قابل استفاده باشد.</p>
        </div>

        <div className="about-card">
          <span className="icon">🚀</span>
          <h3>مسیر ما</h3>
          <p>مهندسینو به‌صورت دوره‌های بیشتری در زمینه ریاضی، مهندسی صنایع، برنامه‌نویسی و مهارت‌های کاربردی مهندسی ارائه خواهد کرد.</p>
        </div>
      </div>
    </main>
  );
}

export default About;