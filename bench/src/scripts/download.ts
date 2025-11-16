import * as fs from "node:fs/promises";
import * as path from "node:path";
import UnpluginTypia from "@ryoppippi/unplugin-typia/rolldown";
import { rolldown } from "rolldown";
import {
  type DownloadResult,
  type DownloadResults,
  minifyTypeSchema,
} from "../results/types";

async function download() {
  const allResults: DownloadResults = {
    minified: [],
    unminified: [],
  };
  for (const minify of minifyTypeSchema.options) {
    const results: Array<Omit<DownloadResult, "rank">> = [];
    for await (const filePath of fs.glob(
      path.resolve(process.cwd(), "schemas/download/**/*.ts"),
    )) {
      const bundle = await rolldown({
        input: filePath,
        plugins: filePath.includes("typia")
          ? [UnpluginTypia({ log: false })]
          : [],
      });

      const output = await bundle.generate({
        format: "esm",
        minify: minify === "minified",
      });

      const code = output.output
        .filter((chunk) => chunk.type === "chunk")
        .map((chunk) => chunk.code)
        .join(minify ? "" : "\n");

      // fileName: libraryName (note)
      // should remove schemas/download/, note and index file names
      const fileName = filePath.split("schemas/download/")[1];
      if (!fileName) continue;

      const compiledPath = path.resolve(
        process.cwd(),
        "schemas/download_compiled",
        minify,
        fileName.replace(".ts", ".js"),
      );

      const exists = await fs
        .access(compiledPath)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        await fs.mkdir(path.dirname(compiledPath), { recursive: true });
      }

      // write to file
      await fs.writeFile(compiledPath, code);

      const libraryName = fileName
        .replace(/\/index\s?/, "")
        .replace(/\.ts$/, "")
        .replace(/\(.*?\)/, "");
      const note = fileName.includes("(")
        ? fileName.match(/\((.*?)\)/)?.[1]
        : undefined;

      const blob = new Blob([code]);

      results.push({
        fileName,
        libraryName,
        note,
        bytes: blob.size,
      });
    }

    allResults[minify] = results
      .sort((a, b) => a.bytes - b.bytes)
      .map((result, index) => Object.assign(result, { rank: index + 1 }));
  }

  const outputPath = path.join(process.cwd(), "download.json");
  await fs.writeFile(outputPath, JSON.stringify(allResults));
}

download();
