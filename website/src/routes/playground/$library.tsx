import type { BenchmarksConfig } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { getOrInsertComputed } from "@schema-benchmarks/utils";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { use, useMemo } from "react";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { MdSymbol } from "@/components/symbol";
import {
  PlaygroundStore,
  PlaygroundStoreProvider,
} from "@/features/playground/store";
import { useExternalStore } from "@/hooks/store";

export const Route = createFileRoute("/playground/$library")({
  head: () => ({
    meta: [
      {
        title: "Playground - Schema Benchmarks",
      },
    ],
  }),
  loader({ params: { library } }) {
    if (!libraries[`./${library}/benchmarks.ts`]) throw notFound();
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
  const store = useMemo(() => new PlaygroundStore(config), [config]);
  const running = useExternalStore(store, (state) => state.running);
  return (
    <PlaygroundStoreProvider playgroundStore={store}>
      <Button
        onClick={() => store.run().then(() => console.log(store.state))}
        loading={running}
        disabled={running}
      >
        Run
      </Button>
      <p className="typo-caption">
        While running, your browser may be unresponsive.
      </p>
    </PlaygroundStoreProvider>
  );
}
