import { Hono } from "hono";
import { logger } from "hono/logger";
import { expenses } from "./routes/expenses.ts";
import { serveStatic } from "hono/bun";
import { auth } from "./routes/auth.ts";

const app = new Hono();

app.use("*", logger());

app.get("/test", (c) => {
    return c.json({
        message: "test",
    });
});

const apiRoutes = app
    .basePath("/api")
    .route("/", auth)
    .route("/expenses", expenses);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
