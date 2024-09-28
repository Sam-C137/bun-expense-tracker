import { useDeleteExpense } from "@/hooks/useExpense.ts";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Trash } from "lucide-react";

interface ExpenseDeleteButtonProps {
    id: number;
    page: number;
}

export function ExpenseDeleteButton({ id, page }: ExpenseDeleteButtonProps) {
    const expenseMutation = useDeleteExpense(id, page);

    return (
        <Button
            disabled={expenseMutation.isPending}
            variant="outline"
            size="icon"
            onClick={() => expenseMutation.mutate()}
        >
            {expenseMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <Trash size={14} />
            )}
        </Button>
    );
}
