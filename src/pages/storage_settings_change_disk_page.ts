import { type Page } from "puppeteer-core";

export class StorageSettingsChangeDiskPage {
  private readonly page: Page;
  private readonly changeToButton = () => this.page.locator("button::-p-text(Change to)");
  public readonly diskTableSelector: string;
  private readonly lvmTab = () => this.page.locator("::-p-aria(LVM)[role='tab']");

  constructor(page: Page) {
    this.page = page;

    this.diskTableSelector = 'div[aria-modal="true"] table[data-type="agama/expandable-selector"]';
  }

  async changeTo() {
    await this.changeToButton().click();
  }

  async selectLVMTab() {
    await this.lvmTab().click();
  }
}
