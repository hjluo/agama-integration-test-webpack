import { type Page } from "puppeteer-core";

export class SoftwareSelectionPage {
  private readonly page: Page;
  private readonly patternCheckbox = (pattern: string) =>
    this.page.locator(`input[type=checkbox][rowid=${pattern}-title]`);

  private readonly closeButton = () => this.page.locator("::-p-text(Close)");

  constructor(page: Page) {
    this.page = page;
  }

  // SELinux was auto selected, click will unselect it.
  async clickIfNotChecked(selector: string, pattern: string) {
    const checkbox = await this.page.$(selector);
    const isChecked = await checkbox.evaluate((cb: HTMLInputElement) => cb.checked);
    if (!isChecked) {
      await checkbox.click();
    } else {
      console.log(`Pattern ${pattern} was auto selected`);
    }
  }

  async selectPattern(pattern: string) {
    const checkbox = await this.patternCheckbox(pattern).waitHandle();
    await checkbox.scrollIntoView();

    // const checkbox = await this.patternCheckbox(pattern).waitHandle();
    // const isChecked = await checkbox.evaluate((cb: HTMLInputElement) => cb.checked);
    const isChecked = await checkbox.evaluate((cb: HTMLInputElement) => cb.checked);
    console.log(`Checkbox for pattern ${pattern} is ${isChecked ? "checked" : "not checked"}`);
    if (isChecked) {
      console.log(`Patter ${pattern} is auto selected ==>`);
      return;
    }

    console.log(`Adding pattern ${pattern} >>>`);
    await this.patternCheckbox(pattern)
      .filter((input) => !input.checked)
      .click();
    // ensure selection due to puppeteer might go too fast
    await this.patternCheckbox(pattern)
      .filter((input) => input.checked)
      .wait();

    console.log(`Added pattern ${pattern} <<<`);
  }

  async close() {
    await this.closeButton().click();
  }
}
