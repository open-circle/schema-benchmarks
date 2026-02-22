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
  errorTypeProps,
  optimizeTypeProps,
  optionalDataTypeSchema,
  optionalErrorTypeSchema,
  optionalOptimizeTypeSchema,
  sortParamsEntries,
} from "../-constants";
import { useSortedResults } from "../-hooks";
import { getBenchResults } from "../-query";
import { DownloadCount } from "../../-components/count";
import Content from "./content.mdx";

import admonitionCss from "../../../blog/-components/admonition/index.css?url";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
  dataType: optionalDataTypeSchema,
  errorType: optionalErrorTypeSchema,
  ...sortParamsEntries,
});

export const Route = createFileRoute("/_benchmarks/_runtime/standard/")({
  head: () =>
    generateMetadata({
      title: "Standard Schema",
      description: "Benchmark results for parsing data using the Standard Schema interface.",
      openGraph: {
        url: "/standard/",
      },
      links: [
        {
          rel: "stylesheet",
          href: admonitionCss,
        },
      ],
    }),
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { optimizeType, dataType, errorType } }) => ({
    optimizeType,
    dataType,
    errorType,
  }),
  async loader({
    context: { queryClient },
    deps: { optimizeType, dataType, errorType },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(getBenchResults(abortController.signal));

    await Promise.all(
      Object.values(
        benchResults.standard[dataType].filter(shallowFilter({ optimizeType, errorType })),
      ).flatMap(({ snippet, libraryName }) => [
        DownloadCount.prefetch(libraryName, {
          queryClient,
          signal: abortController.signal,
        }),
        CodeBlock.prefetch({ code: snippet }, { queryClient, signal: abortController.signal }),
      ]),
    );
  },
  staticData: { crumb: "Standard Schema" },
});

function RouteComponent() {
  const { optimizeType, dataType, errorType, sortBy, sortDir } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      results.standard[dataType].filter(shallowFilter({ optimizeType, errorType })),
  });
  const sortedData = useSortedResults(data, sortBy, sortDir);
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/standard",
            search: toggleFilter("dataType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/standard",
            search: toggleFilter("optimizeType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...errorTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/standard",
            search: toggleFilter("errorType", option),
            replace: true,
            resetScroll: false,
          })}
        />
      </PageFilters>
      <BenchResults results={sortedData} to="/standard" {...{ sortBy, sortDir }} />
    </>
  );
}
