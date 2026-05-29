import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { getPackageMetadata } from "#/routes/_benchmarks/-query";

export interface PackageCardProps {
  pkgName: string;
  libraries: Array<{ libraryName: string; version: string }>;
}

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
    <h5>
      <code>{metadata.name}</code>
    </h5>
  );
  return (
    <li>
      <hgroup>
        {metadata.homepage ? (
          <a href={metadata.homepage} target="_blank" rel="noopener noreferrer">
            {heading}
          </a>
        ) : (
          heading
        )}
        <DownloadCount libraryName={pkgName} />
        <p>{metadata.description}</p>
      </hgroup>
      <ul>
        {libraries.map(({ libraryName, version }) => (
          <li key={libraryName}>
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
