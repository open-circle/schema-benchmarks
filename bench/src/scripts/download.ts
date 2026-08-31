import * as fs from "node:fs/promises";
import * as path from "node:path";

import { unsafeFromEntries } from "@schema-benchmarks/utils";
import { getSigintSignal, getVersion } from "@schema-benchmarks/utils/node";
import ttsc from "@ttsc/unplugin/rolldown";
import { gzipSize } from "gzip-size";
import pLimit from "p-limit";
import { rolldown } from "rolldown";

import {
  type DownloadResult,
  type DownloadResults,
  type MinifyType,
  minifyTypeSchema,
} from "#src/results/types.ts";

const sigintSignal = getSigintSignal();

interface FileDescription {
  path: string;
  compiledPath: string;
  libraryName: string;
  note?: string;
}

function getPackageName(libraryName: string) {
  // effect/Schema -> effect
  // effect@beta -> effect___beta
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
    libraryName = libraryName.slice(0, lastAt) + "___" + libraryName.slice(lastAt + 1);
  }
  return libraryName;
}

async function measureFile(file: FileDescription, minify: MinifyType): Promise<DownloadResult> {
  const bundle = await rolldown({
    input: file.path,
    plugins: file.path.includes("typia") ? [ttsc()] : [],
    external: [/node:/],
  });
  const output = await bundle.generate({
    format: "esm",
    minify: minify === "minified" ? true : "dce-only",
  });
  const code = output.output
    .filter((chunk) => chunk.type === "chunk")
    .map((chunk) => chunk.code)
    .join(minify === "minified" ? "" : "\n");
  const blob = new Blob([code]);

  const exists = await fs
    .access(file.compiledPath)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    await fs.mkdir(path.dirname(file.compiledPath), { recursive: true });
  }
  await fs.writeFile(file.compiledPath, code);

  const fileName = file.path.replace(/\\/g, "/").split("schemas/libraries/")[1];
  if (!fileName) throw new Error(`Invalid file path: ${file.path}`);

  return {
    fileName,
    libraryName: file.libraryName,
    version: await getVersion(getPackageName(file.libraryName)),
    note: file.note,
    bytes: blob.size,
    gzipBytes: await gzipSize(code),
  };
}

async function download() {
  const limit = pLimit({ concurrency: 4, rejectOnClear: true });
  sigintSignal.addEventListener(
    "abort",
    () => {
      limit.clearQueue();
    },
    { once: true },
  );
  const allResults: DownloadResults = unsafeFromEntries(
    await Promise.all(
      minifyTypeSchema.options.map(async (minify) => {
        const [topLevelPaths, nestedPaths] = await Promise.all([
          Array.fromAsync(
            fs.glob(path.resolve(process.cwd(), "../schemas/libraries/**/download.ts")),
          ),
          Array.fromAsync(
            fs.glob(path.resolve(process.cwd(), "../schemas/libraries/**/download/*.ts")),
          ),
        ]);
        const files: Array<FileDescription> = [
          ...topLevelPaths.map((filePath) => {
            const libraryName = filePath
              .replace(/\\/g, "/")
              .split("schemas/libraries/")[1]
              ?.split("/download.ts")[0]
              ?.replace("/@", "@");
            if (!libraryName) throw new Error(`Invalid file path: ${filePath}`);
            const compiledPath = path.resolve(
              path.dirname(filePath),
              `./download_compiled/${minify}.js`,
            );
            return {
              path: filePath,
              compiledPath,
              libraryName,
            };
          }),
          ...nestedPaths.map((filePath) => {
            const libraryName = filePath
              .replace(/\\/g, "/")
              .split("schemas/libraries/")[1]
              ?.split("/download/")[0]
              ?.replace("/@", "@");
            if (!libraryName) throw new Error(`Invalid file path: ${filePath} ${libraryName}`);
            const note = path.basename(filePath).replace("index.ts", "").replace(".ts", "");
            const compiledPath = path.resolve(
              path.dirname(filePath),
              `../download_compiled/${note}/${minify}.js`,
            );
            return {
              path: filePath,
              compiledPath,
              libraryName,
              note: note || undefined,
            };
          }),
        ];
        const results = await Promise.all(
          files.map((file) =>
            limit(() => {
              sigintSignal.throwIfAborted();
              return measureFile(file, minify);
            }),
          ),
        );
        results.sort((a, b) => a.bytes - b.bytes);

        return [minify, results] as const;
      }),
    ),
  );

  const outputPath = path.join(process.cwd(), "download.json");
  await fs.writeFile(outputPath, JSON.stringify(allResults));
}

void download();
