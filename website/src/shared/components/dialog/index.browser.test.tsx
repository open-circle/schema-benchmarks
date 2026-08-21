import { useState } from "react";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";

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
});
