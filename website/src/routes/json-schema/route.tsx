import { createFileRoute, Outlet } from "@tanstack/react-router";

import jsonSchemaStyles from "./styles.css?url";

export const Route = createFileRoute("/json-schema")({
  component: Outlet,
  staticData: { crumb: { label: "JSON Schema", interactive: false } },
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: jsonSchemaStyles,
      },
    ],
  }),
});
