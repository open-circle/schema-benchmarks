import type { StackResult } from "@schema-benchmarks/bench";
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
import { highlightFrame, sortableKeys } from "./-constants";
import Content, { exampleStack } from "./-content.mdx";
import { getStackResults } from "./-query";

import styles from "./index.css?url";

const searchSchema = v.object({
  ...sortParams(v.optional(v.picklist(sortableKeys), "frame")),
});

export const Route = createFileRoute("/_benchmarks/stack/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  loader: async ({ context: { queryClient }, abortController }) => {
    const results = await queryClient.ensureQueryData(getStackResults(abortController.signal));
    await Promise.all([
      AnsiBlock.prefetch(
        { input: exampleStack, lineNumbers: true },
        { queryClient, signal: abortController.signal },
      ),
      ...results.flatMap(({ output, snippet }) => [
        output &&
          AnsiBlock.prefetch(
            { input: highlightFrame(output), lineNumbers: true },
            { queryClient, signal: abortController.signal },
          ),
        CodeBlock.prefetch({ code: snippet }, { queryClient, signal: abortController.signal }),
      ]),
    ]);
  },
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
  staticData: { crumb: "Stack" },
});

function frameSort(a: StackResult, b: StackResult) {
  if (typeof a.frame === "number" && typeof b.frame === "number") return a.frame - b.frame;
  if (typeof a.frame === "number") return -1;
  if (typeof b.frame === "number") return 1;
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
              case "lineCount":
                return a[sortBy] - b[sortBy];
              default:
                return frameSort(a, b);
            }
          },
          {
            sortDir,
            fallbacks: [(a, b) => collator.compare(a.libraryName, b.libraryName), frameSort],
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
