import { describe, it, expect } from "vitest";

import { assertNotReached, ShouldHaveThrownError } from "./types.ts";

describe("assertNotReached", () => {
  it("throws ShouldHaveThrownError when called", () => {
    expect(assertNotReached).toThrow(new ShouldHaveThrownError());
  });
});
