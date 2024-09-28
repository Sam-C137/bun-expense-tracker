import {
    createFileRoute,
    useNavigate,
    useSearch,
} from "@tanstack/react-router";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "@/components/ui/field-info.tsx";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createExpenseSchema } from "@server/shared/validators.ts";
import { Calendar } from "@/components/ui/calendar.tsx";
import { useCreateExpense, useEditExpense } from "@/hooks/useExpense.ts";
import { useExpenseStore } from "@/store/expense.store.ts";

type CreateExpenseSearchParams = {
    page?: number;
};

export const Route = createFileRoute("/__authenticated/create-expense/")({
    component: CreateExpense,
    validateSearch: (
        search: Record<string, unknown>,
    ): CreateExpenseSearchParams => {
        return {
            page: search.page ? Number(search.page) : undefined,
        };
    },
});

function CreateExpense() {
    const navigate = useNavigate();
    const page = useSearch({
        from: "/__authenticated/create-expense/",
        select: (search) => search.page,
    });
    const expenseMutation = useCreateExpense();
    const editExpenseMutation = useEditExpense(page || 1);
    const existingExpense = useExpenseStore((state) => state.expense);
    const removeExpense = useExpenseStore((state) => state.removeExpense);

    const form = useForm({
        validatorAdapter: zodValidator(),
        defaultValues: {
            title: existingExpense?.title || "",
            amount: existingExpense?.amount || "0",
            day: existingExpense?.day || new Date().toISOString(),
        },
        onSubmit: async ({ value, formApi }) => {
            if (existingExpense) {
                editExpenseMutation.mutate({
                    ...existingExpense,
                    ...value,
                });
                removeExpense();
                await navigate({ to: "/expenses", search: { page } });
            } else {
                expenseMutation.mutate(value);
                await navigate({ to: "/expenses" });
            }
            formApi.reset();
        },
    });

    return (
        <div className="p-2 w-full">
            <h1>Create Expense</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
                className="max-w-xl m-auto flex flex-col gap-y-4"
            >
                <form.Field
                    name="title"
                    validators={{
                        onChange: createExpenseSchema.shape.title,
                    }}
                    children={(field) => (
                        <div>
                            <Label htmlFor={field.name}>Title</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                type="text"
                                placeholder="Text"
                            />
                            <FieldInfo field={field} />
                        </div>
                    )}
                />

                <form.Field
                    name="amount"
                    validators={{
                        onChange: createExpenseSchema.shape.amount,
                    }}
                    children={(field) => (
                        <div>
                            <Label htmlFor={field.name}>Amount</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    if (value === "" || isNaN(Number(value))) {
                                        e.preventDefault();
                                        e.target.value = field.state.value;
                                    } else {
                                        field.handleChange(e.target.value);
                                    }
                                }}
                                type="number"
                                placeholder="Ammount"
                            />
                            <FieldInfo field={field} />
                        </div>
                    )}
                />
                <form.Field
                    name="day"
                    children={(field) => (
                        <div className="self-center">
                            <Calendar
                                mode="single"
                                selected={new Date(field.state.value)}
                                onSelect={(date) =>
                                    field.handleChange(
                                        date?.toISOString() ||
                                            field.state.value,
                                    )
                                }
                                id={field.name}
                            />
                            <FieldInfo field={field} />
                        </div>
                    )}
                />
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            canSubmit={canSubmit}
                            isEditing={Boolean(existingExpense)}
                        />
                    )}
                />
            </form>
        </div>
    );
}

interface SubmitButtonProps {
    canSubmit: boolean;
    isSubmitting: boolean;
    isEditing: boolean;
}

function SubmitButton({
    canSubmit,
    isSubmitting,
    isEditing,
}: SubmitButtonProps) {
    const textMapping = {
        base: isEditing ? "Edit Expense" : "Create Expense",
        pending: isEditing ? "Editing Expense" : "Creating Expense",
    };

    return (
        <Button className="mt-4" type="submit" disabled={!canSubmit}>
            {isSubmitting ? textMapping.pending : textMapping.base}
        </Button>
    );
}
