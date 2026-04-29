import { test as testBase } from "vite-plus/test";

import { worker } from "./mocks";

export const test = testBase.extend<{ worker: typeof worker }>({
  worker: [
    // oxlint-disable-next-line no-empty-pattern
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
});

export { test as it };
