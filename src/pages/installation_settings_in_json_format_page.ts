import { type Page } from "puppeteer-core";

export class InstallationSettingsInJSONFormatPage {
  protected readonly page: Page;

  private readonly modalSpinnerSelector = ".pf-v6-c-modal-box .pf-v6-c-spinner";
  private readonly downloadConfigurationButton = () =>
    this.page.locator('::-p-aria(button[name="Download configuration"])');

  private readonly closeButton = () => this.page.locator('::-p-aria(button[name="Close"])');

  constructor(page: Page) {
    this.page = page;
  }

  public async waitForContentToLoad() {
    console.log("in waitForContentToLoad");
    await this.page.waitForSelector(this.modalSpinnerSelector, { hidden: true });
  }

  async downloadConfiguration() {
    await this.downloadConfigurationButton().click();
  }

  async close() {
    await this.closeButton().click();
  }
}
