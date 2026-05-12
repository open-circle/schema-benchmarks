import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { getAllLibraries } from "#/routes/_benchmarks/library/-query";
import { generateMetadata } from "#/shared/data/meta";

export const Route = createFileRoute("/_benchmarks/library/")({
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
  const { data: libraries } = useSuspenseQuery(getAllLibraries());
  return (
    <ul>
      {libraries.map((library) => (
        <li key={library}>
          <Link to="/library/$" params={{ _splat: library }}>
            {library} (<DownloadCount libraryName={library} /> weekly downloads)
          </Link>
        </li>
      ))}
    </ul>
  );
}
