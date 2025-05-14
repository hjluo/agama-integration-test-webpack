import { type Page } from "puppeteer-core";

export class CreateFirstUserPage {
  private readonly page: Page;
  private readonly fullNameInput = () => this.page.locator("input#userFullName");
  private readonly usernameInput = () => this.page.locator("input#userName");
  private readonly passwordInput = () => this.page.locator("input#password");
  private readonly passwordConfirmationInput = () =>
    this.page.locator("input#passwordConfirmation");

  private readonly acceptButton = () => this.page.locator("button[form='firstUserForm']");

  constructor(page: Page) {
    this.page = page;
  }

  async fillFullName(fullName: string) {
    await this.fullNameInput().fill(fullName);
  }

  async fillUserName(userName: string) {
    await this.usernameInput().fill(userName);
  }

  async fillPassword(password: string) {
    await this.passwordInput().click();
    await this.passwordInput().fill(password);
  }

  async fillPasswordConfirmation(password: string) {
    await this.passwordConfirmationInput().fill(password);
  }

  async accept() {
    await this.acceptButton().click();
  }

  async verifyPageHeading() {
    const heading = await this.page.locator("h2::-p-text(Create user)");
    await heading.wait();
    return heading;
  }

  // wait exclamation marks to disappear after registration and create
  // first usrer.
  async waitInstallExclamationToDisappear() {
    await this.page.waitForSelector("button.agm-install-button", { visible: true });
    try {
      // Check if the button has an exclamation mark
      const hasExclamationMark = await this.page.evaluate(() => {
        const button = document.querySelector("button.agm-install-button");
        return button && button.querySelector('svg[data-icon-name="error_fill"]') !== null;
      });

      if (hasExclamationMark) {
        console.log("Install button has exclamation mark. Waiting for it to disappear...");
        // Wait for the exclamation mark to disappear
        await this.page.waitForFunction(
          () => {
            const button = document.querySelector("button.agm-install-button");
            return button && !button.querySelector('svg[data-icon-name="error_fill"]');
          },
          { timeout: 30000 },
        ); // 30 second timeout
      } else {
        console.log("Install button is already ready for installation.");
      }
    } catch (error) {
      console.error("Error waiting for Install button to be ready:", error);
      throw error;
    }
    // Return the Install button for further actions
    return await this.page.$("button.agm-install-button");
  }
}
