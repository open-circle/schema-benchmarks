import { type Assertion, type ExpectPollOptions, expect } from "vitest";

expect.ref = (refObject, pollOptions) =>
  expect.poll(() => refObject.current, pollOptions) as never;

declare module "vitest" {
  interface ExpectStatic {
    /**
     * `expect.ref(refObject)` is a shorthand for `expect.poll(() => refObject.current)`.
     * You can set default timeout via `expect.poll.timeout` option in the config.
     * @see {@link https://vitest.dev/api/expect#poll}
     */
    ref<T>(
      refObject: { current: T },
      pollOptions?: ExpectPollOptions,
    ): Promisify<Assertion<Awaited<T>>>;
  }
}
