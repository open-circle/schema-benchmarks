import { createFileRoute, notFound } from "@tanstack/react-router";

import { getLibraryResults, type getLibraryResultsFn } from "#/routes/_benchmarks/library/$/-query";
import { generateMetadata } from "#/shared/data/meta";

function areResultsEmpty(results: Awaited<ReturnType<typeof getLibraryResultsFn>>) {
  return (
    Math.max(
      results.bench.initialization.length,
      ...Object.values(results.bench.validation).map((arr) => arr.length),
      ...Object.values(results.bench.parsing).map((arr) => arr.length),
      ...Object.values(results.bench.standard).map((arr) => arr.length),
      ...Object.values(results.bench.string).flatMap((obj) =>
        Object.values(obj).map((arr) => arr.length),
      ),
      results.bench.codec.length,
      ...Object.values(results.download).map((arr) => arr.length),
      results.stack.length,
    ) === 0
  );
}

export const Route = createFileRoute("/_benchmarks/library/$/")({
  loader: async ({
    params: { _splat: libraryName },
    context: { queryClient },
    abortController,
  }) => {
    if (!libraryName) throw notFound();
    const libResults = await queryClient.ensureQueryData(
      getLibraryResults(libraryName, abortController.signal),
    );
    if (areResultsEmpty(libResults)) throw notFound();
    return { crumb: libraryName };
  },
  head: ({ params: { _splat: libraryName } }) => {
    const { links, meta } = generateMetadata({
      title: libraryName,
      description: `Benchmarks for ${libraryName}`,
    });
    return { links, meta };
  },
  component: RouteComponent,
  staticData: { crumb: undefined },
});

function RouteComponent() {
  return <div>Hello "/_benchmarks/library/$libraryName/"!</div>;
}
