import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  type RegisteredRouter,
  RouterContextProvider,
  type RouterHistory,
} from "@tanstack/react-router";
import { Fragment } from "react";
import {
  type RenderOptions,
  type RenderResult,
  render,
} from "vitest-browser-react";
import { makeQueryClient } from "@/data/query";
import { getRouter } from "@/router";

export interface RenderWithProviderOptions extends RenderOptions {
  queryClient?: QueryClient;
  historyOpts?: {
    initialEntries: Array<string>;
    initialIndex?: number;
  };
  history?: RouterHistory;
  router?: RegisteredRouter;
}

interface RenderWithProvidersResult extends RenderResult {
  queryClient: QueryClient;
  history: RouterHistory;
  router: RegisteredRouter;
}

export async function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = makeQueryClient(),
    historyOpts,
    history = createMemoryHistory(historyOpts),
    router = getRouter({ history, queryClient }),
    wrapper: Wrapper = Fragment,
    ...options
  }: RenderWithProviderOptions = {},
): Promise<RenderWithProvidersResult> {
  return {
    queryClient,
    history,
    router,
    ...(await render(ui, {
      ...options,
      wrapper({ children }) {
        return (
          <RouterContextProvider router={router}>
            <QueryClientProvider client={queryClient}>
              <Wrapper>{children}</Wrapper>
            </QueryClientProvider>
          </RouterContextProvider>
        );
      },
    })),
  };
}
