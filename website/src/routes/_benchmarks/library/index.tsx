import { collator } from "@schema-benchmarks/utils";
import { useSuspenseQuery, useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import * as v from "valibot";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { useDownloadsByPkgName } from "#/routes/_benchmarks/-hooks";
import { getPackageMetadata, getPackageName } from "#/routes/_benchmarks/-query";
import { getAllLibraries } from "#/routes/_benchmarks/library/-query";
import { SortableHeaderLink } from "#/shared/components/table/sort";
import { generateMetadata } from "#/shared/data/meta";
import { applySort, sortParams } from "#/shared/lib/sort";

const searchSchema = v.object({
  ...sortParams(v.optional(v.picklist(["libraryName", "downloads"]), "libraryName")),
});

export const Route = createFileRoute("/_benchmarks/library/")({
  validateSearch: searchSchema,
  loader: async ({ abortController, context: { queryClient } }) => {
    const libraries = await queryClient.ensureQueryData(getAllLibraries(abortController.signal));
    await Promise.all(
      libraries.map(({ libraryName, version }) =>
        queryClient.ensureQueryData(
          getPackageMetadata(getPackageName(libraryName), version, abortController.signal),
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

function RouteComponent() {
  const { sortBy, sortDir } = Route.useSearch();
  const { data: libraries } = useSuspenseQuery(getAllLibraries());
  const downloadsByPkg = useDownloadsByPkgName(libraries);
  const sortedLibraries = useMemo(
    () =>
      libraries.toSorted(
        applySort(
          (a, b) => {
            switch (sortBy) {
              case "downloads":
                return (
                  (downloadsByPkg?.[getPackageName(a.libraryName)] ?? 0) -
                  (downloadsByPkg?.[getPackageName(b.libraryName)] ?? 0)
                );
              default:
                return collator.compare(a.libraryName, b.libraryName);
            }
          },
          { sortDir },
        ),
      ),
    [libraries, sortBy, downloadsByPkg, sortDir],
  );
  const libraryMetadata = useSuspenseQueries({
    queries: sortedLibraries.map(({ libraryName, version }) =>
      getPackageMetadata(getPackageName(libraryName), version),
    ),
  });
  return (
    <table>
      <thead>
        <tr>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("libraryName", { sortBy, sortDir }, { to: "/library" })}
          >
            Library
          </SortableHeaderLink>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps(
              "downloads",
              { sortBy, sortDir },
              { to: "/library" },
              "descending",
            )}
            className="numeric"
          >
            Downloads (/wk)
          </SortableHeaderLink>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {sortedLibraries.map(({ libraryName }, idx) => (
          <tr key={libraryName}>
            <td>
              <Link to="/library/$" params={{ _splat: libraryName }}>
                {libraryName}
              </Link>
            </td>
            <td className="numeric">
              <DownloadCount libraryName={libraryName} />
            </td>
            <td>{libraryMetadata[idx]!.data.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
