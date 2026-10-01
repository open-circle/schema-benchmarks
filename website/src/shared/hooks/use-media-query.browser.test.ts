import { describe, expect } from "vite-plus/test";
import { page } from "vite-plus/test/browser";

import { it } from "#test/browser/fixtures";

import { useMediaQuery } from "./use-media-query";

describe("useMediaQuery", () => {
  it("updates when the browser viewport changes", async () => {
    await page.viewport(500, 800);
    const { result } = await page.renderHook(() => useMediaQuery("(max-width: 599px)"));

    expect(result.current).toBe(true);
    await page.viewport(800, 800);
    await expect.ref(result).toBe(false);
  });
});
