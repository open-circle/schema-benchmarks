import { describe, expectTypeOf, it } from "vitest";

import {
  hasAtLeast,
  hasLength,
  partition,
  promiseAllKeyed,
  promiseAllSettledKeyed,
} from "./index.ts";

describe("partition", () => {
  it("should narrow based on type predicate", () => {
    const array = [1, "foo", 2, "bar", 3, "baz"];
    const [numbers, strings] = partition(array, (value) => typeof value === "number");
    expectTypeOf(numbers).toEqualTypeOf<Array<number>>();
    expectTypeOf(strings).toEqualTypeOf<Array<string>>();
  });
  it("should not narrow if predicate does not return a type predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const [even, odd] = partition(array, (value) => value % 2 === 0);
    expectTypeOf(even).toEqualTypeOf<Array<number>>();
    expectTypeOf(odd).toEqualTypeOf<Array<number>>();
  });
});

describe("hasLength", () => {
  it("should narrow to tuple of length", () => {
    const array = [1, 2, 3, 4, 5];
    if (hasLength(array, 3)) {
      expectTypeOf(array).toEqualTypeOf<[number, number, number]>();
    }
  });
});

describe("hasAtLeast", () => {
  it("should narrow to tuple of at least length", () => {
    const array = [1, 2, 3, 4, 5];
    if (hasAtLeast(array, 3)) {
      expectTypeOf(array).toEqualTypeOf<[number, number, number] & Array<number>>();
    }
  });
});

describe("promiseAllKeyed", () => {
  it("should resolve to an object with the same keys as the input", async () => {
    const result = promiseAllKeyed({
      a: Promise.resolve(1),
      b: Promise.resolve(2),
      c: Promise.resolve(3),
    });
    expectTypeOf(result).resolves.toEqualTypeOf<{
      a: number;
      b: number;
      c: number;
    }>();
  });
});

describe("promiseAllSettledKeyed", () => {
  it("should resolve to an object with the same keys as the input", async () => {
    const result = promiseAllSettledKeyed({
      a: Promise.resolve(1),
      b: Promise.resolve(2),
      c: Promise.resolve(3),
    });
    expectTypeOf(result).resolves.toEqualTypeOf<{
      a: PromiseSettledResult<number>;
      b: PromiseSettledResult<number>;
      c: PromiseSettledResult<number>;
    }>();
  });
});
