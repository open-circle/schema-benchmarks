import { shortNumFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllWeeklyDownloads, getPackageName, getPkgUrl } from "#src/routes/_benchmarks/-query";
import { useNpmSite } from "#src/shared/components/prefs/context";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import { trackedLinkProps } from "#src/shared/lib/analytics";
import type { PrefetchContext } from "#src/shared/lib/fetch";

export function DownloadCount({
  libraryName,
  useLink = true,
}: {
  libraryName: string;
  useLink?: boolean;
}) {
  const El = useLink ? "a" : "span";
  const { npmSite } = useNpmSite();
  const packageName = getPackageName(libraryName);
  const { data } = useSuspenseQuery(getAllWeeklyDownloads(packageName));
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const packageUrl = getPkgUrl(packageName, npmSite);
  if (data === "n/a") {
    return (
      <El
        {...(useLink && trackedLinkProps(packageUrl))}
        aria-label={`Download count for ${libraryName}: not available`}
      >
        n/a
      </El>
    );
  }
  return (
    <El
      {...(useLink && trackedLinkProps(packageUrl))}
      aria-label={`Download count for ${libraryName}: ${shortNumFormatter.format(data)}`}
    >
      {formatNumber(data)}
    </El>
  );
}

DownloadCount.prefetch = (libraryName: string, { queryClient, signal }: PrefetchContext) =>
  queryClient.query({
    ...getAllWeeklyDownloads(getPackageName(libraryName), signal),
    staleTime: "static",
  });
