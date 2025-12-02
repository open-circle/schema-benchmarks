import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";
import { PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  getBenchResults,
  optimizeTypeProps,
  optionalOptimizeTypeSchema,
} from "@/features/benchmark/query";
import benchmarkStyles from "@/features/benchmark/styles.css?url";
import { getHighlightedCode } from "@/lib/highlight";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
});

export const Route = createFileRoute("/initialization")({
  head: () => ({
    meta: [
      {
        title: "Initialization - Schema Benchmarks",
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
  loaderDeps: ({ search: { optimizeType } }) => ({ optimizeType }),
  async loader({
    context: { queryClient },
    deps: { optimizeType },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(
      getBenchResults(abortController.signal),
    );
    await Promise.all(
      Object.values(
        benchResults.initialization.filter(shallowFilter({ optimizeType })),
      ).map(({ snippet }) =>
        queryClient.ensureQueryData(
          getHighlightedCode({ code: snippet }, abortController.signal),
        ),
      ),
    );
    return { crumb: "Initialization" };
  },
});

function RouteComponent() {
  const { optimizeType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      results.initialization.filter(shallowFilter({ optimizeType })),
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
      </PageFilters>
      <BenchTable results={data} />
    </>
  );
}
