import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import api from "@/lib/api.ts";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    const { data, isPending, error } = useQuery({
        queryKey: ["total-spent"],
        queryFn: async () => {
            const res = await api.expenses["total-spent"].$get();
            if (!res.ok) {
                throw new Error("Failed to fetch total spent");
            }
            return res.json();
        },
    });

    if (error) {
        return <div className="w-[350px] m-auto">Error: {error.message}</div>;
    }

    return (
        <Card className="w-[350px] m-auto">
            <CardHeader>
                <CardTitle>Total Spent</CardTitle>
                <CardDescription>The total amount you've spent</CardDescription>
            </CardHeader>
            <CardContent>{isPending ? "..." : data.total}</CardContent>
        </Card>
    );
}
