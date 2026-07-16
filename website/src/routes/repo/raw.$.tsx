import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, stripSearchParams } from "@tanstack/react-router";
import { isResponseError } from "up-fetch";
import * as v from "valibot";

import { InternalLinkToggleButton } from "#/shared/components/button/toggle";
import { CodeBlock } from "#/shared/components/code";
import { MdSymbol } from "#/shared/components/symbol";
import { generateMetadata } from "#/shared/data/meta";
import { getHighlightedCode, getFormattedCode } from "#/shared/lib/highlight";

import { getRaw } from "./-query";

const knownLanguages = new Set(["ts", "tsx", "js", "jsx", "json"]);

function getLanguage(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension || !knownLanguages.has(extension)) return "text";
  return extension;
}

const libraryNameRegex = /^schemas\/libraries\/(.*)\/(download|benchmarks)/;

const fileNameMap: Record<string, string> = {
  "benchmarks.ts": "Benchmarks",
  "download.ts": "Source",
  "minified.js": "Compiled (minified)",
  "unminified.js": "Compiled (unminified)",
};
// schemas/libraries/<libraryName>/download.ts -> <libraryName> / Source
// schemas/libraries/<libraryName>/download/[<note>].ts -> <libraryName> (<note>) / Source
// schemas/libraries/<libraryName>/download_compiled/[<note>/]<minify>.js -> <libraryName> / Compiled ([minify])
const noteRegex = /download\/([^/]+).ts|download_compiled\/([^/]+)\//;
function getLibraryCrumbs(fileName: string) {
  const libraryName = fileName.match(libraryNameRegex)![1];
  const fileNamePart = fileName?.split("/").pop() ?? "Unknown";
  const noteMatch = fileName.match(noteRegex);
  const note = noteMatch?.[1] ?? noteMatch?.[2];
  const fileNameMapped =
    fileNamePart === `${note}.ts`
      ? fileNameMap["download.ts"]
      : (fileNameMap[fileNamePart] ?? fileNamePart);
  return [`${libraryName}${note ? ` (${note})` : ""}`, fileNameMapped];
}

const searchSchema = v.object({
  formatted: v.optional(
    v.union([
      v.boolean(),
      v.pipe(
        v.picklist(["true", "false"]),
        v.transform((b) => b === "true"),
      ),
    ]),
    false,
  ),
});

export const Route = createFileRoute("/repo/raw/$")({
  component: RouteComponent,
  validateSearch: searchSchema,
  search: {
    middlewares: [
      stripSearchParams({
        ...v.getFallbacks(searchSchema),
        ...v.getDefaults(searchSchema),
      }),
    ],
  },
  staticData: { crumb: undefined },
  loaderDeps: ({ search: { formatted } }) => ({ formatted }),
  async loader({
    context: { queryClient },
    params: { _splat: fileName },
    deps: { formatted },
    abortController,
  }) {
    if (!fileName) throw notFound();
    const isCompiled = fileName.includes("_compiled");
    try {
      const raw = await queryClient.ensureQueryData(getRaw({ fileName }, abortController.signal));
      let formattedCode: string | undefined;
      if (formatted && isCompiled) {
        formattedCode = await queryClient.ensureQueryData(
          getFormattedCode({ fileName, sourceText: raw }, abortController.signal),
        );
      }
      await queryClient.prefetchQuery(
        getHighlightedCode(
          { code: formattedCode ?? raw, language: getLanguage(fileName) },
          abortController.signal,
        ),
      );
    } catch (e) {
      if (isResponseError(e) && e.status === 404) throw notFound();
      throw e;
    }
    const fileNamePart = fileName?.split("/").pop() ?? "Unknown";
    return {
      crumb: libraryNameRegex.test(fileName) ? getLibraryCrumbs(fileName) : [fileNamePart],
    };
  },
  head: ({ params: { _splat: fileName }, loaderData }) =>
    generateMetadata({
      title: loaderData?.crumb ? loaderData.crumb.toReversed().join(" | ") : "Unknown",
      description: "View the raw contents of a file in the repository.",
      openGraph: {
        url: `/repo/raw/${fileName}`,
      },
    }),
});

function RouteComponent() {
  const { _splat: fileName = "" } = Route.useParams();
  const { formatted } = Route.useSearch();
  const { data } = useSuspenseQuery(getRaw({ fileName }));
  const isCompiled = fileName.includes("_compiled");
  const { data: formattedData } = useQuery({
    ...getFormattedCode({ fileName, sourceText: data }),
    enabled: formatted && isCompiled,
  });
  return (
    <CodeBlock
      title={fileName}
      lineNumbers
      language={getLanguage(fileName)}
      showCopy
      actions={
        isCompiled && (
          <InternalLinkToggleButton
            to="/repo/raw/$"
            params={{ _splat: fileName }}
            search={({ formatted }) => ({ formatted: !formatted })}
            tooltip={formatted ? "View Raw" : "View Formatted"}
          >
            <MdSymbol>{formatted ? "code_off" : "code"}</MdSymbol>
          </InternalLinkToggleButton>
        )
      }
    >
      {formatted ? (formattedData ?? data) : data}
    </CodeBlock>
  );
}
