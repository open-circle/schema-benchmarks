import { StackResult } from "@schema-benchmarks/bench";
import { collator } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import * as v from "valibot";

import { CodeBlock } from "#/shared/components/code";
import { AnsiBlock } from "#/shared/components/code/ansi";
import { generateMetadata } from "#/shared/data/meta";
import { applySort, sortParams } from "#/shared/lib/sort";

import { useDownloadsByPkgName } from "../-hooks";
import { getPackageName } from "../-query";
import { StackResults } from "./-components/results";
import { sortableKeys } from "./-constants";
import { getStackResults } from "./-query";
import Content from "./content.mdx";

import styles from "./index.css?url";

const searchSchema = v.object({
  ...sortParams(v.optional(v.picklist(sortableKeys), "line")),
});

export const Route = createFileRoute("/_benchmarks/stack/")({
  component: RouteComponent,
  head: () =>
    generateMetadata({
      title: "Stack",
      description: "Comparison of errors thrown by libraries.",
      openGraph: {
        url: "/stack/",
      },
      links: [
        {
          rel: "stylesheet",
          href: styles,
        },
      ],
    }),
  validateSearch: searchSchema,
  loader: async ({ context: { queryClient }, abortController }) => {
    const results = await queryClient.ensureQueryData(getStackResults(abortController.signal));
    for (const { output, snippet } of results) {
      await Promise.all([
        output &&
          AnsiBlock.prefetch(
            { input: output, lineNumbers: true },
            { queryClient, signal: abortController.signal },
          ),
        CodeBlock.prefetch({ code: snippet }, { queryClient, signal: abortController.signal }),
      ]);
    }
  },
  staticData: { crumb: "Stack" },
});

function lineSort(a: StackResult, b: StackResult) {
  if (typeof a.line === "number" && typeof b.line === "number") {
    return a.line - b.line;
  }
  if (typeof a.line === "number") return -1;
  if (typeof b.line === "number") return 1;
  return 0;
}

function RouteComponent() {
  const { sortBy, sortDir } = Route.useSearch();
  const { data } = useSuspenseQuery(getStackResults());
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
              case "libraryName":
                return collator.compare(a[sortBy], b[sortBy]);
              default:
                return lineSort(a, b);
            }
          },
          {
            sortDir,
            fallbacks: [(a, b) => collator.compare(a.libraryName, b.libraryName), lineSort],
          },
        ),
      ),
    [data, downloadsByPkgName, sortBy, sortDir],
  );
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <StackResults results={sortedData} {...{ sortBy, sortDir }} />
    </>
  );
}
