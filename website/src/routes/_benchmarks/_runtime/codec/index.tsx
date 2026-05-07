import { collator, shallowFilter, toggleFilter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import * as v from "valibot";

import { PageFilters } from "#/shared/components/page-filter";
import { PageFilterChips } from "#/shared/components/page-filter/chips";
import { generateMetadata } from "#/shared/data/meta";
import { getHighlightedCode } from "#/shared/lib/highlight";
import { applySort, sortParams } from "#/shared/lib/sort";

import { optimizeTypeProps, optionalOptimizeTypeSchema } from "../-constants";
import { getBenchResults } from "../-query";
import { DownloadCount } from "../../-components/count";
import { useDownloadsByPkgName } from "../../-hooks";
import { getPackageName } from "../../-query";
import { CodecResults } from "./-components/results";
import { sortableKeys } from "./-constants";
import Content from "./content.mdx";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
  ...sortParams(v.optional(v.picklist(sortableKeys), "encode")),
});

export const Route = createFileRoute("/_benchmarks/_runtime/codec/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { optimizeType } }) => ({ optimizeType }),
  async loader({ context: { queryClient }, deps: { optimizeType }, abortController }) {
    const benchResults = await queryClient.ensureQueryData(getBenchResults(abortController.signal));
    await Promise.all(
      Object.values(benchResults.codec.filter(shallowFilter({ optimizeType }))).flatMap(
        ({ encode, decode, libraryName }) => [
          DownloadCount.prefetch(libraryName, {
            queryClient,
            signal: abortController.signal,
          }),
          queryClient.prefetchQuery(
            getHighlightedCode({ code: encode.snippet }, abortController.signal),
          ),
          queryClient.prefetchQuery(
            getHighlightedCode({ code: decode.snippet }, abortController.signal),
          ),
        ],
      ),
    );
  },
  head: () =>
    generateMetadata({
      title: "Codec",
      description: "Benchmark results for encoding and decoding data.",
      openGraph: {
        url: "/codec/",
      },
    }),
  staticData: { crumb: "Codec" },
});

function RouteComponent() {
  const { optimizeType, sortBy, sortDir } = Route.useSearch();
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.codec.filter(shallowFilter({ optimizeType })),
  });
  const downloadsByPkgName = useDownloadsByPkgName(data);
  const sortedData = useMemo(
    () =>
      data.toSorted(
        applySort(
          (a, b) => {
            switch (sortBy) {
              case "downloads":
                return (
                  (downloadsByPkgName[getPackageName(a.libraryName)] ?? 0) -
                  (downloadsByPkgName[getPackageName(b.libraryName)] ?? 0)
                );
              case "encode":
              case "decode":
                return a[sortBy].mean - b[sortBy].mean;
              default:
                return collator.compare(a[sortBy], b[sortBy]);
            }
          },
          {
            sortDir,
            fallbacks: [
              (a, b) => collator.compare(a.libraryName, b.libraryName),
              (a, b) => a.encode.mean - b.encode.mean,
              (a, b) => a.decode.mean - b.decode.mean,
            ],
          },
        ),
      ),
    [data, downloadsByPkgName, sortBy, sortDir],
  );
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          {...optimizeTypeProps}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: "/codec",
            search: toggleFilter("optimizeType", option),
            replace: true,
            resetScroll: false,
          })}
        />
      </PageFilters>
      <CodecResults results={sortedData} {...{ sortBy, sortDir }} />
    </>
  );
}
