import { it, page } from "../lib/helpers";
import { SidebarPage } from "../pages/sidebar_page";
import { StoragePage } from "../pages/storage_page";
import { SelectDeviceToInstallPage } from "../pages/select_device_to_install_page";

export function changeDeviceToInstall() {
  it("should change device to install for warning test", async function () {
    const storage = new StoragePage(page);
    const sidebar = new SidebarPage(page);
    const selectDevice = new SelectDeviceToInstallPage(page);

    await sidebar.goToStorage();
    await storage.changeDevice();
    await storage.selectAnotherDisk();
    console.log("111 Before click vdb");
    await selectDevice.selectDevice("/dev/vdb");
    console.log("222 After click vdb");
    await storage.verifySpaceAllocationFailed();
    console.log("333 Verified space allocation failed.");
  });

  it("should change device back to install", async function () {
    const storage = new StoragePage(page);
    const selectDevice = new SelectDeviceToInstallPage(page);
    const sidebar = new SidebarPage(page);

    await sidebar.goToStorage();
    await storage.changeDevice();
    await storage.selectAnotherDisk();
    console.log("44 select /dev/vda");
    await selectDevice.selectDevice("/dev/vda");
    console.log("55 select /dev/vda done.");
  });
}
