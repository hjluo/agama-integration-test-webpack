import { it, page } from "../lib/helpers";
import fs from "fs";
import path from "path";
import assert from "node:assert/strict";
import { OptionsTogglePage } from "../pages/options_toggle_page";
import { InstallationSettingsInJSONFormatPage } from "../pages/installation_settings_in_json_format_page";

export async function downloadConfiguration() {
  it("should download configuration file", async function () {
    const downloadFolder = "/root/Downloads";

    console.log("==>download configuration file");
    const optionsPage = new OptionsTogglePage(page);
    await optionsPage.showConfiguration();
    console.log("clicked showConfiguration in the toggle menu");

    const installationSettingPage = new InstallationSettingsInJSONFormatPage(page);
    await installationSettingPage.waitForContentToLoad();
    console.log("==>showConfiguration disppeared ");

    await installationSettingPage.downloadConfiguration();
    console.log("clicked downloadConfiguration");

    const configFiles = fs
      .readdirSync(downloadFolder)
      .filter((file) => file.startsWith("agama-config-") && file.endsWith(".json"));

    assert(configFiles.length > 0, "No Agama configuration JSON file found in download directory.");

    const exactFilePath = path.join(downloadFolder, configFiles[0]);
    const fileSize = fs.statSync(exactFilePath).size;
    console.log(`Downloaded configuration file verified: ${configFiles[0]} (${fileSize} bytes)`);
    assert(fileSize > 0, "Agama configuration file is empty.");

    await installationSettingPage.close();
    console.log("clicked Close button");
  });
}
