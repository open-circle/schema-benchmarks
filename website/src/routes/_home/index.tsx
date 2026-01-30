import { createFileRoute } from "@tanstack/react-router";
import { generateMetadata } from "#/shared/data/meta";
import Content from "./content.mdx";

export const Route = createFileRoute("/_home/")({
  component: App,
  head: () =>
    generateMetadata({
      description:
        "Compare the performance of different schema validation libraries.",
      openGraph: {
        url: "/",
      },
    }),
  staticData: { crumb: undefined },
});

function App() {
  return <Content components={{ wrapper: "div" }} />;
}
