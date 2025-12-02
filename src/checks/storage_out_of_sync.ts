import { it, page, getTextContent } from "../lib/helpers";
import assert from "node:assert/strict";
import util from "util";
import { exec } from "child_process";
import { StorageOutOfSyncAlertPage } from "../pages/storage_out_of_sync_alert_page";

// `echo '${config}' | jq '.storage.drives[0].partitions[0].filesystem.type.btrfs.snapshots = false'`,
async function triggerStorageOutOfSync() {
  const execPromise = util.promisify(exec);
  try {
    const { stdout: config } = await execPromise("agama config show");
    const { stdout: modifiedConfig } = await execPromise(
      `echo '${config}' | jq '.storage.drives[0].partitions[0].filesystem.label = "test-label"'`,
    );
    await execPromise(`echo '${modifiedConfig}' | agama config load`);
    console.log("Successfully triggered out of sync alert");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export function verifyStorageOutOfSync() {
  it("should verify storage out of sync popup", async function () {
    const storageOutOfSyncAlertPage = new StorageOutOfSyncAlertPage(page);
    const execPromise = util.promisify(exec);

    const before = await execPromise("agama config show");
    // await execPromise("agama probe");
    await triggerStorageOutOfSync();
    const after = await execPromise("agama config show");
    console.log("Storage changed:", before !== after);

    assert.deepEqual(
      await getTextContent(storageOutOfSyncAlertPage.configurationOutOfSyncWarningAlert()),
      "Configuration out of sync",
    );
    console.log("verified Configuration out of sync Text, baby");
    await storageOutOfSyncAlertPage.reloadNow();
    console.log("999 Verify StorageOutOfSync done, baby");
  });
}
