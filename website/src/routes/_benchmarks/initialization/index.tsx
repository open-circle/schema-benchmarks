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
import { getAllWeeklyDownloads } from "@/features/popularity/query";
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
    const downloadPromises = [];
    for (const { snippet, libraryName } of Object.values(
      benchResults.initialization.filter(shallowFilter({ optimizeType })),
    )) {
      // wait for these
      downloadPromises.push(
        queryClient.ensureQueryData(
          getAllWeeklyDownloads(libraryName, abortController.signal),
        ),
      );
      // don't wait for these, not visible immediately
      queryClient.prefetchQuery(
        getHighlightedCode({ code: snippet }, abortController.signal),
      );
    }
    await Promise.all(downloadPromises);
  },
  staticData: { crumb: "Initialization" },
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
