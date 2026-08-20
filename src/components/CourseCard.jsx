import { useNavigate } from "react-router-dom";

function CourseCard({
  icon,
  title,
  level,
  price,
  type,
  desc,
  students,
}) {
  const navigate = useNavigate();

  let tag = "⏳ به‌زودی";
  let tagClass = "coming";

  if (type === "free") {
    tag = "🆓 رایگان";
    tagClass = "free";
  }

  if (type === "paid") {
    tag = "💰 پولی";
    tagClass = "paid";
  }

  function openCourse() {
    navigate(
      "/course?title=" +
        encodeURIComponent(title) +
        "&level=" +
        encodeURIComponent(level || "عمومی") +
        "&price=" +
        encodeURIComponent(price || "رایگان") +
        "&desc=" +
        encodeURIComponent(desc || "")
    );
  }

  return (
    <div className="course">
      <div className="course-img">
        {icon || "📚"}
      </div>

      <div className="course-body">
        <span className={"tag " + tagClass}>
          {tag}
        </span>

        <h3>{title}</h3>

        <div className="level">
          {level || "عمومی"}
        </div>

        <p className="course-desc">
          {desc || "آموزش کاربردی در مهندسینو"}
        </p>

        <div className="price">
          {price || "رایگان"}
        </div>

        <div className="students">
          👨‍🎓 <span>{students || 0}</span> دانشجو
        </div>

        <button onClick={openCourse}>
          {type === "coming" ? "به‌زودی" : "مشاهده دوره"}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;