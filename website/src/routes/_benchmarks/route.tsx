import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_benchmarks")({
  component: RouteComponent,
  staticData: { crumb: "Benchmarks" },
});

function RouteComponent() {
  return <Outlet />;
}
