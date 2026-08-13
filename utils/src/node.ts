import * as child_process from "node:child_process";
import * as path from "node:path";
import { promisify } from "node:util";

import * as v from "valibot";

const execFile = promisify(child_process.execFile);

const pnpmListSchema = v.pipe(
  v.string(),
  v.parseJson(),
  v.array(
    v.object({
      dependencies: v.optional(
        v.record(
          v.string(),
          v.object({
            version: v.string(),
          }),
        ),
      ),
      devDependencies: v.optional(
        v.record(
          v.string(),
          v.object({
            version: v.string(),
          }),
        ),
      ),
    }),
  ),
);

const versionCache = new Map<string, string>();

const getPnpmExec = () => {
  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath && path.basename(npmExecPath).startsWith("pnpm")) {
    return {
      command: process.execPath,
      args: [npmExecPath],
    };
  }

  if (process.platform === "win32") {
    return {
      command: "cmd.exe",
      args: ["/d", "/s", "/c", "pnpm"],
    };
  }

  return {
    command: "pnpm",
    args: [],
  };
};

export async function getVersion(libraryName: string) {
  if (versionCache.has(libraryName)) return versionCache.get(libraryName)!;
  const pnpm = getPnpmExec();
  const { stdout } = await execFile(pnpm.command, [
    ...pnpm.args,
    "--filter",
    "schemas",
    "list",
    libraryName,
    "--json",
  ]);
  const data = v.parse(pnpmListSchema, stdout);
  const dep = data[0]?.dependencies?.[libraryName] ?? data[0]?.devDependencies?.[libraryName];
  if (!dep) throw new Error(`No version found for ${libraryName}`);
  versionCache.set(libraryName, dep.version);
  return dep.version;
}

export function forwardStd<T>(promise: child_process.PromiseWithChild<T>) {
  promise.child.stdout?.pipe(process.stdout);
  promise.child.stderr?.pipe(process.stderr);
  return promise;
}

let sigintAc: AbortController | undefined;
/**
 * Returns an abort signal that is aborted when the process receives a SIGINT signal.
 * @returns The abort signal.
 */
export const getSigintSignal = () => {
  if (sigintAc) return sigintAc.signal;
  sigintAc = new AbortController();
  process.on("SIGINT", (signal) => {
    sigintAc?.abort(signal);
  });
  return sigintAc.signal;
};

export function getSystemColorScheme(): "light" | "dark" | undefined {
  if (process.platform === "darwin") {
    try {
      return child_process
        .execFileSync("defaults", ["read", "-g", "AppleInterfaceStyle"], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        })
        .trim()
        .toLowerCase() === "dark"
        ? "dark"
        : "light";
    } catch {
      return;
    }
  }

  if (process.platform === "win32") {
    try {
      return child_process
        .execFileSync(
          "reg",
          [
            "query",
            "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
            "/v",
            "AppsUseLightTheme",
          ],
          { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
        )
        .includes("0x0")
        ? "dark"
        : "light";
    } catch {
      return;
    }
  }

  try {
    return child_process
      .execFileSync("gsettings", ["get", "org.gnome.desktop.interface", "color-scheme"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      })
      .includes("prefer-dark")
      ? "dark"
      : "light";
  } catch {
    return;
  }
}
