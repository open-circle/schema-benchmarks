import type { BenchmarksConfig } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { getOrInsertComputed } from "@schema-benchmarks/utils";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { use } from "react";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { MdSymbol } from "@/components/symbol";
import { getBenchResults } from "@/features/benchmark/query";
import {
  PlaygroundStore,
  PlaygroundStoreProvider,
} from "@/features/playground/store";
import { PlaygroundTable } from "@/features/playground/table";
import { useExternalStore } from "@/hooks/store";
import { useDisposable } from "@/hooks/use-disposable";
import { getHighlightedCode } from "@/lib/highlight";

export const Route = createFileRoute("/playground/$library")({
  head: () => ({
    meta: [
      {
        title: "Playground - Schema Benchmarks",
      },
    ],
  }),
  async loader({
    params: { library },
    context: { queryClient },
    abortController,
  }) {
    if (!libraries[`./${library}/benchmarks.ts`]) throw notFound();
    const benchResults = await queryClient.ensureQueryData(getBenchResults());
    for (const { snippet, libraryName } of [
      ...Object.values(benchResults.initialization),
      ...Object.values(benchResults.validation).flatMap((results) =>
        Object.values(results),
      ),
      ...Object.values(benchResults.parsing).flatMap((results) =>
        Object.values(results),
      ),
    ]) {
      if (libraryName !== library) continue;
      queryClient.prefetchQuery(
        getHighlightedCode({ code: snippet }, abortController.signal),
      );
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <EmptyState
      icon={<MdSymbol>deployed_code_alert</MdSymbol>}
      title="Invalid library"
      subtitle="Select a valid library above"
    />
  ),
});

const cache = new WeakMap<
  () => Promise<BenchmarksConfig<unknown>>,
  Promise<BenchmarksConfig<unknown>>
>();
function getConfig(library: string) {
  return getOrInsertComputed(
    cache,
    // biome-ignore lint/style/noNonNullAssertion: we check for it in the loader
    libraries[`./${library}/benchmarks.ts`]!,
    (fn) => fn(),
  );
}

function RouteComponent() {
  const { library } = Route.useParams();
  const config = use(getConfig(library));
  const store = useDisposable(() => new PlaygroundStore(config), [config]);
  const running = useExternalStore(store, (state) => state.running);
  return (
    <PlaygroundStoreProvider playgroundStore={store}>
      <Button onClick={() => store.run()} loading={running}>
        Run
      </Button>
      <PlaygroundTable />
    </PlaygroundStoreProvider>
  );
}
