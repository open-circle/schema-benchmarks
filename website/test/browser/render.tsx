import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "vitest-browser-react";
import { makeQueryClient } from "@/data/query";

export interface RenderWithProviderOptions extends RenderOptions {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = makeQueryClient(),
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
          <QueryClientProvider client={queryClient}>
            {Wrapper ? <Wrapper>{children}</Wrapper> : children}
          </QueryClientProvider>
        );
      },
    }),
  };
}
