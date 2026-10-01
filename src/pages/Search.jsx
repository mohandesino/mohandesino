import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config.js";

function Search() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/courses`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "خطا در دریافت دوره‌ها");
        }

        const currentCourses = data.courses || [];
        setCourses(currentCourses);
        setResults(currentCourses);
      } catch (err) {
        console.error("Search courses load error:", err);
        setError("دریافت دوره‌ها با مشکل مواجه شد.");
        setCourses([]);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);

    if (q.trim() === "") {
      setResults(courses);
      return;
    }

    const searchText = q.trim().toLowerCase();

    const filtered = courses.filter((item) => {
      const text = [
        item.title,
        item.description,
        item.category,
        item.level,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(searchText);
    });

    setResults(filtered);
  };

  const clearSearch = () => {
    setQuery("");
    setResults(courses);
  };

  return (
    <main className="search-page" dir="rtl">
      <div className="search-container">
        <div className="search-box">
          <div className="search-icon">🔍</div>

          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="جستجوی دوره، موضوع، دسته‌بندی..."
            className="search-input-large"
            autoFocus
          />

          {query && (
            <button
              className="search-clear"
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="search-empty">
            <div>⏳</div>
            <h3>در حال دریافت دوره‌ها...</h3>
          </div>
        ) : error ? (
          <div className="search-empty">
            <div>⚠️</div>
            <h3>{error}</h3>
          </div>
        ) : (
          <>
            <div className="search-count">
              {results.length} دوره پیدا شد
            </div>

            {results.length === 0 ? (
              <div className="search-empty">
                <div>🔍</div>
                <h3>نتیجه‌ای پیدا نشد</h3>
                <p>سعی کن با کلمات دیگه جستجو کنی.</p>
              </div>
            ) : (
              <div className="search-results">
                {results.map((item) => (
                  <div className="search-result-card" key={item.id}>
                    <div className="result-icon">📐</div>

                    <div className="result-info">
                      <span className="result-category">
                        {item.category}
                      </span>

                      <h3>{item.title}</h3>

                      <p>{item.description}</p>

                      <div className="result-meta">
                        <span>{item.level}</span>

                        <span>
                          {item.isFree
                            ? "🎁 رایگان"
                            : `${Number(item.price).toLocaleString()} تومان`}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/course/${item.id}`}
                      className="result-link"
                    >
                      مشاهده دوره ←
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Search;
