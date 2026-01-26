import { createFileRoute, Outlet } from "@tanstack/react-router";
import blogStyles from "@/features/blog/styles.css?url";

export const Route = createFileRoute("/blog")({
  component: RouteComponent,
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: blogStyles,
      },
    ],
  }),
  staticData: { crumb: "Blog" },
});

function RouteComponent() {
  return <Outlet />;
}
