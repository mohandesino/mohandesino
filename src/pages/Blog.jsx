import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Blog() {
  const { dark } = useTheme();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_blog_posts");
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const defaultPosts = [
        {
          id: "1",
          title: "چگونه توان و رادیکال را ساده یاد بگیریم؟",
          excerpt: "در این مقاله به صورت قدم‌به‌قدم با مفاهیم توان و رادیکال آشنا می‌شوید.",
          content: "متن کامل مقاله...",
          date: "۱۴۰۴/۰۵/۲۰",
          category: "ریاضی"
        },
        {
          id: "2",
          title: "۱۰ ترفند طلایی در اکسل برای مهندسان",
          excerpt: "با این ترفندها، کار با اکسل برای شما حرفه‌ای‌تر می‌شود.",
          content: "متن کامل مقاله...",
          date: "۱۴۰۴/۰۵/۱۸",
          category: "مهندسی صنایع"
        }
      ];
      localStorage.setItem("mohandesino_blog_posts", JSON.stringify(defaultPosts));
      setPosts(defaultPosts);
    }
  }, []);

  return (
    <main className={`blog-page-modern ${dark ? 'dark' : ''}`} dir="rtl">
      <div className="blog-container-modern">

        <div className="blog-header-modern">
          <div className="blog-header-content-modern">
            <span className="blog-header-badge-modern">📝 مجله مهندسینو</span>
            <h1>جدیدترین مقالات آموزشی</h1>
            <p>با مقالات تخصصی ما، دانش مهندسی خود را به روز نگه دارید.</p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="blog-empty-modern">
            <span className="blog-empty-icon-modern">📖</span>
            <h3>هنوز مقاله‌ای منتشر نشده</h3>
            <p>به زودی مقالات جدید در مهندسینو منتشر می‌شوند.</p>
          </div>
        ) : (
          <div className="blog-grid-modern">
            {posts.map(post => (
              <div className="blog-card-modern" key={post.id}>
                <div className="blog-card-image-modern">
                  <span className="blog-card-icon-modern">📄</span>
                  <span className="blog-card-category-modern">{post.category}</span>
                </div>
                <div className="blog-card-body-modern">
                  <div className="blog-card-meta-modern">
                    <span className="blog-card-date-modern">📅 {post.date}</span>
                    <span className="blog-card-readtime-modern">⏱️ ۵ دقیقه</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="blog-card-link-modern">
                    مطالعه بیشتر <span>←</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

export default Blog;