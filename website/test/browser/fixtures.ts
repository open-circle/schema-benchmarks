// oxlint-disable no-empty-pattern
// oxlint-disable-next-line no-unused-vars
import type { TestContext } from "vite-plus/test";
import { test as testBase } from "vite-plus/test";

import { worker } from "./mocks";

interface Fixtures {
  worker: typeof worker;

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
  worker: [
    async ({}, use) => {
      // Start the worker before the test.
      await worker.start();

      // Expose the worker object on the test's context.
      await use(worker);

      // Remove any request handlers added in individual test cases.
      // This prevents them from affecting unrelated tests.
      worker.resetHandlers();

      // Stop the worker after the test.
      worker.stop();
    },
    { auto: true },
  ],
  testStack: async ({}, use) => {
    await using stack = new AsyncDisposableStack();
    await use(stack);
  },
  testSignal: async ({ testStack, signal }, use) => {
    const controller = testStack.adopt(new AbortController(), (controller) => controller.abort());
    await use(AbortSignal.any([controller.signal, signal]));
  },
});

export { test as it };
