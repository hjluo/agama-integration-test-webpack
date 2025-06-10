import { type Page } from "puppeteer-core";

export class SoftwareSelectionPage {
  private readonly page: Page;
  private readonly patternCheckbox = (pattern: string) =>
    this.page.locator(`input[type=checkbox][aria-labelledby*=${pattern}-title]`);

  private readonly closeButton = () => this.page.locator("::-p-text(Close)");

  constructor(page: Page) {
    this.page = page;
  }

  async checkIfAutoSelected(page, patternName) {
    //  Look for the blue "auto selected" label within the pattern's DataListItem
    const patternItemSelector = `[aria-labelledby="${patternName}-title"]`;
    const patternItem = await page.$(patternItemSelector);

    if (patternItem) {
      const autoLabel = await patternItem.$('[class*="pf-v6-c-label"][class*="pf-m-blue"]');
      if (autoLabel) {
        const labelText = await page.evaluate((el) => el.textContent, autoLabel);
        return labelText.includes("auto selected");
      }
    }
    console.log(`***pattern ${patternName} was not auto-selected`);
    return false;
  }

  async checkIfAutoSelected1(page, patternName) {
    // Implementation to check if pattern is auto-selected
    // This should check the pattern's selectedBy status
    const selector = `[data-pattern="${patternName}"][data-selected-by="auto"]`;
    return (await page.$(selector)) !== null;
  }

  async getCheckboxState(checkboxHandle) {
    return await checkboxHandle.evaluate((cb) => ({
      isChecked: cb.checked,
      isDisabled: cb.disabled,
      isVisible: cb.offsetParent !== null,
      tagName: cb.tagName,
      type: cb.type,
      ariaLabel: cb.getAttribute("aria-label"),
      className: cb.className,
    }));
  }

  async processPattern_Final(patternName) {
    console.log(`>>>Processing pattern: ${patternName}`);

    // Wait for the pattern to be visible
    await this.page.waitForSelector(`#${patternName}-title`, { timeout: 5000 });

    // Check if pattern is auto-selected first (before any DOM manipulation)
    const isAutoSelected = await this.checkIfAutoSelected(this.page, patternName);
    if (isAutoSelected) {
      console.log(`Pattern ${patternName} is auto-selected, skipping...`);
      return { patternName, status: "skipped", reason: "auto-selected" };
    }

    // Get the checkbox handle using your proven patternCheckbox method
    const checkboxHandle = await this.patternCheckbox(patternName).waitHandle();

    // Scroll into view using the handle
    await checkboxHandle.scrollIntoView();

    // Define the checkbox selector early
    const checkboxSelector = `[aria-labelledby*=${patternName}-title]`;

    // Check current state
    const isCurrentlyChecked = await checkboxHandle.evaluate((cb) => cb.checked);
    if (isCurrentlyChecked) {
      console.log(`Pattern ${patternName} is already selected`);
      return { patternName, status: "already-selected" };
    }

    // Click the checkbox
    await checkboxHandle.click();
    console.log(`--%Clicked checkbox for pattern: ${patternName}`);

    // Wait for checkbox to be checked
    await this.page.waitForFunction(
      (selector) => {
        const cb: HTMLInputElement = document.querySelector(selector);
        return cb && cb.checked;
      },
      { timeout: 10000 },
      checkboxSelector,
    );

    console.log(`<<<Pattern ${patternName} successfully selected`);
    return { patternName, status: "selected" };
  }

  async processPattern_inProgress(patternName) {
    console.log(`Processing pattern: ${patternName}`);

    // Wait for the pattern to be visible
    await this.page.waitForSelector(`#${patternName}-title`, { timeout: 5000 });

    // Get the checkbox handle and scroll it into view
    const checkboxHandle = await this.patternCheckbox(patternName).waitHandle();
    await checkboxHandle.scrollIntoView();

    // Define the checkbox selector early
    const checkboxSelector = `[aria-labelledby*=${patternName}-title]`;

    // Wait a moment for scroll animation to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if pattern is auto-selected
    const isAutoSelected = await this.checkIfAutoSelected(this.page, patternName);
    if (isAutoSelected) {
      console.log(`Pattern ${patternName} is auto-selected, skipping...`);
      return { patternName, status: "skipped", reason: "auto-selected" };
    }

    // Find the actual checkbox input
    const checkbox = await this.page.$(
      `input[type=checkbox][aria-labelledby*=${patternName}-title]`,
    );
    if (!checkbox) {
      throw new Error(`Could not find checkbox for pattern: ${patternName}`);
    }

    // Check current state
    const isCurrentlyChecked = await checkbox.evaluate((cb: HTMLInputElement) => cb.checked);
    if (isCurrentlyChecked) {
      console.log(`Pattern ${patternName} is already selected`);
      return { patternName, status: "already-selected" };
    }

    // Click the checkbox
    await checkbox.click();
    console.log(`-->Clicked checkbox for pattern: ${patternName}`);

    // Wait for checkbox to be checked
    await this.page.waitForFunction(
      (selector) => {
        const cb: HTMLInputElement = document.querySelector(selector);
        return cb && cb.checked;
      },
      { timeout: 10000 },
      checkboxSelector,
    );

    console.log(`Pattern ${patternName} successfully selected`);
    return { patternName, status: "selected" };
  }

  async processPattern(patternName) {
    console.log(`>>>Processing pattern: ${patternName}`);

    // Wait for the pattern to be visible
    await this.page.waitForSelector(`#${patternName}-title`, { timeout: 5000 });

    // Get the checkbox handle and scroll it into view
    const checkboxHandle = await this.patternCheckbox(patternName).waitHandle();
    await checkboxHandle.scrollIntoView();

    const checkboxSelector = `input[aria-labelledby="${patternName}-next-action ${patternName}-title"]`;
    // Check if pattern is auto-selected
    const isAutoSelected = await this.checkIfAutoSelected(this.page, patternName);
    if (isAutoSelected) {
      console.log(`Pattern ${patternName} is auto-selected, skipping...`);
      return { patternName, status: "skipped", reason: "auto-selected" };
    }

    const checkbox = await this.page.$(checkboxSelector);
    if (!checkbox) {
      throw new Error(`Could not find checkbox for pattern: ${patternName}`);
    }

    // Check current state
    const isCurrentlyChecked = await checkbox.evaluate((cb: HTMLInputElement) => cb.checked);
    if (isCurrentlyChecked) {
      console.log(`Pattern ${patternName} is already selected`);
      return { patternName, status: "already-selected" };
    }

    // Click the checkbox
    await checkbox.click();
    console.log(`==>Clicked checkbox for pattern: ${patternName}`);

    // Wait for checkbox to be checked
    await this.page.waitForFunction(
      (selector) => {
        const cb: HTMLInputElement = document.querySelector(selector);
        return cb && cb.checked;
      },
      { timeout: 10000 },
      checkboxSelector,
    );

    console.log(`<<<Pattern ${patternName} successfully selected`);
    return { patternName, status: "selected" };
  }

  async selectPattern(pattern: string) {
    const checkbox = await this.patternCheckbox(pattern).waitHandle();
    await checkbox.scrollIntoView();

    await this.patternCheckbox(pattern)
      .filter((input) => !input.checked)
      .click();

    // ensure selection due to puppeteer might go too fast
    await this.patternCheckbox(pattern)
      .filter((input) => input.checked)
      .wait();
  }

  async close() {
    await this.closeButton().click();
  }
}
