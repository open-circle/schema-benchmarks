import type { Decorator, Preview } from "@storybook/react-vite";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  type RegisteredRouter,
  RouterContextProvider,
  type RouterHistory,
} from "@tanstack/react-router";
import { getRouter } from "../src/router";
import { makeQueryClient } from "../src/shared/data/query";
import "../src/shared/styles/index.css";

const dirDecorator: Decorator<{ dir?: "ltr" | "rtl" }> = (Story, { args }) => {
  document.dir = args.dir ?? "ltr";
  return <Story />;
};

declare module "@storybook/react-vite" {
  export interface Parameters {
    historyOpts?: {
      initialEntries: Array<string>;
      initialIndex?: number;
    };
    history?: RouterHistory;
    router?: RegisteredRouter;
    queryClient?: QueryClient;
  }
}

const routerDecorator: Decorator = (Story, { parameters }) => {
  parameters.history ??= createMemoryHistory(parameters.historyOpts);
  parameters.router ??= getRouter(parameters);
  return (
    <RouterContextProvider router={parameters.router}>
      <Story />
    </RouterContextProvider>
  );
};

const queryClientDecorator: Decorator = (Story, { parameters }) => {
  parameters.queryClient ??= makeQueryClient();
  return (
    <QueryClientProvider client={parameters.queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: ["Theme", "Components"],
        method: "alphabetical",
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  argTypes: {
    dir: {
      control: {
        type: "inline-radio",
      },
      options: ["ltr", "rtl"],
    },
  },
  args: {
    dir: "ltr",
  },
  decorators: [dirDecorator, queryClientDecorator, routerDecorator],
};

document.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
});

export default preview;
