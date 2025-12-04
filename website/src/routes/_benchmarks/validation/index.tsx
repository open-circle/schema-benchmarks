import { partialMatch, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { create } from "mutative";
import * as v from "valibot";
import { PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { generateMetadata } from "@/data/meta";
import { BenchTable } from "@/features/benchmark/components/table";
import {
  dataTypeProps,
  getBenchResults,
  optimizeTypeProps,
  optionalDataTypeSchema,
  optionalOptimizeTypeSchema,
} from "@/features/benchmark/query";
import benchmarkStyles from "@/features/benchmark/styles.css?url";
import { getHighlightedCode } from "@/lib/highlight";
import Content from "./content.mdx";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
  dataType: optionalDataTypeSchema,
});

export const Route = createFileRoute("/_benchmarks/validation/")({
  head: () =>
    create(generateMetadata({ title: "Validation" }), ({ links }) => {
      links.push({
        rel: "stylesheet",
        href: benchmarkStyles,
      });
    }),
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { optimizeType, dataType } }) => ({
    optimizeType,
    dataType,
  }),
  async loader({
    context: { queryClient },
    deps: { optimizeType, dataType },
    abortController,
  }) {
    const benchResults = await queryClient.ensureQueryData(
      getBenchResults(abortController.signal),
    );
    for (const { snippet } of Object.values(
      benchResults.validation[dataType].filter(partialMatch({ optimizeType })),
    )) {
      queryClient.prefetchQuery(
        getHighlightedCode({ code: snippet }, abortController.signal),
      );
    }
    return { crumb: "Validation" };
  },
});

function RouteComponent() {
  const { optimizeType, dataType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      results.validation[dataType].filter(partialMatch({ optimizeType })),
  });
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            search: toggleFilter("dataType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: Route.fullPath,
            replace: true,
            search: toggleFilter("optimizeType", option),
            resetScroll: false,
          })}
        />
      </PageFilters>
      <BenchTable results={data} />
    </>
  );
}
