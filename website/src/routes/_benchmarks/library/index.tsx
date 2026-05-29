import { useSuspenseQuery, useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { getPackageMetadata } from "#/routes/_benchmarks/-query";
import { getAllLibraries } from "#/routes/_benchmarks/library/-query";
import { generateMetadata } from "#/shared/data/meta";

export const Route = createFileRoute("/_benchmarks/library/")({
  loader: async ({ abortController, context: { queryClient } }) => {
    const libraries = await queryClient.ensureQueryData(getAllLibraries(abortController.signal));
    await Promise.all(
      libraries.map(({ packageName, version }) =>
        queryClient.ensureQueryData(
          getPackageMetadata(packageName, version, abortController.signal),
        ),
      ),
    );
  },
  head: () => {
    const { links, meta } = generateMetadata({
      title: "Libraries",
      description: "Libraries included in the benchmarks",
    });
    return { links, meta };
  },
  component: RouteComponent,
  staticData: { crumb: undefined },
});

function mostCommonVersion(libraries: Array<{ version: string }>) {
  const versionCounts: Record<string, number> = {};
  for (const { version } of libraries) {
    versionCounts[version] = (versionCounts[version] ?? 0) + 1;
  }
  return Object.entries(versionCounts).sort((a, b) => b[1] - a[1])[0]![0];
}

function RouteComponent() {
  const { data: libraries } = useSuspenseQuery(getAllLibraries());
  const librariesByPkg = useMemo(
    () => Object.groupBy(libraries, ({ packageName }) => packageName),
    [libraries],
  );
  const metadataByPkg = useSuspenseQueries({
    queries: Object.entries(librariesByPkg).map(([pkgName, libraries = []]) =>
      getPackageMetadata(pkgName, mostCommonVersion(libraries)),
    ),
    combine: (metadatas) => Object.fromEntries(metadatas.map(({ data }) => [data.name, data])),
  });
  return (
    <ul>
      {Object.entries(librariesByPkg).map(([pkgName, libraries]) => {
        const metadata = metadataByPkg[pkgName];
        if (!metadata) return null;
        return (
          <li key={pkgName}>
            <hgroup>
              <h5>
                <code>{metadata.name}</code>
              </h5>
              <DownloadCount libraryName={metadata.name} />
            </hgroup>
            <p>{metadata.description}</p>
            <h6>Benchmarks</h6>
            <ul>
              {libraries?.map(({ libraryName, version }) => (
                <li key={libraryName}>
                  <Link to="/library/$" params={{ _splat: libraryName }}>
                    <code>{libraryName}</code>
                  </Link>{" "}
                  (v{version})
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
