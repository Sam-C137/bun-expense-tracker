import { z } from "zod";
import {
    insertExpenseSchema,
    selectExpenseSchema,
} from "../db/schema/expenses.ts";

export type Expense = z.infer<typeof selectExpenseSchema>;

export const createExpenseSchema = insertExpenseSchema.pick({
    title: true,
    amount: true,
    day: true,
});
