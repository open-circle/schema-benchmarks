import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import bem from "react-bem-helper";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { getPackageMetadata, getRepoLink } from "#/routes/_benchmarks/-query";
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
      {metadata.repository && (
        <ExternalLinkToggleButton
          tooltip="Repository"
          {...trackedLinkProps(getRepoLink(metadata.repository))}
          target="_blank"
          rel="noopener noreferrer"
          {...cls({ element: "repo-link" })}
        >
          {metadata.repository.type === "git" && metadata.repository.url.includes("github.com") ? (
            <GithubIcon />
          ) : (
            <MdSymbol>code</MdSymbol>
          )}
        </ExternalLinkToggleButton>
      )}
    </li>
  );
}
