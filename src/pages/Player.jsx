import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Player() {
  const { lessonId } = useParams();

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const savedCourse = localStorage.getItem(
      "mohandesino_course"
    );

    if (!savedCourse) return;

    const data = JSON.parse(savedCourse);

    setCourse(data);

    for (const chapter of data.chapters || []) {
      const found = chapter.lessons?.find(
        (item) =>
          String(item.id) === String(lessonId)
      );

      if (found) {
        setLesson(found);
        break;
      }
    }
  }, [lessonId]);

  if (!course || !lesson) {
    return (
      <main
        className="player-page"
        dir="rtl"
      >
        <div className="player-error">
          <h2>درس پیدا نشد</h2>

          <Link to="/courses">
            بازگشت به دوره‌ها
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="player-page"
      dir="rtl"
    >

      <div className="player-container">

        <Link
          to={`/course/${course.title}`}
          className="player-back"
        >
          ← بازگشت به دوره
        </Link>


        <section className="video-box">

          {lesson.video ? (

            <video
              className="main-video"
              controls
              playsInline
              src={lesson.video}
            />

          ) : (

            <div className="video-placeholder">

              <div>
                ▶
              </div>

              <h2>
                ویدئوی این درس هنوز اضافه نشده
              </h2>

              <p>
                لینک ویدئو را از پنل مدیریت اضافه کن.
              </p>

            </div>

          )}

        </section>


        <section className="lesson-details">

          <span>
            {course.category}
          </span>

          <h1>
            {lesson.title}
          </h1>

          <p>
            مدت درس: {lesson.duration}
          </p>

        </section>

      </div>

    </main>
  );
}

export default Player;