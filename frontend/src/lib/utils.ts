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

    if (diffInDays === 0) {
        return "Today";
    } else if (diffInDays === 1) {
        return "Yesterday";
    } else {
        return format(from, "MMM d, yyyy");
    }
}
