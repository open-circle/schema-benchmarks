import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { BenchResults } from "#src/routes/_benchmarks/_runtime/-components/results";
import {
  jsonSchemaDirectionProps,
  jsonSchemaTargetProps,
  optionalJsonSchemaDirectionSchema,
  optionalJsonSchemaTargetSchema,
  sortParamsEntries,
} from "#src/routes/_benchmarks/_runtime/-constants";
import { useSortedResults } from "#src/routes/_benchmarks/_runtime/-hooks";
import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { PageFilters } from "#src/shared/components/page-filter";
import { PageFilterChips } from "#src/shared/components/page-filter/chips";
import { generateMetadata } from "#src/shared/data/meta";
import { getHighlightedCode } from "#src/shared/lib/highlight";

import { SupportMatrix } from "./-components/matrix";
import Content from "./content.mdx";

const searchSchema = v.object({
  target: optionalJsonSchemaTargetSchema,
  direction: optionalJsonSchemaDirectionSchema,
  ...sortParamsEntries,
});

export const Route = createFileRoute("/_benchmarks/json-schema/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search: { target, direction } }) => ({ target, direction }),
  async loader({ context: { queryClient }, deps: { target, direction }, abortController }) {
    const benchResults = await queryClient.ensureQueryData(getBenchResults(abortController.signal));
    await Promise.all(
      Object.values(benchResults.jsonSchema.filter(shallowFilter({ target, direction }))).flatMap(
        ({ snippet, libraryName }) => [
          DownloadCount.prefetch(libraryName, {
            queryClient,
            signal: abortController.signal,
          }),
          queryClient.prefetchQuery(getHighlightedCode({ code: snippet }, abortController.signal)),
        ],
      ),
    );
  },
  head: () =>
    generateMetadata({
      title: "JSON Schema",
      description: "Benchmark results for generating a JSON schema from a schema.",
      openGraph: {
        url: "/json-schema/",
      },
    }),
  staticData: { crumb: "JSON Schema" },
});

function RouteComponent() {
  const { target, direction, sortBy, sortDir } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: ({ jsonSchema, jsonSchemaSupport }) => ({
      results: jsonSchema.filter(shallowFilter({ target, direction })),
      support: jsonSchemaSupport,
    }),
  });
  const sortedData = useSortedResults(data.results, sortBy, sortDir);
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <SupportMatrix results={data.support} />
      <PageFilters>
        <PageFilterChips
          {...jsonSchemaTargetProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/json-schema",
            search: toggleFilter("target", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...jsonSchemaDirectionProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/json-schema",
            search: toggleFilter("direction", option),
            replace: true,
            resetScroll: false,
          })}
        />
      </PageFilters>
      <BenchResults results={sortedData} to="/json-schema" {...{ sortBy, sortDir }} />
    </>
  );
}
