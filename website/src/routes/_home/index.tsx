import { createFileRoute } from "@tanstack/react-router";

import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { getDownloadResults } from "#src/routes/_benchmarks/download/-query";
import { generateMetadata } from "#src/shared/data/meta";

import Content from "./content.mdx";

export const Route = createFileRoute("/_home/")({
  component: App,
  loader: async ({ context: { queryClient }, abortController }) => {
    await Promise.all([
      queryClient.ensureQueryData(getBenchResults(abortController.signal)),
      queryClient.ensureQueryData(getDownloadResults(abortController.signal)),
    ]);
  },
  head: () =>
    generateMetadata({
      description: "Compare the performance of different schema validation libraries.",
      openGraph: {
        url: "/",
      },
    }),
  staticData: { crumb: "Home" },
});

function App() {
  return <Content components={{ wrapper: "div" }} />;
}
