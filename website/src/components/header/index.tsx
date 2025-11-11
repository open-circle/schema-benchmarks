import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCrumbs } from "@/hooks/use-crumbs";
import { MdSymbol } from "../symbol";

export function Header({ children }: { children: ReactNode }) {
	return <header className="page-header">{children}</header>;
}

export function TanstackHeader() {
	const allCrumbs = useCrumbs();
	const crumbs = allCrumbs.slice(0, -1);
	const currentCrumb = allCrumbs.at(-1);
	return (
		<Header>
			<nav className="breadcrumbs">
				{crumbs.map((crumb) => (
					<>
						<Link
							key={crumb.to}
							to={crumb.to}
							params={crumb.params}
							className="headline6"
						>
							{crumb.name}
						</Link>
						<MdSymbol>chevron_right</MdSymbol>
					</>
				))}
				{currentCrumb && <span className="headline6">{currentCrumb.name}</span>}
			</nav>
		</Header>
	);
}
