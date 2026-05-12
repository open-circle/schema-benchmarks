import { createFileRoute, notFound } from "@tanstack/react-router";

import { generateMetadata } from "#/shared/data/meta";

export const Route = createFileRoute("/_benchmarks/library/$/")({
  loader: async ({ params: { _splat: libraryName } }) => {
    if (!libraryName) throw notFound();
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
