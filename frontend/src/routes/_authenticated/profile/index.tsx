import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "@/lib/api.ts";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile/")({
    component: Profile,
});

function Profile() {
    const { isPending, error, data } = useQuery(profileQueryOptions);

    if (isPending) {
        return <Loader2 className="animate-spin" />;
    }

    if (error) {
        return <> {error.message} </>;
    }

    return (
        <div className="p2">
            <p>Hello {data.user.family_name}</p>
            <a href="/api/logout">Log Out</a>
        </div>
    );
}
