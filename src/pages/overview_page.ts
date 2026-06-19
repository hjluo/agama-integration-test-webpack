import { type Page } from "puppeteer-core";

export class OverviewPage {
  protected readonly page: Page;
  private readonly systemLink = () => this.page.locator("a[href='#/system']");
  private readonly localizationLink = () => this.page.locator("a[href='#/l10n']");
  private readonly networkLink = () => this.page.locator("a[href='#/network']");
  private readonly storageLink = () => this.page.locator("a[href='#/storage']");
  private readonly softwareLink = () => this.page.locator("a[href='#/software']");
  private readonly usersLink = () => this.page.locator("a[href='#/users']");
  private readonly registrationLink = () => this.page.locator("a[href='#/registration']");

  readonly installButton = () => this.page.locator("button::-p-text(Install now)");

  private readonly overviewHeading = () =>
    this.page.locator('::-p-aria([name="System Information"][role="heading"])');

  constructor(page: Page) {
    this.page = page;
  }

  async ensureSystemInformationPresent(timeout: number = 30 * 1000) {
    await this.overviewHeading().setTimeout(timeout).wait();
  }

  async install() {
    await this.installButton().click();
  }

  async goToSystem() {
    await this.systemLink().click();
  }

  async goToLocalization() {
    await this.localizationLink().click();
  }

  async goToNetwork() {
    await this.networkLink().click();
  }

  async goToStorage() {
    await this.storageLink().click();
  }

  async goToSoftware() {
    await this.softwareLink().click();
  }

  async goToAuthentication() {
    await this.usersLink().click();
  }

  async goToRegistration() {
    await this.registrationLink().click();
  }
}
