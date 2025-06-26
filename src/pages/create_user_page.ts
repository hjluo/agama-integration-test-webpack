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
    console.log("fillFullName passed");
  }

  async fillUserName(userName: string) {
    await this.usernameInput().fill(userName);
    console.log("fillUserName passed");
  }

  async fillPassword(password: string) {
    await this.passwordInput().fill(password);
    console.log("fillPassword passed");
  }

  async fillPasswordConfirmation(password: string) {
    await this.passwordConfirmationInput().fill(password);
    console.log("fillPasswordConfirmation passed");
  }

  async accept() {
    await this.acceptButton().click();
  }
}
