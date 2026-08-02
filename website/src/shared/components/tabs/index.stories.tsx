import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import preview from "#storybook/preview";

import type { TabVariant } from ".";
import { Tabs, Tab, TabPanel, useTabs, TabPanels } from ".";

import "./index.css";

interface StoryArgs {
  orientation: "horizontal" | "vertical";
  variant?: TabVariant;
}

function DemoTabs({ orientation, variant }: StoryArgs) {
  const { getTabProps, getPanelProps, panelsRef } = useTabs(["home", "user", "settings"], "home");
  return (
    <>
      <Tabs {...{ orientation, variant }} ariaLabel="Demo Tabs">
        <Tab {...getTabProps("home")}>
          <MdSymbol>home</MdSymbol>
          Home
        </Tab>
        <Tab {...getTabProps("user")}>
          <MdSymbol>person</MdSymbol>
          User
        </Tab>
        <Tab {...getTabProps("settings")}>
          <MdSymbol>settings</MdSymbol>
          Settings
        </Tab>
      </Tabs>
      <TabPanels
        ref={panelsRef}
        {...{ orientation }}
        containerProps={{
          style: { minHeight: "200px" },
        }}
      >
        <TabPanel {...getPanelProps("home")}>
          <table>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row 1, Cell 1</td>
                <td>Row 1, Cell 2</td>
              </tr>
              <tr>
                <td>Row 2, Cell 1</td>
                <td>Row 2, Cell 2</td>
              </tr>
            </tbody>
          </table>
        </TabPanel>
        <TabPanel {...getPanelProps("user")}>User content</TabPanel>
        <TabPanel {...getPanelProps("settings")}>Settings content</TabPanel>
      </TabPanels>
    </>
  );
}

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: "Components/Tabs",
  render: (args) => <DemoTabs {...args} />,
  args: {
    orientation: "horizontal",
    variant: "fullwidth",
  },
  argTypes: {
    orientation: {
      control: {
        type: "inline-radio",
      },
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: {
        type: "inline-radio",
      },
      options: ["fullwidth", "responsive"],
    },
  },
  parameters: {
    layout: "fullscreen",
  },
});

export default meta;

export const Default = meta.story();
