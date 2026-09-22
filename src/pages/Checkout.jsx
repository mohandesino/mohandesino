import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config.js";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/courses/${id}/full`);
        const data = await response.json();

        if (!response.ok || !data.success || !data.course) {
          navigate("/courses");
          return;
        }

        setCourse(data.course);
      } catch (error) {
        console.error("خطا در دریافت دوره:", error);
        navigate("/courses");
      }
    };

    loadCourse();
  }, [id, navigate]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        alert("برای خرید دوره ابتدا وارد حساب کاربری شوید.");
        navigate("/login");
        return;
      }

      const orderResponse = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: Number(course.id),
        }),
      });

      const orderData = await orderResponse.json().catch(() => null);

      if (!orderResponse.ok || !orderData?.success || !orderData?.order?.id) {
        throw new Error(
          orderData?.message || "ایجاد سفارش با خطا مواجه شد."
        );
      }

      const paymentResponse = await fetch(`${API_BASE}/api/payments/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: Number(orderData.order.id),
        }),
      });

      const paymentData = await paymentResponse.json().catch(() => null);

      if (
        !paymentResponse.ok ||
        !paymentData?.success ||
        !paymentData?.payment_url
      ) {
        const code = paymentData?.code ?? "نامشخص";
        const errors = Array.isArray(paymentData?.errors)
          ? paymentData.errors.join(" | ")
          : "";

        throw new Error(
          `${paymentData?.message || "خطا در اتصال به درگاه زرین‌پال."} | کد: ${code}${errors ? ` | ${errors}` : ""}`
        );
      }

      window.location.href = paymentData.payment_url;
    } catch (error) {
      console.error("خطا در پرداخت:", error);
      setLoading(false);
      alert(error?.message || "خطایی در شروع پرداخت رخ داد.");
    }
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