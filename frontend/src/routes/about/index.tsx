import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about/")({
    component: About,
});

function About() {
    return (
        <div>
            <p>Coming soon...</p>
        </div>
    );
}
