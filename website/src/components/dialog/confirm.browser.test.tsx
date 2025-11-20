import { beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { ConfirmDialog, confirm, confirmQueue } from "./confirm";

describe("ConfirmDialog", () => {
  beforeEach(() => {
    confirmQueue.flush();
  });
  it("should show the dialog", async () => {
    await page.render(<ConfirmDialog />);
    confirm({
      title: "Discard draft?",
      message: "This cannot be undone.",
      confirmLabel: "Discard",
    });

    await expect.element(page.getByText("Discard draft?")).toBeInTheDocument();
    await expect
      .element(page.getByText("This cannot be undone."))
      .toBeInTheDocument();

    await expect
      .element(page.getByRole("button", { name: "Cancel" }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: "Discard" }))
      .toBeInTheDocument();
  });
  it("should resolve the promise when confirmed", async () => {
    await page.render(<ConfirmDialog />);

    const promise = confirm({
      title: "Discard draft?",
      message: "This cannot be undone.",
      confirmLabel: "Discard",
      confirmProps: {
        value: "discard",
      },
    });

    await page.getByRole("button", { name: "Discard" }).click();

    await expect(promise).resolves.toBe("discard");
  });
  it("should reject the promise when cancelled", async () => {
    await page.render(<ConfirmDialog />);

    const promise = confirm({
      title: "Discard draft?",
      message: "This cannot be undone.",
      confirmLabel: "Discard",
      cancelProps: {
        value: "cancel",
      },
    });

    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(promise).rejects.toBe("cancel");
  });
});
