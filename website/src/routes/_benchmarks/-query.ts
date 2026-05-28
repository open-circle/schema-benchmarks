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

export function getPackageName(libraryName: string) {
  // effect/Schema -> effect
  // effect@beta -> effect
  // @vinejs/vine -> @vinejs/vine
  // @foo/bar/baz -> @foo/bar
  if (libraryName.includes("/")) {
    libraryName = libraryName
      .split("/")
      .slice(0, libraryName.startsWith("@") ? 2 : 1)
      .join("/");
  }
  const lastAt = libraryName.lastIndexOf("@");
  if (lastAt > 0) {
    libraryName = libraryName.slice(0, lastAt);
  }
  return libraryName;
}

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

const packageMetadataSchema = v.object({
  name: v.string(),
  version: v.string(),
  description: v.string(),
  homepage: v.optional(v.string()),
  repository: v.optional(
    v.object({
      type: v.string(),
      url: v.string(),
    }),
  ),
});

export const getRepoLink = (repository: { type: string; url: string }) => {
  if (repository.type === "git" && repository.url.startsWith("git+")) {
    return repository.url.slice(4);
  }
  return repository.url;
};

export const getPackageMetadata = (packageName: string, version: string, signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["npm", "metadata", packageName, version],
    queryFn: ({ signal }) =>
      upfetch(
        `https://registry.npmjs.org/${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`,
        {
          signal: anyAbortSignal(signal, signalOpt),
          schema: packageMetadataSchema,
        },
      ),
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
