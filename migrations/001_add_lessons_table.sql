-- migrations/001_add_lessons_table.sql
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
