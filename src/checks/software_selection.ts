import { it, page, sleep, dumpPage } from "../lib/helpers";
import { HeaderPage } from "../pages/header_page";
import { OverviewPage } from "../pages/overview_page";
import { SidebarPage } from "../pages/sidebar_page";
import { SoftwarePage } from "../pages/software_page";
import { SoftwareSelectionPage } from "../pages/software_selection_page";

export function selectPatterns(patterns: string[]) {
  it(`should select patterns ${patterns.join(", ")}`, async function () {
    const overview = new OverviewPage(page);
    const header = new HeaderPage(page);
    const software = new SoftwarePage(page);
    const softwareSelection = new SoftwareSelectionPage(page);

    await overview.goToSoftware();
    await software.changeSelection();

    for (const pattern of patterns) await softwareSelection.selectPattern(pattern);
    await softwareSelection.close();

    console.log("selected gnome pattern");
    const logDir = "/run/agama/scripts";
    await sleep(3000);
    header.goToOverview();
    console.log("1 take a screenshot for the overview page");
    await dumpPage(logDir, "screenshot_after_select_gnome");

    await overview.goToStorage();
    await dumpPage(logDir, "screenshot_in_storage");
    console.log("2 take a screenshot for the storage page");
    header.goToOverview();
    console.log("2 back to the overview page");
  });
}

export function selectPatternsWithSidebar(patterns: string[]) {
  it(`should select patterns ${patterns.join(", ")}`, async function () {
    const sidebar = new SidebarPage(page);
    const software = new SoftwarePage(page);
    const softwareSelection = new SoftwareSelectionPage(page);

    await sidebar.goToSoftware();
    await software.changeSelection();

    for (const pattern of patterns) await softwareSelection.selectPattern(pattern);
    await softwareSelection.close();
  });
}
