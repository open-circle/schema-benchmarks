import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/json-schema/_conversion/to-json/")({
  beforeLoad: () => {
    throw redirect({ to: "/json-schema/to-json/$tab", params: { tab: "matrix" } });
  },
  staticData: { crumb: undefined },
});
