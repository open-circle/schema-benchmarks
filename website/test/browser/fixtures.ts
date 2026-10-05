// oxlint-disable no-empty-pattern
// oxlint-disable-next-line no-unused-vars
import type { TestContext } from "vite-plus/test";
import { test as testBase } from "vite-plus/test";
interface Fixtures {
  /**
   * An {@link AsyncDisposableStack} instance for managing disposable resources within the test.
   *
   * Resources are cleaned up automatically when the fixture is torn down.
   */
  testStack: AsyncDisposableStack;

  /**
   * A signal that aborts once the test finishes, times out, or is cancelled.
   *
   * It combines {@link TestContext.signal Vitest's signal} with one aborted during fixture teardown.
   */
  testSignal: AbortSignal;
}

export const test = testBase.extend<Fixtures>({
  testStack: async ({}, provide) => {
    await using stack = new AsyncDisposableStack();
    await provide(stack);
  },
  testSignal: async ({ testStack, signal }, provide) => {
    const controller = testStack.adopt(new AbortController(), (controller) => controller.abort());
    await provide(AbortSignal.any([controller.signal, signal]));
  },
});

export { test as it };
