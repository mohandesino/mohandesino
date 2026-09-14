import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();

  // با هر تغییر صفحه، اسکرول به بالای صفحه برمی‌گردد
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  // نمایش دکمه بازگشت به بالا
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top"
      aria-label="بازگشت به بالا"
    >
      ↑
    </button>
  );
}

export default ScrollToTop;
