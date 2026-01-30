import preview from "#storybook/preview";

const meta = preview.meta({
  title: "Components/Table/Minimal",
  render: () => (
    <table className="minimal">
      <tr>
        <th>Name</th>
        <td>John Doe</td>
      </tr>
      <tr>
        <th>Age</th>
        <td>30</td>
      </tr>
      <tr>
        <th>City</th>
        <td>New York</td>
      </tr>
    </table>
  ),
});

export const Default = meta.story();
