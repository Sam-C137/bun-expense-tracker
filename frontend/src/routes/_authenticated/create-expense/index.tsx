import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "@/components/ui/field-info.tsx";
import api from "@/lib/api.ts";

export const Route = createFileRoute("/_authenticated/create-expense/")({
    component: CreateExpense,
});

function CreateExpense() {
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            title: "",
            amount: 0,
        },
        onSubmit: async ({ value, formApi }) => {
            const res = await api.expenses.$post({ json: value });
            if (!res.ok) {
                throw new Error("Failed to create expense");
            }
            formApi.reset();
            await navigate({ to: "/expenses" });
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
                className="max-w-xl m-auto"
            >
                <form.Field
                    name="title"
                    children={(field) => (
                        <>
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
                        </>
                    )}
                />

                <form.Field
                    name="amount"
                    children={(field) => (
                        <>
                            <Label htmlFor={field.name}>Amount</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(Number(e.target.value))
                                }
                                type="number"
                                placeholder="Text"
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                />
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            className="mt-4"
                            type="submit"
                            disabled={!canSubmit}
                        >
                            {isSubmitting
                                ? "Creating Expense..."
                                : "Create Expense"}
                        </Button>
                    )}
                />
            </form>
        </div>
    );
}
