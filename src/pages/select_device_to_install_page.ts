import { type Page } from "puppeteer-core";
import { dumpPage } from "../lib/helpers";

export class SelectDeviceToInstallPage {
  private readonly page: Page;
  private readonly deviceRadio = (deviceName: string) =>
    this.page.locator(`xpath=//tr[contains(., "${deviceName}")]//input[@type="radio"]`);

  private readonly confirmButton = () => this.page.locator("button::-p-text(Confirm)");

  constructor(page: Page) {
    this.page = page;
  }

  async waitForDialog() {
    await this.page.waitForSelector("[role=dialog]", { visible: true });
  }

  async waitForGrid() {
    await this.page.waitForSelector("[role=grid]", { visible: true });
  }

  async getAllRows() {
    return await this.page.$$("[role=grid] tbody tr");
  }

  async getTableCell(rowIndex: number, colIndex: number): Promise<string | null> {
    // Get all data rows from tbody (excluding header)
    const rows = await this.page.$$("[role=grid] tbody tr");

    if (rowIndex >= rows.length || rowIndex < 0) {
      console.log(`Row index ${rowIndex} out of bounds (total rows: ${rows.length})`);
      return null;
    }

    // Get the specific row
    const row = rows[rowIndex];
    // Get all cells in that row
    const cells = await row.$$("td");

    if (colIndex >= cells.length || colIndex < 0) {
      console.log(`Column index ${colIndex} out of bounds (total columns: ${cells.length})`);
      return null;
    }

    // Get the specific cell
    const cell = cells[colIndex];
    const cellText = await cell.evaluate((el) => el.textContent?.trim());

    return cellText || null;
  }

  async selectDevice(name: string) {
    const logDir = "/run/agama/scripts";
    const deviceName = name.split("/").pop() || name;

    console.log("Waiting for dialog...");
    await this.waitForDialog();
    console.log("Waiting for grid...");
    await this.waitForGrid();

    console.log("===============print header=====================");
    const headers = await this.page.$$eval('[role="grid"] th', (elements) =>
      elements.map((el) => el.textContent.trim()),
    );
    console.log(headers);
    console.log("===============end header=====================");

    await dumpPage(logDir, `before_select_${deviceName}`);
    // Get all rows from tbody elements (not thead)
    const rows = await this.page.$$("[role=grid] tbody tr");
    console.log(`Found ${rows.length} data rows`);

    for (const row of rows) {
      const text = await row.evaluate((el) => el.textContent);
      const ariaLabel = await row.evaluate((el) => el.getAttribute("aria-label"));
      console.log("Row text:", text);
      console.log("Label text:", ariaLabel);
      console.log("---------------------------");
    }

    const cellValue0 = await this.getTableCell(0, 2);
    console.log("Cell (0,2) value:", cellValue0);
    const cellValue1 = await this.getTableCell(0, 3);
    console.log("Cell (0,3) value:", cellValue1);
    const cellValue2 = await this.getTableCell(0, 4);
    console.log("Cell (0,4) value:", cellValue2);
    const cellValue3 = await this.getTableCell(0, 5);
    console.log("Cell (0,5) value:", cellValue3);

    console.log("+++++++++++++++++++++++++++++++");
    console.log(`Looking for device: ${name}`);
    await this.deviceRadio(name).click();
    console.log(`got ${name}, taking screenshot`);
    await dumpPage(logDir, `after_select_${deviceName}`);

    console.log("Clicking confirm...");
    await this.confirmButton().click();
    console.log(`Done click radio button for ${deviceName} baby`);
  }
}
