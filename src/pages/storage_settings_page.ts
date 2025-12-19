import { type Page } from "puppeteer-core";
import { sleep, dumpPage } from "../lib/helpers";

export class StorageSettingsPage {
  private readonly page: Page;
  private readonly selectMoreDevicesButton = () => this.page.locator("::-p-text(More devices)");

  private readonly encryptionTab = () => this.page.locator("::-p-text(Encryption)");
  private readonly changeEncryptionLink = () =>
    this.page.locator('::-p-aria([name="Change"][role="link"])');

  public readonly encryptionIsEnabledText = () =>
    this.page.locator("::-p-text(Encryption is enabled)");

  public readonly encryptionIsDisabledText = () =>
    this.page.locator("::-p-text(Encryption is disabled)");

  private readonly manageDasdLink = () => this.page.locator("::-p-text(Manage DASD devices)");

  private readonly ActivateZfcpLink = () => this.page.locator("::-p-text(Activate zFCP disks)");
  private readonly moreStorageSettingsButton = () =>
    this.page.locator("::-p-aria(More storage options)");

  private readonly otherStorageOptionButton = () =>
    this.page.locator("button:has(svg.agm-three-dots-icon):not([aria-label])");

  private readonly resetToDefaultsButton = () => this.page.locator("::-p-text(Reset to defaults)");
  private readonly expandPartitionsButton = () =>
    this.page.locator("::-p-text(New partitions will be created)");

  private readonly optionForRoot = () => this.page.locator("::-p-aria(Options for partition /)");
  private readonly editRootPartitionMenu = () =>
    this.page.locator("::-p-aria(Edit /[role='menuitem'])");

  constructor(page: Page) {
    this.page = page;
  }

  async selectMoreDevices() {
    await this.selectMoreDevicesButton().click();
  }

  async selectEncryption() {
    await this.encryptionTab().click();
  }

  async changeEncryption() {
    await this.changeEncryptionLink().click();
  }

  async manageDasd() {
    await this.manageDasdLink().click();
  }

  async activateZfcp() {
    await this.ActivateZfcpLink().click();
  }

  async waitForElement(element, timeout) {
    await this.page.locator(element).setTimeout(timeout).wait();
  }

  async editRootPartition() {
    await this.expandPartitionsButton().click();
    await this.optionForRoot().click();
    await this.editRootPartitionMenu().click();
  }

  async selectMoreStorageOptions() {
    console.log("before clicked this.moreStorageSettingsButton");
    await this.moreStorageSettingsButton().click();
    console.log("after clicked this.moreStorageSettingsButton");
    const logDir = "/run/agama/scripts";
    await dumpPage(logDir, "after_moreStorageSettingsButton");
  }

  async selectOtherStorageOptions() {
    await sleep(2000);
    const logDir = "/run/agama/scripts";

    const 3dotButtons = await this.page.$$eval(".agm-three-dots-icon", (els) =>
      els.map((el) => el.closest("button").getAttribute("aria-label")),
    );
    console.log("Found 3-dot buttons:", 3dotButtons);

    console.log("before clicked this.otherStorageOptionButton");
    await dumpPage(logDir, "before_click_setting_3_dots");
    await this.otherStorageOptionButton().click();
    await dumpPage(logDir, "after_click_setting_3_dots");
    console.log("after clicked this.otherStorageOptionButton");
  }

  async resetToDefaults() {
    console.log("before clicked this.resetToDefaultsMenu");
    await this.resetToDefaultsButton().click();
    console.log("after clicked this.resetToDefaultsMenu");
  }
}
