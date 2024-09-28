import {
    QueryFilters,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import z from "zod";
import { createExpenseSchema, Expense } from "@server/shared/validators.ts";
import { optimisticExpenseQueryOptions } from "@/lib/queries.ts";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const expensesQueryFilters = {
    queryKey: ["expenses"],
} satisfies QueryFilters;

type ExpenseGetResult = Awaited<
    ReturnType<Awaited<ReturnType<typeof api.expenses.$get>>["json"]>
>;

type CreateExpense = z.infer<typeof createExpenseSchema>;

type ExpenseFilters = {
    initialPage?: number;
    limit?: number;
    search?: string;
};

export function useGetExpenses(
    { initialPage = 1, limit = 10 }: ExpenseFilters = {
        initialPage: 1,
        limit: 10,
    },
) {
    const [page, setPage] = useState(initialPage);
    const navigate = useNavigate();

    const query = useQuery({
        queryKey: [...expensesQueryFilters.queryKey, page],
        queryFn: async () => {
            // await sleep(2000);
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

    async function handleNavigate(page: number) {
        await navigate({
            to: ".",
            search: {
                page,
            },
            resetScroll: false,
        });
    }

    async function next() {
        setPage((prev) => prev + 1);
        await handleNavigate(page + 1);
    }

    async function prev() {
        setPage((prev) => prev - 1);
        await handleNavigate(page - 1);
    }

    async function goTo(page: number) {
        setPage(page);
        await handleNavigate(page);
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

    const mutation = useMutation({
        mutationFn: async (value: CreateExpense) => {
            const { queryKey } = optimisticExpenseQueryOptions;

            client.setQueryData(queryKey, {
                expense: value,
            });

            try {
                // await sleep(2000);
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

            client.setQueryData<ExpenseGetResult>(
                [...expensesQueryFilters.queryKey, 1],
                (oldData) => {
                    if (!oldData) return;

                    return {
                        expenses: [data, ...oldData.expenses],
                        total: oldData.total + 1,
                        first: oldData.first,
                        last: oldData.last,
                        pages: Math.ceil((oldData.total + 1) / 10),
                    };
                },
            );
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

export function useDeleteExpense(id: number, page: number) {
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

            client.setQueryData<ExpenseGetResult>(
                [...expensesQueryFilters.queryKey, page],
                (oldData) => {
                    if (!oldData) return;

                    return {
                        expenses: oldData.expenses.filter(
                            (expense) => expense.id !== id,
                        ),
                        total: oldData.total - 1,
                        first: oldData.first,
                        last: oldData.last,
                        pages: Math.ceil((oldData.total - 1) / 10),
                    };
                },
            );
            await client.invalidateQueries({ queryKey: ["expense", id] });
        },
        onError(error) {
            toast.error("Failed to delete expense", {
                description: error.message,
            });
        },
    });
}

export function useEditExpense(page: number) {
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (
            value: Omit<Expense, "createdAt"> & {
                createdAt: string | null;
            },
        ) => {
            const { queryKey } = optimisticExpenseQueryOptions;

            client.setQueryData(queryKey, {
                expense: value as Expense,
            });

            try {
                const res = await api.expenses[":id{[0-9]+}"].$put({
                    param: { id: value.id.toString() },
                    json: value,
                });
                if (!res.ok) {
                    throw new Error("Failed to edit expense");
                }
                toast("Expense updated");
                return value;
            } finally {
                client.setQueryData(queryKey, {});
            }
        },
        onSuccess: async (data) => {
            await client.cancelQueries(expensesQueryFilters);

            client.setQueryData<ExpenseGetResult>(
                [...expensesQueryFilters.queryKey, page],
                (oldData) => {
                    if (!oldData) return;

                    return {
                        expenses: oldData.expenses.map((expense) =>
                            expense.id === data.id ? data : expense,
                        ),
                        total: oldData.total,
                        first: oldData.first,
                        last: oldData.last,
                        pages: oldData.pages,
                    };
                },
            );
        },
        onError(error, variables) {
            toast.error("Failed to edit expense", {
                description: error.message,
                action: {
                    label: "Retry",
                    onClick: () => handleRetry(variables),
                },
            });
        },
    });

    function handleRetry(
        value: Omit<Expense, "createdAt"> & {
            createdAt: string | null;
        },
    ) {
        mutation.mutate(value);
    }

    return mutation;
}
