import { it, page, waitUntilOverlaySettled, dumpPage } from "../lib/helpers";
import { StorageSettingsPage } from "../pages/storage_settings_page";
import { DasdPage } from "../pages/dasd_page";
import { OverviewPage } from "../pages/overview_page";
import { HeaderPage } from "../pages/header_page";

export function prepareDasdStorage() {
  it(
    "should prepare DASD storage",
    async function () {
      const storage = new StorageSettingsPage(page);
      const dasd = new DasdPage(page);
      const overview = new OverviewPage(page);
      const header = new HeaderPage(page);

      const logDir = "/run/agama/scripts";
      await overview.goToStorage();
      await storage.manageDasd();
      await dasd.selectDevice();
      await dumpPage(logDir, "dump_selectDevice");
      await waitUntilOverlaySettled(() => dasd.activateDevice());

      await dasd.selectDeviceToFormat();
      page.setDefaultTimeout(6 * 60 * 1000);
      console.log("1111");
      await waitUntilOverlaySettled(() => dasd.formatNowDevice());
      console.log("2222");
      await header.goToStorage();
      await dumpPage(logDir, "dump_gotoStorage");
      // await storage.waitForElement("::-p-text(Installation devices)", 60000);
      console.log("Now got to installation...");
      await header.goToInstallation();
      await dumpPage(logDir, "dump_goToInstallation");
    },
    7 * 60 * 1000,
  );
}
