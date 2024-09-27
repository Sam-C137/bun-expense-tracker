import { getPaginationRange } from "@/lib/utils.ts";
import {
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination.tsx";

interface PaginationItemsProps {
    totalPages: number;
    page: number;
    goTo: (page: number) => void;
}

export function PaginationItems({
    totalPages,
    page,
    goTo,
}: PaginationItemsProps) {
    const list = getPaginationRange(totalPages, page);

    function handleChange(value: number | string) {
        switch (value) {
            case "... ":
                goTo(1);
                break;
            case " ...":
                goTo(totalPages);
                break;
            default:
                if (typeof value === "number") {
                    goTo(value);
                }
                break;
        }
    }

    return (
        <>
            {list.map((item) => (
                <PaginationItem key={item}>
                    {typeof item === "string" ? (
                        <PaginationEllipsis
                            onClick={() => handleChange(item)}
                        />
                    ) : (
                        <PaginationLink onClick={() => handleChange(item)}>
                            {item}
                        </PaginationLink>
                    )}
                </PaginationItem>
            ))}
        </>
    );
}
