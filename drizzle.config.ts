import { defineConfig } from "drizzle-kit";

// DATABASE_URL check removed for SQLite local setup
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
});
