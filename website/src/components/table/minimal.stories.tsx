import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
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
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
