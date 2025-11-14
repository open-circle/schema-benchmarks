import * as fs from "node:fs/promises";
import * as path from "node:path";
import UnpluginTypia from "@ryoppippi/unplugin-typia/rolldown";
import { rolldown } from "rolldown";
import {
  type DownloadResult,
  type DownloadResults,
  minifyTypeSchema,
} from "./results/types";

async function download() {
  const allResults: DownloadResults = {
    minified: [],
    unminified: [],
  };
  for (const minify of minifyTypeSchema.options) {
    const results: Array<Omit<DownloadResult, "rank">> = [];
    for await (const filePath of fs.glob(
      path.resolve(__dirname, "schemas/download/**/*.ts"),
    )) {
      const bundle = await rolldown({
        input: filePath,
        plugins: filePath.includes("typia")
          ? [UnpluginTypia({ log: false })]
          : [],
      });

      const output = await bundle.generate({
        format: "esm",
        dir: path.resolve(__dirname, "schemas/download_compiled"),
        minify: minify === "minified",
      });

      const code = output.output
        .filter((chunk) => chunk.type === "chunk")
        .map((chunk) => chunk.code)
        .join(minify ? "" : "\n");

      // fileName: libraryName (note)
      // should remove schemas/download/, note and index file names
      const fileName = filePath.split("schemas/download/")[1];
      const libraryName = fileName
        ?.replace(/\/index\s?/, "")
        .replace(/\.ts$/, "")
        .replace(/\(.*?\)/, "");
      if (!libraryName) continue;
      const note = fileName?.includes("(")
        ? fileName.match(/\((.*?)\)/)?.[1]
        : undefined;

      const blob = new Blob([code]);

      // do we want to write the compiled file somewhere, for reference?
      results.push({
        libraryName,
        note,
        bytes: blob.size,
      });
    }
    results.sort((a, b) => a.bytes - b.bytes);
    allResults[minify] = results.map((result, index) =>
      Object.assign(result, { rank: index + 1 }),
    );
  }

  const outputPath = path.join(__dirname, "download.json");
  await fs.writeFile(outputPath, JSON.stringify(allResults));
}

download();
