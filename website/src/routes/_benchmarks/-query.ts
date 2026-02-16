import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import * as v from "valibot";

import { upfetch } from "#/shared/lib/fetch";

const downloadsResponseSchema = v.pipe(
  v.object({
    downloads: v.number(),
  }),
  v.transform(({ downloads }) => downloads),
);

export const getAllWeeklyDownloads = (packageName: string, signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["npm", "downloads", "week", packageName],
    queryFn: ({ signal }) =>
      upfetch(
        `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(packageName)}`,
        {
          signal: anyAbortSignal(signal, signalOpt),
          schema: downloadsResponseSchema,
        },
      ),
  });

const versionResponseSchema = v.pipe(
  v.object({
    downloads: v.record(v.string(), v.number()),
  }),
  v.transform(({ downloads }) => downloads),
);

export const getWeeklyDownloadsByVersion = (packageName: string, signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["npm", "downloads-by-version", "week", packageName],
    queryFn: ({ signal }) =>
      upfetch(`https://api.npmjs.org/versions/${encodeURIComponent(packageName)}/last-week`, {
        signal: anyAbortSignal(signal, signalOpt),
        schema: versionResponseSchema,
      }),
  });

const githubRepoSchema = v.object({
  html_url: v.string(),
  stargazers_count: v.number(),
});

export const getRepo = (repoName: string, signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["github", "repo", repoName],
    queryFn: ({ signal }) =>
      upfetch(`https://api.github.com/repos/${encodeURIComponent(repoName)}`, {
        signal: anyAbortSignal(signal, signalOpt),
        schema: githubRepoSchema,
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }),
  });
