import { errorData, successData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { ensureArray, unsafeEntries } from "@schema-benchmarks/utils";
import { allBenches, getBench, getCaseKey } from "../bench/registry.ts";

async function processLibraries() {
  for (const getConfig of Object.values(libraries)) {
    const { library, initialization, validation, parsing } = await getConfig();
    const { name, type: libraryType, version } = library;

    for (const benchConfig of ensureArray(initialization)) {
      const { run, snippet, note } = benchConfig;
      const bench = getBench({ type: "initialization", libraryType });
      bench.add(
        getCaseKey(bench, {
          libraryName: name,
          version,
          snippet,
          note,
        }),
        run,
      );
    }
    if (validation) {
      for (const [dataType, data] of [
        ["valid", successData],
        ["invalid", errorData],
      ] as const) {
        for (const benchConfig of ensureArray(validation)) {
          const { run, snippet, note } = benchConfig;
          const bench = getBench({ type: "validation", libraryType, dataType });
          bench.add(
            getCaseKey(bench, {
              libraryName: name,
              version,
              snippet,
              note,
            }),
            () => run(data),
          );
        }
      }
    }
    if (parsing) {
      for (const [dataType, data] of [
        ["valid", successData],
        ["invalid", errorData],
      ] as const) {
        for (const [errorType, benchConfigs] of unsafeEntries(parsing)) {
          if (!benchConfigs) continue;
          for (const benchConfig of ensureArray(benchConfigs)) {
            const { run, snippet, note } = benchConfig;
            const bench = getBench({
              type: "parsing",
              libraryType,
              dataType,
              errorType,
            });
            bench.add(
              getCaseKey(bench, {
                libraryName: name,
                version,
                errorType,
                snippet,
                note,
              }),
              () => run(data),
            );
          }
        }
      }
    }
  }
  return allBenches.values();
}

const benches = await processLibraries();
