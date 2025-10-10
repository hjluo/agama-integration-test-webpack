import { it, page } from "../lib/helpers";
import { SidebarPage } from "../pages/sidebar_page";
import { SelectDeviceToInstallPage } from "../pages/select_device_to_install_page";
import { StoragePage } from "../pages/storage_page";

export function changeDeviceToInstall() {
  it("should change device to install for warning test", async function () {
    const storage = new StoragePage(page);
    const selectDevice = new SelectDeviceToInstallPage(page);
    const sidebar = new SidebarPage(page);

    await sidebar.goToStorage();
    await storage.changeDevice();
    await storage.selectAnotherDisk();
    await selectDevice.selectDevice("vdb");
    await storage.verifySpaceAllocationFailed();
  });

  it("should change device back to install", async function () {
    const storage = new StoragePage(page);
    const selectDevice = new SelectDeviceToInstallPage(page);
    const sidebar = new SidebarPage(page);

    await sidebar.goToStorage();
    await storage.changeDevice();
    await storage.selectAnotherDisk();
    await selectDevice.selectDevice("vda");
  });
}
