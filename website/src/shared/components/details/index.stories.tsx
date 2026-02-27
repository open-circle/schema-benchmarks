import preview from "#storybook/preview";

const meta = preview.meta({
  title: "Components/Details",
  render: () => (
    <details>
      <summary>Hello World</summary>
      <p>This is a details element</p>
    </details>
  ),
});

export const Default = meta.story();
