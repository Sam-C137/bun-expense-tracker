import {
    QueryFilters,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import z from "zod";
import {
    createExpenseSchema,
    type Expense,
} from "@server/shared/validators.ts";
import { optimisticExpenseQueryOptions } from "@/lib/queries.ts";
import { toast } from "sonner";
import { useState } from "react";

const expensesQueryFilters = {
    queryKey: ["expenses"],
} satisfies QueryFilters;

export function useGetExpenses(initialPage = 1, limit = 10) {
    const [page, setPage] = useState(initialPage);

    const query = useQuery({
        queryKey: [...expensesQueryFilters.queryKey, page, limit],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const res = await api.expenses.$get({
                query: {
                    page,
                    limit,
                },
            });
            if (!res.ok) {
                throw new Error("Failed to fetch total spent");
            }
            return res.json();
        },
    });

    function next() {
        console.log("next");
        setPage((prev) => prev + 1);
    }

    function prev() {
        console.log("prev");
        setPage((prev) => prev - 1);
    }

    function goTo(page: number) {
        setPage(page);
    }

    return {
        query,
        next,
        prev,
        goTo,
        page,
    };
}

export function useCreateExpense() {
    const client = useQueryClient();

    type CreateExpense = z.infer<typeof createExpenseSchema>;

    const mutation = useMutation({
        mutationFn: async (value: CreateExpense) => {
            const { queryKey } = optimisticExpenseQueryOptions;

            client.setQueryData(queryKey, {
                expense: value,
            });

            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const res = await api.expenses.$post({ json: value });
                if (!res.ok) {
                    throw new Error();
                }
                toast("Expense created", {
                    description: `Expense "${value.title}" created`,
                });
                return res.json();
            } finally {
                client.setQueryData(queryKey, {});
            }
        },
        onSuccess: async (data) => {
            await client.cancelQueries(expensesQueryFilters);

            client.setQueryData<{
                expenses: Expense[];
                total: number;
                first: boolean;
                last: boolean;
                pages: number;
            }>(expensesQueryFilters.queryKey, (oldData) => {
                if (!oldData) return;

                return {
                    expenses: [
                        data as (typeof oldData.expenses)[number],
                        ...oldData.expenses,
                    ],
                    total: oldData.total + 1,
                    first: oldData.first,
                    last: oldData.last,
                    pages: Math.ceil((oldData.total + 1) / 10),
                };
            });
        },
        onError(error, variables) {
            toast.error("Failed to create expense", {
                description: error.message,
                action: {
                    label: "Retry",
                    onClick: () => handleRetry(variables),
                },
            });
        },
    });

    function handleRetry(value: CreateExpense) {
        mutation.mutate(value);
    }

    return mutation;
}

export function useDeleteExpense(id: number) {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await api.expenses[":id{[0-9]+}"].$delete({
                param: { id: id.toString() },
            });
            if (!res.ok) {
                throw new Error("Failed to delete expense");
            }
            toast("Expense deleted");
            return res.json();
        },
        onSuccess: async () => {
            await client.cancelQueries(expensesQueryFilters);
            client.setQueryData<{
                expenses: Expense[];
            }>(expensesQueryFilters.queryKey, (oldData) => {
                if (!oldData) return;

                return {
                    expenses: oldData.expenses.filter(
                        (expense) => expense.id !== id,
                    ),
                };
            });
            await client.invalidateQueries({ queryKey: ["expense", id] });
        },
        onError(error) {
            toast.error("Failed to delete expense", {
                description: error.message,
            });
        },
    });
}
