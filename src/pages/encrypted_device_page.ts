import { dumpPage } from "../lib/helpers";
import { type Page } from "puppeteer-core";

export class EncryptedDevice {
  private readonly page: Page;
  private readonly encryptionPasswordInput = () => this.page.locator("input#luks-password");
  private readonly decryptButton = () => this.page.locator("button::-p-text(Decrypt)");

  constructor(page: Page) {
    this.page = page;
  }

  async waitForModal(timeout: number = 30 * 1000) {
    await this.encryptionPasswordInput().setTimeout(timeout).wait();
  }

  async decrypt(password: string, timeout: number) {
    console.log("==>take screenshot for decrypt");
    await this.encryptionPasswordInput().setTimeout(timeout).fill(password);

    await dumpPage("555_after_issued_password");

    await this.decryptButton().click();
    await dumpPage("55566_after_click");
    console.log("===> decrypt done<====");
  }
}
