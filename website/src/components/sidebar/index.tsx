import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { MdSymbol } from "../symbol";

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

export function TanstackSidebar() {
	return (
		<Sidebar>
			<nav>
				<ul className="subtitle2">
					<li>
						<Link to="/">
							<MdSymbol>home</MdSymbol>
							Home
						</Link>
					</li>
					<li>
						<Link to="/initialization">
							<MdSymbol>timer</MdSymbol>
							Initialization
						</Link>
					</li>
					<li>
						<Link to="/validation">
							<MdSymbol>check_circle</MdSymbol>
							Validation
						</Link>
					</li>
					<li>
						<Link to="/parsing">
							<MdSymbol>output_circle</MdSymbol>
							Parsing
						</Link>
					</li>
				</ul>
			</nav>
		</Sidebar>
	);
}
