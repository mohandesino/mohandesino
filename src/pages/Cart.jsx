import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Cart() {
  const { dark } = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("mohandesino_cart");
    const savedCourses = localStorage.getItem("mohandesino_courses");

    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
    }

    if (savedCourses) {
      const allCourses = JSON.parse(savedCourses);
      setCourses(allCourses);
    }
  }, []);

  // دریافت اطلاعات کامل دوره‌ها از روی آی‌دی‌های موجود در سبد خرید
  const cartCourses = cartItems
    .map(id => courses.find(c => c.id === id))
    .filter(Boolean);

  const totalPrice = cartCourses.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const removeFromCart = (id) => {
    const updated = cartItems.filter(itemId => itemId !== id);
    setCartItems(updated);
    localStorage.setItem("mohandesino_cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    if (window.confirm("آیا از خالی کردن سبد خرید مطمئن هستید؟")) {
      setCartItems([]);
      localStorage.setItem("mohandesino_cart", JSON.stringify([]));
    }
  };

  const handleCheckout = () => {
    if (cartCourses.length === 0) return;
    // هدایت به صفحه پرداخت برای اولین دوره در سبد خرید
    const firstCourse = cartCourses[0];
    if (firstCourse) {
      window.location.href = `/checkout/${firstCourse.id}`;
    }
  };

  return (
    <main className={`cart-page-modern ${dark ? 'dark' : ''}`} dir="rtl">
      <div className="cart-container-modern">

        <div className="cart-header-modern">
          <div className="cart-header-left">
            <div className="cart-icon-big">🛒</div>
            <div>
              <h1>سبد خرید</h1>
              <p className="cart-subtitle">دوره‌های انتخاب شده برای خرید</p>
            </div>
          </div>
          <div className="cart-header-right">
            <span className="cart-count-badge">{cartCourses.length} دوره</span>
            {cartCourses.length > 0 && (
              <button onClick={clearCart} className="cart-clear-btn">🗑️ خالی کردن</button>
            )}
          </div>
        </div>

        {cartCourses.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon">🛒</div>
            <h2>سبد خرید خالی است</h2>
            <p>هنوز دوره‌ای برای خرید انتخاب نکردی.</p>
            <Link to="/courses" className="cart-empty-btn">مشاهده دوره‌ها</Link>
          </div>
        ) : (
          <div className="cart-content-grid">
            <div className="cart-items-list">
              {cartCourses.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <span>📐</span>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-category">{item.category}</span>
                    <h3>{item.title}</h3>
                    <p className="cart-item-desc">{item.description}</p>
                    <div className="cart-item-meta">
                      <span className="cart-item-level">{item.level}</span>
                      <span className="cart-item-price">
                        {Number(item.price) === 0 ? "🎁 رایگان" : `${Number(item.price).toLocaleString()} تومان`}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="cart-item-remove">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary-card">
              <h3>📋 خلاصه سفارش</h3>
              <div className="cart-summary-row">
                <span>تعداد دوره‌ها</span>
                <span>{cartCourses.length}</span>
              </div>
              <div className="cart-summary-row">
                <span>قیمت کل</span>
                <span className="cart-summary-price">{totalPrice.toLocaleString()} تومان</span>
              </div>
              <div className="cart-summary-divider"></div>
              <div className="cart-summary-row total">
                <span>مبلغ قابل پرداخت</span>
                <span className="cart-total-price">{totalPrice.toLocaleString()} تومان</span>
              </div>
              <button className="cart-checkout-btn" onClick={handleCheckout}>
                {totalPrice === 0 ? "🎁 دریافت رایگان" : "💰 ادامه خرید"}
              </button>
              <Link to="/courses" className="cart-continue-btn">← ادامه خرید</Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default Cart;