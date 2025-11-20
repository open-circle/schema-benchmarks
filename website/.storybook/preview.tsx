import type { Decorator, Preview } from '@storybook/react-vite'
import { type RegisteredRouter, type RouterHistory, createMemoryHistory, RouterContextProvider } from "@tanstack/react-router";
import { getRouter } from "../src/router";
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '../src/data/query';
import '../src/styles.css';

const dirDecorator: Decorator<{ dir?: "ltr" | "rtl" }> = (Story, { args }) => {
  document.dir = args.dir ?? "ltr";
  return <Story />;
};

declare module "@storybook/react-vite" {
  export interface Parameters {
    history?: RouterHistory;
    router?: RegisteredRouter;
    queryClient?: QueryClient;
  }
}

const routerDecorator: Decorator = (Story, { parameters }) => {
  const history = parameters.history ??= createMemoryHistory();
  const router = parameters.router ??= getRouter(history);
  return <RouterContextProvider router={router}><Story /></RouterContextProvider>;
};

const queryClientDecorator: Decorator = (Story, { parameters }) => {
  const queryClient = parameters.queryClient ??= makeQueryClient();
  return <QueryClientProvider client={queryClient}><Story /></QueryClientProvider>;
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
  decorators: [dirDecorator, routerDecorator, queryClientDecorator],
};

document.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
});

export default preview;