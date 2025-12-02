import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  dataTypeProps,
  errorTypeProps,
  getBenchResults,
  optimizeTypeProps,
  optionalDataTypeSchema,
  optionalErrorTypeSchema,
  optionalOptimizeTypeSchema,
} from "@/features/benchmark/query";
import benchmarkStyles from "@/features/benchmark/styles.css?url";
import { getHighlightedCode } from "@/lib/highlight";
import Content from "./content.mdx";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
  dataType: optionalDataTypeSchema,
  errorType: optionalErrorTypeSchema,
});

export const Route = createFileRoute("/parsing/")({
  head: () => ({
    meta: [
      {
        title: "Parsing - Schema Benchmarks",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: benchmarkStyles,
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
    const benchResults = await queryClient.ensureQueryData(
      getBenchResults(abortController.signal),
    );
    await Promise.all(
      benchResults.parsing[dataType]
        .filter(shallowFilter({ optimizeType, errorType }))
        .map(({ snippet }) =>
          queryClient.ensureQueryData(
            getHighlightedCode({ code: snippet }, abortController.signal),
          ),
        ),
    );
    return { crumb: "Parsing" };
  },
});

function RouteComponent() {
  const { optimizeType, dataType, errorType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      results.parsing[dataType].filter(
        shallowFilter({ optimizeType, errorType }),
      ),
  });
  return (
    <>
      <Content />
      <PageFilters>
        <PageFilterChips
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            search: toggleFilter("dataType", option),
          })}
        />
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            search: toggleFilter("optimizeType", option),
            replace: true,
          })}
        />
        <PageFilterChips
          {...errorTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            search: toggleFilter("errorType", option),
            replace: true,
          })}
        />
      </PageFilters>
      <BenchTable results={data} />
    </>
  );
}
