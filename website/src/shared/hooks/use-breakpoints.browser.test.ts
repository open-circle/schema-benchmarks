import { describe, expect } from "vitest";
import { page } from "vitest/browser";
import { renderHook } from "vitest-browser-react";
import { it } from "#test/browser/fixtures";
import { useBreakpoints } from "./use-breakpoints";

describe("useBreakpoints", () => {
  it("should match phone breakpoint", async () => {
    await page.viewport(500, 1000);
    const { result } = await renderHook(() => useBreakpoints(["phone"]));
    expect(result.current).toBe(true);

    await page.viewport(600, 1000);
    await expect.ref(result).toBe(false);
  });
  it("should match tabletSmall breakpoint", async () => {
    await page.viewport(600, 1000);
    const { result } = await renderHook(() => useBreakpoints(["tabletSmall"]));
    expect(result.current).toBe(true);

    await page.viewport(905, 1000);
    await expect.ref(result).toBe(false);
  });
  it("should match tabletLarge breakpoint", async () => {
    await page.viewport(905, 1000);
    const { result } = await renderHook(() => useBreakpoints(["tabletLarge"]));
    expect(result.current).toBe(true);

    await page.viewport(1240, 1000);
    await expect.ref(result).toBe(false);
  });
  it("should match laptop breakpoint", async () => {
    await page.viewport(1240, 1000);
    const { result } = await renderHook(() => useBreakpoints(["laptop"]));
    expect(result.current).toBe(true);

    await page.viewport(1440, 1000);
    await expect.ref(result).toBe(false);
  });
  it("should match desktop breakpoint", async () => {
    await page.viewport(1440, 1000);
    const { result } = await renderHook(() => useBreakpoints(["desktop"]));
    expect(result.current).toBe(true);

    await page.viewport(1439, 1000);
    await expect.ref(result).toBe(false);
  });
  it("should match multiple breakpoints", async () => {
    await page.viewport(1440, 1000);
    const { result } = await renderHook(() => useBreakpoints(["tabletSmall", "tabletLarge"]));
    expect(result.current).toBe(false);

    await page.viewport(905, 1000);
    await expect.ref(result).toBe(true);

    await page.viewport(600, 1000);
    await expect.ref(result).toBe(true);
  });
});
