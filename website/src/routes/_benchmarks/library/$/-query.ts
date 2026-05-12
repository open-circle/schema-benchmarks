import {
  anyAbortSignal,
  promiseAllKeyed,
  unsafeEntries,
  unsafeFromEntries,
} from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import * as v from "valibot";

import { getBenchResultsFn } from "#/routes/_benchmarks/_runtime/-query";
import { getDownloadResultsFn } from "#/routes/_benchmarks/download/-query";
import { getStackResultsFn } from "#/routes/_benchmarks/stack/-query";

export const getLibraryResultsFn = createServerFn()
  .inputValidator(v.object({ libraryName: v.string() }))
  .handler(async ({ data: { libraryName } }) => {
    const { signal } = getRequest();
    const allResults = await promiseAllKeyed({
      bench: getBenchResultsFn({ signal }),
      download: getDownloadResultsFn({ signal }),
      stack: getStackResultsFn({ signal }),
    });
    return {
      bench: {
        initialization: allResults.bench.initialization.filter(
          (item) => item.libraryName === libraryName,
        ),
        validation: unsafeFromEntries(
          unsafeEntries(allResults.bench.validation).map(([validity, results]) => [
            validity,
            results.filter((item) => item.libraryName === libraryName),
          ]),
        ),
        parsing: unsafeFromEntries(
          unsafeEntries(allResults.bench.parsing).map(([validity, results]) => [
            validity,
            results.filter((item) => item.libraryName === libraryName),
          ]),
        ),
        standard: unsafeFromEntries(
          unsafeEntries(allResults.bench.standard).map(([validity, results]) => [
            validity,
            results.filter((item) => item.libraryName === libraryName),
          ]),
        ),
        string: unsafeFromEntries(
          unsafeEntries(allResults.bench.string).map(
            ([format, results]) =>
              [
                format,
                unsafeFromEntries(
                  unsafeEntries(results).map(([validity, value]) => [
                    validity,
                    value.filter((item) => item.libraryName === libraryName),
                  ]),
                ),
              ] as const,
          ),
        ),
        codec: allResults.bench.codec.filter((item) => item.libraryName === libraryName),
      },
      download: unsafeFromEntries(
        unsafeEntries(allResults.download).map(([minify, results]) => [
          minify,
          results.filter((item) => item.libraryName === libraryName),
        ]),
      ),
      stack: allResults.stack.filter((item) => item.libraryName === libraryName),
    } satisfies typeof allResults;
  });

export const getLibraryResults = (libraryName: string, signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["library", libraryName],
    queryFn: ({ signal }) =>
      getLibraryResultsFn({ data: { libraryName }, signal: anyAbortSignal(signal, signalOpt) }),
  });
