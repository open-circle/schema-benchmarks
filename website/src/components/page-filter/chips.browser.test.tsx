import { unsafeEntries, unsafeFromEntries } from "@schema-benchmarks/utils";
import { it } from "@test/browser/fixtures";
import { describe, expect } from "vitest";
import { page } from "vitest/browser";
import { PageFilterChips } from "./chips";

const options = ["foo", "bar", "baz"] as const;
const labels: Record<
  (typeof options)[number],
  { label: string; icon: string }
> = {
  foo: { label: "Foo", icon: "home" },
  bar: { label: "Bar", icon: "home" },
  baz: { label: "Baz", icon: "home" },
};
const getLinkOptions = (opt: (typeof options)[number]) => ({
  to: `/${opt}`,
});

const locators = unsafeFromEntries(
  unsafeEntries(labels).map(([option, { label }]) => [
    option,
    page.getByRole("link", { name: label }),
  ]),
);

describe("PageFilterChips", () => {
  it("should render options", async () => {
    await page.renderWithProviders(
      <PageFilterChips
        title="Test"
        options={options}
        labels={labels}
        getLinkOptions={getLinkOptions}
      />,
    );
    for (const option of options) {
      await expect.element(locators[option]).toBeInTheDocument();
    }
  });
  it("should switch between options", async () => {
    const { history } = await page.renderWithProviders(
      <PageFilterChips
        title="Test"
        options={options}
        labels={labels}
        getLinkOptions={getLinkOptions}
      />,
      {
        historyOpts: {
          initialEntries: ["/foo"],
        },
      },
    );
    await expect.element(locators.foo).toBeCurrent("page");
    expect(history.location.pathname).toBe("/foo");
    await locators.bar.click();
    await expect.element(locators.bar).toBeCurrent("page");
    expect(history.location.pathname).toBe("/bar");
    await locators.baz.click();
    await expect.element(locators.baz).toBeCurrent("page");
    expect(history.location.pathname).toBe("/baz");
  });
});
