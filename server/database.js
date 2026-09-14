import sqlite3 from "sqlite3";

const db = new sqlite3.Database("server/data/mohandesino.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'سایر',
      level TEXT DEFAULT 'مقدماتی',
      price INTEGER DEFAULT 0,
      is_free INTEGER DEFAULT 1,
      image TEXT DEFAULT '',
      description TEXT DEFAULT ''
    )
  `);
});

export default db;
