import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/libraries")({
  component: RouteComponent,
  staticData: { crumb: "Libraries" },
});

function RouteComponent() {
  return <Outlet />;
}
