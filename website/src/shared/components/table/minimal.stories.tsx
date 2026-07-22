import preview from "#storybook/preview";

const meta = preview.meta({
  title: "Components/Table/Minimal",
  render: () => (
    <dl className="minimal">
      <div>
        <dt>Name</dt>
        <dd>John Doe</dd>
      </div>
      <div>
        <dt>Age</dt>
        <dd>30</dd>
      </div>
      <div>
        <dt>City</dt>
        <dd>New York</dd>
      </div>
    </dl>
  ),
});

export const Default = meta.story();
