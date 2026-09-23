import { it, page, waitOnFile } from "../lib/helpers";
import fs from "fs";
import path from "path";
import assert from "node:assert/strict";
import { OptionsTogglePage } from "../pages/options_toggle_page";

export async function downloadLogs() {
  it("should download logs", async function () {
    const downloadFolder = "/root/Downloads";

    const optionsPage = new OptionsTogglePage(page);
    await optionsPage.downloadLogs();
    await optionsPage.successAlertHeading().wait();

    const downloadedFiles = fs.readdirSync(downloadFolder);
    assert(downloadedFiles.length > 0, "No files found in the download directory.");

    const exactFilePath = path.join(downloadFolder, downloadedFiles[0]);
    const fileSize = fs.statSync(exactFilePath).size;
    assert(fileSize > 0, "Agama Logfile is empty.");
    console.log("wait DownloadSuccessAlert to disappear...");
    await optionsPage.waitForSuccessAlertToDisappear();
    console.log("DownloadSuccessAlert disappeared");
  });
}

export async function downloadLogsWithSidebar() {
  it("should download logs", async function () {
    const filePathWithSidebar = "/root/Downloads/agama-logs.tar.gz";

    await new OptionsTogglePage(page).downloadLogs();
    await waitOnFile(filePathWithSidebar);

    const fileSize = fs.statSync(filePathWithSidebar).size;
    assert(fileSize > 0, "Agama Logfile is empty.");
  });
}
