function Contact() {
  return (
    <main className="contact-page" dir="rtl">
      <div className="contact-hero">
        <h1>ارتباط با مهندسینو</h1>
        <p>چطور می‌توانیم کمک کنیم؟ سوال، پیشنهاد یا مشکل داری؟</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <h3>اطلاعات تماس</h3>

          <div className="contact-info-item">
            <span className="icon">📧</span>
            <div>
              <strong>ایمیل</strong>
              <span>info@mohandesino.ir</span>
            </div>
          </div>

          <div className="contact-info-item">
            <span className="icon">📞</span>
            <div>
              <strong>تلفن</strong>
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
            </div>
          </div>

          <div className="contact-info-item">
            <span className="icon">📍</span>
            <div>
              <strong>آدرس</strong>
              <span>تهران، خیابان مهندسینو</span>
            </div>
          </div>

          <div className="contact-info-item">
            <span className="icon">🕐</span>
            <div>
              <strong>ساعات پشتیبانی</strong>
              <span>روزهای کاری، ۹ صبح تا ۱۸</span>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h3>ارسال پیام</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert("پیام شما ارسال شد!"); }}>
            <label>نام شما</label>
            <input type="text" placeholder="نام و نام خانوادگی..." />

            <label>ایمیل</label>
            <input type="email" placeholder="ایمیل شما..." />

            <label>موضوع</label>
            <input type="text" placeholder="موضوع پیام..." />

            <label>پیام</label>
            <textarea placeholder="پیام خود را بنویسید..."></textarea>

            <button type="submit">ارسال پیام</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;