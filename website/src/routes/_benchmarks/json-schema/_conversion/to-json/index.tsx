import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { sortParamsEntries } from "#src/routes/_benchmarks/_runtime/-constants";
import { ToJsonResults } from "#src/routes/_benchmarks/json-schema/_conversion/-components/to-json/results";
import {
  jsonSchemaDirectionProps,
  jsonSchemaTargetProps,
  optionalJsonSchemaDirectionSchema,
  optionalJsonSchemaTargetSchema,
} from "#src/routes/_benchmarks/json-schema/_conversion/-constants";
import { getJsonSchemaBenchResults } from "#src/routes/_benchmarks/json-schema/_conversion/-query";
import Content from "#src/routes/_benchmarks/json-schema/_conversion/to-json/content.mdx";
import { PageFilters } from "#src/shared/components/page-filter";
import { PageFilterChips } from "#src/shared/components/page-filter/chips";
import { generateMetadata } from "#src/shared/data/meta";
import { getHighlightedCode } from "#src/shared/lib/highlight";

const searchSchema = v.object({
  target: optionalJsonSchemaTargetSchema,
  direction: optionalJsonSchemaDirectionSchema,
  ...sortParamsEntries,
});

export const Route = createFileRoute("/_benchmarks/json-schema/_conversion/to-json/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search: { target, direction } }) => ({ target, direction }),
  async loader({ context: { queryClient }, deps: { target, direction }, abortController }) {
    const benchResults = await queryClient.ensureQueryData(
      getJsonSchemaBenchResults(abortController.signal),
    );
    await Promise.all(
      benchResults.conversion.toJson
        .filter(shallowFilter({ target, direction }))
        .flatMap(({ snippet, libraryName }) => [
          DownloadCount.prefetch(libraryName, { queryClient, signal: abortController.signal }),
          queryClient.prefetchQuery(getHighlightedCode({ code: snippet }, abortController.signal)),
        ]),
    );
  },
  head: () =>
    generateMetadata({
      title: "Schema to JSON Schema",
      description: "Benchmark results for converting a schema to JSON schema.",
      openGraph: { url: "/json-schema/_conversion/to-json" },
    }),
  staticData: { crumb: ["JSON Schema", "Schema to JSON"] },
});

function RouteComponent() {
  const { target, direction, sortBy, sortDir } = Route.useSearch();
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...jsonSchemaTargetProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/json-schema/to-json",
            search: toggleFilter("target", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...jsonSchemaDirectionProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/json-schema/to-json",
            search: toggleFilter("direction", option),
            replace: true,
            resetScroll: false,
          })}
        />
      </PageFilters>
      <ToJsonResults {...{ target, direction, sortBy, sortDir }} />
    </>
  );
}
