import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
});
