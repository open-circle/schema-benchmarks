/// <reference lib="webworker" />
import { errorData, successData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries/eager";
import { ensureArray } from "@schema-benchmarks/utils";
import { Bench } from "tinybench";
import * as broadcast from "./src/features/broadcast/channel";

broadcast.worker.addEventListener("benchmark", async (benchmarks) => {
  try {
    const config = libraries[`./${benchmarks.library}/benchmarks.ts`];
    if (!config) return;
    const bench = new Bench();
    bench.addEventListener("start", () => {
      console.log("Starting bench...");
    });
    bench.addEventListener("cycle", (event) => {
      const { task } = event;
      if (!task) return;
      console.log("Starting cycle", task.name);
      broadcast.worker.postMessage("cycle", { task: task.name });
    });
    bench.addEventListener("complete", () => {
      console.log("Bench complete");
    });
    const context = config.createContext();
    const data = benchmarks.dataType === "valid" ? successData : errorData;
    for (const entry of ensureArray(config.initialization)) {
      const id = benchmarks.initialization[broadcast.getTaskSlug(benchmarks.library, entry)];
      if (!id) continue;
      bench.add(id, () => entry.run(context));
    }
    for (const entry of ensureArray(config.validation ?? [])) {
      const id = benchmarks.validation[broadcast.getTaskSlug(benchmarks.library, entry)];
      if (!id) continue;
      bench.add(id, () => entry.run(data, context));
    }
    for (const entry of Object.values(config.parsing ?? []).flatMap((configs) =>
      ensureArray(configs),
    )) {
      const id = benchmarks.parsing[broadcast.getTaskSlug(benchmarks.library, entry)];
      if (!id) continue;
      bench.add(id, () => entry.run(data, context));
    }
    const results = await bench.run();
    broadcast.worker.postMessage("complete", {
      type: "results",
      payload: Object.fromEntries(
        results.map((task) => {
          if (!task.result) return [task.name, { error: "No result" }];
          return [
            task.name,
            task.result.error
              ? { error: task.result.error }
              : { mean: task.result.mean },
          ];
        }),
      ),
    });
  } catch (error) {
    console.error("Error running benchmarks: ", error);
    broadcast.worker.postMessage("complete", {
      type: "fail",
      error: error instanceof Error ? error : new Error("Unknown error"),
    });
  }
});
