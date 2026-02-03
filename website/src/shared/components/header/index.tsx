import { ClientOnly, Link, useMatches } from "@tanstack/react-router";
import { Fragment, useContext } from "react";
import bem from "react-bem-helper";
import { ToggleButton } from "../button/toggle";
import { SidebarOpenContext } from "../sidebar/context";
import { MdSymbol } from "../symbol";

const cls = bem("page-header");

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    crumb: string | undefined;
  }
}

const hasCrumb = (data: unknown): data is { crumb: string } =>
  typeof data === "object" &&
  data !== null &&
  "crumb" in data &&
  typeof data.crumb === "string";

export function Header() {
  const { open, setOpen } = useContext(SidebarOpenContext);
  const [crumbs, currentCrumb] = useMatches({
    select: (matches) => {
      const allCrumbs = matches
        .filter(
          (
            match,
          ): match is typeof match &
            (
              | { staticData: { crumb: string } }
              | { loaderData: { crumb: string } }
            ) => hasCrumb(match.loaderData) || hasCrumb(match.staticData),
        )
        .map((match) => ({
          to: match.pathname,
          params: match.params,
          search: match.search,
          name: hasCrumb(match.loaderData)
            ? match.loaderData.crumb
            : match.staticData.crumb,
        }));
      const currentCrumb = allCrumbs.pop();
      return [allCrumbs, currentCrumb] as const;
    },
  });
  return (
    <header {...cls()}>
      <ToggleButton
        {...cls({
          element: "toggle",
          modifiers: { open },
        })}
        onClick={() => setOpen(true)}
        tooltip="Expand sidebar"
        tabIndex={open ? -1 : 0}
      >
        <MdSymbol>menu</MdSymbol>
      </ToggleButton>
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
            <span>/</span>
          </Fragment>
        ))}
        {currentCrumb && (
          <span className="typo-headline6">{currentCrumb.name}</span>
        )}
      </nav>
    </header>
  );
}
