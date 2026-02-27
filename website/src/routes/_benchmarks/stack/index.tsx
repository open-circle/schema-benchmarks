import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AnsiBlock } from "#/shared/components/code/ansi";
import { generateMetadata } from "#/shared/data/meta";

import { StackResults } from "./-components/results";
import { getStackResults } from "./-query";
import Content from "./content.mdx";

import styles from "./index.css?url";

export const Route = createFileRoute("/_benchmarks/stack/")({
  component: RouteComponent,
  head: () =>
    generateMetadata({
      title: "Stack",
      description: "Comparison of errors thrown by libraries.",
      openGraph: {
        url: "/stack/",
      },
      links: [
        {
          rel: "stylesheet",
          href: styles,
        },
      ],
    }),
  loader: async ({ context: { queryClient }, abortController }) => {
    const results = await queryClient.ensureQueryData(getStackResults(abortController.signal));
    for (const { output } of results) {
      if (!output) continue;
      await AnsiBlock.prefetch(
        { input: output, lineNumbers: true },
        { queryClient, signal: abortController.signal },
      );
    }
  },
  staticData: { crumb: "Stack" },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(getStackResults());
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <StackResults results={data} />
    </>
  );
}
