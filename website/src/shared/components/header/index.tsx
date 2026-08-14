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

import { ExternalLinkToggleButton, ToggleButton } from "#src/shared/components/button/toggle";
import { ConsoleWriter } from "#src/shared/components/consolewriter";
import { SidebarOpenContext } from "#src/shared/components/sidebar/context";
import { MdSymbol } from "#src/shared/components/symbol";
import { trackedLinkProps } from "#src/shared/lib/analytics";

import DiscordIcon from "./discord.svg?react";
import GithubIcon from "./github.svg?react";

const cls = bem("page-header");

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    crumb: MaybeArray<CrumbItem> | undefined;
  }
}

const crumbItemSchema = v.union([
  v.string(),
  v.object({
    label: v.string(),
    interactive: v.boolean(),
  }),
]);
type CrumbItem = v.InferInput<typeof crumbItemSchema>;

const crumbSchema = v.object({
  crumb: v.union([crumbItemSchema, v.array(crumbItemSchema)]),
});

export function Header({ prefsOpen, onPrefs }: { prefsOpen: boolean; onPrefs: () => void }) {
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
        {crumbs.map((crumb) => {
          const { label, interactive } =
            typeof crumb.name === "string" ? { label: crumb.name, interactive: true } : crumb.name;
          return (
            <Fragment key={crumb.to + label}>
              {interactive ? (
                <Link
                  to={crumb.to}
                  params={crumb.params}
                  search={crumb.search}
                  className="typo-headline6"
                >
                  {label}
                </Link>
              ) : (
                <span className="typo-headline6">{label}</span>
              )}
              <span>/</span>
            </Fragment>
          );
        })}
        {currentCrumbs.map((crumb, index) => {
          const { label } = typeof crumb.name === "string" ? { label: crumb.name } : crumb.name;
          return (
            <Fragment key={`${index}:${label}`}>
              <span className="typo-headline6">
                {index === currentCrumbs.length - 1 ? (
                  <ConsoleWriter>{label}</ConsoleWriter>
                ) : (
                  label
                )}
              </span>
              {index !== currentCrumbs.length - 1 && <span>/</span>}
            </Fragment>
          );
        })}
      </nav>
      <div {...cls("actions")}>
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
        <ToggleButton tooltip="Preferences" onClick={onPrefs}>
          <MdSymbol fill={prefsOpen}>settings</MdSymbol>
        </ToggleButton>
      </div>
    </header>
  );
}
