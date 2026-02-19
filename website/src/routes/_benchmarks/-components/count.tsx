import { shortNumFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useNumberFormatter } from "#/shared/hooks/format/use-number-formatter";
import type { PrefetchContext } from "#/shared/lib/fetch";

import { formatLibraryName } from "../-lib";
import { getAllWeeklyDownloads, getPackageName } from "../-query";

export function DownloadCount({ libraryName }: { libraryName: string }) {
  const packageName = getPackageName(libraryName);
  const { data } = useSuspenseQuery(getAllWeeklyDownloads(packageName));
  const formatNumber = useNumberFormatter(shortNumFormatter);
  return (
    <a
      href={`https://www.npmjs.com/package/${packageName}`}
      aria-label={`Download count for ${formatLibraryName(libraryName)}: ${shortNumFormatter.format(data)}`}
    >
      {formatNumber(data)}
    </a>
  );
}

DownloadCount.prefetch = (libraryName: string, { queryClient, signal }: PrefetchContext) =>
  queryClient.prefetchQuery(getAllWeeklyDownloads(getPackageName(libraryName), signal));
