import type { Decorator } from "@storybook/react-vite";
import { definePreview } from "@storybook/react-vite";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  type RegisteredRouter,
  RouterContextProvider,
  type RouterHistory,
} from "@tanstack/react-router";
import { http, HttpResponse } from "msw";
import { initialize, type MswParameters, mswLoader } from "msw-storybook-addon";
import { fromJSON, toCrossJSONAsync } from "seroval";
import * as v from "valibot";

import { StyleContext, ThemeContext } from "#/shared/components/prefs/context";
import { getHighlightedAnsiFn, getHighlightedCodeFn } from "#/shared/lib/highlight";
import { highlightAnsi, highlightCode } from "#/shared/lib/highlight.server";

import "../src/shared/styles/index.css";
import { styleLabels, styleSchema, themeLabels, themeSchema } from "#/shared/lib/prefs/constants";

import { getRouter } from "../src/router";
import { makeQueryClient } from "../src/shared/data/query";

const serverFnInput = v.object({
  data: v.any(),
});

// probably very fragile, but TSS doesn't have anything like this yet
export function mockServerFn<Input, Output>(
  serverFn: {
    (input: { data: Input }): Promise<Output>;
    url: string;
  },
  handler: (input: NoInfer<Input>) => NoInfer<Output> | Promise<NoInfer<Output>>,
) {
  return http.all(new URL(serverFn.url, window.location.href).href, async ({ request }) => {
    if (request.method !== "POST" && request.method !== "GET") {
      return HttpResponse.json(
        { error: "Method not allowed" },
        { status: 405, headers: { Allow: "POST, GET" } },
      );
    }
    try {
      const payload =
        request.method === "POST"
          ? await request.json()
          : JSON.parse(new URL(request.url).searchParams.get("payload") ?? "{}");
      const { data } = v.parse(serverFnInput, fromJSON(payload));
      const result = await handler(data);
      return HttpResponse.json(
        await Promise.resolve(
          toCrossJSONAsync({ result, error: undefined, context: {} }, { refs: new Map() }),
        ),
        {
          headers: {
            "X-TSS-Serialized": "true",
          },
        },
      );
    } catch (error) {
      return HttpResponse.json(
        await Promise.resolve(
          toCrossJSONAsync({ result: undefined, error, context: {} }, { refs: new Map() }),
        ),
        {
          headers: {
            "X-TSS-Serialized": "true",
          },
        },
      );
    }
  });
}

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

declare module "@storybook/react-vite" {
  export interface Parameters extends MswParameters {
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

initialize({ onUnhandledRequest: "bypass" }, [
  mockServerFn(getHighlightedCodeFn, highlightCode),
  mockServerFn(getHighlightedAnsiFn, highlightAnsi),
]);

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

  decorators: [dirDecorator, themeDecorator, styleDecorator, queryClientDecorator, routerDecorator],
  addons: [],
  loaders: [mswLoader],
});
