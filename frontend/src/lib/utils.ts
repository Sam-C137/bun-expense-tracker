import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function relativeDate(from: Date) {
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const diffInDays = Math.floor(
        (currentDate.getTime() - from.getTime()) / oneDay,
    );

    switch (diffInDays) {
        case -1:
            return "Tomorrow";
        case 0:
            return "Today";
        case 1:
            return "Yesterday";
        default:
            return format(from, "MMM d, yyyy");
    }
}

function range(start: number, end: number) {
    return Array.from({ length: end - start + 1 }).map((_, i) => i + start);
}

export const getPaginationRange = (
    totalPages: number,
    page: number,
    siblings: number = 1,
): (string | number)[] => {
    const arrTotal = 7 + siblings;

    if (totalPages === 1) {
        return [1];
    }

    if (arrTotal >= totalPages) {
        return range(1, totalPages);
    }

    const leftSibblingIndex = Math.max(page - siblings, 1);
    const showLeftDots = leftSibblingIndex > 2;

    const rightSibblingIndex = Math.min(page + siblings, totalPages);
    const showRightDots = rightSibblingIndex < totalPages - 2;

    if (!showLeftDots && showRightDots) {
        const leftItemsCount = 3 + 2 * siblings;
        const leftRange = range(1, leftItemsCount);

        return [...leftRange, " ...", totalPages];
    } else if (showLeftDots && !showRightDots) {
        const rightItemsCount = 3 + 2 * siblings;
        const rightRange = range(totalPages - rightItemsCount + 1, totalPages);

        return [1, "... ", ...rightRange];
    } else {
        const middleRange = range(leftSibblingIndex, rightSibblingIndex);
        return [1, "... ", ...middleRange, " ...", totalPages];
    }
};
