import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  type RegisteredRouter,
  RouterContextProvider,
  type RouterHistory,
} from "@tanstack/react-router";
import { Fragment } from "react";
import { type RenderOptions, render } from "vitest-browser-react";
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

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = makeQueryClient(),
    historyOpts,
    history = createMemoryHistory(historyOpts),
    router = getRouter(history),
    wrapper: Wrapper = Fragment,
    ...options
  }: RenderWithProviderOptions = {},
) {
  return {
    queryClient,
    history,
    router,
    ...render(ui, {
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
    }),
  };
}
