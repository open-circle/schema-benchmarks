import { QueryClient } from "@tanstack/react-query";

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60, // 1 hour
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => query.queryKey[0] !== "mdx",
      },
    },
  });
