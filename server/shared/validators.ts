import { z } from "zod";
import { insertExpenseSchema } from "../db/schema/expenses.ts";

export type Expense = z.infer<typeof createExpenseSchema>;

export const createExpenseSchema = insertExpenseSchema.pick({
    title: true,
    amount: true,
    day: true,
});
