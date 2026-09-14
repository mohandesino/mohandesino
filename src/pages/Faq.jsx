import { useEffect, useState } from "react";

function Faq() {
  const [faqs, setFaqs] = useState([
    { id: 1, question: "چطور می‌توانم در سایت ثبت‌نام کنم؟", answer: "برای ثبت‌نام، روی دکمه ثبت‌نام در هدر کلیک کنید و شماره موبایل خود را وارد کنید. کد تأیید برای شما ارسال می‌شود." },
    { id: 2, question: "آیا دوره‌ها رایگان هستند؟", answer: "برخی دوره‌ها رایگان و برخی پولی هستند. دوره‌های رایگان با برچسب 'رایگان' مشخص شده‌اند." },
    { id: 3, question: "چطور می‌توانم دوره بخرم؟", answer: "وارد حساب خود شوید، دوره مورد نظر را انتخاب کنید و روی دکمه خرید کلیک کنید." },
    { id: 4, question: "آیا گواهی پایان دوره دریافت می‌کنم؟", answer: "بله، پس از تکمیل ۱۰۰٪ دوره، گواهی پایان دوره به صورت PDF دریافت می‌کنید." },
  ]);

  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <main className="faq-page" dir="rtl">
      <div className="faq-container">
        <div className="faq-header">
          <h1>❓ سوالات متداول</h1>
          <p>پاسخ به سوالات رایج کاربران</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <div className={`faq-item ${openId === faq.id ? "open" : ""}`} key={faq.id}>
              <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
                <span className="faq-icon">{openId === faq.id ? "−" : "+"}</span>
                <h3>{faq.question}</h3>
              </div>
              {openId === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Faq;