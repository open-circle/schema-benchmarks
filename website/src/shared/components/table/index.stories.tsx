import { Button } from "#src/shared/components/button";
import { Radio } from "#src/shared/components/radio";
import { MdSymbol } from "#src/shared/components/symbol";
import preview from "#storybook/preview";

const meta = preview.meta({
  title: "Components/Table",
  render: () => (
    <table>
      <thead>
        <tr>
          {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label */}
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
  ),
});

export const Default = meta.story();
