import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { courses as localCourses } from "../data/courses.js";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    const found = localCourses.find(
      (c) => String(c.id) === String(id)
    );

    if (found) {
      setCourse(found);
    } else {
      navigate("/courses");
    }
  }, [id, navigate]);

  const handlePayment = () => {
    setLoading(true);
    // شبیه‌سازی پرداخت
    setTimeout(() => {
      setLoading(false);
      setPaymentComplete(true);
      
      // ذخیره دوره در دوره‌های من
      const savedMy = localStorage.getItem("mohandesino_my_courses");
      const myCourses = savedMy ? JSON.parse(savedMy) : [];
      const updated = [...myCourses, course];
      localStorage.setItem("mohandesino_my_courses", JSON.stringify(updated));
      
      setTimeout(() => {
        navigate("/payment-success");
      }, 1500);
    }, 2000);
  };

  if (!course) {
    return (
      <main className="checkout-page" dir="rtl">
        <div className="checkout-loading">در حال بارگذاری...</div>
      </main>
    );
  }

  return (
    <main className="checkout-page" dir="rtl">
      <div className="checkout-container">

        <div className="checkout-header">
          <Link to={`/course/${course.id}`} className="checkout-back">
            ← بازگشت به دوره
          </Link>
          <h1>💳 تسویه حساب</h1>
        </div>

        <div className="checkout-grid">

          {/* ===== جزئیات سفارش ===== */}
          <div className="checkout-order">
            <h2>📋 جزئیات سفارش</h2>

            <div className="checkout-course-card">
              <div className="checkout-course-image">
                {course.image ? (
                  <img src={course.image} alt={course.title} />
                ) : (
                  <span>📐</span>
                )}
              </div>
              <div className="checkout-course-info">
                <span className="checkout-course-category">{course.category}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            </div>

            <div className="checkout-divider"></div>

            <div className="checkout-summary">
              <div className="checkout-row">
                <span>💰 قیمت دوره</span>
                <span>{Number(course.price).toLocaleString()} تومان</span>
              </div>
              <div className="checkout-row">
                <span>📊 تعداد درس‌ها</span>
                <span>{course.chapters?.reduce((t, ch) => t + (ch.lessons?.length || 0), 0) || 0} درس</span>
              </div>
              <div className="checkout-row">
                <span>📖 تعداد فصل‌ها</span>
                <span>{course.chapters?.length || 0} فصل</span>
              </div>
              <div className="checkout-divider"></div>
              <div className="checkout-row total">
                <span>مبلغ قابل پرداخت</span>
                <span className="total-price">{Number(course.price).toLocaleString()} تومان</span>
              </div>
            </div>
          </div>

          {/* ===== پرداخت ===== */}
          <div className="checkout-payment">
            <h2>💳 اطلاعات پرداخت</h2>

            {paymentComplete ? (
              <div className="payment-success">
                <div className="payment-success-icon">✅</div>
                <h3>پرداخت موفق!</h3>
                <p>دوره با موفقیت خریداری شد.</p>
                <div className="payment-loader">⏳ در حال انتقال...</div>
              </div>
            ) : (
              <>
                <div className="payment-methods">
                  <div className="payment-method active">
                    <span className="method-icon">🏦</span>
                    <div className="method-info">
                      <strong>پرداخت اینترنتی</strong>
                      <span>زرین‌پال / پرداخت با کارت</span>
                    </div>
                  </div>
                </div>

                <div className="payment-summary">
                  <div className="payment-row">
                    <span>مبلغ</span>
                    <span>{Number(course.price).toLocaleString()} تومان</span>
                  </div>
                  <div className="payment-row">
                    <span>کارمزد</span>
                    <span>رایگان</span>
                  </div>
                  <div className="payment-row total">
                    <span>قابل پرداخت</span>
                    <span className="total-price">{Number(course.price).toLocaleString()} تومان</span>
                  </div>
                </div>

                <button 
                  className={`checkout-btn ${loading ? 'loading' : ''}`}
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      در حال پردازش...
                    </>
                  ) : (
                    '✅ تأیید و پرداخت'
                  )}
                </button>

                <p className="payment-secure">
                  🔒 پرداخت با امنیت بالا انجام می‌شود.
                  <br />
                  <small>برای پرداخت به درگاه بانکی هدایت می‌شوید.</small>
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

export default Checkout;