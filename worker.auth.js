const ALLOWED_ORIGINS = [
  "https://mohandesino2026.ir",
  "https://www.mohandesino2026.ir",
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin)
        ? origin
        : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };

    // CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // =========================
      // TEST
      // =========================
      if (path === "/api/test" && request.method === "GET") {
        return json(
          {
            success: true,
            message: "Backend مهندسینو با موفقیت فعال است 🚀",
          },
          200,
          cors,
        );
      }

      // =========================
      // ADMIN
      // =========================
    if (path === "/api/admin/me" && request.method === "POST") {
        const { user, error } = await requireAdmin(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const adminToken = await createAdminSession(env, user.id);

        return json(
          {
            success: true,
            message: "ورود مدیریت موفق بود",
            admin_token: adminToken,
            user,
          },
          200,
          cors,
        );
      }

      if (path === "/api/admin/logout" && request.method === "POST") {
        const auth = request.headers.get("Authorization") || "";

        if (auth.startsWith("Bearer ")) {
          const token = auth.slice(7).trim();

          if (token) {
            await env.DB.prepare(
              "DELETE FROM admin_sessions WHERE token = ?",
            )
              .bind(token)
              .run();
          }
        }

        return json(
          {
            success: true,
            message: "خروج مدیریت با موفقیت انجام شد",
          },
          200,
          cors,
        );
      }

      // =========================
      // SIGNUP
      // =========================
      if (path === "/api/auth/me" && request.method === "GET") {
        const user = await getSessionUser(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: "نشست کاربری معتبر نیست",
            },
            401,
            cors,
          );
        }

        return json(
          {
            success: true,
            user,
          },
          200,
          cors,
        );
      }

      if (path === "/api/auth/logout" && request.method === "POST") {
        await deleteSession(request, env);

        return json(
          {
            success: true,
            message: "خروج با موفقیت انجام شد",
          },
          200,
          cors,
        );
      }

      if (path === "/api/auth/signup" && request.method === "POST") {
        const body = await request.json();

        const name = String(body.name || "").trim();
        const phone = String(body.phone || "").trim();
        const password = String(body.password || "");

        if (!name) {
          return json(
            {
              success: false,
              message: "نام را وارد کنید",
            },
            400,
            cors,
          );
        }

        if (!/^09\d{9}$/.test(phone)) {
          return json(
            {
              success: false,
              message: "شماره موبایل معتبر نیست",
            },
            400,
            cors,
          );
        }

        if (password.length < 6) {
          return json(
            {
              success: false,
              message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
            },
            400,
            cors,
          );
        }

        const existing = await env.DB.prepare(
          "SELECT id FROM users WHERE phone = ? LIMIT 1",
        )
          .bind(phone)
          .first();

        if (existing) {
          return json(
            {
              success: false,
              message: "این شماره قبلاً ثبت‌نام کرده است",
            },
            400,
            cors,
          );
        }

        const passwordHash = await hashPassword(password);

        const result = await env.DB.prepare(
          `INSERT INTO users
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          (phone, name, password_hash, is_admin)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      VALUES (?, ?, ?, 0)`,
        )
          .bind(phone, name, passwordHash)
          .run();

        return json(
          {
            success: true,
            message: "ثبت‌نام با موفقیت انجام شد",
            token: await createSession(env, result.meta.last_row_id),
            user: {
              id: result.meta.last_row_id,
              phone,
              name,
              is_admin: 0,
            },
          },
          201,
          cors,
        );
      }

      // =========================
      // LOGIN
      // =========================
      if (path === "/api/auth/login" && request.method === "POST") {
        const body = await request.json();

        const phone = String(body.phone || "").trim();
        const password = String(body.password || "");

        const user = await env.DB.prepare(
          `SELECT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        id,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      phone,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    name,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  password_hash,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                is_admin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            FROM users
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        WHERE phone = ?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    LIMIT 1`,
        )
          .bind(phone)
          .first();

        if (!user) {
          return json(
            {
              success: false,
              message: "شماره موبایل یا رمز عبور اشتباه است",
            },
            401,
            cors,
          );
        }

        const valid = await verifyPassword(password, user.password_hash);

        if (!valid) {
          return json(
            {
              success: false,
              message: "شماره موبایل یا رمز عبور اشتباه است",
            },
            401,
            cors,
          );
        }

        return json(
          {
            success: true,
            message: "ورود موفق بود",
            token: await createSession(env, user.id),
            user: {
              id: user.id,
              phone: user.phone,
              name: user.name,
              is_admin: user.is_admin,
            },
          },
          200,
          cors,
        );
      }

      // =========================
      // ADMIN COURSES
      // =========================
      if (path === "/api/admin/courses" && request.method === "GET") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const { results } = await env.DB.prepare(
          "SELECT * FROM courses ORDER BY id DESC",
        ).all();

        return json(
          {
            success: true,
            courses: results,
          },
          200,
          cors,
        );
      }

      if (path === "/api/admin/courses" && request.method === "POST") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const body = await request.json().catch(() => null);

        if (!body || !String(body.title || "").trim()) {
          return json(
            {
              success: false,
              message: "عنوان دوره الزامی است",
            },
            400,
            cors,
          );
        }

        const title = String(body.title).trim();
        const category = String(body.category || "سایر").trim();
        const level = String(body.level || "مقدماتی").trim();
        const price = Math.max(0, Number(body.price) || 0);
        const isFree = body.is_free ? 1 : 0;
        const image = String(body.image || "").trim();
        const description = String(body.description || "").trim();

        const result = await env.DB.prepare(
          `INSERT INTO courses
            (title, category, level, price, is_free, image, description)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            title,
            category,
            level,
            price,
            isFree,
            image,
            description,
          )
          .run();

        const course = await env.DB.prepare(
          "SELECT * FROM courses WHERE id = ?",
        )
          .bind(result.meta.last_row_id)
          .first();

        return json(
          {
            success: true,
            message: "دوره با موفقیت ایجاد شد",
            course,
          },
          201,
          cors,
        );
      }

      const adminCourseMatch = path.match(/^\/api\/admin\/courses\/(\d+)$/);

      if (adminCourseMatch && request.method === "PUT") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const courseId = Number(adminCourseMatch[1]);
        const body = await request.json().catch(() => null);

        if (!body || !String(body.title || "").trim()) {
          return json(
            {
              success: false,
              message: "عنوان دوره الزامی است",
            },
            400,
            cors,
          );
        }

        const title = String(body.title).trim();
        const category = String(body.category || "سایر").trim();
        const level = String(body.level || "مقدماتی").trim();
        const price = Math.max(0, Number(body.price) || 0);
        const isFree = body.is_free ? 1 : 0;
        const image = String(body.image || "").trim();
        const description = String(body.description || "").trim();

        const result = await env.DB.prepare(
          `UPDATE courses
           SET title = ?,
               category = ?,
               level = ?,
               price = ?,
               is_free = ?,
               image = ?,
               description = ?
           WHERE id = ?`,
        )
          .bind(
            title,
            category,
            level,
            price,
            isFree,
            image,
            description,
            courseId,
          )
          .run();

        if (!result.meta.changes) {
          return json(
            {
              success: false,
              message: "دوره پیدا نشد",
            },
            404,
            cors,
          );
        }

        const course = await env.DB.prepare(
          "SELECT * FROM courses WHERE id = ?",
        )
          .bind(courseId)
          .first();

        return json(
          {
            success: true,
            message: "دوره با موفقیت ویرایش شد",
            course,
          },
          200,
          cors,
        );
      }

      if (adminCourseMatch && request.method === "DELETE") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const courseId = Number(adminCourseMatch[1]);

        const course = await env.DB.prepare(
          "SELECT id FROM courses WHERE id = ?",
        )
          .bind(courseId)
          .first();

        if (!course) {
          return json(
            {
              success: false,
              message: "دوره پیدا نشد",
            },
            404,
            cors,
          );
        }

        const orderCount = await env.DB.prepare(
          "SELECT COUNT(*) AS count FROM orders WHERE course_id = ?",
        )
          .bind(courseId)
          .first();

        const enrollmentCount = await env.DB.prepare(
          "SELECT COUNT(*) AS count FROM enrollments WHERE course_id = ?",
        )
          .bind(courseId)
          .first();

        if (
          Number(orderCount?.count || 0) > 0 ||
          Number(enrollmentCount?.count || 0) > 0
        ) {
          return json(
            {
              success: false,
              message: "این دوره دارای سفارش یا ثبت‌نام است و قابل حذف نیست.",
            },
            409,
            cors,
          );
        }

        try {
          await env.DB.prepare(
            "DELETE FROM courses WHERE id = ?",
          )
            .bind(courseId)
            .run();
        } catch (error) {
          return json(
            {
              success: false,
              message: "حذف دوره انجام نشد. ابتدا وابستگی‌های دوره را بررسی کنید.",
            },
            409,
            cors,
          );
        }

        return json(
          {
            success: true,
            message: "دوره با موفقیت حذف شد",
          },
          200,
          cors,
        );
      }

      // =========================
      // ADMIN CHAPTERS
      // =========================
      if (path === "/api/chapters" && request.method === "POST") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const body = await request.json().catch(() => null);
        const courseId = Number(body?.course_id);
        const title = String(body?.title || "").trim();
        const sortOrder = Number(body?.sort_order) || 0;

        if (!courseId || !title) {
          return json(
            {
              success: false,
              message: "دوره و عنوان فصل الزامی هستند",
            },
            400,
            cors,
          );
        }

        const course = await env.DB.prepare(
          "SELECT id FROM courses WHERE id = ?",
        )
          .bind(courseId)
          .first();

        if (!course) {
          return json(
            {
              success: false,
              message: "دوره پیدا نشد",
            },
            404,
            cors,
          );
        }

        const result = await env.DB.prepare(
          `INSERT INTO chapters (course_id, title, sort_order)
           VALUES (?, ?, ?)`,
        )
          .bind(courseId, title, sortOrder)
          .run();

        return json(
          {
            success: true,
            message: "فصل با موفقیت ایجاد شد",
            id: result.meta.last_row_id,
          },
          201,
          cors,
        );
      }

      const adminChapterMatch = path.match(/^\/api\/chapters\/(\d+)$/);

      if (adminChapterMatch && request.method === "PUT") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const chapterId = Number(adminChapterMatch[1]);
        const body = await request.json().catch(() => null);
        const title = String(body?.title || "").trim();

        if (!title) {
          return json(
            {
              success: false,
              message: "عنوان فصل الزامی است",
            },
            400,
            cors,
          );
        }

        const result = await env.DB.prepare(
          `UPDATE chapters
           SET title = ?
           WHERE id = ?`,
        )
          .bind(title, chapterId)
          .run();

        if (!result.meta.changes) {
          return json(
            {
              success: false,
              message: "فصل پیدا نشد",
            },
            404,
            cors,
          );
        }

        const chapter = await env.DB.prepare(
          "SELECT * FROM chapters WHERE id = ?",
        )
          .bind(chapterId)
          .first();

        return json(
          {
            success: true,
            message: "فصل با موفقیت ویرایش شد",
            chapter,
          },
          200,
          cors,
        );
      }

      if (adminChapterMatch && request.method === "DELETE") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const chapterId = Number(adminChapterMatch[1]);

        const chapter = await env.DB.prepare(
          "SELECT id FROM chapters WHERE id = ?",
        )
          .bind(chapterId)
          .first();

        if (!chapter) {
          return json(
            {
              success: false,
              message: "فصل پیدا نشد",
            },
            404,
            cors,
          );
        }

        try {
          await env.DB.prepare(
            "DELETE FROM chapters WHERE id = ?",
          )
            .bind(chapterId)
            .run();
        } catch (error) {
          return json(
            {
              success: false,
              message: "حذف فصل انجام نشد. ابتدا وابستگی‌های فصل را بررسی کنید.",
            },
            409,
            cors,
          );
        }

        return json(
          {
            success: true,
            message: "فصل با موفقیت حذف شد",
          },
          200,
          cors,
        );
      }

      // =========================
      // ADMIN LESSONS
      // =========================
      if (path === "/api/lessons" && request.method === "POST") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const body = await request.json().catch(() => null);

        const chapterId = Number(body?.chapter_id);
        const title = String(body?.title || "").trim();
        const video = String(body?.video || "").trim();
        const free = body?.free ? 1 : 0;
        const duration = String(body?.duration || "").trim();
        const description = String(body?.description || "").trim();
        const sortOrder = Number(body?.sort_order) || 0;

        if (!chapterId || !title) {
          return json(
            {
              success: false,
              message: "فصل و عنوان درس الزامی هستند",
            },
            400,
            cors,
          );
        }

        const chapter = await env.DB.prepare(
          "SELECT id FROM chapters WHERE id = ?",
        )
          .bind(chapterId)
          .first();

        if (!chapter) {
          return json(
            {
              success: false,
              message: "فصل پیدا نشد",
            },
            404,
            cors,
          );
        }

        const result = await env.DB.prepare(
          `INSERT INTO lessons
            (chapter_id, title, video, free, duration, description, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            chapterId,
            title,
            video,
            free,
            duration,
            description,
            sortOrder,
          )
          .run();

        return json(
          {
            success: true,
            message: "درس با موفقیت ایجاد شد",
            id: result.meta.last_row_id,
          },
          201,
          cors,
        );
      }

      const adminLessonMatch = path.match(/^\/api\/lessons\/(\d+)$/);

      if (adminLessonMatch && request.method === "PUT") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const lessonId = Number(adminLessonMatch[1]);
        const body = await request.json().catch(() => null);

        const title = String(body?.title || "").trim();
        const video = String(body?.video || "").trim();
        const free = body?.free ? 1 : 0;
        const duration = String(body?.duration || "").trim();
        const description = String(body?.description || "").trim();
        const sortOrder = Number(body?.sort_order) || 1;

        if (!title) {
          return json(
            {
              success: false,
              message: "عنوان درس الزامی است",
            },
            400,
            cors,
          );
        }

        const result = await env.DB.prepare(
          `UPDATE lessons
           SET title = ?,
               video = ?,
               free = ?,
               duration = ?,
               description = ?,
               sort_order = ?
           WHERE id = ?`,
        )
          .bind(
            title,
            video,
            free,
            duration,
            description,
            sortOrder,
            lessonId,
          )
          .run();

        if (!result.meta.changes) {
          return json(
            {
              success: false,
              message: "درس پیدا نشد",
            },
            404,
            cors,
          );
        }

        const lesson = await env.DB.prepare(
          "SELECT * FROM lessons WHERE id = ?",
        )
          .bind(lessonId)
          .first();

        return json(
          {
            success: true,
            message: "درس با موفقیت ویرایش شد",
            lesson,
          },
          200,
          cors,
        );
      }

      if (adminLessonMatch && request.method === "DELETE") {
        const { user, error } = await requireAdminSession(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: error,
            },
            401,
            cors,
          );
        }

        const lessonId = Number(adminLessonMatch[1]);

        const lesson = await env.DB.prepare(
          "SELECT id FROM lessons WHERE id = ?",
        )
          .bind(lessonId)
          .first();

        if (!lesson) {
          return json(
            {
              success: false,
              message: "درس پیدا نشد",
            },
            404,
            cors,
          );
        }

        try {
          await env.DB.prepare(
            "DELETE FROM lessons WHERE id = ?",
          )
            .bind(lessonId)
            .run();
        } catch (error) {
          return json(
            {
              success: false,
              message: "حذف درس انجام نشد. ابتدا وابستگی‌های درس را بررسی کنید.",
            },
            409,
            cors,
          );
        }

        return json(
          {
            success: true,
            message: "درس با موفقیت حذف شد",
          },
          200,
          cors,
        );
      }

      // =========================
      // COURSES
      // =========================
      if (path === "/api/courses" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM courses ORDER BY id DESC",
        ).all();

        return json(
          {
            success: true,
            courses: results,
          },
          200,
          cors,
        );
      }

      // =========================
      // FULL COURSE
      // =========================
      const courseMatch = path.match(/^\/api\/courses\/(\d+)\/full$/);

      if (courseMatch && request.method === "GET") {
        const courseId = Number(courseMatch[1]);

        const course = await env.DB.prepare(
          "SELECT * FROM courses WHERE id = ?",
        )
          .bind(courseId)
          .first();

        if (!course) {
          return json(
            {
              success: false,
              message: "دوره پیدا نشد",
            },
            404,
            cors,
          );
        }

        const { results: chapters } = await env.DB.prepare(
          `SELECT *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               FROM chapters
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            WHERE course_id = ?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ORDER BY sort_order ASC, id ASC`,
        )
          .bind(courseId)
          .all();

        for (const chapter of chapters) {
          const { results: lessons } = await env.DB.prepare(
            `SELECT *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  FROM lessons
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 WHERE chapter_id = ?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ORDER BY sort_order ASC, id ASC`,
          )
            .bind(chapter.id)
            .all();

          chapter.lessons = lessons;
        }

        return json(
          {
            success: true,
            course,
            chapters,
          },
          200,
          cors,
        );
      }

      // =========================
      // ORDERS
      // =========================
      if (path === "/api/orders" && request.method === "POST") {
        const user = await getSessionUser(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: "برای ثبت سفارش باید وارد حساب شوید",
            },
            401,
            cors,
          );
        }

        const body = await request.json().catch(() => null);
        const courseId = Number(body?.course_id);

        if (!Number.isInteger(courseId) || courseId <= 0) {
          return json(
            {
              success: false,
              message: "شناسه دوره نامعتبر است",
            },
            400,
            cors,
          );
        }

        const course = await env.DB
          .prepare(
            `SELECT id, title, price, is_free
             FROM courses
             WHERE id = ?
             LIMIT 1`,
          )
          .bind(courseId)
          .first();

        if (!course) {
          return json(
            {
              success: false,
              message: "دوره پیدا نشد",
            },
            404,
            cors,
          );
        }

        if (Number(course.is_free) === 1 || Number(course.price) <= 0) {
          return json(
            {
              success: false,
              message: "این دوره رایگان است و نیازی به سفارش ندارد",
            },
            400,
            cors,
          );
        }

        const existing = await env.DB
          .prepare(
            `SELECT id, status
             FROM orders
             WHERE user_id = ?
               AND course_id = ?
               AND status = 'pending'
             ORDER BY id DESC
             LIMIT 1`,
          )
          .bind(user.id, courseId)
          .first();

        if (existing) {
          return json(
            {
              success: true,
              message: "سفارش در انتظار پرداخت از قبل وجود دارد",
              order: {
                id: existing.id,
                status: existing.status,
                course_id: course.id,
                amount: Number(course.price),
              },
            },
            200,
            cors,
          );
        }

        const result = await env.DB
          .prepare(
            `INSERT INTO orders (user_id, course_id, amount, status)
             VALUES (?, ?, ?, 'pending')`,
          )
          .bind(user.id, courseId, Number(course.price))
          .run();

        return json(
          {
            success: true,
            message: "سفارش با موفقیت ایجاد شد",
            order: {
              id: result.meta.last_row_id,
              course_id: course.id,
              course_title: course.title,
              amount: Number(course.price),
              status: "pending",
            },
          },
          201,
          cors,
        );
      }

      // =========================
      // =========================
      // PAYMENTS - ZARINPAL
      // =========================
      if (path === "/api/payments/request" && request.method === "POST") {
        const user = await getSessionUser(request, env);

        if (!user) {
          return json(
            {
              success: false,
              message: "برای پرداخت باید وارد حساب شوید",
            },
            401,
            cors,
          );
        }

        const body = await request.json().catch(() => null);
        const orderId = Number(body?.order_id);

        if (!Number.isInteger(orderId) || orderId <= 0) {
          return json(
            {
              success: false,
              message: "شناسه سفارش نامعتبر است",
            },
            400,
            cors,
          );
        }

        const order = await env.DB
          .prepare(
            `SELECT o.id, o.course_id, o.amount, o.status, c.title
             FROM orders o
             JOIN courses c ON c.id = o.course_id
             WHERE o.id = ?
               AND o.user_id = ?
             LIMIT 1`,
          )
          .bind(orderId, user.id)
          .first();

        if (!order) {
          return json(
            {
              success: false,
              message: "سفارش پیدا نشد",
            },
            404,
            cors,
          );
        }

        if (order.status !== "pending") {
          return json(
            {
              success: false,
              message: "این سفارش قابل پرداخت نیست",
            },
            400,
            cors,
          );
        }

        const amount = Number(order.amount);

        if (!Number.isInteger(amount) || amount <= 0) {
          return json(
            {
              success: false,
              message: "مبلغ سفارش نامعتبر است",
            },
            400,
            cors,
          );
        }

        const merchantId = env.ZARINPAL_MERCHANT_ID;

        if (!merchantId) {
          return json(
            {
              success: false,
              message: "تنظیمات درگاه پرداخت کامل نیست",
            },
            500,
            cors,
          );
        }

        const callbackUrl =
          "https://mohandesino-api.mohammadrezafazelinia92.workers.dev/api/payments/callback";

        const paymentRequest = await zarinpalRequest("request", {
          merchant_id: merchantId,
          amount,
          description: `پرداخت دوره ${order.title}`,
          callback_url: callbackUrl,
        });

        const authority = paymentRequest.data?.data?.authority;

        if (!paymentRequest.ok || !authority) {
          return json(
            {
              success: false,
              message: "دریافت اطلاعات پرداخت از زرین‌پال ناموفق بود",
            },
            502,
            cors,
          );
        }

        await env.DB
          .prepare(
            `INSERT INTO payments
             (order_id, authority, amount, status, gateway)
             VALUES (?, ?, ?, 'pending', 'zarinpal')`,
          )
          .bind(order.id, authority, amount)
          .run();

        return json(
          {
            success: true,
            message: "درخواست پرداخت با موفقیت ایجاد شد",
            payment: {
              authority,
              payment_url: `https://www.zarinpal.com/pg/StartPay/${authority}`,
            },
          },
          201,
          cors,
        );
      }

      // =========================
      // PAYMENT CALLBACK - ZARINPAL
      // =========================
      if (path === "/api/payments/callback" && request.method === "GET") {
        const authority = String(url.searchParams.get("Authority") || "").trim();
        const status = String(url.searchParams.get("Status") || "").trim();

        if (!authority) {
          return Response.redirect(
            "https://mohandesino2026.ir/payment-failed?reason=missing_authority",
            302,
          );
        }

        const payment = await env.DB
          .prepare(
            `SELECT p.id, p.order_id, p.amount, p.status,
                    o.user_id, o.course_id
             FROM payments p
             JOIN orders o ON o.id = p.order_id
             WHERE p.authority = ?
             LIMIT 1`,
          )
          .bind(authority)
          .first();

        if (!payment) {
          return Response.redirect(
            "https://mohandesino2026.ir/payment-failed?reason=payment_not_found",
            302,
          );
        }

        if (payment.status === "paid") {
          return Response.redirect(
            `https://mohandesino2026.ir/payment-success?order_id=${payment.order_id}`,
            302,
          );
        }

        if (status !== "OK") {
          await env.DB
            .prepare(
              `UPDATE payments
               SET status = 'failed'
               WHERE id = ?`,
            )
            .bind(payment.id)
            .run();

          return Response.redirect(
            `https://mohandesino2026.ir/payment-failed?order_id=${payment.order_id}`,
            302,
          );
        }

        const merchantId = env.ZARINPAL_MERCHANT_ID;

        if (!merchantId) {
          return Response.redirect(
            "https://mohandesino2026.ir/payment-failed?reason=gateway_config",
            302,
          );
        }

        const verifyRequest = await zarinpalRequest("verify", {
          merchant_id: merchantId,
          authority,
          amount: Number(payment.amount),
        });

        const verifyData = verifyRequest.data?.data;
        const verifyCode = Number(verifyData?.code);
        const refId = verifyData?.ref_id ? String(verifyData.ref_id) : "";

        if (
          !verifyRequest.ok ||
          (verifyCode !== 100 && verifyCode !== 101)
        ) {
          await env.DB
            .prepare(
              `UPDATE payments
               SET status = 'failed'
               WHERE id = ?`,
            )
            .bind(payment.id)
            .run();

          return Response.redirect(
            `https://mohandesino2026.ir/payment-failed?order_id=${payment.order_id}`,
            302,
          );
        }

        await env.DB
          .prepare(
            `UPDATE payments
             SET status = 'paid',
                 ref_id = ?,
                 paid_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
          )
          .bind(refId, payment.id)
          .run();

        await env.DB
          .prepare(
            `UPDATE orders
             SET status = 'paid'
             WHERE id = ?`,
          )
          .bind(payment.order_id)
          .run();

        await env.DB
          .prepare(
            `INSERT OR IGNORE INTO enrollments
             (user_id, course_id, order_id)
             VALUES (?, ?, ?)`,
          )
          .bind(payment.user_id, payment.course_id, payment.order_id)
          .run();

        return Response.redirect(
          `https://mohandesino2026.ir/payment-success?order_id=${payment.order_id}`,
          302,
        );
      }

      // NOT FOUND
      // =========================
      return json(
        {
          success: false,
          message: "مسیر API پیدا نشد",
        },
        404,
        cors,
      );
    } catch (error) {
      return json(
        {
          success: false,
          message: error?.message || "خطای داخلی سرور",
        },
        500,
        cors,
      );
    }
  },
};

// ========================================
// ZARINPAL HELPERS
// ========================================

async function zarinpalRequest(path, payload) {
  const response = await fetch(
    `https://api.zarinpal.com/pg/v4/payment/${path}.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

// ========================================
// PASSWORD HASHING
// ========================================

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );

  return (
    "pbkdf2$100000$" + toBase64(salt) + "$" + toBase64(new Uint8Array(bits))
  );
}

async function verifyPassword(password, stored) {
  try {
    const parts = String(stored).split("$");

    if (parts.length !== 4 || parts[0] !== "pbkdf2") {
      return false;
    }

    const iterations = Number(parts[1]);
    const salt = fromBase64(parts[2]);
    const expected = parts[3];

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );

    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: "SHA-256",
      },
      key,
      256,
    );

    return toBase64(new Uint8Array(bits)) === expected;
  } catch {
    return false;
  }
}

// ========================================
// BASE64
// ========================================

function toBase64(bytes) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

// ========================================
// JSON RESPONSE
// ========================================


async function createSession(env, userId) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  await env.DB
    .prepare(
      `INSERT INTO sessions (token, user_id, expires_at)
       VALUES (?, ?, ?)`,
    )
    .bind(token, userId, expiresAt)
    .run();

  return token;
}

async function getSessionUser(request, env) {
  const auth = request.headers.get("Authorization") || "";

  if (!auth.startsWith("Bearer ")) {
    return null;
  }

  const token = auth.slice(7).trim();

  if (!token) {
    return null;
  }

  const session = await env.DB
    .prepare(
      `SELECT u.id, u.phone, u.name, u.is_admin, s.expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?
       LIMIT 1`,
    )
    .bind(token)
    .first();

  if (!session) {
    return null;
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await env.DB
      .prepare("DELETE FROM sessions WHERE token = ?")
      .bind(token)
      .run();

    return null;
  }

  return {
    id: session.id,
    phone: session.phone,
    name: session.name,
    is_admin: session.is_admin,
  };
}

async function requireAdmin(request, env) {
  const user = await getSessionUser(request, env);

  if (!user) {
    return { user: null, error: "ابتدا وارد حساب کاربری شوید" };
  }

  if (Number(user.is_admin) !== 1) {
    return { user: null, error: "دسترسی مدیریت ندارید" };
  }

  const body = await request.json().catch(() => null);
  const adminPassword = String(body?.admin_password || "");

  if (
    !adminPassword ||
    !env.ADMIN_PASSWORD ||
    adminPassword !== env.ADMIN_PASSWORD
  ) {
    return { user: null, error: "رمز مدیریت اشتباه است" };
  }

  return { user, error: null };
}

async function requireAdminSession(request, env) {
  const user = await getAdminSessionUser(request, env);

  if (!user) {
    return {
      user: null,
      error: "نشست مدیریت نامعتبر یا منقضی شده است",
    };
  }

  if (Number(user.is_admin) !== 1) {
    return {
      user: null,
      error: "دسترسی مدیریت ندارید",
    };
  }

  return {
    user,
    error: null,
  };
}

async function deleteSession(request, env) {
  const auth = request.headers.get("Authorization") || "";

  if (!auth.startsWith("Bearer ")) {
    return;
  }

  const token = auth.slice(7).trim();

  if (token) {
    await env.DB
      .prepare("DELETE FROM sessions WHERE token = ?")
      .bind(token)
      .run();
  }
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      ...cors,
    },
  });
}

async function createAdminSession(env, userId) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  ).toISOString();

  await env.DB.prepare(
    `INSERT INTO admin_sessions (token, user_id, expires_at)
     VALUES (?, ?, ?)`,
  )
    .bind(token, userId, expiresAt)
    .run();

  return token;
}

async function getAdminSessionUser(request, env) {
  const auth = request.headers.get("Authorization") || "";

  if (!auth.startsWith("Bearer ")) {
    return null;
  }

  const token = auth.slice(7).trim();

  if (!token) {
    return null;
  }

  const session = await env.DB.prepare(
    `SELECT u.id, u.phone, u.name, u.is_admin, a.expires_at
     FROM admin_sessions a
     JOIN users u ON u.id = a.user_id
     WHERE a.token = ?
     LIMIT 1`,
  )
    .bind(token)
    .first();

  if (!session) {
    return null;
  }

  if (
    new Date(session.expires_at).getTime() <= Date.now() ||
    Number(session.is_admin) !== 1
  ) {
    await env.DB.prepare(
      "DELETE FROM admin_sessions WHERE token = ?",
    )
      .bind(token)
      .run();

    return null;
  }

  return {
    id: session.id,
    phone: session.phone,
    name: session.name,
    is_admin: session.is_admin,
  };
}
