import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { sortParamsEntries } from "#src/routes/_benchmarks/_runtime/-constants";
import { FromJsonResults } from "#src/routes/_benchmarks/json-schema/_conversion/-components/from-json/results";
import { getJsonSchemaBenchResults } from "#src/routes/_benchmarks/json-schema/_conversion/-query";
import Content from "#src/routes/_benchmarks/json-schema/_conversion/from-json/content.mdx";
import { generateMetadata } from "#src/shared/data/meta";
import { getHighlightedCode } from "#src/shared/lib/highlight";

const searchSchema = v.object({
  ...sortParamsEntries,
});

export const Route = createFileRoute("/_benchmarks/json-schema/_conversion/from-json/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  async loader({ context: { queryClient }, abortController }) {
    const benchResults = await queryClient.ensureQueryData(
      getJsonSchemaBenchResults(abortController.signal),
    );
    await Promise.all(
      benchResults.conversion.fromJson.flatMap(({ snippet, libraryName }) => [
        DownloadCount.prefetch(libraryName, { queryClient, signal: abortController.signal }),
        queryClient.prefetchQuery(getHighlightedCode({ code: snippet }, abortController.signal)),
      ]),
    );
  },
  head: () =>
    generateMetadata({
      title: "JSON Schema to Schema",
      description: "Benchmark results for converting a JSON schema to a library schema.",
      openGraph: { url: "/json-schema/from-json" },
    }),
  staticData: { crumb: ["JSON Schema", "JSON to Schema"] },
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
