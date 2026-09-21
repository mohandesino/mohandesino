import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [time, setTime] = useState(0);

  const refId = searchParams.get("ref_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <main className="payment-success-page" dir="rtl">
      <div className="payment-success-container">

        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h1>پرداخت با موفقیت انجام شد!</h1>
          <p>
            پرداخت شما با موفقیت تأیید شد و دوره به دوره‌های من اضافه شد.
            {orderId && <><br />شماره سفارش: #{orderId}</>}
          </p>

          <div className="success-details">
            <div className="success-row">
              <span>شماره پیگیری</span>
              <span className="tracking-code">{refId || "ثبت‌شده در زرین‌پال"}</span>
            </div>
            <div className="success-row">
              <span>تاریخ</span>
              <span>{new Date().toLocaleDateString('fa-IR')}</span>
            </div>
            <div className="success-row">
              <span>ساعت</span>
              <span>{new Date().toLocaleTimeString('fa-IR')}</span>
            </div>
            <div className="success-row">
              <span>وضعیت</span>
              <span className="status-paid">✅ پرداخت شده</span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/my-courses" className="success-btn primary">
              📚 رفتن به دوره‌های من
            </Link>
            <Link to="/courses" className="success-btn secondary">
              🔍 مشاهده دوره‌های بیشتر
            </Link>
          </div>

          <div className="success-timer">
            <span>⏱️ </span>
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            <span> زمان سپری شده</span>
          </div>
        </div>

      </div>
    </main>
  );
}

export default PaymentSuccess;