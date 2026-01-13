import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { baseFetch } from "@/lib/fetch";

interface RawSpecifier {
  repo?: string;
  branch?: string;
  fileName: string;
}

const getRawPath = ({
  repo = "open-circle/schema-benchmarks",
  branch = "main",
  fileName,
}: RawSpecifier) =>
  `https://raw.githubusercontent.com/${repo}/${branch}/${fileName}`;

export const getRaw = (
  { repo, branch, fileName }: RawSpecifier,
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["raw", repo, branch, fileName],
    queryFn: ({ signal }) =>
      baseFetch(getRawPath({ repo, branch, fileName }), {
        signal: anyAbortSignal(signal, signalOpt),
      }).then((response) => response.text()),
  });
