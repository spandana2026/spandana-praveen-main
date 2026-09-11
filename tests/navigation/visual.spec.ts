import { test, expect, type Page } from "@playwright/test";

async function getBox(page: Page, selector: string) {
  return page.locator(selector).boundingBox();
}

async function compareBox(previewPage: Page, publicPage: Page, selector: string, label: string) {
  const publicBox = await getBox(publicPage, selector);
  const previewBox = await getBox(previewPage, selector);
  expect(publicBox, `${label} must exist in public header`).not.toBeNull();
  expect(previewBox, `${label} must exist in Designer preview`).not.toBeNull();
  if (publicBox && previewBox) {
    expect(Math.abs(publicBox.width - previewBox.width), `${label} width drift`).toBeLessThanOrEqual(1);
    expect(Math.abs(publicBox.height - previewBox.height), `${label} height drift`).toBeLessThanOrEqual(1);
  }
}

async function assertNoOverlap(page: Page, firstSelector: string, secondSelector: string, label: string) {
  const first = await page.locator(firstSelector).boundingBox();
  const second = await page.locator(secondSelector).boundingBox();
  expect(first, `${label}: first element must exist`).not.toBeNull();
  expect(second, `${label}: second element must exist`).not.toBeNull();
  if (first && second) {
    const overlaps = first.x < second.x + second.width &&
      first.x + first.width > second.x &&
      first.y < second.y + second.height &&
      first.y + first.height > second.y;
    expect(overlaps, `${label}: elements overlap`).toBe(false);
  }
}

async function loadPreview(page: Page, device: "desktop" | "tablet" | "mobile") {
  await page.goto(`/__admin/header-preview?adminPreview=1&device=${device}`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await expect(page.locator("[data-header-preview-root=\"true\"] .spandana-nav-root")).toBeVisible({ timeout: 30_000 });
}


test.describe("navigation visual fidelity", () => {
  test("desktop public header and Designer preview have matching visual geometry", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) !== 1440, "desktop-only visual gate");
    await page.goto("/", { waitUntil: "commit", timeout: 15_000 });
    const publicNav = page.locator(".spandana-nav-root");
    await expect(publicNav).toBeVisible({ timeout: 45_000 });

    const previewPage = await page.context().newPage();
    try {
      await loadPreview(previewPage, "desktop");
      const previewNav = previewPage.locator(".spandana-nav-root");
      for (const label of ["Home", "Sahara Community Centers", "Joy Zone", "Blog", "Get Involved", "Donate", "Shop"]) {
        await expect(previewNav.getByText(label, { exact: true }).first()).toBeVisible();
      }
      const previewContext = previewPage.locator('[data-header-preview-root="true"]');
      await expect(previewContext).toBeVisible();
      await expect(previewContext).toHaveCSS("background-color", "rgb(0, 51, 160)");
      const publicRoot = await publicNav.boundingBox();
      const previewRoot = await previewNav.boundingBox();
      expect(publicRoot).not.toBeNull();
      expect(previewRoot).not.toBeNull();
      if (publicRoot && previewRoot) {
        expect(Math.abs(publicRoot.width - previewRoot.width), "desktop root width drift").toBeLessThanOrEqual(1);
        expect(Math.abs(publicRoot.height - previewRoot.height), "desktop root height drift").toBeLessThanOrEqual(1);
      }
      for (const [selector, label] of [
        ["[data-nav-editor-id=\"logo\"]", "desktop logo"],
        ["[data-nav-editor-id=\"desktop-menu\"]", "desktop menu"],
        ["[data-nav-editor-id=\"cta-group\"]", "desktop CTA group"],
      ] as const) await compareBox(previewPage, page, selector, label);

      await publicNav.screenshot({ path: "qa/navigation-artifacts/visual-public-desktop.png" });
      await previewNav.screenshot({ path: "qa/navigation-artifacts/visual-designer-desktop.png" });
    } finally { await previewPage.close(); }
  });

  test("tablet public header and Designer preview use matching responsive geometry", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) !== 768, "tablet-only visual gate");
    await page.goto("/", { waitUntil: "commit", timeout: 15_000 });
    const publicNav = page.locator(".spandana-nav-root");
    await expect(publicNav).toBeVisible({ timeout: 45_000 });
    const previewPage = await page.context().newPage();
    try {
      await loadPreview(previewPage, "tablet");
      const previewNav = previewPage.locator(".spandana-nav-root");
      for (const label of ["Home", "Sahara Community Centers", "Joy Zone", "Blog", "Get Involved", "Donate", "Shop"]) {
        await expect(previewNav.getByText(label, { exact: true }).first()).toBeVisible();
      }
      const publicRoot = await publicNav.boundingBox();
      const previewRoot = await previewNav.boundingBox();
      expect(publicRoot).not.toBeNull();
      expect(previewRoot).not.toBeNull();
      if (publicRoot && previewRoot) expect(Math.abs(publicRoot.height - previewRoot.height), "tablet root height drift").toBeLessThanOrEqual(1);
      for (const [selector, label] of [
        ["[data-nav-editor-id=\"logo\"]", "tablet logo"],
        ["[data-nav-editor-id=\"desktop-menu\"]", "tablet menu"],
        ["[data-nav-editor-id=\"cta-group\"]", "tablet CTA group"],
      ] as const) await compareBox(previewPage, page, selector, label);
      await assertNoOverlap(page, '[data-nav-editor-id="desktop-menu"]', '[data-nav-editor-id="cta-group"]', "public tablet menu/CTA safety");
      await assertNoOverlap(previewPage, '[data-nav-editor-id="desktop-menu"]', '[data-nav-editor-id="cta-group"]', "Designer tablet menu/CTA safety");
      const previewContext = previewPage.locator('[data-header-preview-root="true"]');
      await expect(previewContext).toBeVisible();
      await expect(previewContext).toHaveCSS("background-color", "rgb(0, 51, 160)");
      await publicNav.screenshot({ path: "qa/navigation-artifacts/visual-public-tablet.png" });
      await previewNav.screenshot({ path: "qa/navigation-artifacts/visual-designer-tablet.png" });
    } finally { await previewPage.close(); }
  });

  test("mobile public header and Designer preview have matching visual geometry", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 999) >= 768, "mobile-only visual gate");
    await page.goto("/", { waitUntil: "commit", timeout: 15_000 });
    const publicNav = page.locator(".spandana-nav-root");
    await expect(publicNav).toBeVisible({ timeout: 45_000 });
    const previewPage = await page.context().newPage();
    try {
      await loadPreview(previewPage, "mobile");
      const previewNav = previewPage.locator(".spandana-nav-root");
      for (const label of ["Donate", "Join Us", "Joy Zone", "Shop"]) {
        await expect(previewNav.locator('[data-nav-editor-id="mobile-strip"]').getByText(label, { exact: true }).first()).toBeVisible();
      }
      await expect(previewNav.locator('[data-spandana-hamburger="true"]')).toBeVisible();
      const publicRoot = await publicNav.boundingBox();
      const previewRoot = await previewNav.boundingBox();
      expect(publicRoot).not.toBeNull();
      expect(previewRoot).not.toBeNull();
      if (publicRoot && previewRoot) expect(Math.abs(publicRoot.height - previewRoot.height), "mobile root height drift").toBeLessThanOrEqual(1);
      for (const [selector, label] of [
        [".spandana-nav-logo", "mobile logo"],
        ["[data-nav-editor-id=\"mobile-strip\"]", "mobile quick-action strip"],
        ["[data-spandana-hamburger=\"true\"]", "mobile hamburger"],
      ] as const) await compareBox(previewPage, page, selector, label);
      await publicNav.screenshot({ path: "qa/navigation-artifacts/visual-public-mobile.png" });
      await previewNav.screenshot({ path: "qa/navigation-artifacts/visual-designer-mobile.png" });
    } finally { await previewPage.close(); }
  });
});


test("admin Header Designer visibly exposes the complete canonical header at each device mode", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) !== 1440, "admin designer smoke test runs once at desktop browser width");
  await page.goto("/admin", { waitUntil: "commit", timeout: 15_000 });
  // If this installation protects Admin behind an external auth wall, skip cleanly rather than treating auth as a header failure.
  if (!(await page.getByText("Main Menu / Navigation", { exact: false }).count())) test.skip(true, "Admin UI not available in this browser session");
  // Navigate to Main Menu / Navigation if the sidebar is present.
  const navLink = page.getByText("Main Menu / Navigation", { exact: false }).first();
  if (await navLink.count()) await navLink.click();
  const designButton = page.getByRole("button", { name: /Design Header/i }).first();
  if (await designButton.count()) await designButton.click();
  const frame = page.locator('iframe[title^="Spandana live header preview"]');
  await expect(frame).toBeVisible({ timeout: 15_000 });
  for (const label of ["Home", "Sahara Community Centers", "Joy Zone", "Blog", "Get Involved", "Donate", "Shop"]) {
    await expect(frame.contentFrame().getByText(label, { exact: true }).first()).toBeVisible({ timeout: 8_000 });
  }
  // Switch to mobile and verify the four protected quick actions are visible inside the same preview iframe.
  await page.getByRole("button", { name: /^Mobile$/ }).first().click();
  const mobileFrame = page.locator('iframe[title^="Spandana live header preview mobile"]');
  await expect(mobileFrame).toBeVisible({ timeout: 15_000 });
  const strip = mobileFrame.contentFrame().locator('[data-nav-editor-id="mobile-strip"]');
  for (const label of ["Donate", "Join Us", "Joy Zone", "Shop"]) await expect(strip.getByText(label, { exact: true })).toBeVisible({ timeout: 8_000 });
});


test("Header Designer preview must not inherit an incomplete Admin draft navigation structure", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) !== 1440, "draft-hydration regression gate runs once at desktop browser width");
  await page.route("**/api/settings", async route => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        branding: { logoUrl: "/logo.png" },
        nav: {
          links: [
            { id: "home", label: "Home", href: "/" },
            { id: "sahara", label: "Sahara Community Centers", href: "/sahara" },
            { id: "joyzone", label: "Joy Zone", href: "/fun-zone" },
            { id: "blog", label: "Blog", href: "/blog" },
            { id: "get-involved", label: "Get Involved", href: "/volunteer", mobileLabel: "Join Us" },
            { id: "donate", label: "Donate", href: "/donate" },
            { id: "shop", label: "Shop", href: "/shop" },
          ],
          structure: {
            desktopMenuIds: ["home", "sahara", "joyzone", "blog"],
            desktopCtaIds: ["get-involved", "donate", "shop"],
            mobileStripIds: ["donate", "get-involved", "joyzone", "shop"],
          },
        },
        visibility: {},
      }),
    });
  });
  await page.goto("/admin", { waitUntil: "commit", timeout: 15_000 });
  if (!(await page.getByText("Main Menu / Navigation", { exact: false }).count())) test.skip(true, "Admin UI not available in this browser session");
  const navLink = page.getByText("Main Menu / Navigation", { exact: false }).first();
  if (await navLink.count()) await navLink.click();
  const designButton = page.getByRole("button", { name: /Design Header/i }).first();
  if (!(await designButton.count())) test.skip(true, "Header Designer unavailable");
  await designButton.click();
  const frame = page.locator('iframe[title^="Spandana live header preview"]');
  await expect(frame).toBeVisible({ timeout: 15_000 });
  const content = frame.contentFrame();
  for (const label of ["Home", "Sahara Community Centers", "Joy Zone", "Blog", "Get Involved", "Donate", "Shop"]) {
    await expect(content.getByText(label, { exact: true }).first()).toBeVisible({ timeout: 8_000 });
  }
  await page.getByRole("button", { name: /^Mobile$/ }).first().click();
  const mobileFrame = page.locator('iframe[title^="Spandana live header preview mobile"]');
  const strip = mobileFrame.contentFrame().locator('[data-nav-editor-id="mobile-strip"]');
  for (const label of ["Donate", "Join Us", "Joy Zone", "Shop"]) {
    await expect(strip.getByText(label, { exact: true }).first()).toBeVisible({ timeout: 8_000 });
  }
});
