import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { isResponseError } from "up-fetch";
import { CodeBlock } from "#/shared/components/code";
import { generateMetadata } from "#/shared/data/meta";
import { getHighlightedCode } from "#/shared/lib/highlight";
import { getRaw } from "./-query";

const knownLanguages = new Set(["ts", "tsx", "js", "jsx", "json"]);

function getLanguage(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension || !knownLanguages.has(extension)) return "text";
  return extension;
}

const libraryNameRegex = /^schemas\/libraries\/([^/]+)\//;

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
  // biome-ignore lint/style/noNonNullAssertion: this function is only called if the regex matches
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

export const Route = createFileRoute("/repo/raw/$")({
  component: RouteComponent,
  staticData: { crumb: undefined },
  async loader({
    context: { queryClient },
    params: { _splat: fileName },
    abortController,
  }) {
    if (!fileName) throw notFound();
    try {
      const code = await queryClient.ensureQueryData(
        getRaw({ fileName }, abortController.signal),
      );
      await queryClient.prefetchQuery(
        getHighlightedCode(
          { code, language: getLanguage(fileName) },
          abortController.signal,
        ),
      );
    } catch (e) {
      if (isResponseError(e) && e.status === 404) throw notFound();
      throw e;
    }
    const fileNamePart = fileName?.split("/").pop() ?? "Unknown";
    return {
      crumb: libraryNameRegex.test(fileName)
        ? getLibraryCrumbs(fileName)
        : [fileNamePart],
    };
  },
  head: ({ params: { _splat: fileName }, loaderData }) =>
    generateMetadata({
      title: loaderData?.crumb
        ? [...loaderData.crumb].reverse().join(" | ")
        : "Unknown",
      description: "View the raw contents of a file in the repository.",
      openGraph: {
        url: `/repo/raw/${fileName}`,
      },
    }),
});

function RouteComponent() {
  const { _splat: fileName = "" } = Route.useParams();
  const { data } = useSuspenseQuery(getRaw({ fileName }));
  return (
    <CodeBlock title={fileName} lineNumbers language={getLanguage(fileName)}>
      {data}
    </CodeBlock>
  );
}
