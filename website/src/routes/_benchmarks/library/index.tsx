import { collator } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import * as v from "valibot";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { useDownloadsByPkgName } from "#/routes/_benchmarks/-hooks";
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
    await queryClient.ensureQueryData(getAllLibraries(abortController.signal));
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
                return (downloadsByPkg?.[a] ?? 0) - (downloadsByPkg?.[b] ?? 0);
              default:
                return collator.compare(a, b);
            }
          },
          { sortDir },
        ),
      ),
    [libraries, sortBy, downloadsByPkg, sortDir],
  );
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
        </tr>
      </thead>
      <tbody>
        {sortedLibraries.map((library) => (
          <tr key={library}>
            <td>
              <Link to="/library/$" params={{ _splat: library }}>
                {library}
              </Link>
            </td>
            <td className="numeric">
              <DownloadCount libraryName={library} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
