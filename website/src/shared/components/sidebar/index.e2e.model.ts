import { ComponentObjectModel } from "#e2e/fixtures/base";
import { expect } from "#e2e/fixtures/expect";

export class Sidebar extends ComponentObjectModel {
  mobileSidebar = this.page.getByRole("dialog", {
    name: "Site navigation",
    includeHidden: true,
  });
  desktopSidebar = this.page.getByRole("complementary", {
    name: "Site navigation",
    includeHidden: true,
  });

  sidebar = this.mobileSidebar.or(this.desktopSidebar);

  nav = this.sidebar.getByRole("navigation");

  menuButton = this.page.getByRole("button", { name: "Expand sidebar" });

  async open() {
    if (await this.menuButton.isVisible()) {
      await expect(this.mobileSidebar).toBeAttached();

      if ((await this.mobileSidebar.getAttribute("aria-hidden")) === "true") {
        await this.menuButton.click();
      }

      await expect(this.mobileSidebar).not.toHaveAttribute("aria-hidden", "true");
      await expect
        .poll(() =>
          this.mobileSidebar.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return rect.left >= 0 && rect.left < window.innerWidth;
          }),
        )
        .toBe(true);
      return;
    }

    await expect(this.sidebar).toBeVisible();
  }

  getLinkByName(name: string) {
    return this.nav.getByRole("link", { name });
  }
}
