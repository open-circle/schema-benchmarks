import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { CodeBlock } from "#/shared/components/code";
import { PageFilters } from "#/shared/components/page-filter";
import { PageFilterChips } from "#/shared/components/page-filter/chips";
import { generateMetadata } from "#/shared/data/meta";

import { BenchResults } from "../-components/results";
import {
  dataTypeProps,
  optimizeTypeProps,
  optionalDataTypeSchema,
  optionalOptimizeTypeSchema,
  optionalStringFormatSchema,
  stringFormatProps,
  sortParamsEntries,
} from "../-constants";
import { useSortedResults } from "../-hooks";
import { getBenchResults } from "../-query";
import { DownloadCount } from "../../-components/count";
import Content from "./content.mdx";

const searchSchema = v.object({
  stringFormat: optionalStringFormatSchema,
  optimizeType: optionalOptimizeTypeSchema,
  dataType: optionalDataTypeSchema,
  ...sortParamsEntries,
});

export const Route = createFileRoute("/_benchmarks/_runtime/string/")({
  head: () =>
    generateMetadata({
      title: "String",
      description: "Benchmark results for string validation.",
      openGraph: {
        url: "/string/",
      },
    }),
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { optimizeType, dataType, stringFormat } }) => ({
    optimizeType,
    dataType,
    stringFormat,
  }),
  async loader({
    context: { queryClient },
    deps: { optimizeType, dataType, stringFormat },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(getBenchResults(abortController.signal));

    await Promise.all(
      Object.values(
        benchResults.string[stringFormat][dataType].filter(shallowFilter({ optimizeType })),
      ).flatMap(({ snippet, libraryName }) => [
        DownloadCount.prefetch(libraryName, {
          queryClient,
          signal: abortController.signal,
        }),
        CodeBlock.prefetch({ code: snippet }, { queryClient, signal: abortController.signal }),
      ]),
    );
  },
  staticData: { crumb: "String" },
});

function RouteComponent() {
  const { stringFormat, optimizeType, dataType, sortBy, sortDir } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      results.string[stringFormat][dataType].filter(shallowFilter({ optimizeType })),
  });
  const sortedData = useSortedResults(data, sortBy, sortDir);
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...stringFormatProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/string",
            search: toggleFilter("stringFormat", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/string",
            search: toggleFilter("dataType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/string",
            search: toggleFilter("optimizeType", option),
            replace: true,
            resetScroll: false,
          })}
        />
      </PageFilters>
      <BenchResults results={sortedData} to="/string" {...{ sortBy, sortDir }} />
    </>
  );
}
