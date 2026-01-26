import type { QueryClient } from "@tanstack/react-query";
import { createRouter, Link, type RouterHistory } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Button } from "@/components/button";
import { Spinner } from "@/components/spinner";
import { MdSymbol } from "@/components/symbol";
import { EmptyState } from "./components/empty-state";
import { makeQueryClient } from "./data/query";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = ({
  history,
  queryClient = makeQueryClient(),
}: {
  history?: RouterHistory;
  queryClient?: QueryClient;
} = {}) => {
  const router = createRouter({
    routeTree,
    history,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPreload: "intent",
    context: { queryClient },
    defaultViewTransition: true,
    defaultPendingComponent: () => <Spinner size={64} />,
    defaultErrorComponent: ({ error, reset }) => (
      <EmptyState
        icon={<MdSymbol>error</MdSymbol>}
        title="Error"
        subtitle={error.message || "An error occurred."}
      >
        <Button onClick={reset}>Retry</Button>
      </EmptyState>
    ),
    defaultNotFoundComponent: () => (
      <EmptyState
        icon={<MdSymbol>warning</MdSymbol>}
        title="Not found"
        subtitle={
          <>
            Try heading back to the <Link to="/">home page</Link>.
          </>
        }
      />
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};
