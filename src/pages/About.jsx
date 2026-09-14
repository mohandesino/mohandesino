import { useEffect, useState } from "react";

function About() {
  const [settings, setSettings] = useState({
    siteTitle: "مهندسینو",
    aboutText: "ریاضی و فیزیک را ساده و مفهومی یاد بگیر",
    teacherTitle: "مدرس و تولیدکننده محتوای آموزشی مهندسینو",
    aboutFullText: "سلام! من محمدرضا فاضلی‌نیا هستم، مدرس و تولیدکننده محتوای آموزشی. هدف من اینه که ریاضی و فیزیک رو به زبان ساده و قابل‌فهم بهت یاد بدم تا بتونی واقعاً مفاهیم رو درک کنی، نه اینکه فقط حفظ کنی."
  });

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_settings");
    if (saved) {
      const data = JSON.parse(saved);
      setSettings(prev => ({ ...prev, ...data }));
    } else {
      localStorage.setItem("mohandesino_settings", JSON.stringify(settings));
    }
  }, []);

  return (
    <main className="about-page" dir="rtl">
      <div className="about-hero" style={{ textAlign: "center", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "4px" }}>
          {settings.siteTitle || "مهندسینو"}
        </h1>
        <p style={{ fontSize: "18px", color: "#475569", marginBottom: "4px" }}>
          {settings.teacherTitle || "مدرس و تولیدکننده محتوای آموزشی مهندسینو"}
        </p>
        <p style={{ fontSize: "16px", color: "#2563eb", fontWeight: "600" }}>
          {settings.aboutText || "ریاضی و فیزیک را ساده و مفهومی یاد بگیر"}
        </p>
        <div style={{ maxWidth: "600px", margin: "20px auto", fontSize: "16px", lineHeight: "1.8", color: "#334155" }}>
          {settings.aboutFullText || "سلام! من محمدرضا فاضلی‌نیا هستم، مدرس و تولیدکننده محتوای آموزشی. هدف من اینه که ریاضی و فیزیک رو به زبان ساده و قابل‌فهم بهت یاد بدم تا بتونی واقعاً مفاهیم رو درک کنی، نه اینکه فقط حفظ کنی."}
        </div>
      </div>
    </main>
  );
}

export default About;