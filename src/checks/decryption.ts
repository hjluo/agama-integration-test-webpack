import { it, page, dumpPage } from "../lib/helpers";
import { EncryptedDevice } from "../pages/encrypted_device_page";
import { OverviewPage } from "../pages/overview_page";
import { StorageSettingsPage } from "../pages/storage_settings_page";

export function decryptDevice(password: string) {
  it("Should decrypt encrypted device", async function () {
    const overview = new OverviewPage(page);
    const storage = new StorageSettingsPage(page);
    const storageDecryption = new EncryptedDevice(page);

    await overview.goToStorage();
    await storage.moreStorageOptions();
    console.log("click rescanDevices menu..");
    await storage.rescanDevices();
    console.log("clicked storage.rescanDevices");
    await dumpPage("555_rescanDevices");

    console.log("6666==>dump_before_Decryption");
    await dumpPage("666_dump_before_Decryption");
    await storageDecryption.waitForModal();
    console.log("we got it, the Encrypted device ...");
    await dumpPage("999_dump_after_waitForModal");
    await storageDecryption.decrypt(password, 3 * 60 * 1000);
    console.log("Decryption done ....");
    await dumpPage("777_dump_after_Decryption");
  });
}
