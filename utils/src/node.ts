import * as child_process from "node:child_process";
import { promisify } from "node:util";

import * as v from "valibot";

const exec = promisify(child_process.exec);

const pnpmListSchema = v.pipe(
  v.string(),
  v.parseJson(),
  v.array(
    v.object({
      dependencies: v.record(
        v.string(),
        v.object({
          version: v.string(),
        }),
      ),
    }),
  ),
);

const versionCache = new Map<string, string>();

export async function getVersion(libraryName: string) {
  if (versionCache.has(libraryName)) return versionCache.get(libraryName)!;
  const { stdout, stderr } = await exec(`pnpm --filter schemas list ${libraryName} --json`);
  if (stderr) throw new Error(stderr);
  const data = v.parse(pnpmListSchema, stdout);
  const dep = data[0]?.dependencies[libraryName];
  if (!dep) throw new Error(`No version found for ${libraryName}`);
  versionCache.set(libraryName, dep.version);
  return dep.version;
}

export function forwardStd<T>(promise: child_process.PromiseWithChild<T>) {
  promise.child.stdout?.pipe(process.stdout);
  promise.child.stderr?.pipe(process.stderr);
  return promise;
}
