import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config.js";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [cardLast4, setCardLast4] = useState("");

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
        body: JSON.stringify({ course_id: Number(course.id) }),
      });

      const orderData = await orderResponse.json().catch(() => null);

      if (!orderResponse.ok || !orderData?.success || !orderData?.order?.id) {
        throw new Error(orderData?.message || "ایجاد سفارش با خطا مواجه شد.");
      }

      const paymentResponse = await fetch(`${API_BASE}/api/payments/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: Number(orderData.order.id) }),
      });

      const paymentData = await paymentResponse.json().catch(() => null);

      if (!paymentResponse.ok || !paymentData?.success) {
        throw new Error(paymentData?.message || "خطا در دریافت اطلاعات پرداخت.");
      }

      setPaymentInfo(paymentData);
    } catch (error) {
      console.error("خطا در پرداخت:", error);
      alert(error?.message || "خطایی در شروع پرداخت رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentInfo?.order_id) return;

    if (!/^\\d{4}$/.test(cardLast4.trim())) {
      alert("۴ رقم آخر کارت مبدا را وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${API_BASE}/api/payments/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: Number(paymentInfo.order_id),
          card_last4: cardLast4.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "ثبت پرداخت ناموفق بود.");
      }

      setPaymentComplete(true);
    } catch (error) {
      console.error("خطا در ثبت پرداخت:", error);
      alert(error?.message || "خطایی در ثبت پرداخت رخ داد.");
    } finally {
      setLoading(false);
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
          </div>

          <div className="checkout-payment">
            <h2>💳 پرداخت</h2>

            {paymentComplete ? (
              <div className="payment-success">
                <div className="payment-success-icon">✅</div>
                <h3>اطلاعات پرداخت ثبت شد</h3>
                <p>پرداخت شما در انتظار بررسی مدیریت است.</p>
                <p>پس از تأیید، دوره برای شما فعال خواهد شد.</p>
              </div>
            ) : !paymentInfo ? (
              <>
                <div className="payment-methods">
                  <div className="payment-method active">
                    <span className="method-icon">💳</span>
                    <div className="method-info">
                      <strong>پرداخت کارت‌به‌کارت</strong>
                      <span>انتقال مبلغ و ثبت اطلاعات پرداخت</span>
                    </div>
                  </div>
                </div>

                <div className="payment-summary">
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
                  {loading ? 'در حال پردازش...' : '💳 نمایش اطلاعات کارت'}
                </button>

                <p className="payment-secure">
                  پس از انتقال وجه، روی «پرداخت کردم» بزنید و ۴ رقم آخر کارت مبدا را وارد کنید.
                </p>
              </>
            ) : (
              <div className="card-to-card-info">
                <h3>💳 اطلاعات کارت‌به‌کارت</h3>
                <p>
                  مبلغ <strong>{Number(paymentInfo.amount).toLocaleString()} تومان</strong> را به یکی از کارت‌های زیر واریز کنید.
                </p>

                {paymentInfo.cards?.map((card, index) => (
                  <div className="payment-card" key={index}>
                    <strong>{card.bank}</strong>
                    <div>{card.card_number}</div>
                    <small>به نام: {card.holder}</small>
                  </div>
                ))}

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="4"
                  placeholder="۴ رقم آخر کارت مبدا *"
                  value={cardLast4}
                  onChange={(e) =>
                    setCardLast4(e.target.value.replace(/\\D/g, "").slice(0, 4))
                  }
                />

                <button
                  className={`checkout-btn ${loading ? 'loading' : ''}`}
                  onClick={handleSubmitPayment}
                  disabled={loading}
                >
                  {loading ? 'در حال ثبت...' : '✅ پرداخت کردم'}
                </button>

                <p className="payment-secure">
                  پس از بررسی پرداخت توسط مدیریت، دوره برای شما فعال خواهد شد.
                </p>
              </div>
            )}
        </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
