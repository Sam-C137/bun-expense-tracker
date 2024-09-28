import { getPaginationRange } from "@/lib/utils.ts";
import {
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination.tsx";

interface PaginationItemsProps {
    totalPages: number;
    page: number;
    goTo: (page: number) => void | Promise<void>;
}

export function PaginationItems({
    totalPages,
    page,
    goTo,
}: PaginationItemsProps) {
    const list = getPaginationRange(totalPages, page);

    async function handleChange(value: number | string) {
        switch (value) {
            case "... ":
                await goTo(1);
                break;
            case " ...":
                await goTo(totalPages);
                break;
            default:
                if (typeof value === "number") {
                    await goTo(value);
                }
                break;
        }
    }

    return (
        <>
            {list.map((item) => (
                <PaginationItem
                    key={item}
                    aria-current={page === item}
                    className="aria-[current=true]:border aria-[current=true]:border-muted-foreground rounded"
                >
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
