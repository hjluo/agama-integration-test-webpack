import { type Page } from "puppeteer-core";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

export class SoftwareSelectionPage {
  private readonly page: Page;
  private readonly patternCheckbox = (pattern: string) =>
    this.page.locator(`input[type=checkbox][rowid=${pattern}-title]`);

  private readonly closeButton = () => this.page.locator("::-p-text(Close)");

  constructor(page: Page) {
    this.page = page;
  }

  // SELinux was auto selected, click will unselect it.
  async clickCheckboxIfNotChecked(locator: string) {
    const checkbox = await this.page.$(locator);
    const isChecked = await checkbox.evaluate((checkbox) => (checkbox as HTMLInputElement).checked);
    if (!isChecked) {
      await checkbox.click();
    } else {
      console.log("This pattern was auto selected.");
    }
  }

  async clickCheckboxIfNotChecked_old(locator: string) {
    const isChecked = await this.page.evaluate((checkboxSelector) => {
      const checkbox = document.querySelector(checkboxSelector) as HTMLInputElement;
      return checkbox.checked;
    }, locator);
    if (!isChecked) {
      await this.page.click(locator);
    } else {
      console.log("This pattern was auto selected.");
    }
  }

  async selectPattern(pattern: string) {
    const checkboxSelector = `input[type=checkbox][rowid=${pattern}-title]`;
    const checkbox = await this.patternCheckbox(pattern).waitHandle();
    await checkbox.scrollIntoView();
    this.clickCheckboxIfNotChecked(checkboxSelector);

    // Wait for the checkbox to be checked
    await this.page.waitForSelector(`${checkboxSelector}:checked`);
  }

  async ensureDirectoryExistence(dirPath: string) {
    const resolvedPath = resolve(dirPath);
    if (!existsSync(resolvedPath)) {
      mkdirSync(resolvedPath, { recursive: true });
      console.log(`Directory created: ${resolvedPath}`);
    } else {
      console.log(`Directory already exists: ${resolvedPath}`);
    }
  }

  async takeScreenshot(pattern: string) {
    const screenshotBuffer = await this.page.screenshot();
    this.ensureDirectoryExistence("/run/agama/scripts");
    const screenshotPath = resolve("/run/agama/scripts", `${pattern}_screenshot.png`);
    writeFileSync(screenshotPath, screenshotBuffer);
    console.log(`take screenshot for pattern: ${pattern}`);
  }

  async takeFullScreenshot() {
    const screenshotBuffer = await this.page.screenshot({ fullPage: true });
    const screenshotPath = resolve("/run/agama/scripts", "full_screenshot.png");
    writeFileSync(screenshotPath, screenshotBuffer);
  }

  async close() {
    await this.closeButton().click();
  }
}
