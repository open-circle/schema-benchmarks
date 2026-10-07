import type { Decorator } from "@storybook/tanstack-react";
import { definePreview } from "@storybook/tanstack-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { parseAnsiSequences } from "ansi-sequence-parser";
import addonMsw from "msw-storybook-addon";
import Prism from "prismjs";
import { radEventListeners } from "rad-event-listeners";
import { mocked } from "storybook/test";
import { network } from "virtual:msw";

import type { RouterContext } from "#src/routes/__root";
import { getReplacementUrlFn } from "#src/routes/libraries/-query";
import { StyleContext, ThemeContext } from "#src/shared/components/prefs/context";
import { makeQueryClient } from "#src/shared/data/query";
import { preloadImage } from "#src/shared/lib/fetch.ts";
import { getHighlightedAnsiFn, getHighlightedCodeFn } from "#src/shared/lib/highlight";
import { highlightAnsi, highlightCode } from "#src/shared/lib/highlight";
import {
  styleLabels,
  styleSchema,
  themeLabels,
  themeSchema,
} from "#src/shared/lib/prefs/constants";

import "#src/shared/styles/index.css";

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

const queryClient = makeQueryClient();

const queryClientDecorator: Decorator = (Story) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

document.addEventListener("click", (event) => {
  if (
    event.target instanceof HTMLAnchorElement &&
    event.target.href.startsWith("http") &&
    !event.target.href.includes("localhost")
  ) {
    event.preventDefault();
    console.log(`Prevented navigation to ${event.target.href} in Storybook`);
  }
});

export default definePreview({
  addons: [
    addonMsw(async () => {
      await network.enable();
      return network;
    }),
  ],
  beforeEach: () => {
    queryClient.clear();
    mocked(getHighlightedCodeFn).mockImplementation(async ({ data }) => highlightCode(Prism, data));
    mocked(getHighlightedAnsiFn).mockImplementation(async ({ data }) =>
      highlightAnsi(parseAnsiSequences, data),
    );
    mocked(getReplacementUrlFn).mockImplementation(async () => null);
    mocked(preloadImage).mockImplementation(async (src) => {
      // same as client impl - storybook automocks all server fns and isomorphic fns
      const { promise, resolve, reject } = Promise.withResolvers<void>();
      const image = new Image();
      const unsub = radEventListeners(
        image,
        {
          load: () => resolve(),
          error: (event) => reject((event as ErrorEvent).error),
        },
        { once: true },
      );
      image.src = src;
      return promise.finally(unsub);
    });
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
});
