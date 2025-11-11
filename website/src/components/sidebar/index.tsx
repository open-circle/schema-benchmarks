import { Link, type LinkOptions, linkOptions } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { MdSymbol } from "../symbol";

const sidebarLinks = [
	{ ...linkOptions({ to: "/" }), name: "Home", icon: "home" },
	{
		...linkOptions({ to: "/initialization" }),
		name: "Initialization",
		icon: "timer",
	},
	{
		...linkOptions({ to: "/validation" }),
		name: "Validation",
		icon: "check_circle",
	},
	{
		...linkOptions({ to: "/parsing" }),
		name: "Parsing",
		icon: "output_circle",
	},
] satisfies Array<LinkOptions & { name: string; icon: string }>;

export function Sidebar({ children }: { children?: ReactNode }) {
	return (
		<aside className="sidebar">
			<div className="logo sidebar__logo">
				<img src="/logo.svg" alt="Logo" />
				<h2 className="subtitle1">Schema Benchmarks</h2>
			</div>
			{children}
		</aside>
	);
}

Sidebar.links = sidebarLinks;

export function TanstackSidebar() {
	return (
		<Sidebar>
			<nav>
				<ul className="subtitle2">
					{sidebarLinks.map(({ name, icon, ...link }) => (
						<li key={link.to}>
							<Link {...link} activeOptions={{ includeSearch: false }}>
								<MdSymbol>{icon}</MdSymbol>
								{name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</Sidebar>
	);
}
