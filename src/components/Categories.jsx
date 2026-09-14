const categories = [
  {
    icon: "📐",
    title: "ریاضی دبیرستان",
    desc: "دهم تا دوازدهم",
  },
  {
    icon: "⚡",
    title: "فیزیک دبیرستان",
    desc: "مفهومی + تستی",
  },
  {
    icon: "🎓",
    title: "ریاضی دانشگاه",
    desc: "ریاضی ۱ و ۲",
  },
  {
    icon: "⚙️",
    title: "دروس مهندسی",
    desc: "به‌زودی...",
  },
];

function Categories() {
  return (
    <section>
      <div className="section-title">
        <h2>📂 دسته‌بندی آموزش‌ها</h2>
      </div>

      <div className="categories">
        {categories.map((category, index) => (
          <div className="category" key={index}>
            <span className="icon">{category.icon}</span>
            <h3>{category.title}</h3>
            <p>{category.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;