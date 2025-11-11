import type { Meta, StoryObj } from "@storybook/react-vite";
import { MdSymbol } from "../symbol";
import { Sidebar } from ".";

const meta = {
	title: "Components/Sidebar",
	component: Sidebar,
	parameters: {
		layout: "fullscreen",
	},
	render: () => (
		<div className="sidebar-container">
			<Sidebar>
				<nav>
					<ul className="subtitle2">
						<li>
							<a href="/" className="active">
								<MdSymbol>home</MdSymbol>
								Home
							</a>
						</li>
						<li>
							<a href="/initialization">
								<MdSymbol>timer</MdSymbol>
								Initialization
							</a>
						</li>
					</ul>
				</nav>
			</Sidebar>
		</div>
	),
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
