import type { Decorator, Preview } from '@storybook/react-vite'
import '../src/styles.css';

const dirDecorator: Decorator<{ dir?: "ltr" | "rtl" }> = (Story, { args }) => {
  document.dir = args.dir ?? "ltr";
  return <Story />;
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
  decorators: [dirDecorator],
};

document.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
});

export default preview;