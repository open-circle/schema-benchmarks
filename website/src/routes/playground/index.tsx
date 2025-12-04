import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/empty-state";
import { MdSymbol } from "@/components/symbol";

export const Route = createFileRoute("/playground/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EmptyState
      icon={<MdSymbol>deployed_code</MdSymbol>}
      title="No library selected"
      subtitle="Select a library to get started"
    />
  );
}
