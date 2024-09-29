import {
    createRootRouteWithContext,
    Link,
    Outlet,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface RouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: Root,
});

function Root() {
    return (
        <>
            <Nav />
            <hr />
            <div className="flex p-4 gap-2 max-w-2xl mx-auto">
                <Outlet />
            </div>
            <Toaster />
        </>
    );
}

function Nav() {
    const { theme, setTheme } = useTheme();

    return (
        <nav className="flex justify-between p-2 max-w-2xl mx-auto items-baseline">
            <Link to="/">
                <h1 className="text-2xl font-bold">Expense Tracker</h1>
            </Link>
            <div className="flex gap-2 items-center justify-center">
                <Link to="/about" className="[&.active]:font-bold">
                    About
                </Link>
                <Link to="/expenses" className="[&.active]:font-bold">
                    Expenses
                </Link>
                <Link to="/create-expense" className="[&.active]:font-bold">
                    Create
                </Link>
                <Link to="/profile" className="[&.active]:font-bold">
                    Profile
                </Link>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                >
                    {theme === "dark" ? (
                        <Sun className="size-4" />
                    ) : (
                        <Moon className="size-4" />
                    )}
                </Button>
            </div>
        </nav>
    );
}
