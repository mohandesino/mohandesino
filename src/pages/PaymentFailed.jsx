import { Link, useSearchParams } from "react-router-dom";

function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const reason = searchParams.get("reason");

  const reasonText = {
    cancelled: "پرداخت توسط شما لغو شد.",
    missing_authority: "شناسه تراکنش دریافت نشد.",
    payment_not_found: "تراکنش پیدا نشد.",
    merchant_not_configured: "تنظیمات درگاه پرداخت کامل نیست.",
    verify_failed: "تأیید پرداخت توسط درگاه انجام نشد.",
  };

  return (
    <main className="payment-success-page" dir="rtl">
      <div className="payment-success-container">
        <div className="success-card">
          <div className="success-icon">❌</div>

          <h1>پرداخت انجام نشد</h1>

          <p>
            {reasonText[reason] || "در پرداخت مشکلی ایجاد شد."}
          </p>

          {orderId && (
            <div className="success-details">
              <div className="success-row">
                <span>شماره سفارش</span>
                <span>#{orderId}</span>
              </div>
              <div className="success-row">
                <span>وضعیت</span>
                <span>❌ پرداخت ناموفق</span>
              </div>
            </div>
          )}

          <div className="success-actions">
            <Link to="/courses" className="success-btn primary">
              📚 بازگشت به دوره‌ها
            </Link>

            <Link to="/my-courses" className="success-btn secondary">
              🎓 دوره‌های من
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PaymentFailed;
