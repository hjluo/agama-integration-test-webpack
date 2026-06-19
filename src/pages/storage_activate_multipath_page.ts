import { type Page } from "puppeteer-core";

export class StorageActivateMultipathPage {
  protected readonly page: Page;

  public readonly multipathText = () =>
    this.page.locator("::-p-text(The system seems to have multipath hardware)");

  private readonly yesButton = () =>
    this.page.locator('div[role="dialog"][aria-label="Question"] button::-p-text(Yes)');

  constructor(page: Page) {
    this.page = page;
  }

  async yes() {
    await this.yesButton().click();
  }
}
