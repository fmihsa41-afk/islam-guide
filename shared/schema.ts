import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sqliteTable, text as sqliteText, integer as sqliteInteger } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  username: sqliteText("username").notNull().unique(),
  password: sqliteText("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Courses Table
export const courses = sqliteTable("courses", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  title: sqliteText("title").notNull(),
  description: sqliteText("description").notNull(),
  slug: sqliteText("slug").notNull().unique(),
  coverImage: sqliteText("cover_image"),
  youtubeUrl: sqliteText("youtube_url"),
  duration: sqliteText("duration"),
  lessons: sqliteInteger("lessons").default(0),
  isArchived: sqliteInteger("is_archived", { mode: "boolean" }).default(false),
});

export const insertCourseSchema = createInsertSchema(courses);
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Books Table
export const books = sqliteTable("books", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  title: sqliteText("title").notNull(),
  author: sqliteText("author").notNull(),
  description: sqliteText("description"),
  coverUrl: sqliteText("cover_url"),
  fileUrl: sqliteText("file_url"),
  fileName: sqliteText("file_name"),
  category: sqliteText("category"),
  level: sqliteText("level"),
});

export const insertBookSchema = createInsertSchema(books);
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;
