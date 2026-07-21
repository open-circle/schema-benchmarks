import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getPackageMetadata } from "#/routes/_benchmarks/-query";
import { generateMetadata } from "#/shared/data/meta";

import { PackageCard } from "./-components/package";
import { getAllPackages, getReplacementUrl } from "./-query";
import Content from "./content.mdx";

import libraryCss from "./index.css?url";

export const Route = createFileRoute("/_benchmarks/libraries/")({
  loader: async ({ abortController, context: { queryClient } }) => {
    const libraries = await queryClient.ensureQueryData(getAllPackages(abortController.signal));
    await Promise.all(
      Object.entries(libraries).flatMap(([packageName, versions]) =>
        versions.flatMap((version) => [
          queryClient.ensureQueryData(
            getPackageMetadata(packageName, version, abortController.signal),
          ),
          queryClient.prefetchQuery(getReplacementUrl(packageName, abortController.signal)),
        ]),
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
