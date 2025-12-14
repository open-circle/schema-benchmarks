import { shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { create } from "mutative";
import * as v from "valibot";
import { PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { generateMetadata } from "@/data/meta";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  getBenchResults,
  optimizeTypeProps,
  optionalOptimizeTypeSchema,
} from "@/features/benchmark/query";
import benchmarkStyles from "@/features/benchmark/styles.css?url";
import { getHighlightedCode } from "@/lib/highlight";
import Content from "./content.mdx";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
});

export const Route = createFileRoute("/_benchmarks/initialization/")({
  head: () =>
    create(generateMetadata({ title: "Initialization" }), ({ links }) => {
      links.push({
        rel: "stylesheet",
        href: benchmarkStyles,
      });
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
    for (const { snippet } of Object.values(
      benchResults.initialization.filter(shallowFilter({ optimizeType })),
    )) {
      queryClient.prefetchQuery(
        getHighlightedCode({ code: snippet }, abortController.signal),
      );
    }
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
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            search: toggleFilter("optimizeType", option),
            resetScroll: false,
          })}
        />
      </PageFilters>
      <BenchTable results={data} />
    </>
  );
}
