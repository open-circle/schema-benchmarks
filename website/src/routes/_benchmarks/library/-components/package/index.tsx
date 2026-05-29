import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import bem from "react-bem-helper";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { getPackageMetadata } from "#/routes/_benchmarks/-query";
import { MdSymbol } from "#/shared/components/symbol";

export interface PackageCardProps {
  pkgName: string;
  libraries: Array<{ libraryName: string; version: string }>;
}

const cls = bem("package-card");

export function PackageCard({ pkgName, libraries }: PackageCardProps) {
  const version = useMemo(() => {
    const versionCounts: Record<string, number> = {};
    for (const { version } of libraries) {
      versionCounts[version] = (versionCounts[version] ?? 0) + 1;
    }
    return Object.entries(versionCounts).sort((a, b) => b[1] - a[1])[0]![0];
  }, [libraries]);
  const { data: metadata } = useSuspenseQuery(getPackageMetadata(pkgName, version));
  const heading = (
    <h4>
      <code>{metadata.name}</code>
    </h4>
  );
  return (
    <li {...cls()}>
      <div {...cls("heading")}>
        {metadata.homepage ? (
          <a href={metadata.homepage} target="_blank" rel="noopener noreferrer">
            {heading}
          </a>
        ) : (
          heading
        )}
        <div {...cls({ element: "downloads", extra: "typo-caption" })}>
          <MdSymbol size={18}>download</MdSymbol>
          <span>
            <DownloadCount libraryName={pkgName} />
            /wk
          </span>
        </div>
      </div>
      <p {...cls({ element: "description", extra: "typo-body2" })}>{metadata.description}</p>
      <h5>Benchmarks</h5>
      <ul {...cls("libraries")}>
        {libraries.map(({ libraryName, version }) => (
          <li key={libraryName} {...cls("library")}>
            <Link to="/library/$" params={{ _splat: libraryName }}>
              <code>{libraryName}</code>
            </Link>{" "}
            (v{version})
          </li>
        ))}
      </ul>
    </li>
  );
}
