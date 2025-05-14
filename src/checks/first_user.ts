import { it, page, dumpPage } from "../lib/helpers";
import { CreateFirstUserPage } from "../pages/create_user_page";
import { UsersPage } from "../pages/users_page";
import { SidebarPage } from "../pages/sidebar_page";

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
    await createFirstUser.fillFullName("Bernhard M. Wiedemann");
    await dumpPage(logDir, "After_full_name");

    await createFirstUser.verifyPageHeading();
    await createFirstUser.fillUserName("bernhard");
    await dumpPage(logDir, "After_User_name");

    await createFirstUser.verifyPageHeading();
    await createFirstUser.fillPassword(password);
    await dumpPage(logDir, "After_password");

    await createFirstUser.verifyPageHeading();
    await createFirstUser.fillPasswordConfirmation(password);
    await dumpPage(logDir, "after_fillPasswordConfirmation");

    await createFirstUser.accept();

    await createFirstUser.waitInstallExclamationToDisappear();
    await dumpPage(logDir, "user_after_first_user_Accept");
  });
}
