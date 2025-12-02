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

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
  dataType: optionalDataTypeSchema,
  errorType: optionalErrorTypeSchema,
});

export const Route = createFileRoute("/parsing")({
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
      benchResults.parsing
        .filter(shallowFilter({ optimizeType, dataType, errorType }))
        .map(({ snippet }) =>
          queryClient.ensureQueryData(getHighlightedCode({ code: snippet })),
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
      results.parsing.filter(
        (result) =>
          (!optimizeType || result.optimizeType === optimizeType) &&
          (!dataType || result.dataType === dataType) &&
          (!errorType || result.errorType === errorType),
      ),
  });
  return (
    <>
      <PageFilters>
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            search: toggleFilter("optimizeType", option),
          })}
        />
        <PageFilterChips
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            search: toggleFilter("dataType", option),
          })}
        />
        <PageFilterChips
          {...errorTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            search: toggleFilter("errorType", option),
          })}
        />
      </PageFilters>
      <BenchTable results={data} />
    </>
  );
}
