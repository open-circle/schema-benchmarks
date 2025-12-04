import { libraries } from "@schema-benchmarks/schemas/libraries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/playground/$library")({
  head: () => ({
    meta: [
      {
        title: "Playground - Schema Benchmarks",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { library } = Route.useParams();
  return library;
}
