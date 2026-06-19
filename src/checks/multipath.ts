import assert from "node:assert/strict";
import { it, page, getTextContent } from "../lib/helpers";
import { StorageActivateMultipathPage } from "../pages/storage_activate_multipath_page";

export function verifyActivateMultipath() {
  it("should allow active multipath", async function () {
    const multipath = new StorageActivateMultipathPage(page);
    const elementText = await getTextContent(multipath.multipathText());
    assert.deepEqual(
      elementText,
      "The system seems to have multipath hardware. Do you want to activate multipath?",
    );

    await multipath.yes();
  });
}
