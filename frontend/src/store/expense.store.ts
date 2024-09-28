import { create } from "zustand";
import type { Expense } from "@server/shared/validators.ts";

type ExpenseUnion =
    | (Omit<Expense, "createdAt"> & {
          createdAt: string | null;
      })
    | null;

interface ExpenseState {
    expense: ExpenseUnion;
    setExpense: (expense: NonNullable<ExpenseUnion>) => void;
    removeExpense: () => void;
}

export const useExpenseStore = create<ExpenseState>()((set) => ({
    expense: null,
    setExpense: (expense) => set((state) => ({ ...state, expense })),
    removeExpense: () => set((state) => ({ ...state, expense: null })),
}));
