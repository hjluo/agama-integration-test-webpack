import assert from "node:assert/strict";
import { it, page, dumpPage } from "../lib/helpers";
import { LoginAsRootPage } from "../pages/login_as_root_page";

export function logIn(password: string) {
  it("should have Agama page title", async function () {
    const logDir = "/run/agama/scripts";
    console.log("before dumpPage Agama_Page");
    await dumpPage(logDir, "Agama_Page");
    console.log("before assert.deepEqual");
    assert.deepEqual(await page.title(), "Agama");
    console.log("after assert.deepEqual");
  });

  it("should allow logging in", async function () {
    const loginAsRoot = new LoginAsRootPage(page);

    await loginAsRoot.fillPassword(password);
    await loginAsRoot.logIn();
  });
}
