import { it, page } from "../lib/helpers";
import { SidebarPage } from "../pages/sidebar_page";
import { ConfigureLvmVolumeGroupPage } from "../pages/configure_lvm_volume_group_page";
import { StoragePage } from "../pages/storage_page";

export function changeInstallationDeviceToLvm() {
  it("should add LVM volume group", async function () {
    const storage = new StoragePage(page);
    const lvm = new ConfigureLvmVolumeGroupPage(page);
    const sidebar = new SidebarPage(page);

    await sidebar.goToStorage();
    await storage.selectMoreDevices();
    await storage.addLvmVolumeGroup();
    await lvm.accept();
  });
}
