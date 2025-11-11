import * as fs from "node:fs/promises";
import * as path from "node:path";
import { runBenchmarks } from "./index";

runBenchmarks().then(async (results) => {
  const outputPath = path.join(__dirname, "results.json");
  await fs.writeFile(outputPath, JSON.stringify(results));
});
