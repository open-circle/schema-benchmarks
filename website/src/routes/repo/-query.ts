import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import * as v from "valibot";

import { upfetch } from "#src/shared/lib/fetch";

const rawSpecifierSchema = v.object({
  repo: v.optional(v.string()),
  branch: v.optional(v.string()),
  fileName: v.string(),
});

type RawSpecifier = v.InferInput<typeof rawSpecifierSchema>;

const getRawPath = ({
  repo = "open-circle/schema-benchmarks",
  branch = "main",
  fileName,
}: RawSpecifier) => `https://raw.githubusercontent.com/${repo}/${branch}/${fileName}`;

const getRawFn = createServerFn()
  .validator(rawSpecifierSchema)
  .handler(async ({ data: { repo, branch, fileName } }) => {
    const { signal } = getRequest();
    const raw = await upfetch(getRawPath({ repo, branch, fileName }), {
      signal,
      parseResponse: (response) => response.text(),
    });
    return raw;
  });

export const getRaw = ({ repo, branch, fileName }: RawSpecifier, signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["raw", repo, branch, fileName],
    queryFn: ({ signal }) =>
      getRawFn({
        data: { repo, branch, fileName },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
