import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { sortParamsEntries } from "#src/routes/_benchmarks/_runtime/-constants";
import { PageFilters } from "#src/shared/components/page-filter";
import { PageFilterChips } from "#src/shared/components/page-filter/chips";
import { generateMetadata } from "#src/shared/data/meta";
import { getHighlightedCode } from "#src/shared/lib/highlight";

import { FromJsonResults } from "./-components/from-json/results";
import { ToJsonResults } from "./-components/to-json/results";
import {
  conversionTypeProps,
  jsonSchemaDirectionProps,
  jsonSchemaTargetProps,
  optionalConversionTypeSchema,
  optionalJsonSchemaDirectionSchema,
  optionalJsonSchemaTargetSchema,
} from "./-constants";
import { getJsonSchemaBenchResults } from "./-query";
import Content from "./content.mdx";
const searchSchema = v.object({
  conversionType: optionalConversionTypeSchema,
  target: optionalJsonSchemaTargetSchema,
  direction: optionalJsonSchemaDirectionSchema,
  ...sortParamsEntries,
});

export const Route = createFileRoute("/_benchmarks/json-schema/conversion/")({
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search: { conversionType, target, direction } }) => ({
    conversionType,
    target,
    direction,
  }),
  async loader({
    context: { queryClient },
    deps: { conversionType, target, direction },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(
      getJsonSchemaBenchResults(abortController.signal),
    );
    const results =
      conversionType === "fromJson"
        ? benchResults.conversion.fromJson
        : benchResults.conversion.toJson.filter(shallowFilter({ target, direction }));
    await Promise.all(
      Object.values(results).flatMap(({ snippet, libraryName }) => [
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
  const { conversionType, target, direction, sortBy, sortDir } = Route.useSearch();
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...conversionTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/json-schema/conversion",
            search: toggleFilter("conversionType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        {conversionType === "toJson" && (
          <>
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
          </>
        )}
      </PageFilters>
      {conversionType === "fromJson" ? (
        <FromJsonResults {...{ sortBy, sortDir }} />
      ) : (
        <ToJsonResults {...{ target, direction, sortBy, sortDir }} />
      )}
    </>
  );
}
