import { shortNumFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllWeeklyDownloads } from "../-query";

export function DownloadCount({ libraryName }: { libraryName: string }) {
  const { data } = useSuspenseQuery(getAllWeeklyDownloads(libraryName));
  return (
    <a href={`https://www.npmjs.com/package/${libraryName}`}>
      {shortNumFormatter.format(data)}
    </a>
  );
}
