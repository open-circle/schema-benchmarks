import { noop } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getPackageMetadata } from "#src/routes/_benchmarks/-query";
import { getMostCommonVersion } from "#src/routes/libraries/-query";
import { generateMetadata } from "#src/shared/data/meta";

import { PackageCard } from "./-components/package";
import { getAllPackages, getReplacementUrl } from "./-query";
import Content from "./content.mdx";

import libraryCss from "./index.css?url";

export const Route = createFileRoute("/libraries/")({
  loader: async ({ abortController, context: { queryClient } }) => {
    const libraries = await queryClient.query({
      ...getAllPackages(abortController.signal),
      staleTime: "static",
    });
    await Promise.all(
      Object.entries(libraries).flatMap(([packageName, versions]) => [
        queryClient.query(
          getPackageMetadata(packageName, getMostCommonVersion(versions), abortController.signal),
        ),
        queryClient.query(getReplacementUrl(packageName, abortController.signal)).catch(noop),
      ]),
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
  const { data: libraries } = useSuspenseQuery(getAllPackages());
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <ul className="library-list">
        {Object.entries(libraries).map(([pkgName, versions]) => {
          if (!libraries) return null;
          return <PackageCard key={pkgName} {...{ pkgName, versions }} />;
        })}
      </ul>
    </>
  );
}
