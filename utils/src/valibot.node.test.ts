import * as v from "valibot";
import { describe, expect, it } from "vitest";
import * as vUtils from "./valibot.ts";

describe("coerceNumber", () => {
  it("should pass through a number", () => {
    expect(v.parse(vUtils.coerceNumber, 1)).toBe(1);
  });
  it("should coerce a string to a number", () => {
    expect(v.parse(vUtils.coerceNumber, "1")).toBe(1);
  });
  it("should throw on a string that can't be coerced to a number", () => {
    expect(() => v.parse(vUtils.coerceNumber, "a")).toThrow();
  });
  it("should throw on non-string, non-number values", () => {
    expect(() => v.parse(vUtils.coerceNumber, {})).toThrow();
  });
});
