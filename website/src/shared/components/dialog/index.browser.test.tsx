import { useState } from "react";
import { describe, expect } from "vite-plus/test";
import { page, userEvent } from "vite-plus/test/browser";

import { it } from "#test/browser/fixtures";

import { Dialog } from ".";

function DialogFixture() {
  const [open, setOpen] = useState(false);
  const [returnValue, setReturnValue] = useState("");

  return (
    <>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <output>{returnValue}</output>
      <Dialog
        open={open}
        onClose={(event) => {
          setReturnValue(event.currentTarget.returnValue);
          setOpen(false);
        }}
      >
        {({ close }) => <button onClick={() => close("confirmed")}>Confirm</button>}
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("opens and closes through its controlled open prop", async () => {
    await page.render(<DialogFixture />);
    const dialog = page.getByRole("dialog");

    await page.getByRole("button", { name: "Open dialog" }).click();
    await expect.element(dialog).toHaveAttribute("open");
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect.element(dialog).not.toHaveAttribute("open");
    await expect.element(page.getByRole("status")).toHaveTextContent("confirmed");
  });

  it("closes on Escape", async () => {
    await page.render(<DialogFixture />);
    const dialog = page.getByRole("dialog");

    await page.getByRole("button", { name: "Open dialog" }).click();
    await expect.element(dialog).toHaveAttribute("open");
    await userEvent.keyboard("[Escape]");
    await expect.element(dialog).not.toHaveAttribute("open");
  });

  it("runs descendant and dialog keydown handlers before stopping Escape", async () => {
    let descendantHandledEscape = false;
    let dialogHandledEscape = false;

    await page.render(
      <Dialog
        open
        onKeyDown={(event) => {
          if (event.key === "Escape") dialogHandledEscape = true;
        }}
      >
        {() => (
          <button
            onKeyDown={(event) => {
              if (event.key === "Escape") descendantHandledEscape = true;
            }}
          >
            Confirm
          </button>
        )}
      </Dialog>,
    );

    await page.getByRole("button", { name: "Confirm" }).click();
    await userEvent.keyboard("[Escape]");

    expect(descendantHandledEscape).toBe(true);
    expect(dialogHandledEscape).toBe(true);
  });

  it("closes on Escape before a window handler can prevent it", async ({ testSignal }) => {
    await page.render(<DialogFixture />);
    const dialog = page.getByRole("dialog");

    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") event.preventDefault();
      },
      { signal: testSignal },
    );

    await page.getByRole("button", { name: "Open dialog" }).click();
    await expect.element(dialog).toHaveAttribute("open");
    await userEvent.keyboard("[Escape]");
    await expect.element(dialog).not.toHaveAttribute("open");
  });
});
