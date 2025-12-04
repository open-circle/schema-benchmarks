import { libraries } from "@schema-benchmarks/schemas/libraries";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { EmptyState } from "@/components/empty-state";
import { MdSymbol } from "@/components/symbol";

export const Route = createFileRoute("/playground/$library")({
  head: () => ({
    meta: [
      {
        title: "Playground - Schema Benchmarks",
      },
    ],
  }),
  loader({ params: { library } }) {
    if (!libraries[`./${library}/benchmarks.ts`]) {
      throw notFound();
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <EmptyState
      icon={<MdSymbol>deployed_code_alert</MdSymbol>}
      title="Invalid library"
      subtitle="Select a valid library above"
    />
  ),
});

function RouteComponent() {
  const { library } = Route.useParams();
  return library;
}
