import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_benchmarks")({
  component: Outlet,
  staticData: { crumb: "Benchmarks" },
});
