import { Hono } from "hono";
import { createExpenseSchema } from "../shared/validators.ts";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde.ts";
import { db } from "../db";
import {
    expenses as expensesTable,
    insertExpenseSchema,
} from "../db/schema/expenses.ts";
import { and, desc, eq, sum } from "drizzle-orm";

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

        const validatedExpense = insertExpenseSchema.parse({
            ...expense,
            user_id: user.id,
        });

        const result = await db
            .insert(expensesTable)
            .values(validatedExpense)
            .returning();

        c.status(201);
        return c.json(result);
    })
    .get("/total-spent", getUser, async (c) => {
        const { user } = c.var;
        const { total } = await db
            .select({ total: sum(expensesTable.amount) })
            .from(expensesTable)
            .where(eq(expensesTable.user_id, user.id))
            .limit(1)
            .then((r) => r[0]);

        return c.json({ total });
    })
    .get("/:id{[0-9]+}", getUser, async (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const { user } = c.var;
        const expense = await db
            .select()
            .from(expensesTable)
            .where(
                and(
                    eq(expensesTable.user_id, user.id),
                    eq(expensesTable.id, id),
                ),
            )
            .then((r) => r[0]);

        if (!expense) {
            return c.notFound();
        }
        return c.json(expense);
    })
    .delete("/:id{[0-9]+}", getUser, async (c) => {
        const id = Number.parseInt(c.req.param("id"));

        const { user } = c.var;
        const deleted = await db
            .delete(expensesTable)
            .where(
                and(
                    eq(expensesTable.user_id, user.id),
                    eq(expensesTable.id, id),
                ),
            )
            .returning()
            .then((r) => r[0]);

        if (!deleted) {
            return c.notFound();
        }

        return c.json(deleted);
    })
    .delete()
    .put();
