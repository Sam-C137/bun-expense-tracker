import {
    createRootRouteWithContext,
    Link,
    Outlet,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

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
            <div className="flex p-4 gap-2 max-w-2xl mx-auto">
                <Outlet />
            </div>
        </>
    );
}

function Nav() {
    return (
        <nav className="p-2 flex gap-2 max-w-2xl mx-auto items-center justify-center">
            <Link to="/" className="[&.active]:font-bold">
                Home
            </Link>
            <Link to="/about" className="[&.active]:font-bold">
                About
            </Link>
            <Link to="/expenses" className="[&.active]:font-bold">
                Expenses
            </Link>
            <Link to="/create-expense" className="[&.active]:font-bold">
                Create Expense
            </Link>
            <Link to="/profile" className="[&.active]:font-bold">
                Profile
            </Link>
        </nav>
    );
}
