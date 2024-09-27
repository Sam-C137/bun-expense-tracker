import { createFileRoute } from "@tanstack/react-router";
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
import { useGetExpenses } from "@/hooks/useExpense.ts";
import { useQuery } from "@tanstack/react-query";
import { optimisticExpenseQueryOptions } from "@/lib/queries.ts";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { PaginationItems } from "@/routes/__authenticated/expenses/-components/pagination-items.tsx";
import { ExpenseDeleteButton } from "@/routes/__authenticated/expenses/-components/expense-delete-button.tsx";

export const Route = createFileRoute("/__authenticated/expenses/")({
    component: Expenses,
});

function Expenses() {
    const {
        query: { data, isPending, isPlaceholderData },
        next,
        prev,
        page,
        goTo,
    } = useGetExpenses();
    const { data: createExpenseLoadingData } = useQuery(
        optimisticExpenseQueryOptions,
    );
    const isPrevDisabled = page === 1;
    const isNextDisabled = isPlaceholderData || data?.last;

    const Loading = () => (
        <TableRow>
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
            <TableCell>
                <Skeleton className="h-4" />
            </TableCell>
        </TableRow>
    );

    return (
        <div className="p-4 w-full max-w-2xl m-auto">
            <Table>
                <TableCaption>A list of your recent expenses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {createExpenseLoadingData?.expense && (
                        <TableRow>
                            <TableCell>
                                <Skeleton className="h-4" />
                            </TableCell>
                            <TableCell>
                                {createExpenseLoadingData?.expense?.title}
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
                    )}
                    {isPending
                        ? Array(3)
                              .fill(null)
                              .map((_, i) => <Loading key={i} />)
                        : data?.expenses?.map((expense) => (
                              <TableRow key={expense.id}>
                                  <TableCell>{expense.id}</TableCell>
                                  <TableCell>{expense.title}</TableCell>
                                  <TableCell>
                                      {relativeDate(new Date(expense.day))}
                                  </TableCell>
                                  <TableCell>${expense.amount}</TableCell>
                                  <TableCell className="text-right">
                                      <ExpenseDeleteButton id={expense.id} />
                                  </TableCell>
                              </TableRow>
                          ))}
                    {data && (
                        <TableRow className="hover:bg-background">
                            <TableCell colSpan={5}>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    !isPrevDisabled && prev()
                                                }
                                                aria-disabled={isPrevDisabled}
                                            />
                                        </PaginationItem>
                                        <PaginationItems
                                            totalPages={data.pages}
                                            page={page}
                                            goTo={goTo}
                                        />
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() =>
                                                    !isNextDisabled && next()
                                                }
                                                aria-disabled={isNextDisabled}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
