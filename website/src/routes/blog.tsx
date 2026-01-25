import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  component: RouteComponent,
  staticData: { crumb: "Blog" },
});

function RouteComponent() {
  return <Outlet />;
}
