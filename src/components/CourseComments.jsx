import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function CourseComments({ courseId }) {
  const { dark } = useTheme();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`mohandesino_comments_${courseId}`);
    if (saved) {
      setComments(JSON.parse(saved));
    }

    const userData = localStorage.getItem("mohandesino_user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name || "کاربر");
      setIsAdmin(user.isAdmin === true);
    }
  }, [courseId]);

  const saveComments = (newComments) => {
    setComments(newComments);
    localStorage.setItem(`mohandesino_comments_${courseId}`, JSON.stringify(newComments));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("لطفاً متن نظر را وارد کنید.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("mohandesino_user") || '{}');
    const comment = {
      id: Date.now().toString(),
      userName: userName || "کاربر مهمان",
      rating: rating,
      text: newComment.trim(),
      date: new Date().toLocaleDateString("fa-IR"),
      time: new Date().toLocaleTimeString("fa-IR"),
      userId: userData.phone || userData.name || "guest",
    };

    const updated = [...comments, comment];
    saveComments(updated);
    setNewComment("");
    setRating(5);
  };

  // ===== حذف نظر (ادمین یا صاحب نظر) =====
  const deleteComment = (id) => {
    const userData = JSON.parse(localStorage.getItem("mohandesino_user") || '{}');
    const comment = comments.find(c => c.id === id);
    
    // چک کردن مجوز: ادمین باشه یا صاحب نظر
    const canDelete = isAdmin || (comment && comment.userId === userData.phone);
    
    if (!canDelete) {
      alert("❌ شما مجاز به حذف این نظر نیستید.");
      return;
    }

    if (!window.confirm("آیا از حذف این نظر مطمئن هستید؟")) return;
    const updated = comments.filter(c => c.id !== id);
    saveComments(updated);
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length)
    : 0;

  const ratingCounts = [0, 0, 0, 0, 0];
  comments.forEach(c => {
    if (c.rating >= 1 && c.rating <= 5) ratingCounts[c.rating - 1]++;
  });

  return (
    <div className={`course-comments ${dark ? 'dark' : ''}`}>
      <div className="comments-header">
        <h3>💬 نظرات و امتیازات</h3>
        <div className="rating-summary">
          <div className="average-rating">
            <span className="big-rating">{averageRating.toFixed(1)}</span>
            <span className="stars-display">
              {[1,2,3,4,5].map(star => (
                <span key={star} className="star-icon">
                  {star <= Math.round(averageRating) ? '⭐' : '☆'}
                </span>
              ))}
            </span>
            <span className="rating-count">({comments.length} نظر)</span>
          </div>
          <div className="rating-breakdown">
            {[5,4,3,2,1].map(star => (
              <div key={star} className="rating-row">
                <span className="star-label">{star}⭐</span>
                <div className="rating-bar-bg">
                  <div 
                    className="rating-bar-fill" 
                    style={{ 
                      width: comments.length > 0 
                        ? `${(ratingCounts[star-1] / comments.length) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
                <span className="rating-count-num">{ratingCounts[star-1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-row">
          <div className="form-group">
            <label>نام شما</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
              placeholder="نام خود را وارد کنید"
              required
            />
          </div>
          <div className="form-group">
            <label>امتیاز شما</label>
            <div className="rating-input">
              {[1,2,3,4,5].map(star => (
                <span 
                  key={star}
                  className={`star-picker ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {star <= (hoverRating || rating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="form-group full">
          <label>متن نظر</label>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="submit-comment-btn">ارسال نظر</button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">هنوز نظری ثبت نشده است. اولین نفر باشید!</div>
        ) : (
          comments.slice().reverse().map(comment => {
            const userData = JSON.parse(localStorage.getItem("mohandesino_user") || '{}');
            const canDelete = isAdmin || comment.userId === userData.phone;
            
            return (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-user">
                    <span className="user-avatar">{comment.userName[0]}</span>
                    <span className="user-name">{comment.userName}</span>
                    {isAdmin && <span className="admin-badge">🛡️ ادمین</span>}
                  </div>
                  <div className="comment-meta">
                    <span className="comment-rating">
                      {[1,2,3,4,5].map(star => (
                        <span key={star}>{star <= comment.rating ? '⭐' : '☆'}</span>
                      ))}
                    </span>
                    <span className="comment-date">{comment.date} - {comment.time}</span>
                    {canDelete && (
                      <button onClick={() => deleteComment(comment.id)} className="delete-comment">🗑</button>
                    )}
                  </div>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CourseComments;