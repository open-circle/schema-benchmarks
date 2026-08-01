import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_benchmarks/json-schema/_conversion")({
  component: Outlet,
  staticData: { crumb: undefined },
});
