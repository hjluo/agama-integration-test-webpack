import { type Page } from "puppeteer-core";

export class SelectDeviceToInstallPage {
  private readonly page: Page;

  private readonly deviceSelector = (name) => this.page.locator(`::-p-text(${name})`);

  private readonly confirmButton = () => this.page.locator("button::-p-text(Confirm)");

  private readonly deviceSelect = (name: string) =>
    this.page.locator(`::-p-aria(${name})[type=checkbox]`);

  private readonly deviceRadio = (deviceName: string) =>
    this.page.locator(`[role=row]:has-text("${deviceName}")[role=radio]`);

  constructor(page: Page) {
    this.page = page;
  }

  async selectDevice(name: string) {
    this.deviceRadio(name).click();
    this.confirmButton().click();
  }
}
