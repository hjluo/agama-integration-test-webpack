import { type Page } from "puppeteer-core";

export class SoftwareSelectionPage {
  private readonly page: Page;
  private readonly patternCheckboxNotChecked = (pattern: string) =>
    this.page.locator(`input[type=checkbox]:not(:checked)[aria-labelledby*=${pattern}-title]`);

  private readonly patternCheckboxChecked = (pattern: string) =>
    this.page.locator(`input[type=checkbox]:checked[aria-labelledby*=${pattern}-title]`);

  private readonly closeButton = () => this.page.locator("::-p-text(Close)");

  constructor(page: Page) {
    this.page = page;
  }

  async selectPattern(pattern: string) {
    console.log(`>>>Processing pattern: ${pattern}`);
    const checkbox = await this.patternCheckboxNotChecked(pattern).waitHandle();
    await checkbox.scrollIntoView();

    await this.patternCheckboxNotChecked(pattern).click();
    await this.page.waitForSelector(".agm-main-content-overlay", { hidden: true });
    await this.patternCheckboxChecked(pattern).wait();
    console.log(`====>Done for pattern: ${pattern}`);
  }

  async close() {
    console.log("now click close button");
    await this.closeButton().setTimeout(10000).wait();
    await this.closeButton().click();
    console.log("==888 clicked closeButton");
  }
}
