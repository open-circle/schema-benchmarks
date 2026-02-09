import * as fs from "node:fs/promises";
import * as path from "node:path";
import UnpluginTypia from "@ryoppippi/unplugin-typia/rolldown";
import { getVersion } from "@schema-benchmarks/utils/node";
import { gzipSize } from "gzip-size";
import { rolldown } from "rolldown";
import {
  type DownloadResult,
  type DownloadResults,
  type MinifyType,
  minifyTypeSchema,
} from "../results/types.ts";

interface FileDescription {
  path: string;
  compiledPath: string;
  libraryName: string;
  note?: string;
}

async function measureFile(
  file: FileDescription,
  minify: MinifyType,
): Promise<DownloadResult> {
  const bundle = await rolldown({
    input: file.path,
    plugins: file.path.includes("typia") ? [UnpluginTypia({ log: false })] : [],
  });
  const output = await bundle.generate({
    format: "esm",
    minify: minify === "minified",
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

  const fileName = file.path.split("schemas/libraries/")[1];
  if (!fileName) throw new Error(`Invalid file path: ${file.path}`);

  return {
    fileName,
    libraryName: file.libraryName,
    version: await getVersion(file.libraryName),
    note: file.note,
    bytes: blob.size,
    gzipBytes: await gzipSize(code),
  };
}

async function download() {
  const allResults: DownloadResults = {
    minified: [],
    unminified: [],
  };
  for (const minify of minifyTypeSchema.options) {
    const results: Array<DownloadResult> = [];
    for await (const filePath of fs.glob(
      path.resolve(process.cwd(), "../schemas/libraries/**/download.ts"),
    )) {
      const libraryName = filePath
        .split("schemas/libraries/")[1]
        ?.split("/download.ts")[0];
      if (!libraryName) throw new Error(`Invalid file path: ${filePath}`);
      const compiledPath = path.resolve(
        path.dirname(filePath),
        `./download_compiled/${minify}.js`,
      );
      results.push(
        await measureFile(
          {
            path: filePath,
            compiledPath,
            libraryName,
          },
          minify,
        ),
      );
    }
    for await (const filePath of fs.glob(
      path.resolve(process.cwd(), "../schemas/libraries/**/download/*.ts"),
    )) {
      const libraryName = filePath
        .split("schemas/libraries/")[1]
        ?.split("/download/")[0];
      if (!libraryName)
        throw new Error(`Invalid file path: ${filePath} ${libraryName}`);
      const note = path
        .basename(filePath)
        .replace("index.ts", "")
        .replace(".ts", "");
      const compiledPath = path.resolve(
        path.dirname(filePath),
        `../download_compiled/${note}/${minify}.js`,
      );
      results.push(
        await measureFile(
          {
            path: filePath,
            compiledPath,
            libraryName,
            note: note || undefined,
          },
          minify,
        ),
      );
    }

    allResults[minify] = results.sort((a, b) => a.bytes - b.bytes);
  }

  const outputPath = path.join(process.cwd(), "download.json");
  await fs.writeFile(outputPath, JSON.stringify(allResults));
}

download();
