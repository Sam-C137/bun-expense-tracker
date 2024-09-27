import { useDeleteExpense } from "@/hooks/useExpense.ts";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Trash } from "lucide-react";

export function ExpenseDeleteButton({ id }: { id: number }) {
    const expenseMutation = useDeleteExpense(id);

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
