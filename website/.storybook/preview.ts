import type { Preview } from '@storybook/react-vite'
import '../src/styles.css';

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
};

document.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
});

export default preview;