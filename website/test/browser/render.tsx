import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  type RegisteredRouter,
  RouterContextProvider,
  type RouterHistory,
} from "@tanstack/react-router";
import { type RenderOptions, render } from "vitest-browser-react";
import { makeQueryClient } from "@/data/query";
import { getRouter } from "@/router";

export interface RenderWithProviderOptions extends RenderOptions {
  queryClient?: QueryClient;
  history?: RouterHistory;
  router?: RegisteredRouter;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = makeQueryClient(),
    history = createMemoryHistory(),
    router = getRouter(history),
    wrapper: Wrapper,
    ...options
  }: RenderWithProviderOptions = {},
) {
  return {
    queryClient,
    ...render(ui, {
      ...options,
      wrapper({ children }) {
        return (
          <RouterContextProvider router={router}>
            <QueryClientProvider client={queryClient}>
              {Wrapper ? <Wrapper>{children}</Wrapper> : children}
            </QueryClientProvider>
          </RouterContextProvider>
        );
      },
    }),
  };
}
