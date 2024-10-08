import { createFileRoute, useSearch } from "@tanstack/react-router";
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
import { PaginationItems } from "./-components/pagination-items.tsx";
import { ExpenseDeleteButton } from "./-components/expense-delete-button.tsx";
import { ExpenseMoreOptions } from "./-components/expense-more-options.tsx";

type ExpensesSearchParams = {
    page?: number;
};

export const Route = createFileRoute("/__authenticated/expenses/")({
    component: Expenses,
    validateSearch: (search: Record<string, unknown>): ExpensesSearchParams => {
        return {
            page: Number(search.page) || 1,
        };
    },
});

function Expenses() {
    const { page: initialPage } = useSearch({ strict: false });
    const {
        query: { data, isPending, isPlaceholderData },
        next,
        prev,
        page,
        goTo,
    } = useGetExpenses({ initialPage });
    const { data: optimisticExpense } = useQuery(optimisticExpenseQueryOptions);
    const isPrevDisabled = page === 1;
    const isNextDisabled = isPlaceholderData || data?.last;

    const Loading = ({ children }: React.PropsWithChildren) => (
        <TableRow>
            <TableCell>
                <Skeleton className="h-4" />
            </TableCell>
            <TableCell>{children || <Skeleton className="h-4" />}</TableCell>
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
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {optimisticExpense?.expense && (
                        <Loading>{optimisticExpense?.expense?.title}</Loading>
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
                                      <ExpenseDeleteButton
                                          id={expense.id}
                                          page={page}
                                      />
                                  </TableCell>
                                  <TableCell>
                                      <ExpenseMoreOptions
                                          expense={expense}
                                          page={page}
                                      />
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
                                                onClick={async () =>
                                                    !isPrevDisabled &&
                                                    (await prev())
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
                                                onClick={async () =>
                                                    !isNextDisabled &&
                                                    (await next())
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
