import { promiseAllKeyed } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPackageMetadata, getPackageName } from "#/routes/_benchmarks/-query";
import { getLibraryResults, type getLibraryResultsFn } from "#/routes/_benchmarks/library/$/-query";
import { generateMetadata } from "#/shared/data/meta";

import { RepoLink } from "../../-components/repo";

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
    // every library should have at least one initialization result, so we can get the version from there
    const version = libResults.bench.initialization[0]?.version;
    if (!version) throw notFound();
    await promiseAllKeyed({
      metadata: queryClient.ensureQueryData(
        getPackageMetadata(getPackageName(libraryName), version, abortController.signal),
      ),
    });
    return { crumb: libraryName, version };
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
  const { _splat: libraryName } = Route.useParams();
  const { version } = Route.useLoaderData();
  const { data: metadata } = useSuspenseQuery(
    getPackageMetadata(getPackageName(libraryName!), version),
  );
  return (
    <>
      <RepoLink libraryName={libraryName!} version={version} />
      <p>{metadata.description}</p>
    </>
  );
}
