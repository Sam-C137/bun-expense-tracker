import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");

export const profileQueryOptions = queryOptions({
    queryKey: ["profile"],
    queryFn: async () => {
        const res = await client.api.me.$get();
        if (!res.ok) {
            throw new Error("Failed to get profile");
        }

        return res.json();
    },
    staleTime: Infinity,
});

export default client.api;
