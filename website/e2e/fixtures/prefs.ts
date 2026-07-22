import type { Style, Theme, NpmSite, Ligature } from "#/shared/lib/prefs/constants";
import { styleLabels, themeLabels } from "#/shared/lib/prefs/constants";
import { BasePOM } from "#e2e/fixtures/base";

import { expect } from ".";

export class PrefsDialog extends BasePOM {
  openButton = this.page.getByRole("button", { name: "Preferences" });
  dialog = this.page.getByRole("dialog", { name: "Preferences" });
  styleOptions = this.dialog.getByRole("toolbar", { name: "Style" });
  themeOptions = this.dialog.getByRole("toolbar", { name: "Theme" });
  npmSiteOptions = this.dialog.getByRole("toolbar", { name: "NPM browser" });
  ligatureOptions = this.dialog.getByRole("toolbar", { name: "Code ligatures" });

  async openDialog() {
    await expect(async () => {
      try {
        await expect(this.dialog).toBeVisible({ timeout: 1000 });
      } catch {
        await this.openButton.click();
        await expect(this.dialog).toBeVisible({ timeout: 5000 });
      }
    }).toPass();
  }

  async closeDialog() {
    await this.page.mouse.click(0, 0);
    await expect(this.dialog).not.toBeVisible();
  }

  async getStyleOption(style: Style) {
    await expect(this.dialog).toBeVisible();
    const option = this.styleOptions.getByRole("button", { name: styleLabels[style].label });
    await expect(option).toBeVisible();
    return option;
  }

  async setStyleOption(style: Style) {
    await this.openDialog();
    const option = await this.getStyleOption(style);
    await option.click();
    await expect(option).toBePressed();
    await this.closeDialog();
  }

  async getThemeOption(theme: Theme) {
    await expect(this.dialog).toBeVisible();
    const option = this.themeOptions.getByRole("button", { name: themeLabels[theme].label });
    await expect(option).toBeVisible();
    return option;
  }

  async setThemeOption(theme: Theme) {
    await this.openDialog();
    const option = await this.getThemeOption(theme);
    await option.click();
    await expect(option).toBePressed();
    await this.closeDialog();
  }

  async getNpmSiteOption(npmSite: NpmSite) {
    await expect(this.dialog).toBeVisible();
    const option = this.npmSiteOptions.getByRole("button", { name: npmSite });
    await expect(option).toBeVisible();
    return option;
  }

  async setNpmSiteOption(npmSite: NpmSite) {
    await this.openDialog();
    const option = await this.getNpmSiteOption(npmSite);
    await option.click();
    await expect(option).toBePressed();
    await this.closeDialog();
  }

  async getLigatureOption(ligature: Ligature) {
    await expect(this.dialog).toBeVisible();
    const option = this.ligatureOptions.getByRole("button", {
      name: ligature === "true" ? "On" : "Off",
    });
    await expect(option).toBeVisible();
    return option;
  }

  async setLigatureOption(ligature: Ligature) {
    await this.openDialog();
    const option = await this.getLigatureOption(ligature);
    await option.click();
    await expect(option).toBePressed();
    await this.closeDialog();
  }
}
