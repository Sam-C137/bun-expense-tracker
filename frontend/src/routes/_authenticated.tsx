import { createFileRoute, Outlet } from "@tanstack/react-router";
import { profileQueryOptions } from "@/lib/api.ts";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ context }) => {
        const { queryClient } = context;
        try {
            const { user } = await queryClient.fetchQuery(profileQueryOptions);

            if (!user) {
                throw new Error();
            }

            return { user };
        } catch (e) {
            return { user: null };
        }
    },
    component: () => {
        const { user } = Route.useRouteContext();
        if (!user) {
            return (
                <div>
                    You have to login
                    <a href="/api/login" className="block">
                        Login
                    </a>
                </div>
            );
        }

        return <Outlet />;
    },
});
