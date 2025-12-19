import { it, page } from "../lib/helpers";
import { SidebarPage } from "../pages/sidebar_page";
import { StorageSettingsPage } from "../pages/storage_settings_page";

export function verifyStorageSettingDots() {
  it("should verify click more settings 3 dots", async function () {
    const sidebar = new SidebarPage(page);
    const storage = new StorageSettingsPage(page);

    await sidebar.goToStorage();
    await storage.selectOtherStorageOptions();
    await storage.resetToDefaults();
  });
}
