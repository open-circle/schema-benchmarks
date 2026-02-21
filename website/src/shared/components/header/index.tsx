import {
  type AtLeastOneKey,
  type MaybeArray,
  nonNullish,
  partition,
} from "@schema-benchmarks/utils";
import { Link, useMatches } from "@tanstack/react-router";
import { Fragment, useContext } from "react";
import bem from "react-bem-helper";
import * as v from "valibot";

import { trackedLinkProps } from "#/shared/lib/analytics";
import { styleLabels, styleSchema, themeLabels, themeSchema } from "#/shared/lib/prefs/constants";

import { ButtonGroup } from "../button";
import { ExternalLinkToggleButton, ToggleButton } from "../button/toggle";
import { ConsoleWriter } from "../consolewriter";
import { useStyle, useTheme } from "../prefs/context";
import { SidebarOpenContext } from "../sidebar/context";
import { MdSymbol } from "../symbol";
import DiscordIcon from "./discord.svg?react";
import GithubIcon from "./github.svg?react";

const cls = bem("page-header");

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    crumb: MaybeArray<string> | undefined;
  }
}

const crumbSchema = v.object({
  crumb: v.union([v.string(), v.array(v.string())]),
});

export function Header() {
  const { open, setOpen } = useContext(SidebarOpenContext);
  const [crumbs, currentCrumbs] = useMatches({
    select: (matches) => {
      const allCrumbs = matches
        .filter(
          (
            match,
          ): match is typeof match &
            AtLeastOneKey<
              Partial<Record<"loaderData" | "staticData", v.InferInput<typeof crumbSchema>>>
            > => v.is(crumbSchema, match.loaderData) || v.is(crumbSchema, match.staticData),
        )
        .flatMap((match) =>
          [match.staticData.crumb, match.loaderData?.crumb]
            .filter(nonNullish)
            .flat()
            .map((crumb) => ({
              to: match.pathname,
              params: match.params,
              search: match.search,
              name: crumb,
            })),
        );
      const currentPathname = allCrumbs.at(-1)?.to;
      return partition(allCrumbs, (crumb) => crumb.to !== currentPathname);
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
          <Fragment key={crumb.to + crumb.name}>
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
        {currentCrumbs.map((crumb, index) => (
          <Fragment key={crumb.to + crumb.name}>
            <span className="typo-headline6">
              {index === currentCrumbs.length - 1 ? (
                <ConsoleWriter>{crumb.name}</ConsoleWriter>
              ) : (
                crumb.name
              )}
            </span>
            {index !== currentCrumbs.length - 1 && <span>/</span>}
          </Fragment>
        ))}
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
        <ExternalLinkToggleButton
          {...trackedLinkProps("https://github.com/open-circle/schema-benchmarks")}
          target="_blank"
          rel="noreferrer noopener"
          tooltip="GitHub"
        >
          <GithubIcon />
        </ExternalLinkToggleButton>
        <ExternalLinkToggleButton
          {...trackedLinkProps("https://discord.gg/tkMjQACf2P")}
          target="_blank"
          rel="noreferrer noopener"
          tooltip="Discord"
        >
          <DiscordIcon height={24} width={24} style={{ padding: 2 }} />
        </ExternalLinkToggleButton>
      </div>
    </header>
  );
}
