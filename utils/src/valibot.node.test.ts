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

describe("coerceDate", () => {
  it("should pass through a date", () => {
    const date = new Date();
    expect(v.parse(vUtils.coerceDate, date)).toBe(date);
  });
  it("should coerce a string to a date", () => {
    const date = new Date();
    expect(v.parse(vUtils.coerceDate, date.toISOString())).toStrictEqual(date);
  });
  it("should throw on a string that can't be coerced to a date", () => {
    expect(() => v.parse(vUtils.coerceDate, "a")).toThrow();
  });
  it("should throw on non-string, non-date values", () => {
    expect(() => v.parse(vUtils.coerceDate, {})).toThrow();
  });
});
