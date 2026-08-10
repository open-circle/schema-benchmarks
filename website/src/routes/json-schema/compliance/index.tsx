import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/json-schema/compliance/")({
  beforeLoad: () => {
    throw redirect({
      to: "/json-schema/compliance/$tab",
      params: { tab: "validation" },
    });
  },
  staticData: { crumb: undefined },
});
