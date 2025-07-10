import { type Page } from "puppeteer-core";

export class SoftwareSelectionPage {
  private readonly page: Page;
  private readonly patternCheckboxNotChecked = (pattern: string) =>
    this.page.locator(`input[type=checkbox][data-pattern-name=${pattern}]:not(:checked)`);

  private readonly patternCheckboxChecked = (pattern: string) =>
    this.page.locator(`input[type=checkbox][data-pattern-name=${pattern}]:checked`);

  private readonly closeButton = () => this.page.locator("::-p-text(Close)");

  constructor(page: Page) {
    this.page = page;
  }

  async selectPattern(pattern: string) {
    await this.patternCheckboxNotChecked(pattern).click();
    await this.patternCheckboxChecked(pattern).wait();
  }

  async close() {
    await this.closeButton().click();
  }
}
