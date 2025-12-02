import { type Page } from "puppeteer-core";

export class StorageOutOfSyncAlertPage {
  private readonly page: Page;

  readonly configurationOutOfSyncWarningAlert = () =>
    this.page.locator("::-p-text(Configuration out of sync)");

  private readonly reloadNowButton = () => this.page.locator("::-p-text(Reload now)");

  constructor(page: Page) {
    this.page = page;
  }

  async reloadNow() {
    console.log("wait 30000 for Selector Reload");
    await this.page.waitForSelector("::-p-aria(Reload now)", { timeout: 30000 });
    console.log("Button Reload now is visible");
    await this.reloadNowButton().click();
    console.log("888 clicked Reload now button");
  }
}
