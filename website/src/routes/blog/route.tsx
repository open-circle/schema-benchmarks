import { createFileRoute, Outlet } from "@tanstack/react-router";
import blogStyles from "./styles.css?url";

export const Route = createFileRoute("/blog")({
  component: Outlet,
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
