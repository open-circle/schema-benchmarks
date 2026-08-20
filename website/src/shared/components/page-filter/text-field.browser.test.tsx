import { describe, expect, vi } from "vitest";
import { page } from "vitest/browser";

import { it } from "#test/browser/fixtures";

import { PageFilterTextField } from "./text-field";

describe("PageFilterTextField", () => {
  it("should update the value", async () => {
    const onChange = vi.fn<(value: number) => void>();
    await page.render(
      <PageFilterTextField title="Test" value={1} type="number" onChange={onChange} />,
    );
    const field = page.getByRole("spinbutton");
    await expect.element(field).toHaveValue(1);
    await field.fill("2");
    await expect.element(field).toHaveValue(2);
    await vi.waitFor(() => expect(onChange).toHaveBeenCalledWith(2));
  });
});
