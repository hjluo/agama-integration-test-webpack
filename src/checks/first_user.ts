import { it, page, sleep } from "../lib/helpers";
import { CreateFirstUserPage } from "../pages/create_user_page";
import { UsersPage } from "../pages/users_page";
import { SidebarPage } from "../pages/sidebar_page";

export function createFirstUser(password: string) {
  it("should create first user", async function () {
    const users = new UsersPage(page);
    const createFirstUser = new CreateFirstUserPage(page);
    const sidebar = new SidebarPage(page);

    // On slow Arches, after registration there will be Configuring
    // product page still running.
    await sidebar.waitOverviewVisible(50000);
    await sidebar.goToUsers();

    await users.defineAUserNow();
    await createFirstUser.fillFullName("Bernhard M. Wiedemann");
    await createFirstUser.fillUserName("bernhard");
    await createFirstUser.fillPassword(password);
    await createFirstUser.fillPasswordConfirmation(password);
    await createFirstUser.accept();
  });
}
