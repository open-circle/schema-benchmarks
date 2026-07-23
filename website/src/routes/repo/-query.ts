import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import * as v from "valibot";

import { upfetch } from "#src/shared/lib/fetch";
import { getFormattedCodeFn } from "#src/shared/lib/highlight";

const rawSpecifierSchema = v.object({
  repo: v.optional(v.string()),
  branch: v.optional(v.string()),
  fileName: v.string(),
  formatted: v.optional(v.boolean(), false),
});

type RawSpecifier = v.InferInput<typeof rawSpecifierSchema>;

const getRawPath = ({
  repo = "open-circle/schema-benchmarks",
  branch = "main",
  fileName,
}: RawSpecifier) => `https://raw.githubusercontent.com/${repo}/${branch}/${fileName}`;

const getRawFn = createServerFn()
  .validator(rawSpecifierSchema)
  .handler(async ({ data: { repo, branch, fileName, formatted } }) => {
    const { signal } = getRequest();
    const raw = await upfetch(getRawPath({ repo, branch, fileName }), {
      signal,
      parseResponse: (response) => response.text(),
    });
    return formatted ? getFormattedCodeFn({ data: { fileName, sourceText: raw }, signal }) : raw;
  });

export const getRaw = (
  { repo, branch, fileName, formatted }: RawSpecifier,
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["raw", repo, branch, fileName, formatted],
    queryFn: ({ signal }) =>
      getRawFn({
        data: { repo, branch, fileName, formatted },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
