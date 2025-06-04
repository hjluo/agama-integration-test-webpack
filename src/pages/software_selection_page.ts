import { type Page } from "puppeteer-core";

export class SoftwareSelectionPage {
  private readonly page: Page;
  private readonly patternCheckbox = (pattern: string) =>
    this.page.locator(`input[type=checkbox][aria-labelledby*=${pattern}-title]`);

  private readonly closeButton = () => this.page.locator("::-p-text(Close)");

  constructor(page: Page) {
    this.page = page;
  }

  async selectPattern(pattern: string) {
    console.log(`Processing pattern: ${pattern}`); 
    const titleSelector = `#${pattern}-title`;
    await page.waitForSelector(titleSelector, { timeout: 5000 });
    // Check if pattern is auto-selected by looking for the blue "auto selected" label  
    const isAutoSelected = await checkIfAutoSelected(page, pattern);  
    if (isAutoSelected) {  
      console.log(`Pattern ${patternName} is auto-selected, skipping...`);  
      return { patternName, status: 'skipped', reason: 'auto-selected' };  
    }  
                                                 
    // Use aria-labelledby to target the checkbox - this is the key change  
    const checkboxSelector = `[aria-labelledby="${patternName}-next-action ${patternName}-title"]`;  
    const checkbox = await page.$(checkboxSelector);  
                                        
    if (!checkbox) {  
      throw new Error(`Could not find checkbox for pattern: ${patternName}`);  
    }  

     // Check current state  
    const isCurrentlyChecked = await page.evaluate(el => el.checked, checkbox);  
                                                                              
    if (isCurrentlyChecked) {  
      console.log(`Pattern ${patternName} is already selected`);  
     return {   patternName,   status: 'already-selected'}; 
    } 
  }

  async close() {
    await this.closeButton().click();
  }
}
