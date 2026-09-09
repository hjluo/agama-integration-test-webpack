import { type Page } from "puppeteer-core";
import { dumpPage } from "../lib/helpers";

export class DasdPage {
  private readonly page: Page;

  private readonly selectRow = (index) =>
    this.page.locator(`::-p-aria(Select row ${index}[role=\\"checkbox\\"])`);

  private readonly actionsForDisk = () =>
    this.page.locator("xpath/descendant-or-self::button[starts-with(@aria-label, 'Actions for')]");

  private readonly activateDisk = () =>
    this.page
      .locator('button[role="menuitem"]')
      .filter((item) => item.getAttribute("tabindex") === "0");

  private readonly formatDiskButton = () => this.page.locator("::-p-aria(Format[role='button'])");
  // private readonly formatDiskButton = () => this.page.locator('::-p-aria(button[name="Format"])');

  private readonly formatNowDiskButton = () => this.page.locator("::-p-text(Format now)");

  constructor(page: Page) {
    this.page = page;
  }

  async selectDevice() {
    await this.actionsForDisk().click();
  }

  async activateDevice() {
    await this.activateDisk().click();
  }

  async selectDeviceToFormat() {
    await this.selectRow(0).click();
    console.log("dasd format start...");
    await this.formatDiskButton().click();
    const logDir = "/run/agama/scripts";
    await dumpPage(logDir, "dump_FormatButton");
  }

  async formatNowDevice() {
    console.log("dasd format Now start...");
    await this.formatNowDiskButton().click();
    const logDir = "/run/agama/scripts";
    await dumpPage(logDir, "dump_formatNow");
  }
}
