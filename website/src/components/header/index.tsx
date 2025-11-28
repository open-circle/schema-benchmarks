import { bem } from "@schema-benchmarks/utils";
import { ClientOnly, Link, useMatches } from "@tanstack/react-router";
import { Fragment, type ReactNode, useContext } from "react";
import { ToggleButton } from "../button/toggle";
import { SidebarOpenContext } from "../sidebar/context";
import { MdSymbol } from "../symbol";

const cls = bem("page-header");

export function Header() {
  const { open, setOpen } = useContext(SidebarOpenContext);
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
          search: match.search,
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
    <header className={cls()}>
      <ClientOnly
        fallback={
          <ToggleButton
            className={cls({
              element: "toggle",
            })}
            tooltip="Expand sidebar"
          >
            <MdSymbol>menu</MdSymbol>
          </ToggleButton>
        }
      >
        <ToggleButton
          className={cls({
            element: "toggle",
            modifiers: { open },
          })}
          onClick={() => setOpen(true)}
          tooltip="Expand sidebar"
          tabIndex={open ? -1 : 0}
        >
          <MdSymbol>menu</MdSymbol>
        </ToggleButton>
      </ClientOnly>
      <nav className="breadcrumbs">
        {crumbs.map((crumb) => (
          <Fragment key={crumb.to}>
            <Link
              to={crumb.to}
              params={crumb.params}
              search={crumb.search}
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
      {actions && <div className={cls("actions")}>{actions}</div>}
    </header>
  );
}
