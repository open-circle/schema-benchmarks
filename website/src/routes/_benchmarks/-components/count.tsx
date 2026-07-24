import { shortNumFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  getAllWeeklyDownloads,
  getPackageName,
  isJsrPackage,
} from "#src/routes/_benchmarks/-query";
import { useNpmSite } from "#src/shared/components/prefs/context";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import { trackedLinkProps } from "#src/shared/lib/analytics";
import type { PrefetchContext } from "#src/shared/lib/fetch";

export function DownloadCount({ libraryName }: { libraryName: string }) {
  const { npmSite } = useNpmSite();
  const packageName = getPackageName(libraryName);
  const { data } = useSuspenseQuery(getAllWeeklyDownloads(packageName));
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const packageUrl = isJsrPackage(packageName)
    ? `https://jsr.io/${packageName}`
    : `https://www.${npmSite}/package/${packageName}`;
  if (data === "n/a") {
    return (
      <a
        {...trackedLinkProps(packageUrl)}
        aria-label={`Download count for ${libraryName}: not available`}
      >
        n/a
      </a>
    );
  }
  return (
    <a
      {...trackedLinkProps(packageUrl)}
      aria-label={`Download count for ${libraryName}: ${shortNumFormatter.format(data)}`}
    >
      {formatNumber(data)}
    </a>
  );
}

DownloadCount.prefetch = (libraryName: string, { queryClient, signal }: PrefetchContext) =>
  queryClient.ensureQueryData(getAllWeeklyDownloads(getPackageName(libraryName), signal));
