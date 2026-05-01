import { delay } from "msw";
import type { Ref } from "react";
import { describe, expect } from "vite-plus/test";
import { page } from "vite-plus/test/browser";

import { useElementSize } from "#/shared/hooks/use-content-box-size";
import { it } from "#test/browser/fixtures";

function Box({
  width,
  height,
  ref,
}: Record<"width" | "height", number> & { ref?: Ref<HTMLDivElement> }) {
  return <div {...{ ref, style: { width, height, backgroundColor: "red" } }} />;
}

describe("useElementSize", () => {
  it("returns a DOMRect instance measuring the targeted element", async () => {
    const { result } = await page.renderHook(() => useElementSize());
    expect(result.current).toEqual([undefined, expect.typeOf("function")]);

    const [, setTargetRef] = result.current;

    const { rerender } = await page.render(<Box ref={setTargetRef} width={50} height={50} />);

    await expect.poll(() => result.current[0]).toBeInstanceOf(DOMRect);
    expect(result.current[0]).toEqual(
      expect.objectContaining<Partial<DOMRect>>({ width: 50, height: 50 }),
    );

    await rerender(<Box ref={setTargetRef} width={25} height={25} />);
    await expect
      .poll(() => result.current[0])
      .toEqual(expect.objectContaining<Partial<DOMRect>>({ width: 25, height: 25 }));
  });

  it("debounces resize updates", async () => {
    const debounce = 100;
    const { result } = await page.renderHook(() => useElementSize({ debounce }));
    const [, setTargetRef] = result.current;

    const { rerender } = await page.render(<Box ref={setTargetRef} width={50} height={50} />);

    await expect
      .poll(() => result.current[0])
      .toEqual(expect.objectContaining<Partial<DOMRect>>({ width: 50, height: 50 }));

    await rerender(<Box ref={setTargetRef} width={25} height={25} />);
    await delay(debounce / 2);

    expect(result.current[0]).toEqual(
      expect.objectContaining<Partial<DOMRect>>({ width: 50, height: 50 }),
    );

    await expect
      .poll(() => result.current[0])
      .toEqual(expect.objectContaining<Partial<DOMRect>>({ width: 25, height: 25 }));
  });
});
