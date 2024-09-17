import {
    index,
    numeric,
    pgTable,
    serial,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

export const expenses = pgTable(
    "expenses",
    {
        id: serial("id").primaryKey(),
        user_id: text("user_id").notNull(),
        title: text("title").notNull(),
        amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (expenses) => {
        return {
            userIdIndex: index("user_idx").on(expenses.user_id),
        };
    },
);
