import { Link, useMatches } from "@tanstack/react-router";
import { Fragment, useContext } from "react";
import bem from "react-bem-helper";
import {
  styleLabels,
  styleSchema,
  themeLabels,
  themeSchema,
} from "#/shared/lib/prefs/constants";
import { ButtonGroup } from "../button";
import { ToggleButton } from "../button/toggle";
import { useStyle, useTheme } from "../prefs/context";
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
  const { theme, setTheme } = useTheme();
  const { style, setStyle } = useStyle();
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
      <div {...cls("actions")}>
        <ButtonGroup ariaLabel="Style" className="pref-switcher">
          {styleSchema.options.map((option) => (
            <ToggleButton
              key={option}
              active={style === option}
              onClick={() => setStyle(option)}
              tooltip={styleLabels[option].label}
            >
              <MdSymbol>{styleLabels[option].icon}</MdSymbol>
            </ToggleButton>
          ))}
        </ButtonGroup>
        <ButtonGroup ariaLabel="Theme" className="pref-switcher">
          {themeSchema.options.map((option) => (
            <ToggleButton
              key={option}
              active={theme === option}
              onClick={() => setTheme(option)}
              tooltip={themeLabels[option].label}
            >
              <MdSymbol>{themeLabels[option].icon}</MdSymbol>
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
    </header>
  );
}
