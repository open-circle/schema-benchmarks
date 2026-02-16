import type { Decorator } from "@storybook/react-vite";
import { definePreview } from "@storybook/react-vite";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  type RegisteredRouter,
  RouterContextProvider,
  type RouterHistory,
} from "@tanstack/react-router";
import { useArgs } from "storybook/preview-api";

import { StyleContext, ThemeContext } from "#/shared/components/prefs/context";
import { type Style, styleSchema, type Theme, themeSchema } from "#/shared/lib/prefs/constants";

import { getRouter } from "../src/router";
import { makeQueryClient } from "../src/shared/data/query";

import "../src/shared/styles/index.css";

const dirDecorator: Decorator<{ dir?: "ltr" | "rtl" }> = (Story, { args }) => {
  document.dir = args.dir ?? "ltr";
  return <Story />;
};

const themeDecorator: Decorator<{ theme?: Theme }> = (Story) => {
  const [{ theme = "system" }, setArgs] = useArgs<{
    theme?: Theme;
  }>();
  document.documentElement.dataset.theme = theme;
  return (
    <ThemeContext value={{ theme, setTheme: (newTheme) => setArgs({ theme: newTheme }) }}>
      <Story />
    </ThemeContext>
  );
};

const styleDecorator: Decorator<{ pageStyle?: Style }> = (Story) => {
  const [{ pageStyle = "code" }, setArgs] = useArgs<{
    pageStyle?: Style;
  }>();
  document.documentElement.dataset.style = pageStyle;
  return (
    <StyleContext
      value={{
        style: pageStyle,
        setStyle: (newStyle) => setArgs({ pageStyle: newStyle }),
      }}
    >
      <Story />
    </StyleContext>
  );
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

document.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
});

export default definePreview({
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: ["Theme", "Components", "Features"],
        method: "alphabetical",
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
    theme: {
      control: {
        type: "inline-radio",
      },
      options: themeSchema.options,
    },
    pageStyle: {
      control: {
        type: "inline-radio",
      },
      options: styleSchema.options,
    },
  },

  args: {
    dir: "ltr",
    theme: "system",
    pageStyle: "code",
  },

  decorators: [dirDecorator, themeDecorator, styleDecorator, queryClientDecorator, routerDecorator],
  addons: [],
});
