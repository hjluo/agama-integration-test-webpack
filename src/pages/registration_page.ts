import { type Page } from "puppeteer-core";
import { type GConstructor } from "../lib/helpers";

class RegistrationBasePage {
  protected readonly page: Page;
  protected readonly codeInput = () => this.page.locator("::-p-aria(Registration code)");
  protected readonly registerButton = () => this.page.locator("::-p-aria(Register)");
  protected readonly extensionRegisteredText = () =>
    this.page.locator("::-p-text(The extension has been registered)");

  protected readonly registrationOptionCheckbox = () =>
    this.page.locator("::-p-aria(Provide registration code)");

  constructor(page: Page) {
    this.page = page;
  }

  async provideRegistrationCode() {
    await this.registrationOptionCheckbox().click();
    console.log("clicked registrationOptionCheckbox");
  }

  async fillCode(code: string) {
    console.log(`start code=${code}`);
    await this.codeInput().wait();
    console.log("waited Registration code");
    // await this.codeInput().fill(code);
    await this.page.locator("aria/Registration code").fill(code);
    console.log("this.codeInput filled code");
  }

  async register() {
    await this.registerButton().click();
  }
}

function ProductRegistrable<TBase extends GConstructor<RegistrationBasePage>>(Base: TBase) {
  return class extends Base {};
}

function ExtensionHaRegistrable<TBase extends GConstructor<RegistrationBasePage>>(Base: TBase) {
  return class extends Base {
    extensionRegisteredText = () =>
      this.page.locator("::-p-text(The extension has been registered)");

    async verifyExtensionRegistration() {
      await this.extensionRegisteredText().wait();
    }
  };
}

export class ProductRegistrationPage extends ProductRegistrable(RegistrationBasePage) {}
export class ExtensionHaRegistrationPage extends ExtensionHaRegistrable(RegistrationBasePage) {}
