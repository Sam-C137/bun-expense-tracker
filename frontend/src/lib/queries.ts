import { queryOptions } from "@tanstack/react-query";
import api from "@/lib/api.ts";
import { type Expense } from "@server/shared/validators.ts";

export const profileQueryOptions = queryOptions({
    queryKey: ["profile"],
    queryFn: async () => {
        const res = await api.me.$get();
        if (!res.ok) {
            throw new Error("Failed to get profile");
        }

        return res.json();
    },
    staleTime: Infinity,
});

export const optimisticExpenseQueryOptions = queryOptions<{
    expense?: Partial<Expense>;
}>({
    queryKey: ["expense:create:loading"],
    queryFn: async () => {
        return {};
    },
    staleTime: Infinity,
});
