import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Learn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({});
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const currentUser = localStorage.getItem("currentUser");

    if (!token || !currentUser) {
      alert("🔐 ابتدا وارد حساب کاربری خود شوید.");
      navigate("/login");
      return;
    }

    const saved = localStorage.getItem("mohandesino_courses");
    const savedProgress = localStorage.getItem(`mohandesino_progress_${id}`);

    if (saved) {
      const all = JSON.parse(saved);
      const found = all.find(c => c.id === id);
      if (found) {
        setCourse(found);
        // محاسبه تعداد کل درس‌ها
        const totalLessons = found.chapters?.reduce(
          (t, ch) => t + (ch.lessons?.length || 0), 0
        ) || 0;
        
        // بازیابی پیشرفت
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        } else {
          const initial = {
            completed: [],
            total: totalLessons,
            lastLesson: null,
          };
          setProgress(initial);
          localStorage.setItem(`mohandesino_progress_${id}`, JSON.stringify(initial));
        }
      } else {
        navigate("/courses");
      }
    } else {
      navigate("/courses");
    }
  }, [id, navigate]);

  // محاسبه درصد پیشرفت
  const completedCount = progress.completed?.length || 0;
  const totalCount = progress.total || 1;
  const percent = Math.round((completedCount / totalCount) * 100);

  // علامت‌گذاری درس به عنوان دیده شده
  const markLessonComplete = (chapterIndex, lessonIndex, lessonId) => {
    if (!progress.completed?.includes(lessonId)) {
      const updated = {
        ...progress,
        completed: [...(progress.completed || []), lessonId],
        lastLesson: lessonId,
      };
      setProgress(updated);
      localStorage.setItem(`mohandesino_progress_${id}`, JSON.stringify(updated));
    }
  };

  // دریافت لیست همه درس‌ها
  const getAllLessons = () => {
    const lessons = [];
    course?.chapters?.forEach((chapter, ci) => {
      chapter.lessons?.forEach((lesson, li) => {
        lessons.push({
          ...lesson,
          chapterIndex: ci,
          lessonIndex: li,
          chapterTitle: chapter.title,
        });
      });
    });
    return lessons;
  };

  const allLessons = getAllLessons();
  const currentLessonData = allLessons.find(
    (_, index) => index === currentLesson
  );

  const goToNext = () => {
    if (currentLesson < allLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      // پیدا کردن chapter متناسب
      const next = allLessons[currentLesson + 1];
      if (next) {
        setCurrentChapter(next.chapterIndex);
      }
    }
  };

  const goToPrev = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      const prev = allLessons[currentLesson - 1];
      if (prev) {
        setCurrentChapter(prev.chapterIndex);
      }
    }
  };

  if (!course) {
    return (
      <main className="learn-page" dir="rtl">
        <div className="learn-loading">در حال بارگذاری...</div>
      </main>
    );
  }

  return (
    <main className="learn-page" dir="rtl">
      <div className="learn-container">

        {/* ===== هدر دوره ===== */}
        <div className="learn-header">
          <div className="learn-header-top">
            <Link to={`/course/${id}`} className="learn-back">
              ← بازگشت به دوره
            </Link>
            <h1>{course.title}</h1>
            <span className="learn-progress-badge">{percent}%</span>
          </div>
          <div className="learn-progress-bar">
            <div 
              className="learn-progress-fill" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <div className="learn-progress-text">
            <span>{completedCount} از {totalCount} درس</span>
            <span>پیشرفت: {percent}%</span>
          </div>
        </div>

        <div className="learn-grid">

          {/* ===== پخش‌کننده ===== */}
          <div className="learn-player">
            <div className="learn-video">
              {currentLessonData?.video ? (
                <div className="video-wrapper">
                  {currentLessonData.video.includes("youtube") || 
                   currentLessonData.video.includes("aparat") ? (
                    <iframe
                      src={currentLessonData.video}
                      title={currentLessonData.title}
                      allowFullScreen
                      className="video-frame"
                    ></iframe>
                  ) : (
                    <video
                      src={currentLessonData.video}
                      controls
                      className="video-player"
                    />
                  )}
                </div>
              ) : (
                <div className="video-placeholder">
                  <span>🎬</span>
                  <p>هیچ ویدئویی برای این درس وجود ندارد.</p>
                </div>
              )}
            </div>

            <div className="learn-lesson-info">
              <span className="learn-badge">
                {currentLessonData?.chapterTitle || "فصل"}
              </span>
              <h2>{currentLessonData?.title || "درسی انتخاب نشده"}</h2>
              <p>{currentLessonData?.duration || ""}</p>
            </div>

            <div className="learn-navigation">
              <button 
                onClick={goToPrev} 
                disabled={currentLesson === 0}
                className="learn-nav-btn prev"
              >
                ← قبلی
              </button>
              <span className="learn-counter">
                {currentLesson + 1} از {allLessons.length}
              </span>
              <button 
                onClick={() => {
                  if (currentLessonData) {
                    markLessonComplete(
                      currentLessonData.chapterIndex,
                      currentLessonData.lessonIndex,
                      currentLessonData.id
                    );
                  }
                  goToNext();
                }}
                disabled={currentLesson === allLessons.length - 1}
                className="learn-nav-btn next"
              >
                بعدی →
              </button>
            </div>
          </div>

          {/* ===== لیست دروس ===== */}
          <div className="learn-sidebar">
            <h3>📚 فهرست دروس</h3>
            <div className="learn-lessons-list">
              {allLessons.map((item, index) => {
                const isCompleted = progress.completed?.includes(item.id);
                const isActive = index === currentLesson;
                return (
                  <div
                    key={item.id}
                    className={`learn-lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      setCurrentLesson(index);
                      setCurrentChapter(item.chapterIndex);
                      // اگر کامل نشده بود، کامل کن
                      if (!isCompleted) {
                        markLessonComplete(
                          item.chapterIndex,
                          item.lessonIndex,
                          item.id
                        );
                      }
                    }}
                  >
                    <span className="lesson-status">
                      {isCompleted ? '✅' : (isActive ? '▶' : '○')}
                    </span>
                    <span className="lesson-title">{item.title}</span>
                    {isCompleted && <span className="lesson-check">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Learn;