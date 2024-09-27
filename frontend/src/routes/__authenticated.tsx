import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { profileQueryOptions } from "@/lib/queries.ts";

export const Route = createFileRoute("/__authenticated")({
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
                <div className="flex flex-col gap-y-2 items-center">
                    <p>You have to login or register</p>
                    <Button asChild>
                        <a href="/api/login" className="block w-full">
                            Login
                        </a>
                    </Button>
                    <Button asChild>
                        <a href="/api/register" className="block w-full">
                            Register
                        </a>
                    </Button>
                </div>
            );
        }

        return <Outlet />;
    },
});
