import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload, UPLOADS_DIR } from "./uploads";
import { insertCourseSchema, insertBookSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Serve uploaded files
  app.use("/uploads", express.static(UPLOADS_DIR));

  // --- Courses API ---
  app.get("/api/courses", async (req, res) => {
    const includeArchived = req.query.archived === "true";
    const courses = await storage.getCourses(includeArchived);
    res.json(courses);
  });

  // IMPORTANT: Slug route must come BEFORE the :id route!
  app.get("/api/courses/slug/:slug", async (req, res) => {
    const course = await storage.getCourseBySlug(req.params.slug);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const course = await storage.getCourse(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  });

  app.post("/api/courses", async (req, res) => {
    const parsed = insertCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid course data", errors: parsed.error });
    }
    const course = await storage.createCourse(parsed.data);
    res.json(course);
  });

  app.patch("/api/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const parsed = insertCourseSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid course data", errors: parsed.error });
    }
    const course = await storage.updateCourse(id, parsed.data);
    res.json(course);
  });

  app.delete("/api/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteCourse(id);
    res.status(204).send();
  });

  // --- Books API ---
  app.get("/api/books", async (_req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.post("/api/books", async (req, res) => {
    const parsed = insertBookSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid book data", errors: parsed.error });
    }
    const book = await storage.createBook(parsed.data);
    res.json(book);
  });

  app.patch("/api/books/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const parsed = insertBookSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid book data", errors: parsed.error });
    }
    const book = await storage.updateBook(id, parsed.data);
    res.json(book);
  });

  app.delete("/api/books/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteBook(id);
    res.status(204).send();
  });

  // --- Upload API ---
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Return the URL to access the file
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, fileName: req.file.originalname });
  });

  return httpServer;
}
