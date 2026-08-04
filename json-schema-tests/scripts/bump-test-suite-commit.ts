import * as fs from "node:fs/promises";
import * as process from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { format } from "oxfmt";
import { up } from "up-fetch";
import * as v from "valibot";

import sha from "#constants/sha.gen.ts";

const commitInfoSchema = v.object({
  sha: v.pipe(v.string(), v.minLength(7), v.maxLength(40), v.regex(/^[0-9a-f]+$/i)),
  commit: v.object({
    message: v.string(),
  }),
});

const githubApi = up(fetch, () => ({
  baseUrl: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    "User-Agent": "open-circle/schema-benchmarks",
    "X-GitHub-Api-Version": "2026-03-10",
  },
}));

const ts = String.raw;

const {
  values: { commit },
} = parseArgs({
  options: {
    commit: {
      type: "string",
      short: "c",
      description: "The commit SHA to set for the test suite.",
      default: "main",
    },
  },
});

const {
  sha: nextCommit,
  commit: { message: fullCommitMessage },
} = await githubApi(`/repos/json-schema-org/json-schema-test-suite/commits/${commit}`, {
  schema: commitInfoSchema,
});

const refFilePath = fileURLToPath(new URL("../constants/sha.gen.ts", import.meta.url));

if (sha.toLowerCase() === nextCommit.toLowerCase()) {
  console.log(`sha is already ${nextCommit}`);
  process.exit(0);
}

// trim to first line, replace multiple whitespace with single space, and trim again
const commitMessage = fullCommitMessage.split("\n", 1)[0]?.replace(/\s+/g, " ").trim();

const nextContent = ts`
// Pinned upstream revision for json-schema-org/json-schema-test-suite.
// Update this with \`pnpm json-schema-tests:bump\`. Optionally provide a commit SHA to set a specific commit, e.g. \`pnpm json-schema-tests:bump -c <sha>\`.
export default "${nextCommit}";${commitMessage ? ` // ${commitMessage}` : ""}
`;

const formatted = await format(refFilePath, nextContent, { sortImports: true });

await fs.writeFile(refFilePath, formatted.code, "utf8");
console.log(`Updated sha: ${sha} -> ${nextCommit}`);
