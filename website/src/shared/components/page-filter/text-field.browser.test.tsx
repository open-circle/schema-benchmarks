import { describe, expect } from "vite-plus/test";
import { page } from "vite-plus/test/browser";

import { it } from "#test/browser/fixtures";

import { PageFilterTextField } from "./text-field";

describe("PageFilterTextField", () => {
  it("should update the value", async () => {
    const { history } = await page.renderWithProviders(
      <PageFilterTextField
        title="Test"
        value={1}
        type="number"
        getLinkOptions={(event) => ({
          to: "/",
          search: { val: event.target.valueAsNumber },
        })}
      />,
    );
    const field = page.getByRole("spinbutton");
    await expect.element(field).toHaveValue(1);
    await field.fill("2");
    await expect.element(field).toHaveValue(2);
    await expect.poll(() => history.location.search).toBe("?val=2");
  });
});
