
import { apiRequest } from "./queryClient";
import type { Course, InsertCourse, Book, InsertBook } from "@shared/schema";

export const api = {
    // Courses
    getCourses: async (archived = false) => {
        const res = await apiRequest("GET", `/api/courses?archived=${archived}`);
        return res.json() as Promise<Course[]>;
    },
    getCourse: async (id: number) => {
        const res = await apiRequest("GET", `/api/courses/${id}`);
        return res.json() as Promise<Course>;
    },
    createCourse: async (course: InsertCourse) => {
        const res = await apiRequest("POST", "/api/courses", course);
        return res.json() as Promise<Course>;
    },
    updateCourse: async (id: number, course: Partial<InsertCourse>) => {
        const res = await apiRequest("PATCH", `/api/courses/${id}`, course);
        return res.json() as Promise<Course>;
    },
    deleteCourse: async (id: number) => {
        await apiRequest("DELETE", `/api/courses/${id}`);
    },

    // Books
    getBooks: async () => {
        const res = await apiRequest("GET", "/api/books");
        return res.json() as Promise<Book[]>;
    },
    createBook: async (book: InsertBook) => {
        const res = await apiRequest("POST", "/api/books", book);
        return res.json() as Promise<Book>;
    },
    updateBook: async (id: number, book: Partial<InsertBook>) => {
        const res = await apiRequest("PATCH", `/api/books/${id}`, book);
        return res.json() as Promise<Book>;
    },
    deleteBook: async (id: number) => {
        await apiRequest("DELETE", `/api/books/${id}`);
    },

    // Uploads
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        return res.json() as Promise<{ url: string; fileName: string }>;
    },
};
