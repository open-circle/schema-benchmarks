import { createRouter, Link, type RouterHistory } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Button } from "@/components/button";
import { EmptyState } from "./components/empty-state";
import { makeQueryClient } from "./data/query";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = (history?: RouterHistory) => {
  const queryClient = makeQueryClient();
  const router = createRouter({
    routeTree,
    history,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { queryClient },
    defaultViewTransition: true,
    defaultErrorComponent: ({ error, reset }) => (
      <EmptyState
        icon="error"
        title="Error"
        subtitle={error.message || "An error occurred."}
      >
        <Button onClick={reset}>Retry</Button>
      </EmptyState>
    ),
    defaultNotFoundComponent: () => (
      <EmptyState
        icon="warning"
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
