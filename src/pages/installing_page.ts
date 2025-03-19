import { type Page } from "puppeteer-core";

export class InstallingPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitInstallBegin() {
    await this.page.waitForSelector("svg.pf-v6-c-spinner.pf-m-xl");
  }

  async waitForInstalling() {
    await this.page.waitForSelector("svg.pf-v6-c-spinner.pf-m-xl", { hidden: true });
  }
}
