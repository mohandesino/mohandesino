import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function BlogPost() {
  const { id } = useParams();
  const { dark } = useTheme();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_blog_posts");
    if (saved) {
      const posts = JSON.parse(saved);
      const found = posts.find(p => p.id === id);
      setPost(found);
    }
  }, [id]);

  if (!post) {
    return (
      <main className={`blog-post-page-modern ${dark ? 'dark' : ''}`} dir="rtl">
        <div className="blog-post-loading-modern">
          <div className="loading-spinner-modern"></div>
          <p>در حال بارگذاری مقاله...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`blog-post-page-modern ${dark ? 'dark' : ''}`} dir="rtl">
      <div className="blog-post-container-modern">

        <Link to="/blog" className="blog-post-back-modern">
          <span>←</span> بازگشت به مقالات
        </Link>

        <div className="blog-post-card-modern">
          <div className="blog-post-header-modern">
            <div className="blog-post-meta-modern">
              <span className="blog-post-category-modern">{post.category}</span>
              <span className="blog-post-date-modern">📅 {post.date}</span>
              <span className="blog-post-readtime-modern">⏱️ ۵ دقیقه مطالعه</span>
            </div>
            <h1>{post.title}</h1>
          </div>

          <div className="blog-post-divider-modern"></div>

          <div className="blog-post-content-modern">
            <p>{post.content}</p>
            <p className="blog-post-placeholder-modern">
              اینجا می‌توانید متن کامل مقاله را بنویسید. 
              برای ویرایش این مقاله به پنل مدیریت بروید.
            </p>
          </div>

          <div className="blog-post-footer-modern">
            <div className="blog-post-author-modern">
              <span className="author-avatar-modern">👤</span>
              <div>
                <strong>مهندسینو</strong>
                <span>تیم تولید محتوا</span>
              </div>
            </div>
            <Link to="/blog" className="blog-post-more-modern">
              مشاهده مقالات بیشتر →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

export default BlogPost;