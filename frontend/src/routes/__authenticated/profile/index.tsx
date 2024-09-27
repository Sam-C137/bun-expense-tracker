import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { profileQueryOptions } from "@/lib/queries.ts";

export const Route = createFileRoute("/__authenticated/profile/")({
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
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage
                        src={
                            data.user.picture?.endsWith("blank&size=200")
                                ? undefined
                                : data.user.picture || undefined
                        }
                    />
                    <AvatarFallback>
                        {data.user.given_name.slice(0, 1)}
                        {data.user.family_name.slice(0, 1)}
                    </AvatarFallback>
                </Avatar>

                <p>
                    {data.user.given_name} {data.user.family_name}
                </p>
            </div>
            <Button asChild className="my-4">
                <a href="/api/logout">Log Out</a>
            </Button>
        </div>
    );
}
