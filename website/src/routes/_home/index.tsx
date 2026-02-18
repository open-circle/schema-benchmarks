import { createFileRoute } from "@tanstack/react-router";

import { generateMetadata } from "#/shared/data/meta";

import { getBenchResults } from "../_benchmarks/_runtime/-query";
import { getDownloadResults } from "../_benchmarks/download/-query";
import Content from "./content.mdx";

import admonitionCss from "../blog/-components/admonition/index.css?url";

export const Route = createFileRoute("/_home/")({
  component: App,
  loader: async ({ context: { queryClient }, abortController }) => {
    await Promise.all([
      queryClient.prefetchQuery(getBenchResults(abortController.signal)),
      queryClient.prefetchQuery(getDownloadResults(abortController.signal)),
    ]);
  },
  head: () =>
    generateMetadata({
      description: "Compare the performance of different schema validation libraries.",
      openGraph: {
        url: "/",
      },
      links: [
        {
          rel: "stylesheet",
          href: admonitionCss,
        },
      ],
    }),
  staticData: { crumb: "Home" },
});

function App() {
  return <Content components={{ wrapper: "div" }} />;
}
