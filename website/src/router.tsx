import { createRouter, Link, type RouterHistory } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
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
    defaultNotFoundComponent: () => (
      <EmptyState
        icon="warning_amber"
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
