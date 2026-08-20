import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_courses");
    if (saved) {
      const all = JSON.parse(saved);
      setCourses(all);
      setResults(all);
    }
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim() === "") {
      setResults(courses);
    } else {
      const filtered = courses.filter(
        (item) =>
          item.title.includes(q) ||
          item.description.includes(q) ||
          item.category.includes(q)
      );
      setResults(filtered);
    }
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
              onClick={() => {
                setQuery("");
                setResults(courses);
              }}
            >
              ✕
            </button>
          )}
        </div>

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
                  <span className="result-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="result-meta">
                    <span>{item.level}</span>
                    <span>{item.isFree ? "🎁 رایگان" : `${Number(item.price).toLocaleString()} تومان`}</span>
                  </div>
                </div>
                <Link to={`/course/${item.id}`} className="result-link">
                  مشاهده دوره ←
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Search;