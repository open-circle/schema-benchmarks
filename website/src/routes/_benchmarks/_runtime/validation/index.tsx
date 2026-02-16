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
} from "../-constants";
import { getBenchResults } from "../-query";
import { DownloadCount } from "../../-components/count";
import Content from "./content.mdx";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
  dataType: optionalDataTypeSchema,
});

export const Route = createFileRoute("/_benchmarks/_runtime/validation/")({
  head: () =>
    generateMetadata({
      title: "Validation",
      description: "Benchmark results for validating data.",
      openGraph: {
        url: "/validation/",
      },
    }),
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { optimizeType, dataType } }) => ({
    optimizeType,
    dataType,
  }),
  async loader({ context: { queryClient }, deps: { optimizeType, dataType }, abortController }) {
    const benchResults = await queryClient.ensureQueryData(getBenchResults(abortController.signal));
    await Promise.all(
      Object.values(
        benchResults.validation[dataType].filter(shallowFilter({ optimizeType })),
      ).flatMap(({ snippet, libraryName }) => [
        DownloadCount.prefetch(libraryName, {
          queryClient,
          signal: abortController.signal,
        }),
        CodeBlock.prefetch({ code: snippet }, { queryClient, signal: abortController.signal }),
      ]),
    );
  },
  staticData: { crumb: "Validation" },
});

function RouteComponent() {
  const { optimizeType, dataType } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.validation[dataType].filter(shallowFilter({ optimizeType })),
  });
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...dataTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/validation",
            search: toggleFilter("dataType", option),
            replace: true,
            resetScroll: false,
          })}
        />
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/validation",
            replace: true,
            search: toggleFilter("optimizeType", option),
            resetScroll: false,
          })}
        />
      </PageFilters>
      <BenchResults results={data} />
    </>
  );
}
