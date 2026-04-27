import { shortNumFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useNpmSite } from "#/shared/components/prefs/context";
import { useNumberFormatter } from "#/shared/hooks/format/use-number-formatter";
import { trackedLinkProps } from "#/shared/lib/analytics";
import type { PrefetchContext } from "#/shared/lib/fetch";

import { getAllWeeklyDownloads, getPackageName } from "../-query";

export function DownloadCount({ libraryName }: { libraryName: string }) {
  const { npmSite } = useNpmSite();
  const packageName = getPackageName(libraryName);
  const { data } = useSuspenseQuery(getAllWeeklyDownloads(packageName));
  const formatNumber = useNumberFormatter(shortNumFormatter);
  return (
    <a
      {...trackedLinkProps(`https://www.${npmSite}/package/${packageName}`)}
      aria-label={`Download count for ${libraryName}: ${shortNumFormatter.format(data)}`}
    >
      {formatNumber(data)}
    </a>
  );
}

DownloadCount.prefetch = (libraryName: string, { queryClient, signal }: PrefetchContext) =>
  queryClient.ensureQueryData(getAllWeeklyDownloads(getPackageName(libraryName), signal));
