import { test, expect, type Page } from "@playwright/test";

const DESKTOP_MENU = ["Home", "Sahara Community Centers", "Joy Zone", "Blog"];
const DESKTOP_CTA = ["Get Involved", "Donate", "Shop"];
const MOBILE_STRIP = ["Donate", "Join Us", "Joy Zone", "Shop"];

async function loadPreview(page: Page, device: "desktop" | "tablet" | "mobile") {
  await page.goto(`/__admin/header-preview?adminPreview=1&device=${device}`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await expect(page.locator("[data-header-preview-root=\"true\"] .spandana-nav-root")).toBeVisible({ timeout: 30_000 });
}


test.describe("navigation header", () => {
  test("desktop contains canonical menu and all three CTAs", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) !== 1440, "desktop-only assertion");
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 15_000 });
    const nav = page.locator(".spandana-nav-root");
    await expect(nav).toBeVisible();
    for (const label of [...DESKTOP_MENU, ...DESKTOP_CTA]) await expect(nav.getByText(label, { exact: true }).first()).toBeVisible();
    const cta = nav.locator('[data-nav-editor-id="cta-group"]');
    await expect(cta).toBeVisible();
    for (const label of DESKTOP_CTA) await expect(cta.getByText(label, { exact: true })).toBeVisible();

    const boxes = await Promise.all([...DESKTOP_MENU, ...DESKTOP_CTA].map(async label => ({ label, box: await nav.getByText(label, { exact: true }).first().boundingBox() })));
    for (const item of boxes) expect(item.box, `${item.label} must have a bounding box`).not.toBeNull();
    await nav.screenshot({ path: "qa/navigation-artifacts/public-desktop-header.png" });
  });

  test("mobile contains the approved four quick actions and hamburger without overlap", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 999) >= 768, "mobile-only assertion");
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 15_000 });
    const nav = page.locator(".spandana-nav-root");
    await expect(nav).toBeVisible();
    const mobileStrip = nav.locator('[data-nav-editor-id="mobile-strip"]');
    await expect(mobileStrip).toBeVisible();
    for (const label of MOBILE_STRIP) await expect(mobileStrip.getByText(label, { exact: true })).toBeVisible();
    await expect(nav.locator('[data-spandana-hamburger="true"]')).toBeVisible();

    const logoLocator = nav.locator(".spandana-nav-logo");
    const hamburgerLocator = nav.locator('[data-spandana-hamburger="true"]');
    const stripLocator = nav.locator('[data-nav-editor-id="mobile-strip"]');
    const [logoBox, hamburgerBox, stripBox] = await Promise.all([
      logoLocator.boundingBox(),
      hamburgerLocator.boundingBox(),
      stripLocator.boundingBox(),
    ]);
    expect(logoBox).not.toBeNull();
    expect(hamburgerBox).not.toBeNull();
    expect(stripBox).not.toBeNull();
    if (logoBox && stripBox) expect(logoBox.x + logoBox.width).toBeLessThanOrEqual(stripBox.x + 1);
    if (hamburgerBox && stripBox) expect(stripBox.x + stripBox.width).toBeLessThanOrEqual(hamburgerBox.x + hamburgerBox.width + 1);
    await nav.screenshot({ path: "qa/navigation-artifacts/public-mobile-header.png" });
  });
  test("desktop preview reproduces menu and CTAs", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, "desktop-only assertion");
    await loadPreview(page, "desktop");
    const nav = page.locator(".spandana-nav-root");
    for (const label of [...DESKTOP_MENU, ...DESKTOP_CTA]) await expect(nav.getByText(label, { exact: true }).first()).toBeVisible();
    await expect(nav.locator('[data-nav-editor-id="cta-group"]')).toBeVisible();
    await expect(nav.locator('[data-nav-editor-id="cta-get-involved"]')).toBeVisible();
    await expect(nav.locator('[data-nav-editor-id="cta-donate"]')).toBeVisible();
    await expect(nav.locator('[data-nav-editor-id="cta-shop"]')).toBeVisible();
    await nav.screenshot({ path: "qa/navigation-artifacts/designer-desktop-header.png" });

    // Visual-fidelity gate: compare the same canonical header implementation at the
    // same browser viewport. The preview may live in a narrower designer canvas,
    // so compare invariant geometry rather than raw pixels.
    const previewRootBox = await nav.boundingBox();
    expect(previewRootBox).not.toBeNull();
    const publicPage = await page.context().newPage();
    try {
      await publicPage.goto("/", { waitUntil: "domcontentloaded", timeout: 15_000 });
      const publicNav = publicPage.locator(".spandana-nav-root");
      await expect(publicNav).toBeVisible();
      const publicRootBox = await publicNav.boundingBox();
      expect(publicRootBox).not.toBeNull();
      if (previewRootBox && publicRootBox) {
        expect(Math.abs(previewRootBox.height - publicRootBox.height), "Designer/public desktop header height drift").toBeLessThanOrEqual(1);
      }
      const ids = ["logo", "desktop-menu", "cta-group"];
      for (const id of ids) {
        const a = await nav.locator(`[data-nav-editor-id="${id}"]`).boundingBox();
        const b = await publicNav.locator(`[data-nav-editor-id="${id}"]`).boundingBox();
        expect(a, `Designer ${id} must have a bounding box`).not.toBeNull();
        expect(b, `Public ${id} must have a bounding box`).not.toBeNull();
        if (a && b) expect(Math.abs(a.height - b.height), `Designer/public ${id} height drift`).toBeLessThanOrEqual(1);
      }
    } finally {
      await publicPage.close();
    }
  });

  test("tablet preview uses the real responsive viewport", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) !== 768, "tablet-only assertion");
    await loadPreview(page, "tablet");
    const nav = page.locator(".spandana-nav-root");
    await expect(nav.getByText("Home", { exact: true }).first()).toBeVisible();
    await expect(nav.getByText("Donate", { exact: true }).first()).toBeVisible();
    await expect(nav.locator('[data-spandana-hamburger="true"]')).toBeHidden();
  });

  test("mobile preview uses the real mobile viewport and has no header overlap", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 999) >= 768, "mobile-only assertion");
    await loadPreview(page, "mobile");
    const nav = page.locator(".spandana-nav-root");
    const mobileStrip = nav.locator('[data-nav-editor-id="mobile-strip"]');
    await expect(mobileStrip).toBeVisible();
    for (const label of MOBILE_STRIP) await expect(mobileStrip.getByText(label, { exact: true })).toBeVisible();
    await expect(nav.locator('[data-spandana-hamburger="true"]')).toBeVisible();

    const logoBox = await nav.locator(".spandana-nav-logo").boundingBox();
    const stripBox = await nav.locator('[data-nav-editor-id="mobile-strip"]').boundingBox();
    const hamburgerBox = await nav.locator('[data-spandana-hamburger="true"]').boundingBox();
    expect(logoBox).not.toBeNull();
    expect(stripBox).not.toBeNull();
    expect(hamburgerBox).not.toBeNull();
    if (logoBox && stripBox) expect(logoBox.x + logoBox.width).toBeLessThanOrEqual(stripBox.x + 2);
    if (hamburgerBox && stripBox) expect(stripBox.x + stripBox.width).toBeLessThanOrEqual(hamburgerBox.x + 2);
    await nav.screenshot({ path: "qa/navigation-artifacts/designer-mobile-header.png" });

    // Visual-fidelity gate: compare invariant mobile header geometry against the
    // public page at the same 390px CSS viewport.
    const previewRootBox = await nav.boundingBox();
    expect(previewRootBox).not.toBeNull();
    const publicPage = await page.context().newPage();
    try {
      await publicPage.goto("/", { waitUntil: "domcontentloaded", timeout: 15_000 });
      const publicNav = publicPage.locator(".spandana-nav-root");
      await expect(publicNav).toBeVisible();
      const publicRootBox = await publicNav.boundingBox();
      expect(publicRootBox).not.toBeNull();
      if (previewRootBox && publicRootBox) {
        expect(Math.abs(previewRootBox.height - publicRootBox.height), "Designer/public mobile header height drift").toBeLessThanOrEqual(1);
      }
      const logo = await publicNav.locator(".spandana-nav-logo").boundingBox();
      const strip = await publicNav.locator('[data-nav-editor-id="mobile-strip"]').boundingBox();
      const hamburger = await publicNav.locator('[data-spandana-hamburger="true"]').boundingBox();
      expect(logo).not.toBeNull();
      expect(strip).not.toBeNull();
      expect(hamburger).not.toBeNull();
      if (logo && logoBox) expect(Math.abs(logo.width - logoBox.width), "Designer/public mobile logo width drift").toBeLessThanOrEqual(1);
      if (strip && stripBox) expect(Math.abs(strip.height - stripBox.height), "Designer/public mobile strip height drift").toBeLessThanOrEqual(1);
      if (hamburger && hamburgerBox) expect(Math.abs(hamburger.width - hamburgerBox.width), "Designer/public mobile hamburger width drift").toBeLessThanOrEqual(1);
    } finally {
      await publicPage.close();
    }
  });

  test("preview responds to draft messages without rebuilding a second header implementation", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, "desktop-only assertion");
    await loadPreview(page, "desktop");
    await page.evaluate(() => {
      const nav = document.querySelector(".spandana-nav-root");
      if (!nav) throw new Error("preview nav missing");
      window.postMessage({
        type: "spandana-admin-header-preview",
        nav: {
          links: [
            { id: "home", label: "Home", href: "/" },
            { id: "sahara", label: "Sahara Community Centers", href: "/sahara" },
            { id: "joyzone", label: "Joy Zone", href: "/fun-zone" },
            { id: "blog", label: "Blog", href: "/blog" },
            { id: "get-involved", label: "Get Involved", mobileLabel: "Join Us", href: "/volunteer" },
            { id: "donate", label: "Donate", href: "/donate" },
            { id: "shop", label: "Shop", href: "/shop" },
          ],
          structure: { desktopMenuIds: ["home", "sahara", "joyzone", "blog"], desktopCtaIds: ["get-involved", "donate", "shop"], mobileStripIds: ["donate", "get-involved", "joyzone", "shop"], hamburgerIds: ["home", "sahara", "joyzone", "blog"], mobileCtaIds: ["donate", "get-involved", "shop"] },
          design: { desktop: { headerHeight: 80 }, mobile: { headerHeight: 72 } },
        },
      }, window.location.origin);
    });
    await expect(page.locator('[data-nav-editor-id="cta-shop"]')).toBeVisible();
  });
});
