import type { Decorator } from "@storybook/tanstack-react";
import { definePreview } from "@storybook/tanstack-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { parseAnsiSequences } from "ansi-sequence-parser";
import { initialize, type MswParameters, mswLoader } from "msw-storybook-addon";
import Prism from "prismjs";
import { mocked } from "storybook/test";

import "../src/shared/styles/index.css";
import { RouterContext } from "#/routes/__root";
import { StyleContext, ThemeContext } from "#/shared/components/prefs/context";
import { getHighlightedAnsiFn, getHighlightedCodeFn } from "#/shared/lib/highlight";
import { highlightAnsi, highlightCode } from "#/shared/lib/highlight.shared";
import { styleLabels, styleSchema, themeLabels, themeSchema } from "#/shared/lib/prefs/constants";

import { makeQueryClient } from "../src/shared/data/query";

const dirDecorator: Decorator = (Story, { globals: { dir = "ltr" } }) => {
  document.dir = dir;
  return <Story />;
};

const themeDecorator: Decorator = (Story, { globals: { theme = themeSchema.fallback } }) => {
  document.documentElement.dataset.theme = theme;
  return (
    <ThemeContext value={{ theme, setTheme: () => {} }}>
      <Story />
    </ThemeContext>
  );
};

const styleDecorator: Decorator = (Story, { globals: { style = styleSchema.fallback } }) => {
  document.documentElement.dataset.style = style;
  return (
    <StyleContext value={{ style, setStyle: () => {} }}>
      <Story />
    </StyleContext>
  );
};

declare module "@storybook/tanstack-react" {
  export interface Parameters extends MswParameters {}
}

const queryClient = makeQueryClient();

const queryClientDecorator: Decorator = (Story) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

document.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
});

initialize({ onUnhandledRequest: "bypass" });

export default definePreview({
  beforeEach: () => {
    queryClient.clear();
    mocked(getHighlightedCodeFn).mockImplementation(async ({ data }) => highlightCode(Prism, data));
    mocked(getHighlightedAnsiFn).mockImplementation(async ({ data }) =>
      highlightAnsi(parseAnsiSequences, data),
    );
  },
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: ["Theme", "Components", "Features"],
        method: "alphabetical",
      },
    },
    tanstack: {
      router: {
        context: { queryClient } satisfies RouterContext,
      },
    },
  },

  globalTypes: {
    dir: {
      description: "The text direction of the page",
      defaultValue: "ltr",
      toolbar: {
        icon: "paragraph",
        items: [
          { value: "ltr", title: "LTR" },
          { value: "rtl", title: "RTL" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "The theme of the page",
      defaultValue: themeSchema.fallback,
      toolbar: {
        icon: "circlehollow",
        items: themeSchema.options.map((option) => ({
          value: option,
          title: themeLabels[option].label,
        })),
        dynamicTitle: true,
      },
    },
    style: {
      description: "The style of the page",
      defaultValue: styleSchema.fallback,
      toolbar: {
        icon: "paintbrush",
        items: styleSchema.options.map((option) => ({
          value: option,
          title: styleLabels[option].label,
        })),
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    dir: "ltr",
    theme: themeSchema.fallback,
    style: styleSchema.fallback,
  },

  decorators: [dirDecorator, themeDecorator, styleDecorator, queryClientDecorator],
  addons: [],
  loaders: [mswLoader],
});
