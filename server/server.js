import express from "express";
import cors from "cors";
import db from "./database.js";
import { adminLogin, requireAdmin } from "./auth.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/admin/login", (req, res) => {
  const { phone = "", password = "" } = req.body;

  const token = adminLogin(phone, password);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "شماره موبایل یا رمز عبور اشتباه است",
    });
  }

  res.json({
    success: true,
    token,
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend مهندسینو با موفقیت فعال است 🚀",
  });
});

app.get("/api/courses", (req, res) => {
  db.all("SELECT * FROM courses ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      courses: rows,
    });
  });
});

app.post("/api/courses", requireAdmin, (req, res) => {
  const {
    title,
    category = "سایر",
    level = "مقدماتی",
    price = 0,
    is_free = 1,
    image = "",
    description = "",
  } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "عنوان دوره الزامی است",
    });
  }

  const sql = `
    INSERT INTO courses
    (title, category, level, price, is_free, image, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [title, category, level, price, is_free, image, description],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "دوره با موفقیت اضافه شد",
        id: this.lastID,
      });
    }
  );
});

app.put("/api/courses/:id", requireAdmin, (req,res) => { const {title,category="سایر",level="مقدماتی",price=0,is_free=1,image="",description=""}=req.body; if(!title) return res.status(400).json({success:false,message:"عنوان دوره الزامی است"}); db.run("UPDATE courses SET title=?,category=?,level=?,price=?,is_free=?,image=?,description=? WHERE id=?",[title,category,level,price,is_free,image,description,req.params.id],function(err){if(err)return res.status(500).json({success:false,message:err.message});res.json({success:true,message:"دوره ویرایش شد"});}); });

app.delete("/api/courses/:id",requireAdmin,(req,res)=>{db.run("DELETE FROM courses WHERE id=?",[req.params.id],function(err){if(err)return res.status(500).json({success:false,message:err.message});res.json({success:true,message:"دوره حذف شد"});});});

app.get("/api/courses/:id/full", (req,res) => {
  db.get("SELECT * FROM courses WHERE id = ?", [req.params.id], (err, course) => {
    if (err) return res.status(500).json({ success:false, message:err.message });
    if (!course) return res.status(404).json({ success:false, message:"دوره پیدا نشد" });
    db.all("SELECT * FROM chapters WHERE course_id = ? ORDER BY sort_order, id", [req.params.id], (err, chapters) => {
      if (err) return res.status(500).json({ success:false, message:err.message });
      let done = 0;
      if (chapters.length === 0) return res.json({ success:true, course:{...course, chapters:[]} });
      chapters.forEach((chapter, index) => {
        db.all("SELECT * FROM lessons WHERE chapter_id = ? ORDER BY sort_order, id", [chapter.id], (err, lessons) => {
          if (err) return res.status(500).json({ success:false, message:err.message });
          chapters[index] = {...chapter, lessons};
          done++;
          if (done === chapters.length) res.json({ success:true, course:{...course, chapters} });
        });
      });
    });
  });
});

app.get("/api/courses/:courseId/chapters", (req, res) => {
  db.all("SELECT * FROM chapters WHERE course_id = ? ORDER BY sort_order, id", [req.params.courseId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, chapters: rows });
  });
});

app.post("/api/chapters", requireAdmin, (req, res) => {
  const { course_id, title, sort_order = 0 } = req.body;
  if (!course_id || !title) return res.status(400).json({ success: false, message: "course_id و عنوان فصل الزامی است" });
  db.run("INSERT INTO chapters (course_id, title, sort_order) VALUES (?, ?, ?)", [course_id, title, sort_order], function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "فصل اضافه شد", id: this.lastID });
  });
});

app.put("/api/chapters/:id", requireAdmin, (req, res) => {
  const { title, sort_order = 0 } = req.body;
  db.run("UPDATE chapters SET title = ?, sort_order = ? WHERE id = ?", [title, sort_order, req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "فصل ویرایش شد" });
  });
});

app.delete("/api/chapters/:id", requireAdmin, (req, res) => {
  db.run("DELETE FROM chapters WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "فصل حذف شد" });
  });
});

app.get("/api/chapters/:chapterId/lessons", (req, res) => { db.all("SELECT * FROM lessons WHERE chapter_id = ? ORDER BY sort_order, id", [req.params.chapterId], (err, rows) => { if (err) return res.status(500).json({ success: false, message: err.message }); res.json({ success: true, lessons: rows }); }); });

app.post("/api/lessons", requireAdmin, (req, res) => { const { chapter_id, title, video = "", free = 0, duration = "", description = "", sort_order = 0 } = req.body; if (!chapter_id || !title) return res.status(400).json({ success: false, message: "chapter_id و عنوان درس الزامی است" }); db.run("INSERT INTO lessons (chapter_id, title, video, free, duration, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)", [chapter_id, title, video, free, duration, description, sort_order], function(err) { if (err) return res.status(500).json({ success: false, message: err.message }); res.json({ success: true, message: "درس اضافه شد", id: this.lastID }); }); });

app.put("/api/lessons/:id", requireAdmin, (req, res) => { const { title, video = "", free = 0, duration = "", description = "", sort_order = 0 } = req.body; db.run("UPDATE lessons SET title = ?, video = ?, free = ?, duration = ?, description = ?, sort_order = ? WHERE id = ?", [title, video, free, duration, description, sort_order, req.params.id], function(err) { if (err) return res.status(500).json({ success: false, message: err.message }); res.json({ success: true, message: "درس ویرایش شد" }); }); });

app.delete("/api/lessons/:id", requireAdmin, (req, res) => { db.run("DELETE FROM lessons WHERE id = ?", [req.params.id], function(err) { if (err) return res.status(500).json({ success: false, message: err.message }); res.json({ success: true, message: "درس حذف شد" }); }); });

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
