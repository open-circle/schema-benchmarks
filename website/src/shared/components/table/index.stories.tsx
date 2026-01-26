import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Radio } from "../radio";
import { MdSymbol } from "../symbol";

const meta = {
  title: "Components/Table",
  render({ inCard }) {
    const baseTable = (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th className="numeric">Age</th>
            <th className="action">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fit-content action">
              <Radio name="group" value="John Doe" defaultChecked />
            </td>
            <td>John Doe</td>
            <td className="numeric">30</td>
            <td className="action">
              <Button icon={<MdSymbol>edit</MdSymbol>}>Edit</Button>
            </td>
          </tr>
          <tr>
            <td className="fit-content action">
              <Radio name="group" value="Jane Doe" />
            </td>
            <td>Jane Doe</td>
            <td className="numeric">25</td>
            <td className="action">
              <Button icon={<MdSymbol>edit</MdSymbol>}>Edit</Button>
            </td>
          </tr>
        </tbody>
      </table>
    );
    return inCard ? <div className="card">{baseTable}</div> : baseTable;
  },
  args: {
    inCard: false,
  },
} satisfies Meta<{ inCard: boolean }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
