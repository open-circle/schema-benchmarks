import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import * as tar from "tar";
import { up } from "up-fetch";

import sha from "#constants/sha.gen.ts";

const upfetch = up(fetch);

// degit v3 resolves SHAs by matching branch/tag tips, so pinned commits break
// once upstream advances. Download the tarball directly instead.
const url = `https://github.com/json-schema-org/JSON-Schema-Test-Suite/archive/${sha}.tar.gz`;
const tarball = path.join(os.tmpdir(), `json-schema-test-suite-${sha}.tar.gz`);

console.log(`downloading ${url}`);
const buffer = await upfetch(url, {
  parseResponse: async (response) => Buffer.from(await response.arrayBuffer()),
});
await fs.writeFile(tarball, buffer);

await fs.rm("tests", { recursive: true, force: true });
await fs.rm("remotes", { recursive: true, force: true });

await tar.extract({
  file: tarball,
  cwd: ".",
  strip: 1,
  filter: (p) =>
    p.startsWith(`JSON-Schema-Test-Suite-${sha}/tests`) ||
    p.startsWith(`JSON-Schema-Test-Suite-${sha}/remotes`),
});

await fs.rm(tarball, { force: true });
await fs.rm("tests/latest", { recursive: true, force: true });
