import type { Decorator, Preview } from '@storybook/react-vite'
import { RegisteredRouter, RouterContextProvider } from "@tanstack/react-router";
import { getRouter } from "../src/router";
import '../src/styles.css';

const dirDecorator: Decorator<{ dir?: "ltr" | "rtl" }> = (Story, { args }) => {
  document.dir = args.dir ?? "ltr";
  return <Story />;
};

declare module "@storybook/react-vite" {
  export interface Parameters {
    router?: RegisteredRouter;
  }
}

const routerDecorator: Decorator = (Story, { parameters }) => {
  const router = parameters.router ??= getRouter();
  return <RouterContextProvider router={router}><Story /></RouterContextProvider>;
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
  decorators: [dirDecorator, routerDecorator],
};

document.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
});

export default preview;