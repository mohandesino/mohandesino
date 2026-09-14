import { useState, useEffect } from "react";

function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", excerpt: "", content: "", category: "ریاضی" });

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_blog_posts");
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  const savePosts = (updated) => {
    setPosts(updated);
    localStorage.setItem("mohandesino_blog_posts", JSON.stringify(updated));
  };

  const addPost = () => {
    if (!newPost.title || !newPost.excerpt) {
      alert("عنوان و خلاصه مقاله را وارد کنید.");
      return;
    }
    const post = {
      id: Date.now().toString(),
      ...newPost,
      date: new Date().toLocaleDateString("fa-IR"),
    };
    savePosts([...posts, post]);
    setNewPost({ title: "", excerpt: "", content: "", category: "ریاضی" });
    alert("✅ مقاله با موفقیت اضافه شد!");
  };

  const deletePost = (id) => {
    if (!window.confirm("آیا از حذف این مقاله مطمئن هستید؟")) return;
    savePosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="admin-blog-modern">
      <div className="admin-blog-header">
        <div className="admin-blog-icon">📝</div>
        <div>
          <span className="admin-blog-label">مقالات</span>
          <h2>مدیریت مقالات</h2>
          <p>مقالات جدید اضافه کن یا مقاله‌های موجود رو ویرایش کن.</p>
        </div>
      </div>

      <div className="admin-blog-form-modern">
        <div className="admin-blog-grid">
          <div className="admin-blog-field full">
            <label>📌 عنوان مقاله</label>
            <input
              placeholder="عنوان مقاله را وارد کنید..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
          </div>
          <div className="admin-blog-field full">
            <label>📝 خلاصه مقاله</label>
            <input
              placeholder="خلاصه مقاله را وارد کنید..."
              value={newPost.excerpt}
              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
            />
          </div>
          <div className="admin-blog-field full">
            <label>📄 متن کامل مقاله</label>
            <textarea
              placeholder="متن کامل مقاله را وارد کنید..."
              rows="4"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
          </div>
          <div className="admin-blog-field half">
            <label>🏷️ دسته‌بندی</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            >
              <option>ریاضی</option>
              <option>برق</option>
              <option>برنامه‌نویسی</option>
              <option>مهندسی صنایع</option>
              <option>سایر</option>
            </select>
          </div>
          <div className="admin-blog-field half" style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="admin-blog-add-btn" onClick={addPost} type="button">
              + افزودن مقاله
            </button>
          </div>
        </div>
      </div>

      <div className="admin-blog-list-modern">
        <div className="admin-blog-list-header">
          <h3>📚 مقالات موجود</h3>
          <span className="admin-blog-count">{posts.length} مقاله</span>
        </div>
        {posts.length === 0 ? (
          <div className="admin-blog-empty">هیچ مقاله‌ای وجود ندارد. اولین مقاله را اضافه کن!</div>
        ) : (
          <div className="admin-blog-items">
            {posts.map(p => (
              <div className="admin-blog-item-modern" key={p.id}>
                <div className="admin-blog-item-info">
                  <strong>{p.title}</strong>
                  <div className="admin-blog-item-meta">
                    <span className="admin-blog-item-category">{p.category}</span>
                    <span className="admin-blog-item-date">📅 {p.date}</span>
                  </div>
                </div>
                <button onClick={() => deletePost(p.id)} className="admin-blog-item-delete">🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBlog;