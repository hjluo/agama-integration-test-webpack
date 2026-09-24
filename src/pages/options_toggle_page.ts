import { type Page } from "puppeteer-core";

export class OptionsTogglePage {
  protected readonly page: Page;

  private readonly moreOptionsButton = () =>
    this.page.locator('::-p-aria(More options[role="button"])');

  private readonly optionsToggle = () => this.page.locator("::-p-aria(Options toggle)");
  private readonly downloadLogsMenuItem = () => this.page.locator("::-p-aria(Download logs)");
  private readonly showConfigurationMenuItem = () =>
    this.page.locator("::-p-aria(Show configuration)");

  public readonly successAlertHeading = () =>
    this.page.locator(".pf-v6-c-alert.pf-m-success h4::-p-text(Installation logs download)");

  private readonly dismissAlertSelector = "button[aria-label^='Close Success alert']";

  constructor(page: Page) {
    this.page = page;
  }

  async downloadLogs() {
    const toggle = await Promise.any([
      this.moreOptionsButton().waitHandle(),
      this.optionsToggle().waitHandle(),
    ]);
    await toggle.click();
    await this.downloadLogsMenuItem().click();
  }

  async showConfiguration() {
    const toggle = await Promise.any([
      this.moreOptionsButton().waitHandle(),
      this.optionsToggle().waitHandle(),
    ]);
    await toggle.click();
    await this.showConfigurationMenuItem().click();
  }

  public async waitForSuccessAlertToDisappear() {
    await this.page.waitForSelector(this.dismissAlertSelector, { hidden: true });
  }
}
