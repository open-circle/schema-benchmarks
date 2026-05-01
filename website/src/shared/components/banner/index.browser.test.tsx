import { beforeEach, describe, expect } from "vite-plus/test";
import { page } from "vite-plus/test/browser";

import { it } from "#test/browser/fixtures";

import { Banner } from ".";
import { Button } from "../button";
import { bannerStore } from "./queue";

describe("Banner", () => {
  beforeEach(() => {
    bannerStore.setState(() => []);
  });
  it("should show the banner", async () => {
    await page.render(<Banner />);

    bannerStore.actions.open({
      children: "Hello World",
    });

    await expect.element(page.getByText("Hello World")).toBeInTheDocument();
  });
  it("should close the banner", async () => {
    await page.render(<Banner />);

    bannerStore.actions.open({
      children: "Hello World",
      actions: <Button onClick={() => bannerStore.actions.close()}>Close</Button>,
    });

    await expect.element(page.getByText("Hello World")).toBeInTheDocument();

    await page.getByRole("button", { name: "Close" }).click();

    await expect.element(page.getByText("Hello World")).not.toBeInTheDocument();
  });
});
