import {
    date,
    index,
    numeric,
    pgTable,
    serial,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable(
    "expenses",
    {
        id: serial("id").primaryKey(),
        user_id: text("user_id").notNull(),
        title: text("title").notNull(),
        amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        day: date("day").notNull(),
    },
    (expenses) => {
        return {
            userIdIndex: index("user_idx").on(expenses.user_id),
        };
    },
);

export const insertExpenseSchema = createInsertSchema(expenses, {
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters"),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid monetary value"),
    day: z.string().refine((d) => !isNaN(Date.parse(d))),
});
export const selectExpenseSchema = createSelectSchema(expenses);
