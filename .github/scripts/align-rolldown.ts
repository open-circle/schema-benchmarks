import { execFileSync } from "node:child_process";
import * as fs from "node:fs";

import { parseDocument } from "yaml";

const toolchain = JSON.parse(
  execFileSync("vp", ["toolchain", "--global", "--json"], { encoding: "utf8" }),
) as { nodes?: Array<{ id: string; version?: string }> };
const version = toolchain.nodes?.find((node) => node.id === "rolldown")?.version;
if (!version) throw new Error("Could not determine the bundled Rolldown version");

const file = "pnpm-workspace.yaml";
const workspace = parseDocument(fs.readFileSync(file, "utf8"));
if (workspace.errors.length)
  throw new AggregateError(workspace.errors, "Failed to parse pnpm-workspace.yaml");
workspace.setIn(["overrides", "rolldown"], version);
fs.writeFileSync(file, workspace.toString());
process.stdout.write(`Aligned Rolldown override with Vite+: ${version}\n`);
