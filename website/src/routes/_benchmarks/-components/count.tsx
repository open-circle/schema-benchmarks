import { shortNumFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNumberFormatter } from "#/shared/hooks/format/use-number-formatter";
import { getAllWeeklyDownloads } from "../-query";

export function DownloadCount({ libraryName }: { libraryName: string }) {
  const { data } = useSuspenseQuery(getAllWeeklyDownloads(libraryName));
  const formatNumber = useNumberFormatter(shortNumFormatter);
  return (
    <a
      href={`https://www.npmjs.com/package/${libraryName}`}
      aria-label={`Download count for ${libraryName}: ${shortNumFormatter.format(data)}`}
    >
      {formatNumber(data)}
    </a>
  );
}
