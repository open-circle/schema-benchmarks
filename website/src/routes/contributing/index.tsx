import { createFileRoute } from "@tanstack/react-router";

import { generateMetadata } from "#/shared/data/meta";

import Content from "./CONTRIBUTING.md";

export const Route = createFileRoute("/contributing/")({
  component: RouteComponent,
  head: () =>
    generateMetadata({
      title: "Contributing",
      description: "Contributing to Schema Benchmarks.",
      openGraph: {
        url: "/contributing/",
      },
    }),
  staticData: { crumb: "Contributing" },
});

function RouteComponent() {
  return <Content components={{ wrapper: "div" }} />;
}
