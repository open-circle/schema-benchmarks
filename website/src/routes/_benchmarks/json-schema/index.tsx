import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_benchmarks/json-schema/")({
  beforeLoad: () => {
    throw redirect({
      to: "/json-schema/conversion",
    });
  },
  staticData: { crumb: undefined },
});
