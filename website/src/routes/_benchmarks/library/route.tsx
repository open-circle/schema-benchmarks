import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_benchmarks/library")({
  component: RouteComponent,
  staticData: { crumb: "Libraries" },
});

function RouteComponent() {
  return <Outlet />;
}
