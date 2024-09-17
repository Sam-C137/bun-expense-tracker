import { Hono } from "hono";
import { type Expense, ExpenseSchema } from "../models/expense.ts";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde.ts";

import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses.ts";
import { desc, eq } from "drizzle-orm";

const fakeExpenses: Expense[] = [
    {
        id: 1,
        title: "suii",
        amount: 3,
    },
    {
        id: 2,
        title: "not so suii",
        amount: 4,
    },
    {
        id: 3,
        title: "we're so back suii",
        amount: 10,
    },
];

const createExpenseSchema = ExpenseSchema.omit({ id: true });

export const expenses = new Hono()
    .get("/", getUser, async (c) => {
        const { user } = c.var;

        const expenses = await db
            .select()
            .from(expensesTable)
            .where(eq(expensesTable.user_id, user.id))
            .orderBy(desc(expensesTable.createdAt))
            .limit(10);

        return c.json({
            expenses,
        });
    })
    .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
        const expense = c.req.valid("json");
        const { user } = c.var;
        // fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
        const result = await db
            .insert(expensesTable)
            .values({
                ...expense,
                amount: String(expense.amount),
                user_id: user.id,
            })
            .returning();

        c.status(201);
        return c.json(result);
    })
    .get("/total-spent", getUser, async (c) => {
        const total = fakeExpenses.reduce((acc, e) => acc + e.amount, 0);
        return c.json({ total });
    })
    .get("/:id{[0-9]+}", getUser, (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const expense = fakeExpenses.find((e) => e.id === id);
        if (!expense) {
            return c.notFound();
        }
        return c.json(expense);
    })
    .delete("/:id{[0-9]+}", getUser, (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const idx = fakeExpenses.findIndex((e) => e.id === id);
        if (idx < 0) {
            return c.notFound();
        }
        const deleted = fakeExpenses.splice(idx, 1)[0];
        return c.json(deleted);
    })
    .delete()
    .put();
