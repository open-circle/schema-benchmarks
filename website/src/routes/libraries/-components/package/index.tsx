import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import bem from "react-bem-helper";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { getPackageMetadata, getRepoLink } from "#src/routes/_benchmarks/-query";
import { getMostCommonVersion } from "#src/routes/libraries/-query";
import { getReplacementUrl } from "#src/routes/libraries/-query";
import { ButtonGroup } from "#src/shared/components/button";
import { ExternalLinkToggleButton } from "#src/shared/components/button/toggle";
import GithubIcon from "#src/shared/components/header/github.svg?react";
import { MdSymbol } from "#src/shared/components/symbol";
import { trackedLinkProps } from "#src/shared/lib/analytics";

export interface PackageCardProps {
  pkgName: string;
  versions: Array<string>;
}

const cls = bem("package-card");

export function PackageCard({ pkgName, versions }: PackageCardProps) {
  const mostCommonVersion = useMemo(() => getMostCommonVersion(versions), [versions]);
  const { data: metadata } = useSuspenseQuery(getPackageMetadata(pkgName, mostCommonVersion));
  const repositoryUrl = useMemo(() => {
    if (!metadata.repository) return null;
    return getRepoLink(metadata.repository);
  }, [metadata.repository]);
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
        {repositoryUrl && (
          <ExternalLinkToggleButton
            tooltip="Repository"
            {...trackedLinkProps(repositoryUrl)}
            target="_blank"
            rel="noopener noreferrer"
            {...cls({ element: "repo-link" })}
          >
            {metadata.repository?.type === "git" &&
            new URL(repositoryUrl).hostname === "github.com" ? (
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
