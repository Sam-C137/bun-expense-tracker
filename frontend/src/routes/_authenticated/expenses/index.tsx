import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api.ts";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { relativeDate } from "@/lib/utils.ts";

export const Route = createFileRoute("/_authenticated/expenses/")({
    component: Expenses,
});

function Expenses() {
    const { data, isPending } = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const res = await api.expenses.$get();
            if (!res.ok) {
                throw new Error("Failed to fetch total spent");
            }
            return res.json();
        },
    });

    return (
        <div className="p-4 w-full max-w-2xl m-auto">
            <Table>
                <TableCaption>A list of your recent expenses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isPending
                        ? Array(3)
                              .fill(null)
                              .map((_, i) => (
                                  <TableRow key={i}>
                                      <TableCell>
                                          <Skeleton className="h-4" />
                                      </TableCell>
                                      <TableCell>
                                          <Skeleton className="h-4" />
                                      </TableCell>
                                      <TableCell>
                                          <Skeleton className="h-4" />
                                      </TableCell>
                                      <TableCell>
                                          <Skeleton className="h-4" />
                                      </TableCell>
                                  </TableRow>
                              ))
                        : data?.expenses?.map((expense) => (
                              <TableRow key={expense.id}>
                                  <TableCell>{expense.id}</TableCell>
                                  <TableCell>{expense.title}</TableCell>
                                  <TableCell>
                                      {relativeDate(new Date(expense.day))}
                                  </TableCell>
                                  <TableCell className="text-right">
                                      ${expense.amount}
                                  </TableCell>
                              </TableRow>
                          ))}
                </TableBody>
            </Table>
        </div>
    );
}
