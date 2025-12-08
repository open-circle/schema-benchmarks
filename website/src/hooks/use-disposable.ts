import { type DependencyList, useEffect, useMemo } from "react";

/**
 * Like useMemo, but calls dispose on the previous value when the dependencies change.
 * @param factory The function to create the disposable value.
 * @param deps The dependencies to watch for changes.
 * @returns The disposable value.
 * @see {useMemo}
 */
export function useDisposable<T extends Disposable>(
  factory: () => T,
  deps: DependencyList,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: We're ensuring the dependencies are correct
  const disposable = useMemo(factory, deps);
  useEffect(() => () => disposable[Symbol.dispose](), [disposable]);
  return disposable;
}

/**
 * Like useMemo, but calls asyncDispose on the previous value when the dependencies change.
 * @param factory The function to create the disposable value.
 * @param deps The dependencies to watch for changes.
 * @returns The disposable value.
 * @see {useMemo}
 * @remarks asyncDispose will not be awaited
 */
export function useAsyncDisposable<T extends AsyncDisposable>(
  factory: () => T,
  deps: DependencyList,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: We're ensuring the dependencies are correct
  const disposable = useMemo(factory, deps);
  useEffect(() => () => void disposable[Symbol.asyncDispose](), [disposable]);
  return disposable;
}
