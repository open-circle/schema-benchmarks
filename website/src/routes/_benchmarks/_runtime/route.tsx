import { createFileRoute, Outlet } from "@tanstack/react-router";

import runtimeStyles from "./styles.css?url";

export const Route = createFileRoute("/_benchmarks/_runtime")({
  component: Outlet,
  staticData: { crumb: undefined },
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: runtimeStyles,
      },
    ],
  }),
});
