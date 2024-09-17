import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./server/db/schema/*",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    },
});
