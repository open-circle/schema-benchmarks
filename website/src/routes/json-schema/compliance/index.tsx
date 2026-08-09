import { createFileRoute } from "@tanstack/react-router";

import { generateMetadata } from "#src/shared/data/meta";

export const Route = createFileRoute("/json-schema/compliance/")({
  component: RouteComponent,
  staticData: { crumb: "Compliance" },
  head: () =>
    generateMetadata({
      title: "Compliance",
      description: "Compliance with JSON Schema standards",
      openGraph: {
        url: "/json-schema/compliance/",
      },
    }),
});

function RouteComponent() {
  return <div>Hello "/json-schema/compliance/"!</div>;
}
