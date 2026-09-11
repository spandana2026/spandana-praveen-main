import { test, expect } from "@playwright/test";

test.describe("mobile Header Designer controls", () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== "desktop", "Control audit runs once in the desktop browser project");

  async function openMobileDesigner(page: any) {
    await page.goto("/admin", { waitUntil: "commit", timeout: 15_000 });
    if (!(await page.getByText("Main Menu / Navigation", { exact: false }).count())) test.skip(true, "Admin UI not available in this browser session");
    await page.getByText("Main Menu / Navigation", { exact: false }).first().click();
    await page.getByRole("button", { name: /Design Header/i }).first().click();
    await page.getByRole("button", { name: /^Mobile$/ }).first().click();
    const frame = page.locator('iframe[title^="Spandana live header preview mobile"]');
    await expect(frame).toBeVisible({ timeout: 15_000 });
    const content = frame.contentFrame();
    const strip = content.locator('[data-nav-editor-id="mobile-strip"]');
    await expect(strip).toBeVisible({ timeout: 15_000 });
    return { frame, content, strip };
  }

  function inputFor(page: any, label: string) {
    return page.getByText(label, { exact: true }).locator("..").locator('input[type="number"]').first();
  }

  async function boxes(strip: any) {
    const labels = ["Donate", "Join Us", "Joy Zone", "Shop"];
    const out: Record<string, any> = {};
    for (const label of labels) out[label] = await strip.getByText(label, { exact: true }).locator("..").boundingBox();
    return out;
  }

  test("all four shared position, icon size and scale controls change the rendered actions", async ({ page }) => {
    const { strip } = await openMobileDesigner(page);
    const before = await boxes(strip);

    await inputFor(page, "Move all 4 horizontally").fill("10");
    await expect.poll(async () => (await boxes(strip))["Donate"].x, { timeout: 10_000 }).toBeGreaterThan(before["Donate"].x + 5);
    const afterX = await boxes(strip);
    for (const label of ["Donate", "Join Us", "Joy Zone", "Shop"]) expect(afterX[label].x).toBeGreaterThan(before[label].x + 5);

    await inputFor(page, "Move all 4 vertically").fill("10");
    await expect.poll(async () => (await boxes(strip))["Donate"].y, { timeout: 10_000 }).toBeGreaterThan(before["Donate"].y + 5);

    const beforeSize = (await boxes(strip))["Donate"];
    await inputFor(page, "Icon size — all 4").fill("34");
    await expect.poll(async () => (await boxes(strip))["Donate"].height, { timeout: 10_000 }).toBeGreaterThan(beforeSize.height);

    const beforeScale = (await boxes(strip))["Donate"];
    await inputFor(page, "Scale — all 4").fill("120");
    await expect.poll(async () => (await boxes(strip))["Donate"].width, { timeout: 10_000 }).toBeGreaterThan(beforeScale.width);

    await page.getByRole("button", { name: /Reset all 4 action positions & sizes/i }).click();
    await expect.poll(async () => (await boxes(strip))["Donate"].x, { timeout: 10_000 }).toBeLessThan(afterX["Donate"].x);
  });

  test("individual X, Y, icon size and scale controls change only the selected action", async ({ page }) => {
    const { strip } = await openMobileDesigner(page);
    const before = await boxes(strip);

    const donateCard = page.getByText("Donate", { exact: true }).last().locator("..");
    const donateInputs = donateCard.locator('input[type="number"]');
    await donateInputs.nth(0).fill("10");
    await expect.poll(async () => (await boxes(strip))["Donate"].x, { timeout: 10_000 }).toBeGreaterThan(before["Donate"].x + 5);
    const afterDonateX = await boxes(strip);
    expect(afterDonateX["Join Us"].x).toBeLessThan(afterDonateX["Donate"].x);

    await donateInputs.nth(1).fill("10");
    await expect.poll(async () => (await boxes(strip))["Donate"].y, { timeout: 10_000 }).toBeGreaterThan(before["Donate"].y + 5);

    const beforeIcon = (await boxes(strip))["Donate"];
    await donateInputs.nth(2).fill("34");
    await expect.poll(async () => (await boxes(strip))["Donate"].height, { timeout: 10_000 }).toBeGreaterThan(beforeIcon.height);

    const beforeItemScale = (await boxes(strip))["Donate"];
    await donateInputs.nth(3).fill("120");
    await expect.poll(async () => (await boxes(strip))["Donate"].width, { timeout: 10_000 }).toBeGreaterThan(beforeItemScale.width);
  });

  test("properties panel scrolls independently while the center mobile preview stays visible", async ({ page }) => {
    const { frame } = await openMobileDesigner(page);
    const panel = page.getByText("Live Header Properties", { exact: true }).locator("..");
    await panel.evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
    const box = await frame.boundingBox();
    expect(box).not.toBeNull();
    const viewport = page.viewportSize()!;
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeLessThan(viewport.height);
    expect(box!.y + box!.height).toBeGreaterThan(0);
  });
});
