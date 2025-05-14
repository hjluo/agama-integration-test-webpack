import { it, page, dumpPage } from "../lib/helpers";
import { CreateFirstUserPage } from "../pages/create_user_page";
import { UsersPage } from "../pages/users_page";
import { SidebarPage } from "../pages/sidebar_page";

async function handlePossibleConfigurationMessage() {
  // Check if the configuration message appears
  try {
    const configMessageVisible = await page.evaluate(() => {
      return document.body.textContent.includes("Configuring the product, please wait");
    });

    if (configMessageVisible) {
      console.log("Configuration message detected, waiting for it to disappear...");
      // Wait for the message to disappear
      await page.waitForFunction(
        () => {
          return !document.body.textContent.includes("Configuring the product, please wait");
        },
        { timeout: 60000 },
      ); // 1 minute timeout
      console.log("Configuration message disappeared, continuing...");
    }
  } catch (error) {
    console.log("Error handling configuration message:", error);
  }
}

export function createFirstUser(password: string) {
  it("should create first user", async function () {
    const users = new UsersPage(page);
    const createFirstUser = new CreateFirstUserPage(page);
    const sidebar = new SidebarPage(page);
    const logDir = "/run/agama/scripts";

    await sidebar.waitOverviewVisible(50000);
    await sidebar.goToUsers();

    await users.defineAUserNow();

    await createFirstUser.verifyPageHeading();
    await dumpPage(logDir, "Create_first_user");
    await handlePossibleConfigurationMessage();
    await createFirstUser.fillFullName("Bernhard M. Wiedemann");
    await handlePossibleConfigurationMessage();
    await dumpPage(logDir, "After_full_name");

    await createFirstUser.verifyPageHeading();
    await createFirstUser.fillUserName("bernhard");
    await handlePossibleConfigurationMessage();
    await dumpPage(logDir, "After_User_name");

    await createFirstUser.verifyPageHeading();
    await createFirstUser.fillPassword(password);
    await handlePossibleConfigurationMessage();
    await dumpPage(logDir, "After_password");

    await createFirstUser.verifyPageHeading();
    await createFirstUser.fillPasswordConfirmation(password);
    await handlePossibleConfigurationMessage();
    await dumpPage(logDir, "after_fillPasswordConfirmation");

    await createFirstUser.accept();
    await handlePossibleConfigurationMessage();

    await createFirstUser.waitInstallExclamationToDisappear();
    await dumpPage(logDir, "user_after_first_user_Accept");
  });
}
