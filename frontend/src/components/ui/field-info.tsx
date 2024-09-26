import { FieldApi } from "@tanstack/react-form";

interface FieldInfoProps {
    field: FieldApi<any, any, any, any>;
}

export function FieldInfo({ field }: FieldInfoProps) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em className="block">{field.state.meta.errors.join(", ")}</em>
            ) : null}
            {field.state.meta.isValidating ? "Validating..." : null}
        </>
    );
}
