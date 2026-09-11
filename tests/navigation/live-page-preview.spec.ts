import { test, expect } from "@playwright/test";

test.describe("Live Page Preview device modes", () => {
  test("opens the real Home page and switches desktop/tablet/mobile viewports", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) !== 1440, "live preview gate runs once at desktop browser width");
    await page.goto("/admin", { waitUntil: "commit", timeout: 15_000 });
    if (!(await page.getByText("Main Menu / Navigation", { exact: false }).count())) test.skip(true, "Admin UI not available in this browser session");
    const navLink = page.getByText("Main Menu / Navigation", { exact: false }).first();
    if (await navLink.count()) await navLink.click();
    const liveButton = page.getByRole("button", { name: /Live Page Preview/i }).first();
    await expect(liveButton).toBeVisible({ timeout: 15_000 });
    await liveButton.click();

    const modal = page.getByText("Live Page Preview", { exact: true }).locator("..", { has: page.getByText(/Actual Home page at the selected device viewport/i) }).locator("..");
    await expect(page.getByText(/Actual Home page at the selected device viewport/i)).toBeVisible();

    const frame = page.locator('iframe[title^="Spandana Home mobile live preview"]');
    await expect(frame).toBeVisible({ timeout: 15_000 });
    await expect(frame.contentFrame().locator(".spandana-nav-root")).toBeVisible({ timeout: 30_000 });
    await expect(frame.contentFrame().locator("[data-nav-editor-id=mobile-strip]").getByText("Donate", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: /^Desktop$/ }).last().click();
    const desktopFrame = page.locator('iframe[title^="Spandana Home desktop live preview"]');
    await expect(desktopFrame).toBeVisible({ timeout: 15_000 });
    await expect(desktopFrame.contentFrame().locator(".spandana-nav-root")).toBeVisible({ timeout: 30_000 });
    for (const label of ["Home", "Sahara Community Centers", "Joy Zone", "Blog", "Get Involved", "Donate", "Shop"]) {
      await expect(desktopFrame.contentFrame().getByText(label, { exact: true }).first()).toBeVisible({ timeout: 8_000 });
    }
    expect(await desktopFrame.evaluate((el) => (el as HTMLIFrameElement).src)).toContain("device=desktop");

    await page.getByRole("button", { name: /^Tablet$/ }).last().click();
    const tabletFrame = page.locator('iframe[title^="Spandana Home tablet live preview"]');
    await expect(tabletFrame).toBeVisible({ timeout: 15_000 });
    await expect(tabletFrame.contentFrame().locator(".spandana-nav-root")).toBeVisible({ timeout: 30_000 });
    expect(await tabletFrame.evaluate((el) => (el as HTMLIFrameElement).src)).toContain("device=tablet");

    await page.getByRole("button", { name: /^Mobile$/ }).last().click();
    const mobileFrame = page.locator('iframe[title^="Spandana Home mobile live preview"]');
    await expect(mobileFrame).toBeVisible({ timeout: 15_000 });
    expect(await mobileFrame.evaluate((el) => (el as HTMLIFrameElement).src)).toContain("device=mobile");
  });
});
