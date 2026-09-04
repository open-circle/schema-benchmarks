import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { sortParamsEntries } from "#src/routes/_benchmarks/_runtime/-constants";
import { getJsonSchemaBenchResults } from "#src/routes/json-schema/-query.ts";
import { ResponsiveCodeBlock } from "#src/shared/components/code";
import { generateMetadata } from "#src/shared/data/meta";
import { getHighlightedCode } from "#src/shared/lib/highlight";

import { FromJsonResults } from "./-components/results.tsx";
import Content from "./content.mdx";

const searchSchema = v.object({
  ...sortParamsEntries,
});

export const Route = createFileRoute("/json-schema/_conversion/from-json/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  async loader({ context: { queryClient }, abortController }) {
    const benchResults = await queryClient.query({
      ...getJsonSchemaBenchResults(abortController.signal),
      staleTime: "static",
    });
    await Promise.all(
      benchResults.conversion.fromJson.flatMap(({ snippet, libraryName }) => [
        DownloadCount.prefetch(libraryName, { queryClient, signal: abortController.signal }),
        queryClient.query(getHighlightedCode({ code: snippet }, abortController.signal)),
        ResponsiveCodeBlock.prefetch(
          { fileName: `${libraryName}.ts`, sourceText: snippet },
          { queryClient, signal: abortController.signal },
        ),
      ]),
    );
  },
  head: () =>
    generateMetadata({
      title: "JSON Schema to Schema",
      description: "Benchmark results for converting a JSON schema to a library schema.",
      openGraph: { url: "/json-schema/from-json" },
    }),
  staticData: { crumb: "JSON to Schema" },
});

function RouteComponent() {
  const { sortBy, sortDir } = Route.useSearch();
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <FromJsonResults {...{ sortBy, sortDir }} />
    </>
  );
}
