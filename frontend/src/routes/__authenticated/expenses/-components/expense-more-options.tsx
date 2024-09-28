import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { MoreHorizontal } from "lucide-react";
import { type Expense } from "@server/shared/validators.ts";
import { useCreateExpense, useDeleteExpense } from "@/hooks/useExpense.ts";
import { useExpenseStore } from "@/store/expense.store.ts";
import { useNavigate } from "@tanstack/react-router";

interface ExpenseMoreOptionsProps {
    expense: Omit<Expense, "createdAt"> & {
        createdAt: string | null;
    };
    page: number;
}

export function ExpenseMoreOptions({ expense, page }: ExpenseMoreOptionsProps) {
    const expenseMutation = useCreateExpense();
    const expenseDeleteMutation = useDeleteExpense(expense.id, page);
    const setExpense = useExpenseStore((state) => state.setExpense);
    const navigate = useNavigate();

    function handleKeydown<T>(e: React.KeyboardEvent<T>) {
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey && e.key === "d") {
            expenseMutation.mutate(expense);
        }

        if (e.ctrlKey && e.key === "Delete") {
            expenseDeleteMutation.mutate();
        }
    }

    async function handleEdit() {
        setExpense(expense);
        await navigate({
            to: "/create-expense",
            search: {
                page,
            },
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[160px]"
                onKeyDown={handleKeydown}
            >
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => expenseMutation.mutate(expense)}
                >
                    Duplicate
                    <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => expenseDeleteMutation.mutate()}
                >
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
