import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import bem from "react-bem-helper";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { getPackageMetadata } from "#/routes/_benchmarks/-query";
import { MdSymbol } from "#/shared/components/symbol";

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
    </li>
  );
}
