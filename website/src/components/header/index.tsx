import { Link, useMatches } from "@tanstack/react-router";
import clsx from "clsx";
import { Fragment, type ReactNode, useContext } from "react";
import { SidebarExpandedContext } from "../sidebar/context";
import { MdSymbol } from "../symbol";

export function Header({ children }: { children: ReactNode }) {
  const { expanded, setExpanded } = useContext(SidebarExpandedContext);
  return (
    <header className="page-header">
      <button
        type="button"
        className={clsx("button button--toggle page-header__toggle", {
          "page-header__toggle--expanded": expanded,
        })}
        onClick={() => setExpanded(true)}
        aria-label="Expand sidebar"
      >
        <MdSymbol>menu</MdSymbol>
      </button>
      {children}
    </header>
  );
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
  const actions = useMatches({
    select: (matches) =>
      matches.findLast(
        (
          match,
        ): match is typeof match & { loaderData: { actions: ReactNode } } =>
          !!(match.loaderData as { actions?: ReactNode })?.actions,
      )?.loaderData.actions,
  });
  const crumbs = allCrumbs.slice(0, -1);
  const currentCrumb = allCrumbs.at(-1);
  return (
    <Header>
      <nav className="breadcrumbs">
        {crumbs.map((crumb) => (
          <Fragment key={crumb.to}>
            <Link
              to={crumb.to}
              params={crumb.params}
              className="typo-headline6"
            >
              {crumb.name}
            </Link>
            <MdSymbol>chevron_right</MdSymbol>
          </Fragment>
        ))}
        {currentCrumb && (
          <span className="typo-headline6">{currentCrumb.name}</span>
        )}
      </nav>
      {actions && <div className="page-header__actions">{actions}</div>}
    </Header>
  );
}
