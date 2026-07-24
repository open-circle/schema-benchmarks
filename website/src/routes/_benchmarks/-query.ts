import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import * as v from "valibot";

import { isRetryableUpfetchError, upfetch } from "#src/shared/lib/fetch";

const downloadsResponseSchema = v.pipe(
  v.object({
    downloads: v.number(),
  }),
  v.transform(({ downloads }) => downloads),
);

// Packages hosted on JSR rather than npm — the registry can't be inferred from the name
// (e.g. `@vinejs/vine` is npm), so metadata/downloads for these resolve from the JSR API.
const JSR_PACKAGES = new Set(["@paseri/paseri", "@paseri/compiler"]);

export const isJsrPackage = (packageName: string) => JSR_PACKAGES.has(packageName);

// "@scope/name" -> JSR API path segments.
const jsrScopeAndName = (packageName: string) => {
  const [scope, name] = packageName.slice(1).split("/");
  return { scope, name };
};

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

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// JSR reports daily, per-channel buckets (npm_tarball + jsr_meta); sum the last week across both.
const jsrDownloadsSchema = v.pipe(
  v.object({
    total: v.array(v.object({ timeBucket: v.string(), count: v.number() })),
  }),
  v.transform(({ total }) => {
    const cutoff = Date.now() - MS_PER_WEEK;
    return total.reduce(
      (sum, { timeBucket, count }) =>
        new Date(timeBucket).getTime() >= cutoff ? sum + count : sum,
      0,
    );
  }),
);

export const getAllWeeklyDownloads = (packageName: string, signalOpt?: AbortSignal) => {
  if (isJsrPackage(packageName)) {
    const { scope, name } = jsrScopeAndName(packageName);
    return queryOptions({
      queryKey: ["jsr", "downloads", "week", packageName],
      queryFn: async ({ signal }) => {
        try {
          return await upfetch(`https://api.jsr.io/scopes/${scope}/packages/${name}/downloads`, {
            signal: anyAbortSignal(signal, signalOpt),
            schema: jsrDownloadsSchema,
          });
        } catch (error) {
          if (isRetryableUpfetchError(error)) return "n/a" as const;
          throw error;
        }
      },
    });
  }
  return queryOptions({
    queryKey: ["npm", "downloads", "week", packageName],
    queryFn: async ({ signal }) => {
      try {
        return await upfetch(
          `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(packageName)}`,
          {
            signal: anyAbortSignal(signal, signalOpt),
            schema: downloadsResponseSchema,
          },
        );
      } catch (error) {
        if (isRetryableUpfetchError(error)) return "n/a" as const;
        throw error;
      }
    },
  });
};

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

// Maps the JSR package API onto the same shape as packageMetadataSchema so cards render uniformly.
type PackageMetadata = v.InferOutput<typeof packageMetadataSchema>;

const jsrMetadataSchema = v.pipe(
  v.object({
    scope: v.string(),
    name: v.string(),
    description: v.nullish(v.string()),
    githubRepository: v.nullish(v.object({ owner: v.string(), name: v.string() })),
  }),
  v.transform(
    ({ scope, name, description, githubRepository }): Omit<PackageMetadata, "version"> => ({
      name: `@${scope}/${name}`,
      description: description ?? "",
      homepage: `https://jsr.io/@${scope}/${name}`,
      repository: githubRepository
        ? {
            type: "git",
            url: `https://github.com/${githubRepository.owner}/${githubRepository.name}`,
          }
        : undefined,
    }),
  ),
);

export const getPackageMetadata = (
  packageName: string,
  version: string,
  signalOpt?: AbortSignal,
) => {
  if (isJsrPackage(packageName)) {
    const { scope, name } = jsrScopeAndName(packageName);
    return queryOptions({
      queryKey: ["jsr", "metadata", packageName, version],
      queryFn: async ({ signal }) => {
        // JSR has version specific metadata (https://api.jsr.io/scopes/paseri/packages/paseri/versions/1.9.5),
        // but it's missing fields (description, repository, etc.) that are present in the package-level metadata (https://api.jsr.io/scopes/paseri/packages/paseri).
        // So we fetch the package-level metadata and just add the version to it.
        const data = await upfetch(`https://api.jsr.io/scopes/${scope}/packages/${name}`, {
          signal: anyAbortSignal(signal, signalOpt),
          schema: jsrMetadataSchema,
        });
        return {
          ...data,
          version,
        };
      },
    });
  }
  return queryOptions({
    queryKey: ["npm", "metadata", packageName, version],
    queryFn: async ({ signal }) => {
      try {
        return await upfetch(
          `https://registry.npmjs.org/${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`,
          {
            signal: anyAbortSignal(signal, signalOpt),
            schema: packageMetadataSchema,
          },
        );
      } catch (error) {
        if (isRetryableUpfetchError(error)) {
          return {
            name: packageName,
            version,
            description: "",
            homepage: `https://www.npmjs.com/package/${packageName}`,
          };
        }
        throw error;
      }
    },
  });
};

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
