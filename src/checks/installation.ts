import { it, page, getTextContent } from "../lib/helpers";
import { ConfirmInstallationPage } from "../pages/confirm_installation_page";
import { CongratulationPage } from "../pages/congratulation_page";
import { OverviewPage } from "../pages/overview_page";
import { OverviewWithSidebarPage } from "../pages/overview_with_sidebar_page";
import { SidebarPage } from "../pages/sidebar_page";
import { InstallationPage } from "../pages/installation_page";
import assert from "node:assert/strict";
import { ConfirmInstallationWithSidebarPage } from "../pages/confirm_installation_with_sidebar_page";
import { InstallationCompletePage } from "../pages/installation_complete_page";
import { InstallationInProgressPage } from "../pages/installation_in_progress_page";

export function performInstallation() {
  it("should start installation", async function () {
    const confirmInstallation = new ConfirmInstallationPage(page);
    const overview = new OverviewPage(page);

    await overview.install();
    await confirmInstallation.confirmAndInstall();
  });
}

export function performInstallationWithSidebar() {
  it("should start installation", async function () {
    const confirmInstallation = new ConfirmInstallationWithSidebarPage(page);
    const overview = new OverviewWithSidebarPage(page);
    const sidebar = new SidebarPage(page);

    await sidebar.goToOverview();
    await overview.install();
    await confirmInstallation.continue();
  });
}

export function checkInstallation() {
  it("should check installation progress", async function () {
    const installationInProgress = new InstallationInProgressPage(page);

    assert.deepEqual(
      await getTextContent(installationInProgress.installationInProgressText()),
      "Installation in progress",
    );
    assert.deepEqual(
      await getTextContent(installationInProgress.prepareTheSystemText()),
      "Prepare the system",
    );

    assert.deepEqual(
      await getTextContent(installationInProgress.installSoftwareText()),
      "Install software",
    );

    assert.deepEqual(
      await getTextContent(installationInProgress.configureTheSystemText()),
      "Configure the system",
    );
  });
}

export function checkInstallationWithSidebar() {
  it("should check installation progress", async function () {
    const installation = new InstallationPage(page);

    assert.deepEqual(await getTextContent(installation.prepareDisksText()), "Prepare disks");

    assert.deepEqual(
      await getTextContent(installation.installingSystemText()),
      "Installing the system, please wait...",
    );

    assert.deepEqual(await getTextContent(installation.installSoftwareText()), "Install software");

    assert.deepEqual(
      await getTextContent(installation.configureTheSystemText()),
      "Configure the system",
    );
  });
}

export function finishInstallation() {
  it(
    "should finish installation",
    async function () {
      const installationComplete = new InstallationCompletePage(page);
      console.log(">>> Installing and wait it to be finished");
      await installationComplete.wait(40 * 60 * 1000);
      console.log(">>> 888 Congratulation! Installation successfully finished!");
    },
    41 * 60 * 1000,
  );
}

export function finishInstallationCongratulation() {
  it(
    "should finish installation",
    async function () {
      const congratulation = new CongratulationPage(page);
      await congratulation.wait(20 * 60 * 1000);
    },
    21 * 60 * 1000,
  );
}
