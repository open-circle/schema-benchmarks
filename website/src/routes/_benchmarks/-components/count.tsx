import { shortNumFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useNumberFormatter } from "#/shared/hooks/format/use-number-formatter";
import type { PrefetchContext } from "#/shared/lib/fetch";

import { getAllWeeklyDownloads } from "../-query";

function getPackageName(libraryName: string) {
  if (libraryName.includes("/") && !libraryName.startsWith("@")) {
    return libraryName.split("/")[0] ?? libraryName;
  }
  return libraryName;
}

export function DownloadCount({ libraryName }: { libraryName: string }) {
  const packageName = getPackageName(libraryName);
  const { data } = useSuspenseQuery(getAllWeeklyDownloads(packageName));
  const formatNumber = useNumberFormatter(shortNumFormatter);
  return (
    <a
      href={`https://www.npmjs.com/package/${packageName}`}
      aria-label={`Download count for ${packageName}: ${shortNumFormatter.format(data)}`}
    >
      {formatNumber(data)}
    </a>
  );
}

DownloadCount.prefetch = (libraryName: string, { queryClient, signal }: PrefetchContext) =>
  queryClient.prefetchQuery(getAllWeeklyDownloads(getPackageName(libraryName), signal));
