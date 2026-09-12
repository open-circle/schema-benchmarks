import type { TypesResult } from "@schema-benchmarks/bench";
import { collator, compareStrings } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import * as v from "valibot";

import { compareDownloadsByPkgName, useDownloadsByPkgName } from "#src/routes/_benchmarks/-hooks";
import { generateMetadata } from "#src/shared/data/meta";
import { applySort, sortParams } from "#src/shared/lib/sort";

import { TypesDetail } from "./-components/detail";
import { TypesResults } from "./-components/results";
import { sortableKeys } from "./-constants.ts";
import Content from "./-content.mdx";
import { getTypesBenchResults } from "./-query.ts";

import styles from "./index.css?url";

const searchSchema = v.object({
  ...sortParams(v.optional(v.picklist(sortableKeys), "instantiations")),
  detail: v.fallback(v.optional(v.string()), undefined),
});

export const Route = createFileRoute("/typescript/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  loader: async ({ context: { queryClient }, abortController }) => {
    await queryClient.query({
      ...getTypesBenchResults(abortController.signal),
      staleTime: "static",
    });
  },
  head: () =>
    generateMetadata({
      title: "TypeScript Inference",
      description:
        "Comparison of the types libraries infer, what they cost the compiler, and how they read on hover.",
      openGraph: { url: "/typescript" },
      links: [{ rel: "stylesheet", href: styles }],
    }),
  staticData: { crumb: "TypeScript" },
});

/** A library that infers nothing has no number to compare, so it sorts last either way. */
const compareInference = (
  a: TypesResult,
  b: TypesResult,
  read: (inference: NonNullable<TypesResult["inference"]>) => number,
) => (a.inference ? read(a.inference) : Infinity) - (b.inference ? read(b.inference) : Infinity);

function RouteComponent() {
  const { sortBy, sortDir, detail } = Route.useSearch();
  const { data } = useSuspenseQuery(getTypesBenchResults());
  const downloadsByPkgName = useDownloadsByPkgName(data.results);
  const sortedResults = useMemo(
    () =>
      data.results.toSorted(
        applySort(
          (a, b) => {
            switch (sortBy) {
              case "libraryName":
                return collator.compare(a.libraryName, b.libraryName);
              case "downloads":
                return compareDownloadsByPkgName(downloadsByPkgName, a, b);
              case "chars":
                return compareInference(a, b, (result) => result.schema.chars);
              default:
                return compareInference(a, b, (result) => result.instantiations);
            }
          },
          {
            sortDir,
            fallbacks: [
              compareDownloadsByPkgName.fallback(downloadsByPkgName),
              compareStrings((result) => result.libraryName),
            ],
          },
        ),
      ),
    [data.results, downloadsByPkgName, sortBy, sortDir],
  );
  const detailResult = useMemo(
    () => data.results.find((result) => result.id === detail),
    [data.results, detail],
  );
  return (
    <>
      <div>
        <Content />
        <p className="typo-caption">Measured with TypeScript {data.typescriptVersion}.</p>
      </div>
      <TypesResults results={sortedResults} {...{ sortBy, sortDir }} />
      <TypesDetail result={detailResult} />
    </>
  );
}
