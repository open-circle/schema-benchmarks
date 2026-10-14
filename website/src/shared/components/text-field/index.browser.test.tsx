import { describe, expect } from "vite-plus/test";
import { page, userEvent } from "vite-plus/test/browser";

import { it } from "#test/browser/fixtures";

import { TextField } from ".";

describe("TextField", () => {
  it("associates help text with the input and preserves existing descriptions", async () => {
    await page.render(
      <>
        <span id="email-hint">Your work address.</span>
        <TextField
          aria-label="Email"
          aria-describedby="email-hint"
          helpText="Use your work email."
        />
      </>,
    );

    const field = page.getByRole("textbox", { name: "Email" });
    await expect
      .element(field)
      .toHaveAccessibleDescription("Your work address. Use your work email.");
  });

  it("derives the message id from the input id", async () => {
    await page.render(<TextField id="email" aria-label="Email" helpText="Use your work email." />);

    const field = page.getByRole("textbox", { name: "Email" });
    const message = page.getByText("Use your work email.");

    await expect.element(field).toHaveAttribute("id", "email");
    await expect.element(field).toHaveAttribute("aria-describedby", "email-message");
    await expect.element(message).toHaveAttribute("id", "email-message");
  });

  it("exposes error text and native invalid state accessibly", async () => {
    await page.render(
      <TextField aria-label="Email" type="email" errorMessage="Enter a valid email." />,
    );

    const field = page.getByRole("textbox", { name: "Email" });
    await expect.element(field).toHaveAccessibleDescription("Enter a valid email.");
    await expect.element(field).toHaveAttribute("aria-invalid", "true");
  });

  it("exposes native invalid state after the user interacts", async () => {
    await page.render(<TextField aria-label="Email" type="email" />);

    const field = page.getByRole("textbox", { name: "Email" });
    await expect.element(field).not.toHaveAttribute("aria-invalid", "true");

    await field.fill("not-an-email");
    await userEvent.tab();

    await expect.element(field).toHaveAttribute("aria-invalid", "true");
  });
});
