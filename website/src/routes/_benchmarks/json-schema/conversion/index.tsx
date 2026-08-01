import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { sortParamsEntries } from "#src/routes/_benchmarks/_runtime/-constants";
import { useSortedResults } from "#src/routes/_benchmarks/_runtime/-hooks";
import { PageFilters } from "#src/shared/components/page-filter";
import { PageFilterChips } from "#src/shared/components/page-filter/chips";
import { generateMetadata } from "#src/shared/data/meta";
import { getHighlightedCode } from "#src/shared/lib/highlight";

import { ConversionResults } from "./-components/results";
import {
  jsonSchemaDirectionProps,
  jsonSchemaTargetProps,
  optionalJsonSchemaDirectionSchema,
  optionalJsonSchemaTargetSchema,
} from "./-constants";
import { getJsonSchemaBenchResults } from "./-query";
import Content from "./content.mdx";

const searchSchema = v.object({
  target: optionalJsonSchemaTargetSchema,
  direction: optionalJsonSchemaDirectionSchema,
  ...sortParamsEntries,
});

export const Route = createFileRoute("/_benchmarks/json-schema/conversion/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search: { target, direction } }) => ({ target, direction }),
  async loader({ context: { queryClient }, deps: { target, direction }, abortController }) {
    const benchResults = await queryClient.ensureQueryData(
      getJsonSchemaBenchResults(abortController.signal),
    );
    await Promise.all(
      Object.values(
        benchResults.conversion.toJson.filter(shallowFilter({ target, direction })),
      ).flatMap(({ snippet, libraryName }) => [
        DownloadCount.prefetch(libraryName, {
          queryClient,
          signal: abortController.signal,
        }),
        queryClient.prefetchQuery(getHighlightedCode({ code: snippet }, abortController.signal)),
      ]),
    );
  },
  head: () =>
    generateMetadata({
      title: "JSON Schema Conversion",
      description: "Benchmark results for generating a JSON schema from a schema.",
      openGraph: {
        url: "/json-schema/conversion",
      },
    }),
  staticData: { crumb: ["JSON Schema", "Conversion"] },
});

function RouteComponent() {
  const { target, direction, sortBy, sortDir } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: ({ conversion }) => conversion.toJson.filter(shallowFilter({ target, direction })),
  });
  const sortedData = useSortedResults(data, sortBy, sortDir);
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...jsonSchemaTargetProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/json-schema/conversion",
            search: toggleFilter("target", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...jsonSchemaDirectionProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/json-schema/conversion",
            search: toggleFilter("direction", option),
            replace: true,
            resetScroll: false,
          })}
        />
      </PageFilters>
      <ConversionResults results={sortedData} {...{ sortBy, sortDir }} />
    </>
  );
}
