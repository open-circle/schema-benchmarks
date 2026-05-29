import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { getPackageMetadata } from "#/routes/_benchmarks/-query";
import { PackageCard } from "#/routes/_benchmarks/library/-components/package";
import { getAllLibraries } from "#/routes/_benchmarks/library/-query";
import { generateMetadata } from "#/shared/data/meta";

import Content from "./content.mdx";

import libraryCss from "./index.css?url";

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
    return { links: [...links, { rel: "stylesheet", href: libraryCss }], meta };
  },
  component: RouteComponent,
  staticData: { crumb: undefined },
});

function RouteComponent() {
  const { data: libraries } = useSuspenseQuery(getAllLibraries());
  const librariesByPkg = useMemo(
    () => Object.groupBy(libraries, ({ packageName }) => packageName),
    [libraries],
  );
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <ul className="library-list">
        {Object.entries(librariesByPkg).map(([pkgName, libraries]) => {
          if (!libraries) return null;
          return <PackageCard key={pkgName} {...{ pkgName, libraries }} />;
        })}
      </ul>
    </>
  );
}
