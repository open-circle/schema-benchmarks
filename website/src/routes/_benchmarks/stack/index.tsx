import { StackResult } from "@schema-benchmarks/bench";
import { collator } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import * as v from "valibot";

import { AnsiBlock } from "#/shared/components/code/ansi";
import { generateMetadata } from "#/shared/data/meta";
import { getHighlightedCode } from "#/shared/lib/highlight";
import { getHighlightedAnsi } from "#/shared/lib/highlight";
import { applySort, sortParams } from "#/shared/lib/sort";

import { useDownloadsByPkgName } from "../-hooks";
import { getPackageName } from "../-query";
import { StackResults } from "./-components/results";
import { highlightFrame, sortableKeys } from "./-constants";
import Content from "./-content.mdx";
import { getStackResults } from "./-query";

import styles from "./index.css?url";

const searchSchema = v.object({
  ...sortParams(v.optional(v.picklist(sortableKeys), "frame")),
});

const exampleStack = `ValiError: Invalid length: Expected >=1 but received 0
    at Module.parse (file:///node_modules/\u001b[4m.pnpm\u001b[24m/valibot@1.2.0_typescript@6.0.0-beta/node_modules/\u001b[4mvalibot\u001b[24m/dist/index.mjs:6748:28)
\x1b[7m    at Object.throw (file:///schemas/dist/benchmarks-D-_Y96Ph.js:93:6)\x1b[0m
    at \u001b[90mfile:///bench/\u001b[39msrc/scripts/stack/log.ts:24:28`;

export const Route = createFileRoute("/_benchmarks/stack/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  loader: async ({ context: { queryClient }, abortController }) => {
    const results = await queryClient.ensureQueryData(getStackResults(abortController.signal));
    await Promise.all([
      queryClient.prefetchQuery(
        getHighlightedAnsi({ input: exampleStack, lineNumbers: true }, abortController.signal),
      ),
      ...results.flatMap(({ output, snippet }) => [
        output &&
          queryClient.prefetchQuery(
            getHighlightedAnsi(
              { input: highlightFrame(output), lineNumbers: true },
              abortController.signal,
            ),
          ),
        queryClient.prefetchQuery(getHighlightedCode({ code: snippet }, abortController.signal)),
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
      <div>
        <Content />
        <AnsiBlock lineNumbers>{exampleStack}</AnsiBlock>
      </div>
      <StackResults results={sortedData} {...{ sortBy, sortDir }} />
    </>
  );
}
