import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import bem from "react-bem-helper";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { getPackageMetadata, getRepoLink } from "#/routes/_benchmarks/-query";
import { getReplacementUrl } from "#/routes/_benchmarks/libraries/-query";
import { ButtonGroup } from "#/shared/components/button";
import { ExternalLinkToggleButton } from "#/shared/components/button/toggle";
import GithubIcon from "#/shared/components/header/github.svg?react";
import { MdSymbol } from "#/shared/components/symbol";
import { trackedLinkProps } from "#/shared/lib/analytics";

export interface PackageCardProps {
  pkgName: string;
  versions: Array<string>;
}

const cls = bem("package-card");

export function PackageCard({ pkgName, versions }: PackageCardProps) {
  const mostCommonVersion = useMemo(() => {
    const versionCounts = new Map<string, number>();
    for (const version of versions)
      versionCounts.set(version, (versionCounts.get(version) ?? 0) + 1);

    // we can mutate this array, we've only just made it
    // oxlint-disable-next-line unicorn/no-array-sort
    return Array.from(versionCounts).sort((a, b) => b[1] - a[1])[0]![0];
  }, [versions]);
  const { data: metadata } = useSuspenseQuery(getPackageMetadata(pkgName, mostCommonVersion));
  const { data: replacementUrl } = useSuspenseQuery(getReplacementUrl(pkgName));
  const heading = (
    <h4>
      <code>{metadata.name}</code>
    </h4>
  );
  return (
    <li {...cls()}>
      <div {...cls("heading")}>
        <hgroup>
          <p {...cls({ element: "versions", extra: "typo-overline" })}>{versions.join(", ")}</p>
          {metadata.homepage ? (
            <a href={metadata.homepage} target="_blank" rel="noopener noreferrer">
              {heading}
            </a>
          ) : (
            heading
          )}
        </hgroup>
        <div {...cls({ element: "downloads", extra: "typo-caption" })}>
          <MdSymbol size={18}>download</MdSymbol>
          <span>
            <DownloadCount libraryName={pkgName} />
            /wk
          </span>
        </div>
      </div>
      <p {...cls({ element: "description", extra: "typo-body2" })}>{metadata.description}</p>
      <ButtonGroup {...cls({ element: "actions" })} ariaLabel="Package actions">
        {replacementUrl && (
          <ExternalLinkToggleButton
            tooltip={{
              subhead: "e18e",
              supporting: (
                <>
                  This library has been marked as having a preferred replacement by the{" "}
                  <a
                    {...trackedLinkProps("https://github.com/e18e")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    e18e
                  </a>{" "}
                  community effort.
                  <br />
                  <br />
                  This could be for a few reasons:
                  <ul>
                    <li>It is no longer maintained</li>
                    <li>It has more performant or modern alternatives</li>
                    <li>It has known security vulnerabilities</li>
                    <li>
                      It lacks support for more modern JavaScript features (e.g. ES Modules,
                      TypeScript)
                    </li>
                  </ul>
                  <br />
                  For specific guidance, open the link.
                </>
              ),
            }}
            {...trackedLinkProps(replacementUrl)}
            target="_blank"
            rel="noopener noreferrer"
            {...cls({ element: "replacement-link" })}
          >
            <MdSymbol>warning</MdSymbol>
          </ExternalLinkToggleButton>
        )}
        {metadata.repository && (
          <ExternalLinkToggleButton
            tooltip="Repository"
            {...trackedLinkProps(getRepoLink(metadata.repository))}
            target="_blank"
            rel="noopener noreferrer"
            {...cls({ element: "repo-link" })}
          >
            {metadata.repository.type === "git" &&
            metadata.repository.url.includes("github.com") ? (
              <GithubIcon />
            ) : (
              <MdSymbol>code</MdSymbol>
            )}
          </ExternalLinkToggleButton>
        )}
      </ButtonGroup>
    </li>
  );
}
