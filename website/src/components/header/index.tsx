import { Link, useMatches } from "@tanstack/react-router";
import { Fragment, type ReactNode } from "react";
import { MdSymbol } from "../symbol";

export function Header({ children }: { children: ReactNode }) {
  return <header className="page-header">{children}</header>;
}

export function TanstackHeader() {
  const allCrumbs = useMatches({
    select: (matches) =>
      matches
        .filter(
          (match): match is typeof match & { loaderData: { crumb: string } } =>
            !!match.loaderData?.crumb,
        )
        .map((match) => ({
          to: match.pathname,
          params: match.params,
          name: match.loaderData.crumb,
        })),
  });
  const crumbs = allCrumbs.slice(0, -1);
  const currentCrumb = allCrumbs.at(-1);
  return (
    <Header>
      <nav className="breadcrumbs">
        {crumbs.map((crumb) => (
          <Fragment key={crumb.to}>
            <Link to={crumb.to} params={crumb.params} className="headline6">
              {crumb.name}
            </Link>
            <MdSymbol>chevron_right</MdSymbol>
          </Fragment>
        ))}
        {currentCrumb && <span className="headline6">{currentCrumb.name}</span>}
      </nav>
    </Header>
  );
}
