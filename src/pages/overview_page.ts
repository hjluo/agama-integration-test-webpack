import { type Page } from "puppeteer-core";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

export class OverviewPage {
  private readonly page: Page;
  private readonly installButton = () => this.page.locator("button::-p-text(Install)");
  private readonly mustBeRegisteredText = () => this.page.locator("::-p-text(must be registered)");

  constructor(page: Page) {
    this.page = page;
  }

  async waitWarningAlertToDisappear() {
    await this.mustBeRegisteredText().setVisibility("hidden").wait();
  }

  async install() {
    await this.installButton().click();
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

  async takeScreenshot() {
    const screenshotBuffer = await this.page.screenshot();
    this.ensureDirectoryExistence("/run/agama/scripts");
    const screenshotPath = resolve("/run/agama/scripts", "overview_page_screenshot.png");
    writeFileSync(screenshotPath, screenshotBuffer);
  }
}
