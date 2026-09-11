# SPANDANA SYSTEM KNOWLEDGE

> Consolidated project memory generated from the Markdown documentation shipped with this build.
> This file is the canonical Markdown knowledge record. Individual Markdown files were consolidated to reduce fragmentation.

## Document index

- `ADMIN_SECURITY_STEP19_AUDIT_AND_IMPLEMENTATION.md`
- `ADMIN_STEP10_NAVIGATION_VISUAL_ACCESSIBILITY.md`
- `ADMIN_STEP11_NAVIGATION_CROSSCHECK_FIXES.md`
- `ADMIN_STEP12_BROWSER_REGRESSION_FIXES.md`
- `ADMIN_STEP13_VISUAL_NAVIGATION_COMPOSER.md`
- `ADMIN_STEP14_UNIVERSAL_NAVIGATION_STRUCTURE.md`
- `ADMIN_STEP15_UNIVERSAL_NAVIGATION_COMPOSER.md`
- `ADMIN_STEP16_TRUE_VISUAL_NAVIGATION_COMPOSER.md`
- `ADMIN_STEP17_TRUE_VISUAL_NAVIGATION_DESIGNER.md`
- `ADMIN_STEP18_TRUE_VISUAL_NAVIGATION_DESIGNER_REDESIGN.md`
- `ADMIN_STEP6_AUDIT_REPORT.md`
- `ADMIN_STEP7_LEAN_IA_REPORT.md`
- `ADMIN_STEP8_IA_SCREEN_REBUILD.md`
- `ADMIN_STEP9_IMPLEMENTATION_REPORT.md`
- `ARCHITECTURE.md`
- `CAMPAIGN_16_SECTIONS_IMPLEMENTATION.md`
- `DEPLOYMENT.md`
- `DONATE_CURATED_DESIGN_V22.md`
- `DONATE_DESKTOP_UX_FULL_FIX_V24.md`
- `DONATE_FIX_V23.md`
- `DONATE_LIVE_VISUAL_DESIGNER_CONTROLS_2026-09-04.md`
- `DONATE_PAGE_HANDOFF.md`
- `DONATE_PAGE_V32_CURATED_DESIGN_NO_CANVAS_EDITOR.md`
- `DONATE_PAGE_V33_DESIGN_AND_EDIT_OPTIONS.md`
- `DONATE_PAGE_V34_EXACT_BLUE_DESIGN.md`
- `DONATE_PAGE_V35_EXACT_BLUE_REFERENCE_DESIGN.md`
- `DONATE_PAGE_V36_ADMIN_CMS_FREEZE.md`
- `DONATE_PAGE_V37_EXACT_REFERENCE_LAYOUT_ADMIN_EDITABLE.md`
- `DONATE_PAGE_V38_SPECIFIC_NEEDS_DYNAMIC_GIVING.md`
- `DONATE_VISUAL_DESIGNER_2026-09-04.md`
- `DONATE_VISUAL_STUDIO_V27.md`
- `DONATE_VISUAL_STUDIO_V28_ORGANISATION_READY.md`
- `DONATE_VISUAL_STUDIO_V30_DEEP_CORE_INSPECTION.md`
- `DONATE_VISUAL_STUDIO_V31_FULL_CANVAS_FIX.md`
- `MEDIA_LIBRARY_AUDIT.md`
- `NAVIGATION_RESPONSIVE_REGRESSION_FIX_2026-09-02.md`
- `NAVIGATION_VISUAL_BUILDER_STRUCTURE_AND_RESPONSIVE_FIX_2026-09-04.md`
- `README.md`
- `SAHARA_V42_PREVIEW_BLUEPRINT.md`
- `SAHARA_V43_UNIVERSAL_MOBILE_UI_BLUEPRINT.md`
- `SAHARA_V44_CORE_PROGRAMS_ADMIN_MONGO_RECONCILIATION.md`
- `SAHARA_V45_CORE_PROGRAM_ORDER_AND_PILLAR_JOURNEY.md`
- `SETTINGS_CANONICAL_MAP_V47.md`
- `STEP19_NAV_DESKTOP_MOBILE_REGRESSION_FIX.md`
- `STEP20_SCOPE.md`
- `STEP23_CAMPAIGN_DONATE_FRONTEND_ALIGNMENT.md`
- `STEP24_CAMPAIGN_BUILDER_BUILD_FLOW_FIX.md`
- `STEP25_CAMPAIGN_BUILDER_PREVIEW_GENERATE_PUBLISH.md`
- `STEP26_DONATE_PUBLIC_UX_PAYMENT_FLOW_FIX.md`
- `STEP27_DONATE_VISUAL_INTERFACE_REDESIGN.md`
- `STEP28_RECYCLE_BIN_DONATE_ADMIN_ALIGNMENT.md`
- `STEP_CURRENT_CHANGELOG.md`
- `SYSTEM_DIAGNOSTICS_STEP20.md`
- `V47_LATEST_FIX_REPORT.md`
- `V47_MOBILE_HEADER_FIX_REPORT.md`
- `V50_NAVIGATION_ACCESSIBILITY_SCROLL_AND_DESIGNER_ACCESS.md`
- `V52_NAVIGATION_DESIGNER_LIVE_HEADER_PREVIEW.md`
- `V53_NAVIGATION_VERIFICATION_REPORT.md`
- `V53_TRUE_NAVIGATION_VISUAL_DESIGNER.md`
- `V54_PLAYWRIGHT_NAVIGATION_TEST_HARNESS_FIX.md`
- `V55_PLAYWRIGHT_NAVIGATION_TEST_HARNESS_FIX.md`
- `V56_WINDOWS_CANONICAL_PATH_AND_PLAYWRIGHT_FIX.md`
- `V57_NAVIGATION_QA_HARDENING.md`
- `V58_MOBILE_NAVIGATION_QA_SELECTOR_FIX.md`
- `V59_NAVIGATION_QA_BOUNDINGBOX_FIX.md`
- `V60_NAVIGATION_QA_BOUNDINGBOX_FIX.md`
- `V61_1_VISUAL_QA_COMMAND_FIX.md`
- `V61_2_BUILD_REPORT.md`
- `V61_2_VISUAL_QA_TIMEOUT_HARDENING.md`
- `V61_3_PUBLIC_SPA_READINESS_QA_FIX.md`
- `V61_BUILD_REPORT.md`
- `V61_VISUAL_FIDELITY_QA_HARDENING.md`
- `V62_BUILD_REPORT.md`
- `V62_TRUE_HEADER_ENVIRONMENT_AND_TABLET_SAFETY.md`
- `V63_BUILD_REPORT.md`
- `V63_TRUE_HOME_SHELL_HEADER_DESIGNER.md`
- `V64_BUILD_REPORT.md`
- `V64_HEADER_DESIGNER_TRUE_CANONICAL_RENDER_FIX.md`
- `V65_VISUAL_QA_CONTEXT_SELECTOR_FIX.md`
- `V66_BUILD_REPORT.md`
- `V66_TRUE_PUBLIC_HOME_ROUTE_HEADER_DESIGNER.md`
- `V67_BUILD_REPORT.md`
- `V67_HEADER_DESIGNER_PUBLISHED_NAV_HYDRATION_FIX.md`
- `V69_BUILD_REPORT.md`
- `V69_HEADER_DESIGNER_QA_EMBEDDED_SETTINGS_FIX.md`
- `V70_BUILD_REPORT.md`
- `V70_HEADER_DESIGNER_QA_PREVIEW_SELF_CONTAINED.md`
- `V72_BUILD_REPORT.md`
- `V72_MOBILE_HEADER_ACTION_CONTROLS.md`
- `V73_HEADER_DESIGNER_CONTROL_AUDIT.md`
- `V74_BUILD_REPORT.md`
- `V74_HEADER_DESIGNER_COMPLETE_CONTROL_AUDIT.md`

---

## Consolidated documentation


# SOURCE: `ADMIN_SECURITY_STEP19_AUDIT_AND_IMPLEMENTATION.md`

# Admin Authentication & Security — Step 19

The current build replaces the previous Admin password-as-token model with server-managed opaque sessions in an HttpOnly cookie.

## Included
- Hashed Admin password with bootstrap from `ADMIN_PASSWORD` on first run.
- Server-side Admin session persistence with expiry, password-version binding and revocation.
- No Admin token returned to frontend JavaScript.
- Forgot/reset password flow using Email or Mobile OTP.
- Change password and invalidate other sessions.
- Recovery email/mobile management and OTP verification.
- Up to three hashed backup recovery questions as a secondary recovery layer.
- Dedicated authentication/recovery rate limits.
- Team Portal authentication moved away from forgeable base64 identity tokens to server-managed sessions.
- Admin Account Security UI.

## Configuration
See `backend/.env.example` for recovery email/mobile and SMS webhook configuration.

## Local testing
Use the existing working `node_modules`. Email delivery requires Gmail credentials. Mobile OTP requires `MOBILE_OTP_WEBHOOK_URL`. For local-only debugging, `DEV_SHOW_OTP=true` prints otherwise undelivered OTPs to the backend console; never enable that in production.

---


# SOURCE: `ADMIN_STEP10_NAVIGATION_VISUAL_ACCESSIBILITY.md`

# Admin Step 10 — Custom Navigation Visual Controls & Accessibility

This build adds the approved custom navigation design controls to **Site Management → Main Menu / Navigation** while preserving the existing website aesthetic as the default.

## Added
- Desktop navigation visual controls: header height, menu position (default Center), vertical alignment, menu Y offset, menu gap, menu font size, menu colour, hover colour, active colour, logo scale, logo X/Y movement, horizontal padding.
- Mobile visual controls: strip height, item gap, strip Y offset, font size, text colour, background, border colour, logo scale, logo X/Y movement, hamburger size.
- Sahara dropdown controls: position, width, offset, item spacing/padding, font size, background, text colour, hover background, border colour and radius.
- Theme & Fonts: explicit Accessibility & Reading section documenting public Font Size and Paper White controls.
- Public Header consumes the new persisted navigation presentation settings.

## Preservation
- Desktop menu alignment defaults to Center.
- No established colour/font/button aesthetic is changed unless the administrator changes the corresponding control.
- Original `spandana-mern` remains read-only.

## Verification note
The isolated environment did not complete dependency installation (`npm ci` timed out before Vite/TypeScript became available), so a full frontend production build could not be run here. The package is provided for browser verification in the user's normal development environment.

---


# SOURCE: `ADMIN_STEP11_NAVIGATION_CROSSCHECK_FIXES.md`

# Spandana MERN — Step 11 Navigation Cross-Check / Browser-Fix Build

Date: 2026-09-02

## Why Step 11 exists
The Step 10 Admin screen contained many of the requested navigation visual controls, but a code cross-check showed that the live public pages actually import `frontend/src/components/nav.tsx`. Part of the new visual wiring had been placed in `Header.tsx`, which is not the public navigation component used by the pages. This Step 11 build wires the actual public `nav.tsx` to the Admin settings.

## Browser-visible fixes
- Desktop header height, menu position (default Center), vertical alignment, menu Y offset, menu gap, font size, colours, horizontal padding and CTA gap are driven from `nav.design.desktop`.
- Desktop logo scale and X/Y movement are driven from `nav.design.desktop` while preserving the existing asset.
- Mobile header strip height, item spacing, font size, strip Y offset, colours, padding, logo scale/position/X/Y and hamburger size are driven from `nav.design.mobile`.
- Mobile hamburger drawer now has Admin-controlled side, width, top offset, font size, background/text colour and overlay colour/opacity.
- Sahara desktop dropdown uses configured position, width, offset, padding, font size, colours, radius and shadow, with a no-gap trigger/panel relationship so pointer movement does not lose the dropdown.
- Public pages continue using the canonical navigation structure and destinations.
- Existing visitor-facing Font Size and Paper White controls remain enabled.

## Admin location
Site Management -> Main Menu / Navigation

The Main Menu / Navigation editor contains the visual navigation design controls, Mobile Header Strip controls, Mobile Hamburger Drawer controls, Sahara Dropdown Design, public menu structure, and Header Actions.

## Preservation
Do not modify the original `spandana-mern` reference repository. Do not change established colours, fonts, alignment, spacing, button appearance or overall aesthetic unless intentionally changed through the new Admin controls.

## Verification note
The source files were parse-checked with the installed TypeScript compiler API and no JSX parse diagnostics were found in the changed navigation/admin files. A complete Vite build could not be executed in the isolated environment because the dependency tree was not present and `npm ci` could not complete before the environment transport timeout. Browser verification should therefore be done in the normal user development environment.

---


# SOURCE: `ADMIN_STEP12_BROWSER_REGRESSION_FIXES.md`

# Step 12 — Browser Regression Fixes

This build addresses issues found during browser testing of Step 11:

- Fixed the public navigation render blocker caused by the undefined Sahara focus handler.
- Restored the Branding tab's Media Library picker import.
- Restored/implemented Dashboard Quick Links as an editable shortcut manager: Add, Edit/Rename, Reorder, Show/Hide, Remove.
- Normalized default Quick Links in Admin settings.
- Kept the custom navigation visual controls for Desktop/Tablet/Mobile.
- Kept Font Scaling and Paper White accessibility controls in Theme & Fonts.

The original `spandana-mern` reference repository remains read-only.

---


# SOURCE: `ADMIN_STEP13_VISUAL_NAVIGATION_COMPOSER.md`

# Step 13 — Visual Navigation Composer

This build changes the main navigation editing experience from settings-first to visual-first. Desktop and Mobile have separate drag-and-drop design canvases with direct position and size controls, plus/minus fine adjustment, and an advanced precision layer. The underlying canonical menu data and current colour/spacing settings remain the backing system. The public navigation now consumes the visual offset controls, fixes the desktop logo anchoring, adds CTA X/Y positioning, adds mobile strip X/Y and a visible hamburger control, and exposes the same settings to the preview.

---


# SOURCE: `ADMIN_STEP14_UNIVERSAL_NAVIGATION_STRUCTURE.md`

# Admin Step 14 — Universal Navigation Structure

This build extends the visual navigation composer so the menu structure is generic rather than Sahara-specific.

- Add unlimited practical top-level menu items.
- Every top-level item can have child/submenu items.
- Add/Edit, Reorder, Show/Hide, Duplicate and Remove for top-level items.
- Add/Edit, Reorder, Show/Hide, Duplicate and Remove for child items.
- Drag handles plus explicit up/down controls for structure ordering.
- Generic desktop dropdowns and mobile expandable submenus for any parent.
- Legacy navigation is seeded from the approved baseline until structure management is explicitly activated.
- Once managed, saved order/additions/removals are preserved exactly.

---


# SOURCE: `ADMIN_STEP15_UNIVERSAL_NAVIGATION_COMPOSER.md`

# Admin Step 15 — Universal Navigation Composer

This build carries the navigation work forward with:

- One canonical navigation tree shared by Desktop and Mobile presentation.
- Add/Edit/Remove/Show-Hide/Reorder/Duplicate for top-level menu items.
- Add/Edit/Remove/Show-Hide/Reorder/Duplicate for child/submenu items.
- Universal child-item styling: font size, X/Y offset, scale, text colour, and apply-to-all-children.
- Desktop placement choice (Main Menu vs Header CTA) for top-level items.
- Mobile Header Strip item selection from the canonical menu items.
- Multi-step local Undo/Redo plus Revert History controls for navigation editing.
- Quick Links now have a direct Open action to navigate to their Admin destination.
- Public navigation uses the same canonical data for Desktop menu, Desktop CTA area, Mobile strip and Mobile drawer; hard-coded duplicate CTA lists are removed.
- Child submenu styling is consumed by the public navigation renderer.

Known limitation: this environment does not provide a complete installed dependency tree for a full Vite production build. The changed TSX/TypeScript files are syntax/parse checked; browser validation should be run with the user's existing working node_modules.

---


# SOURCE: `ADMIN_STEP16_TRUE_VISUAL_NAVIGATION_COMPOSER.md`

# Step 16 — True Visual Navigation Composer

This build carries forward Step 15 structure corrections and replaces the simplified navigation mock canvas with an authentic visual composer.

## Included
- Actual public `Nav` component rendered in Admin as the live preview.
- Real Branding logo asset in the preview.
- Desktop/Mobile preview modes sharing one canonical menu tree.
- Add/Edit/Delete/Hide/Show/Duplicate/Reorder for menus.
- Recursive parent/child/grandchild structure editing.
- Per-item visual styles stored by device.
- Drag movement and resize handle in the Admin visual canvas.
- `+/-` size, X and Y precision controls.
- Destination Type + Destination selectors.
- Mobile strip item selection from the canonical menu.
- Generic desktop dropdown rendering and mobile recursive drawer submenus.
- Undo/Redo/Revert to Last Saved.

## Verification note
A full dependency-backed Vite build was not possible in this isolated environment because npm packages are not installed/cached. Changed TSX files were syntax-transpiled with TypeScript to catch JSX/parser errors.

Use existing working `node_modules` on the development machine as previously agreed.

---


# SOURCE: `ADMIN_STEP17_TRUE_VISUAL_NAVIGATION_DESIGNER.md`

SPANDANA MERN — STEP 17
TRUE VISUAL NAVIGATION DESIGNER

This build carries forward Step 15/16 navigation structure, submenu styling, canonical destinations, actionable Quick Links, undo/redo, and adds a canvas-first editor layout.

Editor goals:
- Actual public Nav renderer on the canvas with authentic Branding logo.
- Desktop / Tablet / Mobile presentation views.
- Visual element selection, drag movement, resize handles, +/− and precision X/Y.
- Universal menu structure: add/edit/remove/hide/duplicate/reorder, parent/child/grandchild.
- Desktop placement and Mobile Header Strip selection from the same canonical tree.
- Individual child styling plus Apply to All Siblings.
- Canva-style Back/Front and Ctrl+Z/Ctrl+Y/Shift+Z.
- Semantic Destination Type → Destination selection.
- Safe-area guides, responsive/overflow warnings, and live renderer preview.

Security workstream remains deferred until this navigation workstream passes browser verification.

---


# SOURCE: `ADMIN_STEP18_TRUE_VISUAL_NAVIGATION_DESIGNER_REDESIGN.md`

# ADMIN STEP 18 — TRUE VISUAL NAVIGATION DESIGNER REDESIGN

This build replaces the Step 17 settings-heavy interaction with a canvas-first visual editing experience.

## Editor model
- The actual public navigation component is rendered on the center canvas.
- The real Branding logo is used in the canvas.
- Desktop, Tablet and Mobile are presentation modes backed by the same canonical menu tree.
- Left panel = layers/structure; center = actual navigation + page context; right panel = precision inspector.
- Dragging is the primary interaction; numeric controls remain a precision layer.

## Universal structure
- Add, rename/edit, show/hide, delete, duplicate and reorder top-level items.
- Add child to any item; child items can receive their own children.
- Child/grandchild styling is universal, not Sahara-specific.
- Sahara is not special-cased in rendering.

## Visual controls
- Drag logo, menu group, CTA group, mobile strip and hamburger.
- Select individual menu/submenu items on the actual canvas.
- Resize selected objects with corner handles.
- Use X/Y, scale, font size and colour in the inspector for precision.
- Menu group, CTA group and mobile strip each support group scaling.
- Safe-area guides and contextual sizing information are visible on the canvas.

## History
- Back / Front toolbar controls.
- Ctrl+Z = Back/Undo.
- Ctrl+Y or Ctrl+Shift+Z = Front/Redo.
- Revert to Last Saved.
- Multi-step history records meaningful visual changes.

## Destination model
- Destination Type -> Destination selector for internal/canonical links.
- Supports Home Section, Program, Sahara Center, Community Initiative, Project, Emergency Campaign, Event, Blog, External URL, Phone, Email, WhatsApp and No Destination.
- Accidental raw `#` placeholders are not a valid finished internal-navigation state.

## Mobile parity
- Mobile strip is derived from canonical menu IDs and can be selected/arranged separately as presentation.
- Hamburger remains the mobile full navigation tree.
- Both use the same canonical destinations.

## Verification status
- NavigationTab.tsx and nav.tsx parse successfully with the TypeScript parser.
- Full Vite dependency install/build could not be completed in the isolated environment because npm packages are not cached here; use the user's existing working node_modules.

---


# SOURCE: `ADMIN_STEP6_AUDIT_REPORT.md`

# Spandana Admin Panel — Step 6 Audit & Deduplication

## Scope
Audited the current `spandana-praveen-main` Admin Panel structure in Step 5 against the agreed Master architecture: Admin navigation ownership, duplicate management surfaces, Global Settings ownership, Page Builder placement, and legacy tab routing.

## Findings

### Removed/relocated duplicate Admin UI
- `Health Programs`, `Physical Health`, and `Mental Health` no longer operate as independent Admin surfaces. Legacy routes are redirected to canonical owners; the underlying files/data remain for migration safety.
- `Branding & Logo` was duplicated inside Global Settings. It is now under **Site Management → Branding**.
- `Social Media Links` was duplicated inside Global Settings and Footer. A canonical **Site Management → Social Media** owner is now present; the Global Settings copy was removed. Footer social data remains as legacy presentation data until the Footer renderer is migrated to the canonical social source.
- Homepage-specific controls previously embedded in Global Settings — promo video, newsletter section settings, campaign widget, volunteer spotlight settings, impact ticker items — were removed from Global Settings because they belong to Homepage/section-specific ownership rather than global configuration. Their underlying persisted settings were not deleted.
- Old page-specific Admin tabs (`VisionPage`, `StoriesPage`, `TestimonialsPage`) are no longer independent Admin routes; they redirect to the canonical owners.
- Duplicate CRUD-only Admin routes for blog posts, stories, testimonials, values, and game listings redirect to the canonical visible modules rather than remaining separate sidebar managers.

### Canonical navigation order
1. Dashboard
2. Site Management
3. Page Builder
4. Homepage
5. Pages
6. Community
7. People & Participation
8. Media

### Site Management
Now contains the global/structural controls: Global Settings, Branding, Social Media, Theme & Fonts, Navbar, Footer, SEO, Floating Menu, and Live Stream.

### Global Settings
Now contains only clearly global items:
- Global Contact Information
- WhatsApp Community Widget
- Content Protection

This removes the previous “second CMS” effect where Global Settings duplicated other Admin modules.

### Page Builder
Already positioned directly after Site Management. Its homepage section catalogue now calls the program section **Core Programs** rather than “Programs & Community Centers”.

## Remaining architectural gaps (not falsely marked complete)
- Footer still has its own stored contact/social presentation fields; these are duplicate persistence fields and should be migrated to canonical Contact/Social settings before deletion.
- Several canonical system areas from the Master architecture — People identity, Users/Roles/Permissions, Notifications, Global Search, Activity/Audit, Relationship Mapping, central Media Library, Legal, and version/workflow controls — are not yet fully exposed as independent Admin modules in this codebase. They are not being fabricated as dead sidebar links.
- Homepage content settings removed from Global Settings still need their final canonical editor owners (notably newsletter presentation, campaign widget, promo video, and impact ticker). Page Builder currently controls their placement/visibility, not all of their detailed content.
- Shop remains conditional and was not reclassified solely from its existence in code.

## Safety rule applied
No legacy backend data files, public routes, or underlying content components were deleted solely because their Admin navigation entries were redundant. This preserves migration safety.

---


# SOURCE: `ADMIN_STEP7_LEAN_IA_REPORT.md`

# Admin Step 7 — Lean Information Architecture

## Goal
Turn the Admin panel into a practical CMS with clear ownership, fewer duplicate entry points, and no generic "Pages" bucket for unrelated domains.

## Visible navigation changes
- Renamed `Navbar` to `Main Menu / Navigation`.
- Removed the generic `Pages` group from the Admin sidebar.
- Added clear operational groups: Community, Emergency Response, People & Participation, Events, Editorial, Fundraising, Joy Zone, Shop, Media.
- Kept `Page Builder` immediately after `Site Management`.
- Moved `Newsletter` into `People & Participation`.
- Removed `Floating Menu` and `Live Stream` from the primary sidebar to avoid presenting low-use specialist utilities as core CMS areas. Their underlying components/routes remain for compatibility and future specialist placement.
- Removed the separate `Community Initiatives` sidebar entry. Its existing route now redirects to the Sahara owner; the underlying CRUD code remains for safe migration.

## Ownership model
- Main Menu / Navigation owns the public main navigation structure.
- Page Builder owns homepage layout/order/visibility presentation only.
- Homepage owns homepage section content editors.
- Core Programs owns canonical Program records; programs carry Physical Care or Mental Care classification.
- Sahara Community Centers owns the public Sahara experience and will expose Physical Care, Mental Care and Community Initiatives as internal areas without creating duplicate Program stores.
- Emergency Aid & Relief remains an independent domain outside Core Programs.
- People & Participation owns people/volunteer/application/participation/newsletter-facing administration.
- Editorial owns Blog, Success Stories and Testimonials.
- Donate owns fundraising/payment configuration and donation workflow.
- Media Library remains the central media owner.

## Page Builder cleanup
Removed the broad Page Visibility and Module Visibility panels because they duplicated responsibilities of navigation/domain owners and created a second place to hide/manage content. Page Builder now focuses on homepage section order and per-device section visibility.

## Intentionally not deleted
Legacy Admin tab files and old routes remain in the repository where removal could affect existing frontend/API consumers. They are hidden from the primary navigation or redirected to canonical owners until migration/reference tracing is complete.

## Verification note
Frontend dependency installation/build was attempted in the isolated working copy but timed out in the execution environment. No production/build-pass claim is made here. The source changes were limited to the Admin navigation/IA and Page Builder presentation controls described above.

---


# SOURCE: `ADMIN_STEP8_IA_SCREEN_REBUILD.md`

# Step 8 — Admin IA Screen Rebuild

Implemented against the Step 7 lean Admin copy.

## Main Menu / Navigation
- Reframed the screen as the visitor-facing public Main Menu / Navigation manager.
- Added approved menu defaults: Home, Vision / Mission, Sahara Community Centers, Blog, Joyzone, Get Involved, Donate, Shop.
- Added explicit ordering controls (move up/down), visibility toggles, edit label/destination, add/remove menu items.
- Added Sahara Community Centers submenu management for Physical Care, Mental Care and Community Initiatives.
- Removed legacy Gallery from the approved primary menu normalization.
- Preserved custom menu items after the approved core order.

## Sahara Community Centers
- Reframed the screen as a parent workspace, not an ordinary page editor.
- Added three public-area selectors: Physical Care, Mental Care, Community Initiatives.
- Physical/Mental areas point to the canonical Core Programs manager rather than editing a duplicate program list.
- Community Initiatives uses the existing canonical initiative editor inside the Sahara workspace.
- Removed the duplicate inline "Active Programs" editor from Sahara page settings.
- Kept Sahara page-specific presentation content (hero, about, stats, facilities, hours, contact, CTA).

## Global Settings
- Kept only organization-wide information, Floating Menu, and Content Protection.
- Floating Menu now exposes basic global controls (enable, position, desktop/mobile visibility) without creating a separate top-level menu item.

## Safety
- No canonical Program/Project/Initiative data structures were merged.
- Existing legacy routes/files remain for migration compatibility.
- Visual styling was not intentionally changed.

---


# SOURCE: `ADMIN_STEP9_IMPLEMENTATION_REPORT.md`

# Admin Step 9 — Implementation Report

## Implemented in this pass

1. Mobile Header Strip controls were added to Main Menu / Navigation. The strip is a presentation layer for the same canonical navigation destinations and supports add/remove, enable/disable, order, label and destination plus header height and logo scale/position settings.
2. Sahara submenu rendering on the public desktop/mobile navigation now reads its configured children instead of hard-coded Physical/Mental items. Community Initiatives can therefore appear in the same canonical submenu.
3. Vision & Mission now has a Featured Spotlight configuration. The existing visual slot can use video, image/poster, hot news, upcoming event, emergency campaign or story content and may link to a destination.
4. A shared MediaLibraryPicker was added. Connected Admin fields can browse existing assets, filter image/video/all, select an existing asset, or upload a new image/video into the shared library.
5. The Media/Gallery backend record now stores mediaType, url and mimeType while keeping imageUrl compatibility. A single media upload route supports images and videos with binary-signature validation.
6. Media Library UI now previews image and video assets.

## Active Admin media fields connected
- Hero desktop image
- Hero desktop carousel images
- Hero video
- Hero mobile image
- Hero mobile carousel images
- Branding primary logo
- Branding white logo
- SEO share image
- Community Initiative image
- Emergency Campaign image
- Ad banner image
- Ad banner video
- Donate QR image
- Joy Zone QR image
- Vision & Mission Featured Spotlight media

## Remaining direct upload code
- Legacy HealthProgramsTab: retained for migration safety; not a visible canonical Admin destination.
- ShopAdminTab.broken-reference.tsx.bak: backup-only file; not an active Admin destination.
- GameListingsTab ZIP upload: intentionally not part of the media-library image/video model because it uploads game packages.

## Architecture decisions carried forward
- Floating Menu remains inside Global Settings / Site Settings.
- Generic Pages is not a domain bucket.
- Sahara Community Centers contains Physical Care, Mental Care and Community Initiatives as sibling areas.
- Core Programs remains the single canonical Program manager.
- Emergency Aid & Relief remains independent of Core Programs.
- Page Builder is presentation/layout, not a duplicate content database.
- Dashboard Quick Links remain a planned editable shortcut manager.

## Verification
Backend JavaScript syntax checks passed for the modified upload/gallery files. Full frontend build verification remains pending in the normal user development environment because the isolated environment does not contain complete dependency packages.

---


# SOURCE: `ARCHITECTURE.md`

# Spandana Care Aid Foundation — MERN Stack Architecture
**Complete File, Route & Feature Inventory**
Version: Production | Files: 419 | Stack: MongoDB + Express + React + Node.js

---

## TABLE OF CONTENTS
1. [Project Structure Overview](#1-project-structure-overview)
2. [Backend — Node.js / Express](#2-backend--nodejs--express)
3. [Database — MongoDB / JSON Fallback](#3-database--mongodb--json-fallback)
4. [Admin Panel — React (Frontend)](#4-admin-panel--react-frontend)
5. [Frontend Website — React](#5-frontend-website--react)
6. [Standalone Form Apps](#6-standalone-form-apps)
7. [Complete API Route Reference](#7-complete-api-route-reference)
8. [Features Included vs Not Included](#8-features-included-vs-not-included)
9. [Environment Variables](#9-environment-variables)
10. [Setup & Deployment Checklist](#10-setup--deployment-checklist)

---

## 1. PROJECT STRUCTURE OVERVIEW

```
spandana-mern/
├── backend/                    # Node.js + Express API server
│   ├── server.js               # Entry point
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # All required env vars documented
│   ├── config/
│   │   ├── env.js              # Validates env vars at startup
│   │   └── db.js               # MongoDB connection + JSON fallback
│   ├── middleware/             # 7 middleware files
│   ├── models/                 # 12 Mongoose models
│   ├── controllers/            # 13 controller files
│   ├── routes/v1/              # 14 route files
│   ├── services/               # 2 services (email, upload)
│   └── data/                   # 19 JSON seed/fallback files
│
└── frontend/                   # React + Vite website (single build — deploy this one folder)
    ├── src/
    │   ├── pages/              # 23 public pages + admin panel (51 files)
    │   │   └── embed/          # Standalone, iframe-embeddable widgets (merged in)
    │   │       ├── donate-widget.tsx     # was donate-form/src/App.tsx
    │   │       └── volunteer-widget.tsx  # was volunteer-form/src/App.tsx
    │   ├── components/         # 89 components (non-admin)
    │   ├── services/           # 18 API service files
    │   ├── hooks/              # 3 custom hooks
    │   └── lib/                # 3 utility libraries
    └── public/                 # 14 static assets
```

> **Note:** The former standalone `volunteer-form/` and `donate-form/` Vite apps have been merged into
> `frontend/` as routes `/embed/volunteer` and `/embed/donate`. There is now only **one** frontend to
> build and deploy — see [Section 6](#6-standalone-form-apps).

---

## 2. BACKEND — Node.js / Express

### Entry Point

| File | Purpose |
|---|---|
| `backend/server.js` | Starts Express on `PORT`, applies CSP headers, attaches request ID middleware, mounts `/api/v1`, handles graceful shutdown on SIGTERM/SIGINT |
| `backend/package.json` | Exact pinned versions — no `^` or `~` |
| `backend/.env.example` | All 12 env vars documented with descriptions |

---

### Config — `backend/config/`

| File | Purpose |
|---|---|
| `env.js` | Reads `.env`, validates all required vars at startup, throws if any missing — prevents silent misconfiguration |
| `db.js` | Connects to MongoDB via `MONGO_URI`. If connection fails or env var is absent, falls back to JSON file storage in `backend/data/`. Exports `isDbConnected()` used by every model. |

**JSON Fallback:** Every model checks `isDbConnected()` before each operation. If MongoDB is not available, reads/writes to local JSON files in `backend/data/`. This means the server runs without a database for development — no MongoDB required locally.

---

### Middleware — `backend/middleware/` (7 files)

| File | What it does |
|---|---|
| `asyncHandler.js` | Wraps async route handlers — catches rejected promises and forwards to Express error handler. Eliminates try/catch in controllers. |
| `auth.js` | `requireAdmin` — validates JWT from `Authorization: Bearer <token>` header. Returns 401 if missing/expired. Also exports `requireTeam` for team-member-only routes. |
| `errorHandler.js` | Global error handler — formats all errors as `{ error, message, requestId }`. Handles Zod validation errors (400), JWT errors (401), and generic 500s. |
| `paginate.js` | Reads `?page=` and `?limit=` query params. Attaches `req.pagination = { page, limit, skip }` for controllers. Default: page 1, limit 20, max 100. |
| `requestId.js` | Attaches a unique `X-Request-ID` UUID to every request and response. Used in error logging. |
| `uploadGuard.js` | Validates uploaded files — checks MIME type against allowed list (`image/jpeg`, `image/png`, `image/webp`, `image/gif`). Rejects invalid types with 400. |
| `validate.js` | Zod schema validator middleware — takes a Zod schema, validates `req.body`, returns 400 with field-level errors on failure. |

---

### Models — `backend/models/` (12 files)

| Model file | Collection | Key fields |
|---|---|---|
| `Settings.js` | `settings` | Singleton — entire site config as one JSON document. Fields: hero, vision, programs, timeline, team, testimonials, footer, theme, SEO, etc. |
| `Team.js` | `teams` | `name`, `username`, `passwordHash` (bcrypt, 12 rounds), `role`, `active`. `toSafeJSON()` strips hash from API responses. |
| `Event.js` | `events` | `title`, `description`, `date`, `time`, `location`, `category`, `image`, `published` |
| `Volunteer.js` | `volunteers` | `fullName`, `email`, `phone`, `occupation`, `skills`, `motivation`, `areasOfInterest[]`, `availability[]`, `declaration`, `status` |
| `BlogPost.js` | `blogposts` | `title`, `category`, `excerpt`, `content` (HTML), `date`, `readTime`, `image`, `published`, `author` |
| `Gallery.js` | `galleries` | `title`, `caption`, `imageUrl`, `category`, `published`, `order` |
| `Newsletter.js` | `newsletters` | `email`, `subscribedAt`, `active` |
| `Program.js` | `programs` | `title`, `description`, `category`, `image`, `published` |
| `Story.js` | `stories` | `title`, `excerpt`, `content` (HTML), `image`, `published` |
| `Testimonial.js` | `testimonials` | `name`, `role`, `text`, `image`, `rating` (1–5), `published`, `order` |
| `Value.js` | `values` | `title`, `description`, `icon`, `order`, `published` |
| `base.js` | — | `jsonModel(filePath)` factory — provides `getAll`, `getById`, `create`, `update`, `delete`, `replaceAll` for JSON file storage. Auto-generates `_id` as UUID. |

---

### Controllers — `backend/controllers/` (13 files)

| Controller | Methods | Notes |
|---|---|---|
| `authController.js` | `adminLogin`, `teamLogin`, `logout` | Admin uses `ADMIN_PASSWORD` env var. Team uses bcrypt-hashed password in Team model. Both return signed JWT. |
| `settingsController.js` | `getPublicSettings`, `getDraft`, `getStatus`, `saveDraft`, `publishSettings`, `getHistoryEntry` | Publish appends to `settings_history.json`. Draft saved separately from live. |
| `eventsController.js` | `listPublic`, `getOne`, `listAdmin`, `create`, `update`, `remove` | Public list filters `published: true`. |
| `volunteersController.js` | `submit`, `listAll`, `remove` | Submit sends confirmation email via `emailService`. |
| `blogController.js` | `listPublic`, `getOne`, `listAdmin`, `create`, `update`, `remove` | — |
| `teamController.js` | `listAll`, `create`, `update`, `remove` | Password hashed by `Team` model before storage. |
| `galleryController.js` | `listPublic`, `listAdmin`, `create`, `uploadBulk`, `update`, `remove` | `uploadBulk` uses multer + `uploadGuard`. |
| `newsletterController.js` | `subscribe`, `unsubscribe`, `listAll` | Deduplication on subscribe. |
| `contactController.js` | `submit` | Rate-limited (5 per 15 min). Sends email via `emailService`. |
| `programsController.js` | `listPublic`, `getOne`, `listAdmin`, `create`, `update`, `remove` | — |
| `storiesController.js` | `listPublic`, `getOne`, `listAdmin`, `create`, `update`, `remove` | — |
| `testimonialsController.js` | `listPublic`, `getOne`, `listAdmin`, `create`, `update`, `remove` | — |
| `valuesController.js` | `listPublic`, `getOne`, `listAdmin`, `create`, `update`, `remove` | — |

---

### Services — `backend/services/` (2 files)

| Service | Purpose |
|---|---|
| `emailService.js` | Sends transactional emails via Gmail SMTP using `nodemailer`. Used by contact and volunteer controllers. Requires `GMAIL_USER` + `GMAIL_APP_PASSWORD` env vars. |
| `uploadService.js` | Configures `multer` with disk storage to `backend/uploads/`. Exports `uploadSingle` and `uploadMultiple`. `uploads/` directory created at runtime. |

---

### Data Files — `backend/data/` (19 JSON files)

| File | Purpose | State |
|---|---|---|
| `settings.json` | Live site settings (published) | 34 KB — full site config |
| `settings_draft.json` | Admin draft (unpublished changes) | 38 KB |
| `settings_history.json` | Publish audit log — every publish saved | 212 KB |
| `events.json` | Event records | Seeded — 2 sample events |
| `blog-posts.json` | Blog post records | Seeded — 3 articles |
| `gallery.json` | Gallery image records | Seeded — 4 items |
| `game-listings.json` | Game catalog | Seeded — 8 games |
| `stories.json` | Success stories | Seeded — 3 stories |
| `testimonials.json` | Testimonials | Seeded — 4 items |
| `values.json` | Core values | Seeded — 5 values |
| `volunteers.json` | Volunteer applications | Empty `[]` — filled by form submissions |
| `team.json` | Team member accounts | Empty `[]` — added via admin panel (bcrypt) |
| `newsletter-subscribers.json` | Email list | 2 test entries |
| `community-initiatives.json` | Community programme records | Seeded |
| `health-programs.json` | Health programme records | Seeded |
| `posts.json` | Alternative blog posts store | Seeded |
| `products.json` | Shop product catalog | Seeded — 3 products |
| `shop-products.json` | Shop product catalog (admin view) | Seeded |
| `shop-orders.json` | Shop order records | 1 sample order |

---

## 3. DATABASE — MongoDB / JSON Fallback

### MongoDB (Production)
- **Connection:** `MONGO_URI` env var (e.g. MongoDB Atlas connection string)
- **ORM:** Mongoose 8.x
- **Collections:** settings, teams, events, volunteers, blogposts, galleries, newsletters, programs, stories, testimonials, values
- **Indexes:** All models have `timestamps: true` — `createdAt`/`updatedAt` auto-managed

### JSON Fallback (Development)
- When `MONGO_URI` is not set or connection fails, all reads/writes go to `backend/data/*.json`
- The `base.js` model provides identical API to Mongoose — controllers don't know the difference
- **Limitation:** No indexing, no complex queries, no transactions. Fine for local dev and small deployments.

### Authentication
This project does **not** use JWTs. It uses two simpler mechanisms:
- **Admin:** The `ADMIN_PASSWORD` itself is the bearer token — `requireAdmin` middleware
  compares the `Authorization: Bearer <token>` header to `ADMIN_PASSWORD` with a
  timing-safe comparison. Simple and functional, but the audit correctly flags this
  as not production-grade (the password never expires and doubles as the token).
- **Team members:** Login (`POST /api/auth/team/login`) verifies a bcrypt hash and
  returns an opaque `base64(username:id)` token. `requireTeam` middleware decodes it
  and re-looks-up the member on every request — there's no signature or expiry, so
  treat it as a session identifier rather than a secure credential.
- **No refresh tokens, no expiry** — tokens are valid until the admin password/team
  member is changed. For a public production deployment, replacing both with real
  signed JWTs (or session cookies) is worth doing before handling sensitive data.

---

## 4. ADMIN PANEL — React (Frontend)

**Route:** `/admin` and `/admin/:section`
**Login:** Uses `ADMIN_PASSWORD` (same as backend env var, entered in the browser)
**Files:** `frontend/src/pages/admin/` (3 shell files) + `frontend/src/components/admin/` (18 files)

### Shell Files

| File | Purpose |
|---|---|
| `pages/admin/index.tsx` | Auth gate, tab routing, settings load/save/publish state machine |
| `pages/admin/types.ts` | All TypeScript interfaces — `SiteSettings`, `HeroSection`, `TeamMember`, `NavItem`, etc. |
| `pages/admin/shared.tsx` | Shared UI: `Label`, `Field`, `SectionCard`, `DeviceTabs`, `VisibilityToggleRow` |

### Admin Tabs — `pages/admin/tabs/` (30 files)

| Tab file | Section slug | What it controls |
|---|---|---|
| `DashboardTab.tsx` | `dashboard` | Stats overview — volunteer count, event count, publish status |
| `HeroTab.tsx` | `hero` | Hero banner — badge, headline, subheading, two CTAs, background image, video |
| `SiteInfoTab.tsx` | `site-info` | Site name, tagline, logo, favicon, contact details, social links, address |
| `VisionTab.tsx` | `vision` | Vision & mission statements, stats (families helped, years, volunteers, camps) |
| `ProgramsTab.tsx` | `programs` | Programme cards — title, description, icon, colour, visibility |
| `TimelineTab.tsx` | `timeline` | Organisation history timeline — year, title, description |
| `ImpactTab.tsx` | `impact` | Impact numbers section — animated counters |
| `SuccessStoriesTab.tsx` | `success-stories` | Featured story card on homepage |
| `TestimonialsTab.tsx` | `testimonials` | Homepage testimonials carousel |
| `CoreValuesTab.tsx` | `values` | Core values displayed on home/vision pages |
| `VisionPageTab.tsx` | `vision-page` | Full vision page content |
| `StoriesPageTab.tsx` | `stories-page` | Success Stories page content |
| `TestimonialsPageTab.tsx` | `testimonials-page` | Testimonials page content |
| `SaharaTab.tsx` | `sahara` | Sahara programme page — hero, what we do, eligibility, how to apply |
| `SiteInfoTab.tsx` | `footer` | *(also handles footer)* |
| `FooterTab.tsx` | `footer` | Footer links, columns, copyright, social icons |
| `NavigationTab.tsx` | `navigation` | Main nav items — label, URL, visibility, order |
| `ThemeTab.tsx` | `theme` | Primary/accent/background colours, fonts, border radius, dark mode toggle |
| `AdsTab.tsx` | `ads` | Public service ads — title, image/video, link, schedule |
| `TeamTab.tsx` | `team` | Team member cards on public Team Portal page |
| `PhysicalHealthTab.tsx` | `physical-health` | Physical health page — hero, content blocks |
| `MentalHealthTab.tsx` | `mental-health` | Mental health page — hero, resources, helpline |
| `GetInvolvedTab.tsx` | `get-involved` | Get Involved page — ways to help, volunteer CTA |
| `DonateTab.tsx` | `donate` | Donate page — amounts, UPI ID, bank details, 80G info |
| `FunZoneTab.tsx` | `fun-zone` | Fun Zone page — header, intro text, game section visibility |
| `GamesTab.tsx` | `games` | Game listings management — CRUD for games catalog |
| `BlogTab.tsx` | `blog` | Blog page settings (uses BlogPostsTab component for post CRUD) |
| `EventsTab.tsx` | `events` | Events CRUD — create/edit/delete events |
| `VolunteersTab.tsx` | `volunteers` | Volunteer page content (text, form visibility) |
| `VolunteerAppsTab.tsx` | `volunteer-apps` | View/manage volunteer applications, export CSV |
| `SubscribersTab.tsx` | `subscribers` | View newsletter subscribers, export |

### Admin Components — `components/admin/` (18 files)

| Component file | Purpose |
|---|---|
| `AdminLayout.tsx` | Outer shell — sidebar, header, logout |
| `AdminNav.tsx` | Sidebar navigation — all tab links with icons |
| `AdminPlaceholder.tsx` | "Coming Soon" card for unbuilt sections |
| `ShopAdminTab.tsx` | Full shop management — products CRUD, order view, shop settings (141 KB) |
| `GalleryTab.tsx` | Gallery CRUD — upload, reorder, captions, categories |
| `BlogPostsTab.tsx` | Blog post CRUD — rich text editor, categories, publish toggle |
| `StoriesTab.tsx` | Success stories CRUD |
| `TestimonialsCrudTab.tsx` | Testimonials CRUD — rating, name, role, image |
| `ValuesCrudTab.tsx` | Core values CRUD — title, description, icon |
| `GameListingsTab.tsx` | Games catalog CRUD — title, description, emoji, paid/free toggle, price |
| `SeoTab.tsx` | SEO settings — meta title, description, OG image, robots, sitemap |
| `LiveStreamTab.tsx` | Live stream settings — YouTube/embed URL, schedule, visibility |
| `HealthProgramsTab.tsx` | Health programmes CRUD |
| `CommunityInitiativesTab.tsx` | Community initiatives CRUD |
| `PageBuilderTab.tsx` | Custom page builder — drag-and-drop content blocks |
| `FloatingMenuTab.tsx` | Floating action menu — items, icons, links, visibility |
| `TabControlBar.tsx` | Save/publish/preview toolbar shown at top of every tab |
| `RichTextEditor.tsx` | Lightweight rich text editor used in blog/stories/content tabs |

---

## 5. FRONTEND WEBSITE — React

### Pages — `frontend/src/pages/` (23 files)

| Page file | URL route | What the user sees |
|---|---|---|
| `home.tsx` | `/` | Hero, vision stats, programmes, timeline, impact counter, success stories, testimonials, newsletter signup |
| `blog.tsx` | `/blog` | Blog post list with search and category filter |
| `donate.tsx` | `/donate` | Donation amounts, UPI QR, bank details, 80G info, campaign widget |
| `events.tsx` | `/events` | Upcoming and past events list |
| `gallery.tsx` | `/gallery` | Image gallery with category filter, lightbox |
| `shop.tsx` | `/shop` | Product catalog, add to cart, checkout (frontend only) |
| `volunteer.tsx` | `/volunteer` | Volunteer registration form (multi-step) |
| `fun-zone.tsx` | `/fun-zone` | Game hub — all 8 games playable |
| `programs.tsx` | `/programs` | Health & community programmes list |
| `sahara.tsx` | `/sahara` | Sahara crisis support programme page |
| `team-portal.tsx` | `/team-portal` | Team member directory and portal |
| `vision-page.tsx` | `/vision` | Full vision, mission, values page |
| `testimonials-page.tsx` | `/testimonials` | Full testimonials page |
| `success-stories-page.tsx` | `/success-stories` | Full success stories page |
| `physical-health-page.tsx` | `/physical-health` | Physical health programme detail |
| `mental-health-page.tsx` | `/mental-health` | Mental health resources and helpline |
| `get-involved.tsx` | `/get-involved` | Ways to help — volunteer, donate, spread word |
| `live-stream.tsx` | `/live-stream` | Live stream embed (YouTube/custom URL) |
| `coloring.tsx` | `/coloring` | Interactive coloring activity for children |
| `privacy.tsx` | `/privacy` | Privacy policy |
| `terms.tsx` | `/terms` | Terms and conditions |
| `not-found.tsx` | `*` | 404 page |
| `core-values.tsx` | `/values` | Core values page |

### Components — `frontend/src/components/` (89 files)

**Navigation & Layout (5):**
`nav.tsx`, `Header.tsx`, `MobileMenu.tsx`, `footer.tsx`, `floating-menu-preview.tsx`

**Content Blocks (10):**
`testimonials.tsx`, `success-stories.tsx`, `timeline.tsx`, `vision-mission-block.tsx`,
`impact-calculator.tsx`, `impact-ticker.tsx`, `trust-strip.tsx`, `newsletter.tsx`,
`campaign-widget.tsx`, `volunteer-spotlight.tsx`

**Interactive (3):**
`volunteer-modal.tsx`, `ads-carousel.tsx`, `community-chat.tsx`

**Utility (3):**
`content-protection.tsx`, `font-size-control.tsx`, `MusicPlayer.tsx`

**Games — `components/games/` (11):**

| Component | Game |
|---|---|
| `tic-tac-toe.tsx` | Tic Tac Toe — vs AI or 2 player |
| `memory-match.tsx` | Memory card matching game |
| `ludo-game.tsx` | Ludo board — 2–4 players |
| `multiplayer-ludo.tsx` | WebSocket multiplayer Ludo |
| `snakes-ladders.tsx` | Snakes and Ladders |
| `tambola.tsx` | Tambola / Housie |
| `darts.tsx` | Darts — timing-based |
| `match3.tsx` | Match-3 candy puzzle |
| `platformer.tsx` | Side-scrolling platformer |
| `multiplayer-ttt.tsx` | WebSocket multiplayer Tic Tac Toe |
| `pay-to-play.tsx` | UPI payment screen (UI only) |
| `how-to-play.tsx` | Shared how-to-play accordion |

**shadcn/ui Components — `components/ui/` (55 files):**
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card, input, input-group, input-otp, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip

### Services — `frontend/src/services/` (18 files)

All API calls go through these service files — no raw `fetch()` calls in components.

| Service file | Base path | Methods |
|---|---|---|
| `api.js` | `/api/v1` | Base axios instance with auth token header |
| `authService.js` | `/auth` | `adminLogin`, `teamLogin`, `logout` |
| `settingsService.js` | `/settings` | `getPublic`, `getDraft`, `saveDraft`, `publish` |
| `eventsService.js` | `/events` | `list`, `getOne`, `create`, `update`, `delete` |
| `blogService.js` | `/blog` | `list`, `getOne`, `create`, `update`, `delete` |
| `galleryService.js` | `/gallery` | `list`, `create`, `uploadBulk`, `update`, `delete` |
| `shopService.js` | `/shop` | `getProducts`, `createOrder` (frontend only) |
| `teamService.js` | `/admin/team` | `list`, `create`, `update`, `delete` |
| `volunteersService.js` | `/volunteers` | `submit`, `listAll`, `delete` |
| `newsletterService.js` | `/newsletter` | `subscribe`, `unsubscribe`, `listAll` |
| `contactService.js` | `/contact` | `submit` |
| `testimonialsService.js` | `/testimonials` | `list`, `getOne`, `create`, `update`, `delete` |
| `storiesService.js` | `/stories` | `list`, `getOne`, `create`, `update`, `delete` |
| `valuesService.js` | `/values` | `list`, `getOne`, `create`, `update`, `delete` |
| `programsService.js` | `/programs` | `list`, `getOne`, `create`, `update`, `delete` |
| `uploadService.js` | `/admin/gallery/bulk` | `uploadImages` |
| `cmsService.js` | `/admin/settings` | `getCmsBlocks`, `updateBlock` |
| `adsService.js` | `/admin/settings` | `getAds`, `updateAds` |

### Hooks — `frontend/src/hooks/` (3 files)

| Hook | Purpose |
|---|---|
| `use-mobile.tsx` | Returns `true` if viewport width < 768px (Tailwind `md` breakpoint) |
| `use-toast.ts` | Toast notification state — `toast()`, `dismiss()` |
| `use-font-size.ts` | Persists user's preferred font size in localStorage |

### Lib — `frontend/src/lib/` (3 files)

| File | Purpose |
|---|---|
| `utils.ts` | `cn()` — merges Tailwind class names using `clsx` + `tailwind-merge` |
| `cart-context.tsx` | React context for shop cart — add, remove, update quantity, total |
| `sound.ts` | `playSound(type)` — plays game sound effects (win, click, error) |

### Public Assets — `frontend/public/` (14 files)

| File/Folder | Content |
|---|---|
| `favicon.svg` | Spandana favicon |
| `logo.png` | Spandana logo (used in navbar) |
| `opengraph.jpg` | OG social share image |
| `robots.txt` | `User-agent: * / Allow: /` |
| `sitemap.xml` | XML sitemap for search engines |
| `images/hero.png` | Homepage hero background |
| `images/hero-indian.png` | Alternative hero image |
| `images/center.png` | Community center image |
| `images/physical.png` | Physical health page image |
| `images/mental.png` | Mental health page image |
| `ads/child-labor.png` | Public service ad — child labour awareness |
| `ads/no-drugs.png` | Public service ad — anti-drugs |
| `ads/no-trafficking.png` | Public service ad — anti-trafficking |
| `ads/spandana-community.mp4` | Community video ad |

---

## 6. STANDALONE FORM APPS (now merged into `frontend/`)

Previously `volunteer-form/` and `donate-form/` were separate Vite + React apps with their own
`package.json` and shadcn/ui component copies, unused by the deploy scripts (nginx, Docker, and
`deploy.sh` only ever built/served `frontend/`). They've been folded into `frontend/` as two
routes so there is a single app to build and deploy on Hostinger.

### `/embed/volunteer` — `frontend/src/pages/embed/volunteer-widget.tsx`
Multi-step volunteer registration form, rendered standalone (no site header/footer/floating
widgets) so it can be dropped into an `<iframe>` on this site or an external one (e.g. WordPress).

| Detail | Value |
|---|---|
| Route | `/embed/volunteer` |
| API call | `POST /api/v1/volunteers` |
| Extra deps added to `frontend/package.json` | `react-hook-form`, `@hookform/resolvers`, `@radix-ui/react-checkbox`, `@radix-ui/react-popover`, `react-day-picker` |

### `/embed/donate` — `frontend/src/pages/embed/donate-widget.tsx`
Donation form — amounts, UPI, bank details. Same standalone rendering approach.

| Detail | Value |
|---|---|
| Route | `/embed/donate` |
| API call | `GET /api/v1/settings` (for dynamic UPI/bank details) |

Both widgets reuse the shadcn/ui components already present in `frontend/src/components/ui`
(identical copies existed in all three original folders), so no UI component files needed to be
duplicated — only the missing Radix/form packages were added to `frontend/package.json`.

The full site also has its own richer `/donate` and `/volunteer` pages (with header/footer/nav) —
those are unrelated, pre-existing pages and were left as-is. The `/embed/*` routes are specifically
for bare, embeddable widgets.

---

## 7. COMPLETE API ROUTE REFERENCE

All routes are prefixed `/api/v1/`.
`🔒` = Requires `Authorization: Bearer <token>` header.

### Authentication
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/admin/login` | No | Admin login — body: `{ password }` — returns JWT |
| POST | `/auth/team/login` | No | Team login — body: `{ username, password }` — returns JWT |
| POST | `/auth/logout` | No | Clears server-side session (informational) |

### Settings
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/settings` | No | Returns live (published) site settings |
| GET | `/admin/settings/draft` | 🔒 | Returns current draft settings |
| GET | `/admin/settings/status` | 🔒 | Returns draft vs live diff status |
| PUT | `/admin/settings` | 🔒 | Save draft — body: full settings object |
| POST | `/admin/settings/publish` | 🔒 | Publish draft → live |
| GET | `/admin/settings/history/:index` | 🔒 | Get a specific publish history entry |

### Events
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/events` | No | List published events — `?page=&limit=` |
| GET | `/events/:id` | No | Get single event |
| GET | `/admin/events` | 🔒 | List all events (including unpublished) |
| POST | `/admin/events` | 🔒 | Create event |
| PUT | `/admin/events/:id` | 🔒 | Update event |
| DELETE | `/admin/events/:id` | 🔒 | Delete event |

### Blog Posts
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/blog` | No | List published posts — `?page=&limit=` |
| GET | `/blog/:id` | No | Get single post |
| GET | `/admin/blog` | 🔒 | List all posts |
| POST | `/admin/blog` | 🔒 | Create post |
| PUT | `/admin/blog/:id` | 🔒 | Update post |
| DELETE | `/admin/blog/:id` | 🔒 | Delete post |

### Gallery
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/gallery` | No | List published images — `?page=&limit=` |
| GET | `/admin/gallery` | 🔒 | List all images |
| POST | `/admin/gallery` | 🔒 | Create gallery item |
| POST | `/admin/gallery/bulk` | 🔒 | Bulk upload images (multipart/form-data) |
| PUT | `/admin/gallery/:id` | 🔒 | Update gallery item |
| DELETE | `/admin/gallery/:id` | 🔒 | Delete gallery item |

### Volunteers
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/volunteers` | No | Submit volunteer application |
| GET | `/admin/volunteers` | 🔒 | List all applications — `?page=&limit=` |
| DELETE | `/admin/volunteers/:id` | 🔒 | Delete application |

### Team
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/admin/team` | 🔒 | List team members |
| POST | `/admin/team` | 🔒 | Create team member — body: `{ name, username, password, role }` |
| PUT | `/admin/team/:id` | 🔒 | Update team member |
| DELETE | `/admin/team/:id` | 🔒 | Delete team member |

### Newsletter
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/newsletter/subscribe` | No | Subscribe — body: `{ email }` |
| POST | `/newsletter/unsubscribe` | No | Unsubscribe — body: `{ email }` |
| GET | `/admin/newsletter` | 🔒 | List all subscribers |

### Contact
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/contact` | No | Submit contact form — rate limited: 5 per 15 min per IP |

### Programs
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/programs` | No | List published programs |
| GET | `/programs/:id` | No | Get single program |
| GET | `/admin/programs` | 🔒 | List all programs |
| POST | `/admin/programs` | 🔒 | Create program |
| PUT | `/admin/programs/:id` | 🔒 | Update program |
| DELETE | `/admin/programs/:id` | 🔒 | Delete program |

### Stories
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/stories` | No | List published stories |
| GET | `/stories/:id` | No | Get single story |
| GET | `/admin/stories` | 🔒 | List all stories |
| POST | `/admin/stories` | 🔒 | Create story |
| PUT | `/admin/stories/:id` | 🔒 | Update story |
| DELETE | `/admin/stories/:id` | 🔒 | Delete story |

### Testimonials
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/testimonials` | No | List published testimonials |
| GET | `/testimonials/:id` | No | Get single testimonial |
| GET | `/admin/testimonials` | 🔒 | List all testimonials |
| POST | `/admin/testimonials` | 🔒 | Create testimonial |
| PUT | `/admin/testimonials/:id` | 🔒 | Update testimonial |
| DELETE | `/admin/testimonials/:id` | 🔒 | Delete testimonial |

### Values
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/values` | No | List published values |
| GET | `/values/:id` | No | Get single value |
| GET | `/admin/values` | 🔒 | List all values |
| POST | `/admin/values` | 🔒 | Create value |
| PUT | `/admin/values/:id` | 🔒 | Update value |
| DELETE | `/admin/values/:id` | 🔒 | Delete value |

### API Docs
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/docs` | No | Returns JSON listing of all available API routes |

**Total: 56 API routes across 14 resource groups**

---

## 8. FEATURES INCLUDED vs NOT INCLUDED

### Fully included and working
- Complete website (23 pages, all content dynamic from settings)
- Full admin panel (30 tab sections + 18 CRUD components)
- All 8 games (Tic Tac Toe, Memory Match, Ludo, Snakes & Ladders, Tambola, Darts, Match 3, Platformer)
- WebSocket multiplayer (Tic Tac Toe, Ludo)
- Volunteer registration form + email confirmation
- Contact form + email notification
- Newsletter subscribe/unsubscribe
- Gallery with bulk image upload
- Blog with rich text editor
- Success stories, testimonials, core values CRUD
- Events management
- Settings publish/draft/history system
- JWT authentication (admin + team members)
- Mobile-responsive design
- Dark mode support (theme settings)
- Font size control (accessibility)
- SEO settings (meta, OG, sitemap)
- Public Service Ads carousel
- Live stream embed
- Coloring activity page
- Interactive impact calculator
- Sahara crisis support page
- Physical & mental health pages
- Floating action menu

### Included — UI only, backend not connected
- **Shop** (`shop.tsx`, `ShopAdminTab.tsx`) — product display and cart work; checkout needs Razorpay backend
- **Pay-to-play games** (`pay-to-play.tsx`) — UPI QR screen shows; payment verification needs backend
- **Google Sheets sync** (button in VolunteerAppsTab) — needs Google service account backend route
- **Multiplayer games** — WebSocket works if your hosting supports it (not guaranteed on all shared hosts)

### Not included
- Razorpay payment processing backend (`shopController.js`, `routes/v1/shop.js`)
- Google Sheets API sync backend
- `backend/uploads/` directory — created automatically at runtime

---

## 9. ENVIRONMENT VARIABLES

All required variables are documented in `backend/.env.example`.
(These names are read directly by `backend/config/env.js` — this section
previously listed different names like `JWT_SECRET` / `MONGODB_URI` /
`CORS_ORIGIN`, which the server does not actually read; corrected below.)

### Backend (required to run)
| Variable | Description | Example |
|---|---|---|
| `ADMIN_PASSWORD` | Admin panel login password | `YourSecurePassword123!` |
| `SESSION_SECRET` | Random secret used for token comparisons (min 32 chars) | `your-very-long-random-secret-here` |

### Backend (optional — enables extra features)
| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DATA_DIR` | Path to data JSON files | `backend/data` |
| `UPLOADS_DIR` | Path to uploaded files | `backend/uploads` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origin(s) | `http://localhost:5173` |
| `MONGO_URI` | MongoDB Atlas connection string. If absent, uses JSON file storage. | — |
| `GMAIL_USER` | Gmail address for sending emails | — |
| `GMAIL_APP_PASSWORD` | Gmail app password (not account password) | — |
| `CONTACT_EMAIL` | Where contact-form alerts are sent | — |
| `RAZORPAY_KEY_ID` / `RAZORPAY_SECRET` | Shop checkout payments | — |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Enables the admin "Sync to Sheet" button | — |

### Frontend (build time)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL. Leave as `/api` (default) for same-origin deploys — see DEPLOYMENT.md. |

---

## 10. SETUP & DEPLOYMENT CHECKLIST

### Local Development (No MongoDB needed)
```bash
# 1. Install backend
cd backend && npm install

# 2. Copy env file and set minimum vars
cp .env.example .env
# Edit .env: set ADMIN_PASSWORD, SESSION_SECRET, PORT=5000

# 3. Start backend
npm start
# Server runs on http://localhost:5000
# Data stored in backend/data/*.json

# 4. Install and start frontend
cd ../frontend && npm install
npm run dev
# Frontend on http://localhost:5173
# Proxy to backend already configured in vite.config.ts
```

### Production with MongoDB Atlas
```bash
# 1. Set MONGO_URI in backend .env
MONGO_URI=mongodb+srv://[REDACTED]

# 2. Build frontend
cd frontend && npm run build
# Output in frontend/dist/

# 3. Serve frontend/dist/ as static files from backend
# OR deploy frontend to Netlify/Vercel, backend to Railway/Render

# 4. Set CORS_ORIGINS to your frontend domain
# 5. Set VITE_API_URL to your backend URL
```

### VPS / cPanel Deployment
```
1. Upload backend/ to server, run npm install --production
2. Set all env vars in server environment
3. Build frontend: npm run build
4. Upload frontend/dist/ to public_html
5. Point domain to public_html
6. Run backend with PM2: pm2 start server.js --name spandana
7. Configure nginx/Apache reverse proxy for /api → backend:5000
```

### Gmail Email Setup
```
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate app password for "Mail"
4. Set GMAIL_USER=yourname@gmail.com
5. Set GMAIL_APP_PASSWORD=the-16-char-app-password
```

## Central Media Library — Admin-wide field connection (Step 9)
The Central Media Library is the canonical asset source for supported Admin image/video fields. A shared `MediaLibraryPicker` allows an editor to browse, filter, select, or upload an asset without creating a second media store. Connected modules include Hero, Branding, SEO share image, Community Initiatives, Emergency Campaigns, Ads, Donate QR, Joy Zone QR and Vision & Mission Featured Spotlight. The same media asset can be reused across modules. Legacy direct-upload code remains only where the surface is legacy/backup or the uploaded file is a non-media package such as a game ZIP.

---


# SOURCE: `CAMPAIGN_16_SECTIONS_IMPLEMENTATION.md`

# Campaign 16-Section Structured Implementation

This implementation replaces the previous generic JSON-style campaign editor with a real structured Campaign Builder.

## 16 sections
1. Basic Information
2. Fundraising Goal
3. Needs & Requirements
4. Volunteers & Participation
5. Skills & Expertise Needed
6. Sponsorship Opportunities
7. In-Kind Support
8. Beneficiaries & Expected Impact
9. Campaign Team & Contacts
10. Location & Logistics
11. Documents & Attachments
12. Partners & Sponsors
13. Campaign Updates & Progress
14. Communication & Thank-You
15. Payment & Giving Options
16. Visibility, Publishing & Campaign Controls

## Implementation behavior
- Every section is optional.
- Every section has Section Enabled and Publicly Visible controls.
- Repeatable sections have Add/Remove controls and real fields rather than a JSON textarea.
- Campaign data is persisted in `campaignDetails` as structured JSON/Mixed data so the architecture can grow without a rigid migration for every new optional field.
- Campaign-specific donation options remain separate from general donation opportunities.
- Public campaign URL: `/campaigns/:id`.
- Public campaign page hides internal taxonomy and presents visitor-friendly headings.
- Support Now links into the existing campaign-specific donation flow.

## Verification
Backend syntax checks passed for the modified backend files.
Frontend full Vite/TypeScript build was not run because the extracted working environment does not contain frontend node_modules.

---


# SOURCE: `DEPLOYMENT.md`

# Spandana Care Aid Foundation — Deployment Guide

## QUICK START (3 options — pick one)

---

## Option A: VPS / Ubuntu Server (Recommended)

### Requirements
- Ubuntu 20.04+ / Debian 11+
- Node.js 18+
- Nginx
- PM2 (process manager)

### Step 1 — Upload project
```bash
# Upload the zip to your server
scp spandana-mern.zip user@your-server-ip:/var/www/

# On server: unzip
cd /var/www
unzip spandana-mern.zip
mv spandana-mern spandana
cd spandana
```

### Step 2 — Configure environment
```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Set these minimum values:
```
PORT=5000
NODE_ENV=production
ADMIN_PASSWORD=[REDACTED]
SESSION_SECRET=[REDACTED]
DATA_DIR=/var/www/spandana/backend/data
CORS_ORIGINS=https://yourdomain.com

# Optional — enables email notifications
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=[REDACTED]

# Optional — enables MongoDB (otherwise uses JSON files)
MONGO_URI=mongodb+srv://[REDACTED]
```

### Step 3 — Run deploy script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 4 — Configure Nginx
```bash
# Install nginx if needed
sudo apt install nginx -y

# Copy config
sudo cp nginx/spandana.conf /etc/nginx/sites-available/spandana

# Edit your domain name in the config
sudo nano /etc/nginx/sites-available/spandana
# Change: server_name spandana.org www.spandana.org;
# To:     server_name yourdomain.com www.yourdomain.com;

# Also update root path if different:
# root /var/www/spandana/frontend/dist;

# Enable site
sudo ln -s /etc/nginx/sites-available/spandana /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5 — SSL Certificate (Free — Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 6 — PM2 auto-start on reboot
```bash
pm2 startup
# Run the command it gives you (starts with "sudo env PATH=...")
pm2 save
```

---

## Option B: cPanel / Hostinger Shared Hosting (hPanel)

### Limitations on shared hosting
- Cannot run Node.js backend directly unless your plan includes "Setup Node.js App" (Hostinger Business/Cloud plans have this; entry-level shared plans do not — check hPanel → Advanced → Setup Node.js App)
- Frontend is served as static files; backend runs as a separate Node.js process

### Step 1 — Build frontend locally first
```bash
cd frontend
npm install
VITE_API_URL=/api npm run build
```
`VITE_API_URL=/api` (not `/api/v1`) matches the routes this frontend actually calls — see the note under "Environment Variables Reference" below.

### Step 2 — Upload
```
Upload frontend/dist/*  → public_html/
Upload backend/         → a non-public folder, e.g. /home/USERNAME/spandana-api/
```
(In hPanel File Manager: create the `spandana-api` folder outside `public_html`, then upload/extract the backend folder there.)

### Step 3 — Node.js app in hPanel
1. hPanel → Advanced → **Setup Node.js App** → Create Application
   - Node.js version: 18 or newer
   - Application mode: Production
   - Application root: `spandana-api` (the folder from Step 2)
   - Application startup file: `server.js`
   - Application URL: your domain, or a subdomain/subfolder used only for the API
2. In the same screen, add the environment variables listed below under
   "Environment Variables Reference" (at minimum `ADMIN_PASSWORD` and `SESSION_SECRET`).
3. Click **Run NPM Install**.
4. Click **Start App** (or Restart if already running). Hostinger keeps it running for you — no PM2 needed on shared hosting.

### Step 4 — API routing
The frontend calls the API at `/api/...` on the same domain, so requests need to be
proxied from `public_html` to the Node.js app. Add this to `public_html/.htaccess`
(replace `5000` with the port hPanel assigned to your Node.js app, shown on the
Setup Node.js App screen):
```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:5000/api/$1 [P,L]

# React SPA — everything else falls back to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```
If your hosting doesn't allow `mod_proxy` (`[P]` flag), use a subdomain
(e.g. `api.yourdomain.com`) pointed at the Node.js app instead, and set
`VITE_API_URL=https://api.yourdomain.com/api` when building the frontend in Step 1.

---

## Option C: Docker (Easiest for full-stack)

### Requirements
- Docker + Docker Compose installed

### Deploy
```bash
# Set your API URL
export VITE_API_URL=https://yourdomain.com/api/v1

# Start everything (builds frontend, starts backend + nginx)
docker-compose up -d

# Check logs
docker-compose logs -f spandana
```

### Stop
```bash
docker-compose down
```

### Update
```bash
git pull  # or re-upload files
docker-compose up -d --build
```

---

## Option D: Hostinger — GitHub Auto-Deploy (push-to-deploy, no zip uploads)

**Requires** Hostinger Business Web Hosting or a Cloud plan (Cloud Startup/Professional/Enterprise) — Node.js Web Apps hosting is not available on entry-level shared plans.

This repo is set up to deploy as **one single Node.js app**: `npm run build` builds
the React frontend and installs backend dependencies, and `backend/server.js` now
serves the built frontend (`frontend/dist`) itself alongside the API — so there's
nothing to split across two hostings or configure with nginx.

### Step 1 — Push this repo to GitHub
```bash
git init   # if not already a repo
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
Do **not** commit `backend/.env` (it should already be in `.gitignore`) — you'll set
environment variables in hPanel instead, in Step 4.

### Step 2 — Add the website in hPanel
1. hPanel → **Websites** → **Add Website**
2. Choose **Node.js Apps** → **Import Git Repository**
3. Click **Continue with GitHub**, authorize Hostinger, and pick this repository

### Step 3 — Build settings
Hostinger will try to auto-detect the framework. Since this is a monorepo (frontend
+ backend in one repo), it will likely be detected as **"Other"** — set these manually:
| Field | Value |
|---|---|
| Install command | `npm run install:all` |
| Build command | `npm run build` |
| Output directory | *(leave blank — this isn't a static-only app)* |
| Entry file | `index.js` |

If the build-settings screen offers a **Root directory** field, leave it blank/`.`
(repo root) — the root `package.json`'s `build`/`start` scripts already know how to
reach into `frontend/` and `backend/`.

### Step 4 — Environment variables
In the same setup screen (or afterwards under the app's **Environment Variables**
tab), add at minimum:
```
ADMIN_PASSWORD=[REDACTED]
SESSION_SECRET=[REDACTED]
NODE_ENV=production
MONGO_URI=mongodb+srv://[REDACTED]   # optional — omit to use JSON file storage
CORS_ORIGINS=https://yourdomain.com
```
(`PORT` is set automatically by Hostinger — don't override it.)

### Step 5 — Deploy
Click **Deploy**. Hostinger builds and starts the app, then gives you a live preview.

### Step 6 — Auto-deploy on every push
No extra setup needed — once connected via GitHub, Hostinger **automatically
rebuilds and redeploys** the app on every push to the selected branch. Just:
```bash
git add .
git commit -m "some change"
git push
```
...and the live site updates on its own. You can watch build/deploy status and logs
under the app's **Deployments** tab in hPanel.

### Database
For MongoDB, either use MongoDB Atlas (set `MONGO_URI` as above — see the
Atlas setup section below) or use hPanel's built-in **Database Connect Wizard**
under the Node.js app dashboard, which supports MongoDB Atlas and Supabase and
wires up the environment variable for you automatically.

---

## Environment Variables Reference

These are the **actual** variable names read by `backend/config/env.js` — use these
exact names (older drafts of this doc used different names like `JWT_SECRET` /
`MONGODB_URI` / `CORS_ORIGIN`, which the server does **not** read).

### Required (backend/.env) — server refuses to start without these
| Variable | Description |
|---|---|
| `ADMIN_PASSWORD` | Admin panel login password |
| `SESSION_SECRET` | Random 64-char string — never share this |

### Optional
| Variable | Enables | Default |
|---|---|---|
| `PORT` | Backend port | `3000` |
| `NODE_ENV` | Set to `production` on a live server | `development` |
| `MONGO_URI` | MongoDB Atlas connection string (without this, uses JSON file storage in `backend/data/`) | — |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:5173` |
| `DATA_DIR` | Full path to the JSON data folder | `backend/data` |
| `UPLOADS_DIR` | Full path to the uploads folder | `backend/uploads` |
| `GMAIL_USER` | Gmail address used to send emails | — |
| `GMAIL_APP_PASSWORD` | Gmail app password (not your account password) | — |
| `CONTACT_EMAIL` | Where contact-form alerts are sent | — |
| `RAZORPAY_KEY_ID` / `RAZORPAY_SECRET` | Shop checkout payments | — |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Enables the admin "Sync to Sheet" button (a Google Apps Script Web App URL — see below) | — |

For a production deploy, also set `CORS_ORIGINS` to your real domain(s), e.g.
`CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`.

---

## Gmail App Password Setup
1. Enable 2FA on your Gmail account
2. Go to: Google Account → Security → 2-Step Verification → App Passwords
3. Select "Mail" → Generate
4. Copy the 16-character password → set as `GMAIL_APP_PASSWORD`

---

## MongoDB Atlas Setup (Optional — for production database)
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster
2. Create a database user (username + password)
3. Whitelist your server IP (or 0.0.0.0/0 for any)
4. Click Connect → Drivers → Copy connection string
5. Replace `<password>` with your password
6. Set as `MONGO_URI` in backend/.env

Without MongoDB: the server uses JSON files in `backend/data/` — works perfectly for small sites.

---

## Google Sheets Sync Setup (Optional — for the admin "Sync to Sheet" button)
This feature has no external dependency by default — it just tells you it isn't
configured, and "Download CSV" (already in the same screen) works with zero setup.
To make "Sync to Sheet" actually push subscribers into a Google Sheet:
1. Create a Google Sheet, then Extensions → Apps Script
2. Add a script with a `doPost(e)` function that parses `JSON.parse(e.postData.contents).subscribers`
   and appends each email as a new row
3. Deploy → New deployment → Web app → Execute as "Me" → Who has access "Anyone with the link"
4. Copy the deployment URL → set as `GOOGLE_SHEETS_WEBHOOK_URL` in backend/.env

---

## Useful Commands (after deploy)

```bash
# View backend logs
pm2 logs spandana-api

# Restart backend
pm2 restart spandana-api

# Check backend health
curl http://localhost:5000/api/v1/docs

# Check nginx status
sudo systemctl status nginx

# View nginx error log
sudo tail -f /var/log/nginx/error.log

# Admin panel URL
# https://yourdomain.com/admin

# API docs URL
# https://yourdomain.com/api/v1/docs
```

---

## Folder Structure After Deploy

```
/var/www/spandana/
├── backend/
│   ├── server.js          ← Entry point
│   ├── .env               ← Your environment variables
│   ├── data/              ← JSON data files (auto-created)
│   └── uploads/           ← Uploaded images (auto-created)
├── frontend/
│   └── dist/              ← Built React app (served by nginx)
├── ecosystem.config.json  ← PM2 config
├── nginx/spandana.conf    ← Nginx config (copy to sites-available)
├── deploy.sh              ← Build + launch script
└── DEPLOYMENT.md          ← This file
```

---


# SOURCE: `DONATE_CURATED_DESIGN_V22.md`

# Donate Curated Design V22 — 2026-09-04

The Donate page visual design has been simplified and curated instead of exposing a large set of manual design controls.

## Public Donate
- Warm ivory background with restrained Spandana deep blue typography.
- Donation Opportunities use compact, consistent 3+3 mobile / 6 desktop controls.
- Selecting an opportunity opens one compact support panel below the opportunity grid rather than expanding individual cards in place.
- Campaigns and Specific Needs use exactly the same card geometry, spacing, typography hierarchy, image/cover area, and action layout.
- Specific Needs receive a neutral visual cover so their card structure matches Campaign cards.
- Support cards use equal height, restrained borders, 22px radius, subtle shadow, 18px grid gap, and compact pill actions.
- Progress uses a quiet natural-green bar.
- Desktop content is constrained to approximately 1180px so it remains judgeable on ultra-wide monitors.

## Admin
- Removed the long list of Donate visual sliders/colour controls from the visual designer.
- Admin Donate now shows the real Donate page in a controlled 1366px desktop viewport and 390px mobile viewport simultaneously.
- Both previews are scrollable and use the same Donate component rendered by the public page.
- Open Donate, Preview, and Save Draft remain available.

---


# SOURCE: `DONATE_DESKTOP_UX_FULL_FIX_V24.md`

# Donate Desktop UX Full Fix — V24

Implemented after live desktop review.

## Fixed
- Donate hero now clears the fixed header; “Give with Joy” is fully visible.
- Hero remains restrained and the decorative pill stays removed.
- Donation Opportunities remain 6 across desktop and 3+3 on mobile.
- Removed opportunity emojis/icons, short descriptions, and expand/collapse arrows.
- Clicking an opportunity still reveals its introduction and giving controls.
- Selected opportunity support panel is kept compact.
- Ways to Support balances two desktop cards across two columns; 3+ items use three columns.
- Campaign and Specific Need support cards keep the same geometry and action pattern.
- Support buttons use direct Donate checkout navigation with campaign/requirement parameters.
- Donate checkout automatically scrolls into view when opened from support.
- Specific Need detail has clear Back to Donate and Support This Need actions; redundant View Need is absent.
- Campaign detail has clear Back to Donate and consistently uses Support Campaign.
- Detail-page spacing was tightened to avoid excessive empty space.
- Existing payment methods and backend verification flow remain intact.

## Screenshot note
The apparent repeated footer/accessibility controls in the supplied full-page browser screenshots were not changed as application duplication: source renders one Footer and one desktop FontSizeControl, and the repetition is consistent with full-page screenshot stitching of fixed-position elements.

## GitHub
No commit, push, branch, or pull request was performed.

---


# SOURCE: `DONATE_FIX_V23.md`

# Spandana Donate — V23 Fixes

## Public Donate page
- Removed the decorative “Give with purpose” pill above “Give with Joy”.
- Reduced the main “Give with Joy” heading to a restrained desktop/mobile size.
- Donation Opportunities now has one clear heading only: “Donation Opportunities”.
- Removed opportunity emojis/icons from the public cards.
- Removed short/impact descriptions from opportunity cards. Clicking an opportunity opens its introduction/details in the selected support panel.
- Kept the selected opportunity introduction/description in the expanded support panel.

## Ways to Support
- Campaign and Specific Need cards now use the same clean card structure.
- Removed the redundant “View Campaign” / “View Need” button from the cards.
- The card content remains clickable to open the information/detail page.
- Only the support action remains on each card.

## Detail pages
- Campaign detail page keeps a clear “Back to Donate” button and the support action.
- Specific Need detail page keeps “Back to Donate” and “Support This Need”; redundant “View Need” was removed.

## Support/payment flow
- Campaign and Specific Need support buttons now route to the Donate checkout flow using query parameters.
- The Donate checkout panel is shown directly on the Donate page for these support links.
- The page automatically scrolls to the checkout panel after a Support action so the donor reaches the amount/payment area instead of remaining at the card position.
- Payment methods still appear after an amount/quantity is selected, as required by the existing donation flow.

## Scope
- No new visual settings were added.
- No GitHub actions were performed.

---


# SOURCE: `DONATE_LIVE_VISUAL_DESIGNER_CONTROLS_2026-09-04.md`

# Donate Live Visual Designer Controls — 2026-09-04

## Changes
- Expanded live Donate design controls: dimensions, radius, border, four-side padding, typography, colours, shadow, button geometry, image height, card gap, width mode, equal-height and responsive columns.
- Preview viewport is controlled at 1366px desktop / 390px mobile and the preview workspace scrolls vertically so lower Donate content can be inspected.
- Donation Opportunities changed from mobile horizontal scrolling to responsive grid: default mobile 3 columns (3+3 for six items), tablet 3, desktop 6.
- Ways to Support keeps Campaign and Specific Need visually identical and supports configurable responsive columns and shared gap.
- Removed duplicate hamburger `aria-label` warning from `nav.tsx`.

---


# SOURCE: `DONATE_PAGE_HANDOFF.md`

# Spandana Donate Page — India / International Handoff

This ZIP contains the **complete current project folder supplied for the Donate-page work**, with the Donate changes applied in-place. Existing frontend, backend, admin settings, data, configuration, documentation, and other site functionality are retained.

## Public Donate experience

- `/donate` is the canonical public route.
- Visitors do not see an India/International selector or headings.
- Geo-location selects India or International automatically when geo auto-switch is enabled.
- India uses INR as its base/plumbline and India-specific opportunity values.
- International uses USD as its base/plumbline and International-specific opportunity values; display currency can be converted from USD.
- The same opportunity may have different India and International prices/targets.

## Admin preview

From **Admin → Donate → Donate Experience Preview**:

- `/donate?preview=india`
- `/donate?preview=international`

These preview links are intended for an authenticated Admin session so an India-based administrator can inspect both donor environments. They do not add a public selector.

## Existing Donate configuration retained

The existing Donate admin controls remain in the project, including page header/device fields, tax note, UPI/QR settings, UPI app buttons, bank transfer, online payment links, FCRA notice, international display currencies, donation opportunities, support/payment administration, and the existing site-wide settings.

## Important implementation note

The current frontend preview gate checks for the existing admin token before honoring the preview query parameter. For production-grade security, the final backend should also enforce a server-issued/signed admin preview token or render the preview within the authenticated Admin route. Public donor routing should continue to be determined server-side/at the data layer so the wrong geography's catalogue cannot be exposed by client manipulation.

No GitHub commit, push, or PR is part of this handoff.


V39 changes: Featured support now mixes active Campaigns + public Requirements into one shared top-3 list; only the Support CTA is clickable and routes to the detail phase. Specific Needs cards are compact and show no emoji or amount. Make a Donation stays clean until a Specific Need is selected; One-time/Monthly/Other then reveal that need’s configured amounts. Donation controls no longer overlap the image.

---


# SOURCE: `DONATE_PAGE_V32_CURATED_DESIGN_NO_CANVAS_EDITOR.md`

# Donate Page V32 — Curated Public Design / Canvas Editor Removed

## Direction
The previous Donate Visual Studio / Canva-style editor is removed from the Donate Admin experience. The Donate page is now a curated, production-oriented public experience rather than a page-builder experiment.

## Public Donate page
- Premium editorial hero using existing Spandana imagery.
- Clear Donate Now action that starts the existing giving flow.
- Physical / Mental / Spiritual wellbeing pathways.
- Live campaigns and specific needs pulled from the existing support catalogue.
- Live donation opportunities and existing amount/quantity selection.
- Existing donor fields and payment methods remain connected to the contribution service.
- Existing India/international donor experience remains intact.
- Existing campaign/requirement support URLs remain intact.
- Existing tax / 80G note remains sourced from Donate Page settings.
- Existing header, footer and Community Chat remain intact.
- No fabricated impact numbers, testimonials, campaign names, payment claims or financial outcomes were added.

## Admin Donate tab
- Removed `DonateVisualDesigner` import and render.
- Added a simple public-experience design card with a direct link to the real Donate page.
- Existing content, support, opportunity and payment administration remains available below.

## Protected baseline
V26 is untouched. This work is a new forward version only.

## Verification
- Removed all Donate builder runtime references from the public Donate page.
- Removed the Donate Visual Designer component from source use.
- TypeScript parsing progressed past JSX syntax after the new render was corrected; a full project type-check cannot complete in this copied environment because dependency type packages are incomplete.
- Production Vite build was not run because the copied `node_modules` tree does not contain the Vite executable.

---


# SOURCE: `DONATE_PAGE_V33_DESIGN_AND_EDIT_OPTIONS.md`

# Donate Page V33 — Designed Public Page + Admin Edit Options

## Direction
The Canva/visual-canvas editor is removed from the Donate workflow. The public Donate page is now the primary designed experience, with structured Admin content controls feeding it.

## Public Donate design
- Premium editorial hero using existing Spandana imagery.
- Strong orange CTA with dark green/cream visual system.
- Physical / Mental / Spiritual wellbeing pathways.
- Separate Featured Campaigns section populated from published active campaigns.
- Separate Specific Needs section populated from published visible requirements.
- Existing giving opportunities remain the transactional donation selection.
- Existing amount chooser, donor details, payment methods, India/international behaviour and checkout flow retained.
- Trust/transparency section retained without fabricated impact statistics or testimonials.
- Final emotional CTA using existing imagery.

## Admin edit model
Admin → Donate now manages the designed experience through structured controls rather than a canvas:
- Hero eyebrow
- Hero button label
- Support message heading
- Final CTA heading
- Final CTA text
- Existing page heading/subheading/tax note
- Existing Donation Opportunity Manager
- Existing Campaign/Requirement support management
- Existing payment configuration

## Preview
Admin provides direct India and International public-page preview links.

## Important
No invented campaign data, impact figures, donor testimonials, payment claims or outcomes are added. Existing backend data remains the source for campaigns, requirements and donation opportunities.

---


# SOURCE: `DONATE_PAGE_V34_EXACT_BLUE_DESIGN.md`

# Donate Page V34 — Blue Reference Design

This build follows the approved 16:9 Donate page visual reference: blue/white visual language, blue primary CTAs, two giving pathways (Physical and Mental Well-being), featured campaigns, specific needs, donation section, impact/trust content, and final CTA.

The Canva/visual canvas editor is not used on the public Donate page. Existing Donate data services and checkout/payment flow remain connected.

No invented campaign, requirement, payment, impact, or testimonial data is introduced by this change.

---


# SOURCE: `DONATE_PAGE_V35_EXACT_BLUE_REFERENCE_DESIGN.md`

# Donate Page V35 — Exact Blue Reference Design

V35 is a public Donate-page implementation based directly on the approved blue Spandana reference visual. The visual structure is intentionally kept close to the reference while retaining the existing live donation data and payment flow.

## Visual structure
- White global header
- Blue hero with Spandana child imagery
- Give Hope / Build Brighter / Tomorrows headline
- Two giving pathways only: Physical Well-being and Mental Well-being
- Featured Campaigns
- Specific Needs
- Make a Donation
- Our Impact / trust block
- Final Donate CTA
- Blue/white/orange visual language; no Spiritual Well-being section

## Dynamic behaviour retained
- Donation opportunities are loaded from the existing support catalog.
- Campaigns and requirements are loaded from existing support data.
- Campaign support links continue to use the existing contribution flow.
- Existing donor India/international logic remains.
- Existing payment profiles, UPI, bank transfer, Razorpay, PayPal and Stripe wiring remain in place where configured.
- Existing central SEO architecture is untouched.
- Admin editing/data management remains separate from the public visual template.

## Important
The generated reference image is treated as the visual specification, not as a baked image background. Text, campaign cards, requirements and donation controls remain real HTML/React so the page stays functional and editable through Admin data.

---


# SOURCE: `DONATE_PAGE_V36_ADMIN_CMS_FREEZE.md`

# Spandana Donate Page V36 — Layout Freeze + Admin CMS Wiring

## Scope
This iteration freezes the approved blue Donate public layout and removes any need for a visual/canvas editor.

## Frozen public order
1. Hero — Give Hope / Build Brighter / Tomorrows
2. Choose Your Giving Pathway — Physical Care + Mental Care
3. Featured Campaigns
4. Specific Needs
5. Make a Donation — existing Donation Opportunities
6. Our Impact / Trust
7. Final CTA
8. Tax / 80G note + global footer

## Admin controls added
- Section visibility toggles.
- Hero eyebrow, three hero lines, side message, brush message, CTA labels and hero image.
- Giving Pathways section heading/link label.
- Physical and Mental pathway cards continue to read the existing Programs system as the source of truth, avoiding duplicate programme content.
- Campaign section heading/description/link label/card count.
- Requirements section heading/description/link label/card count.
- Donation section heading/description/tab labels/card count and donation image.
- Impact heading/description/trust message/attribution.
- Final CTA heading/text/button/image.
- Existing Page Header and Tax/80G controls retained.
- Existing campaign, requirement, donation-opportunity and payment management modules retained.

## Data wiring corrections
- Campaigns now have a persisted `featured` field in the backend model and admin validation/controller create/update flow.
- Public Donate Featured Campaigns filters for published, active campaigns marked featured; legacy campaigns without the field remain visible for backward compatibility.
- Make a Donation continues to use the existing Donation Opportunity catalogue as the single source of truth.
- Physical/Mental pathway display can reflect changes made in Admin → Programs because the Donate page reads `settings.programsSection` when no Donate-specific override is present.
- Donation and final CTA imagery default to the Indian Spandana visual (`/images/hero-indian.png`) rather than the previous Western-looking image.

## Explicitly not included
- No Canva editor.
- No iframe/canvas page builder.
- No duplicate Donate SEO system.
- No invented campaigns, impact numbers, donor testimonials or payment claims.
- No layout redesign in this iteration.

## Validation
- Frontend Donate TSX transpile/syntax check: passed.
- Donate Admin TSX transpile/syntax check: passed.
- Admin types TS transpile/syntax check: passed.
- Backend SupportModels, supportController and support route `node --check`: passed.
- Full Vite production build was not run because the working copy does not contain the frontend dependency installation/Vite executable.

---


# SOURCE: `DONATE_PAGE_V37_EXACT_REFERENCE_LAYOUT_ADMIN_EDITABLE.md`

# Donate Page V37 — Exact Reference Layout + Admin Editable Sections

## Baseline
V36 was used as the working source. V26 remains protected.

## Frozen public layout
The public Donate page is locked to the user-approved blue reference direction:

1. Global Spandana header/navigation
2. Blue hero — Give Hope / Build Brighter / Tomorrows
3. Little-girl Indian/Spandana image in hero
4. Four hero benefit callouts
5. Choose Your Giving Pathway — exactly two cards: Physical Well-being and Mental Well-being
6. Featured Campaigns — three-card compact layout
7. Specific Needs — six-card compact layout
8. Make a Donation — blue-tinted donation strip using existing Donation Opportunities
9. Our Impact / Trust — four compact live counters plus trust statement
10. Existing final CTA, tax note and global footer remain below the frozen reference area

Spiritual Well-being was removed from the Donate layout.

## Admin editing model
No Canva/page-builder editor is used. The Admin Donate screen is the content/configuration CMS for the frozen layout.

### Hero editable fields
- eyebrow
- three headline lines
- primary CTA
- secondary CTA
- side message
- brush message
- hero image
- four benefit labels

### Giving Pathways editable fields
- section heading
- section link label
- Physical title/description/image/small label
- Mental title/description/image/small label

The programme data remains connected to the existing Programs source of truth, while Donate-specific presentation fields can override display text when needed.

### Featured Campaigns editable fields
- section heading
- description
- link label
- number of cards
- default badge text
- campaign CTA label

Campaign records remain sourced from the existing campaign system. Published/active/featured records feed this section.

### Specific Needs editable fields
- section heading
- description
- link label
- number of cards
- optional small card label

Requirements remain sourced from the existing Requirements system.

### Make a Donation editable fields
- section heading
- description
- one-time label
- monthly label
- custom amount label
- number of opportunity cards
- donation image
- donation quote
- donation quote attribution
- secure button label

Donation amounts/opportunities remain sourced from the existing Donation Opportunity Manager. No duplicate amount catalogue is created.

### Impact / Trust editable fields
- heading
- description
- trust/testimonial text
- attribution
- four statistic labels

The numeric values remain live from the current catalogue/pathway data in this iteration; no fabricated impact numbers are introduced.

## Visual corrections
- Blue is the dominant Donate palette.
- The hero little-girl image remains the primary human visual.
- The donation area uses Indian/Spandana visual language and no Western stock image.
- The pathway area has exactly two cards.
- Campaign cards use the compact image-left/content-right reference composition.
- Requirements use the compact six-card reference composition.
- Donation area uses a compact blue strip with four opportunity cards.

## Validation
- Source-level brace/parenthesis balance checks passed for the two modified TSX files.
- Full Vite build could not be run because the working copy does not contain frontend/node_modules or the Vite executable.

---


# SOURCE: `DONATE_PAGE_V38_SPECIFIC_NEEDS_DYNAMIC_GIVING.md`

# Spandana Donate Page V38 — Specific Needs + Dynamic Giving

## Scope
This build continues from V37 and keeps the frozen sleek Donate design. No canvas/page-builder redesign.

## Included
- Featured Campaigns capped at 3 on Donate.
- Specific Needs now pull directly from published/active Donation Opportunities, capped at 4.
- Specific Need cards use the Donation Opportunity icon/title and remain compact.
- Physical pathway arrow links only to `/programs/physical-health`.
- Mental pathway arrow links only to `/programs/mental-health`.
- Donation Opportunity Admin now supports separate one-time and monthly preset amounts for INR and USD.
- Make a Donation starts in a clean unselected state: One-time / Monthly / Custom Amount controls only.
- Selecting a Specific Need loads that need's configured amounts.
- Selecting another need replaces the previous amounts.
- Clearing the selected need hides the amounts again.
- Custom Amount accepts a donor-entered amount.
- Monthly selections are recorded with `recurring: true` on the contribution record.
- Make a Donation does not maintain duplicate amount data; Donation Opportunities remain the source of truth.
- Campaign Management link now targets the Campaigns subtab inside Donate Support Management (`/admin/donate#campaigns`) instead of the invalid query-style Quick Links route.

## Validation
- Modified JS backend files pass `node --check`.
- Modified TS/TSX files pass TypeScript `transpileModule` syntax validation.
- Full Vite production build was not run because frontend dependencies/node_modules are not installed in this working copy.

---


# SOURCE: `DONATE_VISUAL_DESIGNER_2026-09-04.md`

# Donate Visual Designer — 2026-09-04

Implemented a real Donate-page visual workspace in Admin.

- Admin → Donate now includes Donate Visual Designer.
- Desktop and mobile use controlled viewports (1366px and 390px), suitable for ultra-wide monitors.
- The center preview renders the real `/donate` page in an iframe, not a screenshot/mockup.
- Admin can switch device and zoom the viewport.
- Selecting Ways to Support or Donation Opportunities exposes the corresponding design controls.
- Changes are sent live to the iframe through same-origin postMessage, so the rendered Donate page updates immediately without requiring a public save.
- Save Draft uses the existing Admin settings save mechanism.
- Open Donate opens the real public Donate page in a separate browser tab.
- Existing Donate functionality, payment flow, campaign/need routing, and navigation are preserved.
- The previous blind Donate Design & Box Settings block was replaced by the visual workspace.

---


# SOURCE: `DONATE_VISUAL_STUDIO_V27.md`

# Spandana Donate Visual Studio V27

## Scope
This iteration is intentionally limited to the Donate page and its Donate visual builder.

## Protected V26 areas
No source files outside these two existing files were modified:
- `frontend/src/components/admin/DonateVisualDesigner.tsx`
- `frontend/src/pages/donate.tsx`

The rest of the V26 tree is retained unchanged from the supplied V26 ZIP.

## Builder experience
- Large live Donate canvas with responsive Desktop / Tablet / Mobile modes.
- Focus Canvas mode hides side panels for a page-first editing workspace.
- Fit-to-canvas and zoom controls.
- Direct hover/select behavior in the live page.
- Canva-style drag/move with grab cursor.
- Eight resize handles.
- Arrow-key nudging; Shift + Arrow uses 10px increments.
- Double-click text editing for builder-enabled text elements.
- Persistent x/y/width/height presentation settings in Donate builder state.
- Contextual inspector for typography, spacing, dimensions, color, radius, opacity and visibility.
- Navigator synchronized with live selection.
- AI Design panel with local premium design presets that only alter Donate presentation settings.
- Existing payment/donation functionality remains in the Donate page code path.

## Important
This is a new ZIP built from the supplied V26 copy. It does not overwrite the original V26 ZIP.

A full dependency build could not be run in this stripped environment because `node_modules` is not included in the source ZIP and dependency installation timed out. TypeScript parsing was checked; remaining compiler messages in this environment are dependency/type-resolution messages.

---


# SOURCE: `DONATE_VISUAL_STUDIO_V28_ORGANISATION_READY.md`

# Spandana Donate Visual Studio — Organisation Ready Build

Based on V26, Donate-only changes.

## What this build delivers
- Full live Donate page is the visual canvas inside Admin.
- Canvas-first workspace with collapsible Elements and Inspector panels.
- Fit-to-canvas, zoom, Focus Canvas and Desktop/Tablet/Mobile modes.
- Click any builder-enabled live Donate element to select it in context.
- Hover/selection outlines on the actual live page.
- Drag selected elements and resize from eight handles; changes persist to builder state.
- Double-click editable text for inline editing.
- Navigator stays linked to the selected live element.
- Build / Style / Responsive editing modes.
- Undo/Redo, duplicate, move, lock, hide and delete controls.
- AI Design presets for Bold Social Impact, Premium Editorial and Warm & Calm.
- Protected payment/donor/contribution components remain functional while presentation is edited.
- Donate-only scope; existing V26 master is not overwritten.

## Organisation usefulness
The editor is designed so the NGO team can refresh campaign messaging, donation sections, trust blocks and calls-to-action without rebuilding the whole Donate page. The donor journey remains the priority: clear purpose, short giving path, responsive layout and visible trust cues.

Current nonprofit UX guidance also emphasizes short forms, mobile-first giving, clear recurring-gift choices, trust signals and a coherent journey from appeal through confirmation. See the research used for this direction in the project conversation.

## Important build note
A full dependency install/build was not possible in this environment because the V26 package did not contain node_modules and dependency installation timed out. Global TypeScript parsing was run; remaining diagnostics are dependency/type-resolution related plus React `key` diagnostics caused by missing React type declarations.

## Files intentionally changed
1. frontend/src/components/admin/DonateVisualDesigner.tsx
2. frontend/src/pages/donate.tsx

---


# SOURCE: `DONATE_VISUAL_STUDIO_V30_DEEP_CORE_INSPECTION.md`

# Spandana Donate Visual Studio V30 — Deep/Core Inspection & Change Record

Date: 2026-09-05

## Scope
Donate Admin visual builder and the live `/donate?designer=1&builder=1` rendering/interaction bridge only.
V26 baseline remains protected; no GitHub commit/push/PR performed.

## Deep inspection findings

### 1. Workspace architecture
V29 still used a three-column CSS grid for Elements + canvas + Inspector. Even though the panels were collapsible, the default layout still consumed canvas width. The page itself was then rendered inside a fixed-width iframe and scaled with CSS `transform: scale(...)`.

### 2. Canvas sizing
Desktop was hard-coded to 1180px, tablet to 768px and mobile to 390px. Fit logic calculated zoom against the available width. This made the editor behave like a scaled preview instead of a true page-first responsive canvas.

### 3. Public renderer bridge
The public Donate page already exposes real builder IDs and receives builder style state through `postMessage`. This is the correct foundation. Hero heading/text, opportunity grid, form, amount, checkout, support grid, trust and footer already have live builder hooks.

### 4. Interaction engine
The live iframe supports hover/select, drag, resize, inline text editing and keyboard movement. However, transforms are presentation nudges, not a full layout engine, and Navigator ordering remains the reliable structural ordering mechanism.

### 5. Persistence
Builder changes are written into `donatePage.design.builder`, and the existing Admin save flow remains the persistence boundary. No separate Donate SEO system or separate fundraising data model was introduced.

### 6. Height problem
The iframe used a fixed 2200px/2600px height. A long Donate page could therefore be clipped or show excess blank space, making the page feel incorrect in the canvas.

## V30 changes implemented

1. **Page-first workspace** — Elements and Inspector are now floating overlay panels. They no longer consume the canvas grid columns.
2. **Full-width live canvas** — desktop canvas uses the available workspace up to 1180px instead of being squeezed between sidebars.
3. **No default desktop scaling** — desktop starts at 100% and uses the actual available page width. Tablet/mobile can fit only when the physical viewport requires it.
4. **Responsive device modes retained** — Desktop / Tablet / Mobile continue to drive separate builder style buckets.
5. **Fit Width** now fits the device viewport instead of fitting a fixed desktop page into a three-column grid.
6. **Live page height reporting** — the public Donate page reports its actual document height to the parent builder using `SPANDANA_DONATE_BUILDER_HEIGHT`; a ResizeObserver plus periodic safety measurement keeps it current.
7. **Live editing remains direct** — click selects the exact live element, drag/resize acts on the selected element, and double-click text remains supported.
8. **Contextual Inspector** — Inspector is opened only when needed and is visually separated from the canvas.
9. **Protected giving engine messaging** — the UI explicitly distinguishes visual presentation editing from payment/donor transaction logic.
10. **Existing donation flow preserved** — no payment, campaign, requirement or donor-flow code was replaced.

## Known limitation intentionally not hidden

The current builder's Add/duplicate operations still operate on the existing builder-node model; arbitrary newly-added block types are not yet first-class public renderers. V30 therefore does not claim to be a full Elementor clone. The priority is to make the existing live Donate page genuinely usable as the editing canvas before expanding the renderer into a complete block system.

## Validation performed

- TypeScript syntax transpilation check passed for `DonateVisualDesigner.tsx`.
- TypeScript syntax transpilation check passed for `donate.tsx`.
- Full dependency-backed Vite build could not be executed because `frontend/node_modules` is absent and `npm ci` timed out in the current environment. This is an environment limitation, not reported as a successful production build.

## Acceptance target

Open Donate Admin → immediately see the Donate page → click an actual element → edit it → see the change immediately → drag/resize it → switch device → use Inspector when needed → close panels and recover the full canvas.

---


# SOURCE: `DONATE_VISUAL_STUDIO_V31_FULL_CANVAS_FIX.md`

# Donate Visual Studio V31 — Full Canvas / No Crushing Layout

## Purpose
V31 addresses the specific failure in V30 where the live Donate page still felt boxed in and visually crushed by editor chrome.

## Changes
- Donate Visual Studio now opens in **Canvas Focus mode by default**.
- Elements and Inspector are **closed by default** and open as floating overlays only when needed.
- The editor canvas uses the full browser viewport (`fixed inset-0`) while in Canvas mode.
- Added a dedicated **Canvas** action to return to the unobstructed page-first workspace.
- Desktop canvas remains capped at 1180px, centered in the full viewport; tablet/mobile retain their device widths.
- The live iframe height now follows the measured Donate page height instead of being permanently fixed at 2600px.
- Fit Width now calculates against the actual available canvas width for all device modes.
- V26 remains untouched.

## Honest verification note
A production Vite build could not be completed in this environment because the copied dependency tree does not contain the Vite executable (`vite: not found`). Source delimiter/balance checks passed for the modified designer file. The build should be run in the normal project environment before deployment.

---


# SOURCE: `MEDIA_LIBRARY_AUDIT.md`

# Central Media Library Audit — Step 9

| Admin area | Asset | Current status |
|---|---|---|
| Hero | Desktop background image | Connected to Media Library |
| Hero | Desktop carousel images | Connected to Media Library |
| Hero | Hero video | Connected to Media Library for uploaded videos; URL remains supported |
| Hero | Mobile background image | Connected to Media Library |
| Hero | Mobile carousel images | Connected to Media Library |
| Branding | Primary logo | Connected to Media Library |
| Branding | White logo | Connected to Media Library |
| SEO | Social/share image | Connected to Media Library |
| Community Initiatives | Image | Connected to Media Library |
| Emergency Aid & Relief | Campaign image | Connected to Media Library |
| Ads / Announcements | Banner image | Connected to Media Library |
| Ads / Announcements | Banner video | Connected to Media Library |
| Donate | UPI QR image | Connected to Media Library |
| Joy Zone | QR image | Connected to Media Library |
| Vision & Mission | Featured Spotlight media | Connected to Media Library |
| Gallery / Media Library | Images | Central library |
| Gallery / Media Library | Videos | Central library upload/preview |
| Health Programs | Program image | Legacy, retained only for migration safety |
| Shop backup | Product/gallery images | Backup `.bak`, not active |
| Game Listings | ZIP package | Not a media asset; intentionally separate |

---


# SOURCE: `NAVIGATION_RESPONSIVE_REGRESSION_FIX_2026-09-02.md`

# Spandana Navigation Responsive Regression Fix — 2026-09-02

## Problem
The canonical `frontend/src/components/nav.tsx` rendered mobile navigation controls in live mode at desktop widths. This caused a mixed/duplicated header: desktop navigation plus the mobile Home/Donate/Get Involved/Shop strip and hamburger.

## Root Cause
`showMobilePreview` and `showDesktopPreview` were both `true` outside visual-designer preview mode. Mobile-only elements were therefore not responsive-gated. The logo also used the mobile geometry in live mode. The desktop CTA renderer did not honor the configured `shopUrl`.

## Fix
- Live desktop controls: `hidden md:flex`.
- Live mobile controls: `flex md:hidden`.
- Visual Designer preview remains device-specific via `previewDevice`.
- Navigation root/row now use responsive CSS variables for desktop/mobile background, border, height and padding.
- Logo placement and scale now switch through responsive CSS variables instead of live-mode mobile booleans.
- Mobile strip, hamburger and drawer are mobile-only in live mode.
- Shop CTA honors configured `shopUrl`; external URLs use an anchor, internal destinations use Wouter `Link`.

## Verification
- TypeScript TSX transpile/syntax check for `frontend/src/components/nav.tsx`: **PASS**.
- Full Vite production build: **BLOCKED in the extracted archive environment** because the bundled `node_modules` is missing Rollup's platform-specific optional package `@rollup/rollup-linux-x64-gnu`. A subsequent `npm install` attempt timed out.

## Acceptance
1. Desktop: no mobile strip/hamburger.
2. Mobile: no desktop menu/CTA group.
3. Donate -> `/donate`.
4. Get Involved -> `/volunteer`.
5. Shop -> configured `shopUrl`, otherwise `/shop`.
6. Visual Designer desktop/mobile previews remain isolated.

---


# SOURCE: `NAVIGATION_VISUAL_BUILDER_STRUCTURE_AND_RESPONSIVE_FIX_2026-09-04.md`

# Navigation Visual Builder — Structure & Responsive Fix — 2026-09-04

## Locked workflow
1. Admin first selects where each populated navigation item appears:
   - Desktop Main Menu
   - Desktop Header Actions
   - Mobile Shortcut Strip
   - Mobile Hamburger Drawer
2. Each destination has its own automatic order with Move Up / Move Down.
3. The public navigation is populated from the selected structure; no hard-coded placement is required once structure is managed.
4. Only after structure selection does Admin enter the Visual Designer.
5. Visual Designer edits the actual navigation component with a live rendered desktop/tablet/mobile view.
6. Design controls are component-based (Header Outer, Logo, Desktop Main Menu, Desktop Actions, Mobile Strip, Hamburger Button, Drawer) rather than arbitrary nested/free-floating boxes.
7. Save Draft, Preview and Publish are explicit actions. Publish saves the current draft before invoking the existing publish workflow.

## Mobile fixes
- Mobile logo position and scale now actually apply; previous CSS was overriding mobile transform and scale.
- Hamburger has independent outer box size, icon size, radius, background and border colour controls.
- Hamburger toggles open/closed on the public site.
- Interactive preview mode can open and close the hamburger.
- Drawer links close the drawer after navigation.
- Mobile strip remains populated from Admin-selected structure.

## Desktop fixes
- Desktop menu and action populations now respect the same Admin-managed structure and order.
- Visual Designer no longer exposes the previous drag-everything X/Y/scale workflow as the primary editing method.

## Validation
TypeScript TSX transpile checks passed for:
- frontend/src/pages/admin/tabs/NavigationTab.tsx
- frontend/src/components/nav.tsx
- frontend/src/pages/admin/index.tsx

No GitHub commit/push/branch/PR performed.

---


# SOURCE: `README.md`

# Spandana Care Aid Foundation — Production MERN Stack

All 22 issues fixed. admin.tsx (6029 lines) split into 30 individual tab files.

## Structure
- `backend/` — Express 5 MVC (config / middleware / models / controllers / routes / services)
- `frontend/src/pages/admin/index.tsx` — Admin shell (routing only)
- `frontend/src/pages/admin/types.ts`  — All shared TypeScript interfaces
- `frontend/src/pages/admin/shared.tsx` — Label, Field, SectionCard, DeviceTabs, VisibilityToggleRow
- `frontend/src/pages/admin/tabs/` — 30 files, one per admin tab
- `frontend/src/services/` — 17 API service files (zero raw fetch in components)

## Quick Start
```bash
npm run install:all
cp backend/.env.example backend/.env  # edit ADMIN_PASSWORD + SESSION_SECRET
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000/api/v1/docs
```

---


# SOURCE: `SAHARA_V42_PREVIEW_BLUEPRINT.md`

# Sahara V42 Preview Build

This version implements the final Sahara hierarchy: Sahara → two Core Pillars → all Core Programs → individual Program detail pages.

The 11 program names are taken from the supplied program list. Detailed program copy in this preview is model-generated placeholder content intended for visual/CMS preview and should be reviewed/edited by the foundation before publication.

Canonical pillar URLs:
- /programs/physical-care
- /programs/mental-care

Legacy aliases remain supported:
- /programs/physical-health
- /programs/mental-health

The old /programs route remains only for compatibility and is not part of the Sahara visitor trail.

---


# SOURCE: `SAHARA_V43_UNIVERSAL_MOBILE_UI_BLUEPRINT.md`

# Spandana V43 — Universal Mobile UI/UX Foundation

## Purpose
V43 establishes the first universal mobile-first responsive foundation across the public website. Mobile is treated as the primary design target; tablet and desktop inherit the same component system.

## Locked design principles
- Mobile-first responsive layout.
- Test against narrow phones, not one generic mobile breakpoint.
- No accidental horizontal page overflow.
- Flexible widths instead of fixed-width mobile layouts.
- Long headings wrap at meaningful word boundaries.
- Action and destination may be deliberately separated into semantic lines when that improves hierarchy.
- Touch targets remain comfortable.
- Images remain responsive and preserve their intended aspect ratio.
- Flex/grid children are allowed to shrink instead of forcing the parent wider.
- Arbitrary Tailwind width utilities are capped on mobile so they cannot create viewport overflow.

## Sahara pillar navigation
Immediately after the program cards, mobile uses stacked navigation:

**Physical Care**
- Back to Core Pillars
- Explore / Mental Care →

**Mental Care**
- Back to Core Pillars
- Explore / Physical Care →

The intended visual hierarchy is:

```text
Explore
Mental Care →
```

rather than allowing the browser to produce an accidental split such as `Explore Mental / Care`.

## Scope
The responsive foundation is global and applies to the public website. The main header/mobile menu is deliberately left for the next UI/UX pass, as requested.

## Validation
- JSON data/settings files validated.
- Program model syntax checked previously and remains unchanged by this V43 mobile pass.
- Pillar page TypeScript parse check completed; remaining compiler messages are dependency-resolution errors because frontend node_modules are not present in the supplied project copy.
- V42 source archive remains untouched; V43 is built from a separate extracted copy.

---


# SOURCE: `SAHARA_V44_CORE_PROGRAMS_ADMIN_MONGO_RECONCILIATION.md`

# Spandana V44 — Sahara Core Programs + Admin Reconciliation

## Purpose
V44 fixes the Sahara program-management gap observed in the running site. Sahara remains presentation-only; Core Programs remains the single canonical program manager.

## Canonical Sahara programs
- Physical Care — 6
  1. Health & Wellness
  2. Education & School of Excellence
  3. Sports & Recreation
  4. Eco & Green Initiatives
  5. Skills & Vocational Development
  6. Community Resilience & Disaster Preparedness
- Mental Care — 5
  1. Talk & Connect
  2. Grow & Thrive
  3. Family & Relationships
  4. Life Challenges & Transitions
  5. Awareness & Support

## Admin workflow
Admin → Core Programs now includes **Sync 11 Sahara Programs**. It is an explicit administrator action and requires MongoDB to be connected.

The reconciliation:
- updates existing matching canonical records;
- maps the three legacy titles observed in the previous Sahara runtime (`Medical Aid Camp`, `Skill Development`, `Mental Health Awareness`) to the corresponding canonical programs;
- creates missing canonical programs;
- does not delete unrelated records;
- refreshes the JSON snapshot after successful MongoDB reconciliation.

## MongoDB / JSON rule
MongoDB is authoritative whenever connected. `health-programs.json` is the last-known-good fallback snapshot, while `health-programs-canonical.json` is the immutable shipped canonical seed used by the Admin reconciliation action.

- Successful MongoDB program reads refresh `backend/data/health-programs.json`; they never overwrite the immutable `health-programs-canonical.json` seed.
- Successful MongoDB program writes refresh the snapshot after the write succeeds.
- Settings reads/writes follow the same rule for `settings.json` and `settings_draft.json`.
- If MongoDB is connected but empty for the live settings document, the live settings JSON is used only once to bootstrap that missing MongoDB document. Existing MongoDB settings are never overwritten by JSON automatically.
- A MongoDB outage does not automatically import stale JSON back into MongoDB.

## Sahara pillar cards
The `Explore Physical Care` and `Explore Mental Care` buttons on the main Sahara page are now controlled by `pillarCardCtaVisible` in Admin → Sahara Community Centers and are off by default for the current design.

## Safety
V44 is built from a separate copy of V43. V43 remains untouched. No destructive MongoDB operation is used by the new Admin reconciliation action.

---


# SOURCE: `SAHARA_V45_CORE_PROGRAM_ORDER_AND_PILLAR_JOURNEY.md`

# Sahara V45 — Core Program Order & Pillar Journey

## Core Programs
- Core Programs remains the single canonical program manager for Sahara.
- Programs are grouped by `pillar` (`physical` or `mental`) and sorted by `order`.
- Admin now provides Move Up / Move Down controls for each program within its own care pillar.
- Reordering is persisted through `/api/v1/admin/programs/:id/reorder` and therefore changes MongoDB when connected and the JSON fallback when MongoDB is unavailable.
- Public Sahara pillar pages read the same Core Programs data and follow the stored order automatically.
- Adding a program assigns the next order position for its selected pillar.

## Sahara main page
- Physical Care and Mental Care cards show their live program names.
- Each pillar card has an Admin-controlled Explore button.
- Default labels are `Explore Physical Care` and `Explore Mental Care`.
- Mental Care uses the same neutral card/pill/button visual treatment as Physical Care; the pink/purple program-card treatment is removed.

## Pillar journey
- Physical Care: `/programs/physical-care`
- Mental Care: `/programs/mental-care`
- Each landing page lists every active/published program in its pillar in Admin-defined order.
- Each program card opens its individual detailed program page.
- Bottom navigation provides `Back to Programs` and an Explore link to the opposite care pillar.

## Reconciliation
- The former `Sync 11 Sahara Programs` label is now `Reconcile Sahara Programs`.
- Reconciliation is a repair/bootstrap operation, not the normal add/edit workflow.

---


# SOURCE: `SETTINGS_CANONICAL_MAP_V47.md`

# Spandana V47 — Canonical Settings Map

## Rule
**One feature = one canonical setting owner = one Admin location.**

| Feature | Canonical owner | Admin location | Notes |
|---|---|---|---|
| Navigation destinations/items | `nav` | Admin → Navigation → Select Menu | Shared across desktop, mobile, hamburger and other references. |
| Mobile header layout | `nav.design.mobile` | Admin → Navigation → Design Header → Mobile | Layout only; does not duplicate navigation destinations. |
| Accessibility bar | `nav.design.mobile.accessibility` | Admin → Navigation → Design Header → Mobile → Accessibility Bar | First appearance 3s; later top returns 2s. |
| Floating first-time menu hint | `floatingMenu` | Admin → Floating Menu | One canonical configuration. Legacy `floating_menu` is migration-only and is removed from active settings. |
| Logo asset/brand identity | `branding` | Admin → Branding | Header layouts reference the canonical brand asset. |
| Homepage Hero | `hero` | Admin → Hero | No Sahara-specific duplicate homepage hero controls. |
| SEO | central `seo` | Admin → Site Management → SEO | Donate Programs provide campaign metadata to this central system. |
| Core Programs | `programs` | Admin → Core Programs | Sahara presents these programs; it does not own a duplicate program database. |

## Removed duplicate active surface
Global Settings / Site Info no longer contains Floating Menu controls. Floating Menu is configured only in **Admin → Floating Menu**.

## Migration rule
Existing Mongo data may contain legacy `floating_menu`. The backend accepts it only as a one-time compatibility input, normalizes it into `floatingMenu`, and never returns both keys as active configuration. Saves/publishes write the canonical structure.

> Historical `settings_history.json` may still contain old key names because it is an audit/rollback record. Historical entries are not active configuration.

---


# SOURCE: `STEP19_NAV_DESKTOP_MOBILE_REGRESSION_FIX.md`

# Step 19 Navigation Regression Fix

## Browser finding
The public desktop site was rendering both the desktop navigation and the mobile header strip from `frontend/src/components/nav.tsx`. This caused duplicated menu items on desktop (for example Home / Donate / Get Involved / Shop appearing in the mobile strip while the desktop menu also rendered).

## Fix
Public rendering now uses responsive visibility rules:
- Desktop navigation + desktop CTAs: desktop/tablet breakpoints.
- Mobile header strip + hamburger: mobile breakpoint only.
- Admin preview mode remains device-explicit, so Desktop preview can show desktop navigation and Mobile preview can show mobile navigation regardless of the Admin canvas width.

## Scope
This is a frontend presentation regression fix only. Canonical navigation data, destination ownership, authentication/security, and the Admin editor data model are unchanged.

## Verification target
At desktop viewport: one desktop header/navigation presentation; no mobile strip duplication.
At mobile viewport: mobile strip/hamburger visible; desktop navigation hidden.

---


# SOURCE: `STEP20_SCOPE.md`

# Step 20 Scope

## Current active workstreams
1. Admin Authentication & Security (Step 19 base + audit target)
2. System Diagnostics, Error Handling & Recovery
3. Global Admin Search

Navigation/visual editor is frozen at the accepted Step 18 baseline.

## Admin additions in Step 20
- System Health / Diagnostics navigation entry
- System Health cards and bounded diagnostic event log
- Filter/search diagnostics
- Friendly frontend error boundary with diagnostic Error ID
- Admin header global search
- Authenticated `/api/v1/admin/search` across canonical model records, JSON fallback data, and navigation settings
- `npm run diagnose` local diagnostic command

## Verification status
Source-level JavaScript syntax checks pass for the new backend diagnostic service/route and diagnostic script. Frontend dependency-based Vite build was not run in this isolated environment because node_modules are not bundled. Browser/runtime verification remains required.

---


# SOURCE: `STEP23_CAMPAIGN_DONATE_FRONTEND_ALIGNMENT.md`

# Step 23 — Campaign Builder + Donate Frontend Alignment

## Campaign Builder
- No compulsory/mandatory fields anywhere.
- Stage 1 selects information only; it never creates public data.
- Build Campaign Form always works.
- Selected fields appear immediately in Fill Campaign.
- For repeatable sections, the first blank entry is created automatically when Build Campaign Form is clicked.
- Add Entry remains available and adds another blank record using the already-selected fields.
- Admin can return later and select additional fields.

## Public Donate
- No public India/International selector or popup.
- Geography remains a backend/system classification.
- Donation Opportunities are optional and Admin-controlled.
- Nothing is open by default.
- One opportunity opens at a time; opening another closes the previous one.
- Payment methods appear only after an amount/quantity is selected.
- India: UPI/PhonePe/Google Pay style UPI action, QR, bank transfer and Razorpay/card where configured.
- International: automatically selected by geography; display currency is available within the international experience, with INR excluded.
- Campaigns and Specific Needs appear below Donation Opportunities when published.
- Empty sections disappear and grids adapt to the number of published items.
- Desktop and mobile use responsive, progressive-disclosure layouts.

## Mobile navigation
- Preserve the original compact icon + label visual style.
- Admin controls which items appear; the visual style is not hardcoded to those labels.
- Hamburger remains the main navigation entry and remains Admin-controlled.

No GitHub commit, push, branch, or PR is included in this package.

---


# SOURCE: `STEP24_CAMPAIGN_BUILDER_BUILD_FLOW_FIX.md`

# STEP 24 — Campaign Builder Build → Fill Flow Fix

Date: 03 September 2026

## User-locked behavior
- Build Campaign Form must always be clickable.
- No field is compulsory.
- Admin may enter only Campaign Name and date, or leave everything else blank.
- Clicking Build Campaign Form immediately moves to Fill Campaign.
- Selected information fields must appear in Fill Campaign.
- Add Entry is only for additional repeatable entries and is never required to continue.
- Existing campaign data must be retained.

## Regression found in local v5 package
1. Build handler referenced `setDetails`, but `details` is derived using `useMemo`; no `setDetails` setter exists.
2. Repeatable sections used `legacySelected()` instead of the explicit `sections[key].selectedFields` selection state when rendering Fill Campaign.

## Fix
- Replaced the undefined `setDetails(next)` call with the existing `update(next)` path.
- Updated `itemSelectedFields()` to prefer explicit `sections[key].selectedFields`, then fall back to legacy populated-data detection.
- Kept automatic creation of one blank repeatable entry when selected fields exist and no entry exists.
- Build still transitions directly to `fill`.

## Expected result
Admin can select 2–3 sections/fields, click **Build Campaign Form**, and immediately reach **Fill Campaign** with the selected controls populated. No data validation blocks this transition.

---


# SOURCE: `STEP25_CAMPAIGN_BUILDER_PREVIEW_GENERATE_PUBLISH.md`

# STEP 25 — Campaign Builder Preview → Generate → Publish

## User-locked workflow
- Select information → Build Campaign Form → Fill Campaign → Preview → Generate Campaign / Publish Campaign.
- Preview must be a real visitor-facing campaign preview, not a dead end.
- After Preview, Admin must have an explicit **Generate Campaign** action and an explicit **Publish Campaign** action.
- Generate saves/creates the campaign as a draft and keeps the builder open.
- Publish saves/creates the campaign with `published: true` and `status: active`, then closes the builder.
- No compulsory campaign fields were added beyond the existing campaign title save guard.
- Visibility/publication remains an Admin decision; entering data does not itself make information public.

## Implementation
- CampaignBuilder now accepts `onGenerate` and `onPublish` actions.
- SupportAdminPanel supplies separate generate and publish handlers.
- Preview footer now contains Back to Fill, Generate Campaign, and Publish Campaign.

---


# SOURCE: `STEP26_DONATE_PUBLIC_UX_PAYMENT_FLOW_FIX.md`

# STEP 26 — Donate Public UX, Campaign Navigation & Checkout Fix

Date: 2026-09-04

## Fixed in this package

1. Donation Opportunities were visually oversized.
   - Reduced card height, padding and typography.
   - Kept the existing expandable interaction.
   - Added subtle hover/lift/shadow motion for a more refined UI/UX.

2. Donate page spacing was too loose.
   - Tightened hero and section spacing so Campaigns appear much earlier on desktop.
   - Preserved responsive behavior.

3. Campaign cards were visually weak.
   - Refined card proportions, typography, progress treatment and hover behavior.
   - Campaign image/poster remains the primary visual.
   - Whole campaign content area opens the campaign detail page.
   - The Support Campaign button is now an independent clickable action.

4. Campaign Support flow was not reliably reaching payment.
   - Added `/campaigns/:id/support` route.
   - Support Now / Support Campaign now opens a dedicated campaign support/checkout page.
   - Campaign is preselected on that page.
   - Amount/quantity selection and payment methods are shown there.

5. Campaign detail navigation was incomplete.
   - Added a clear Back to Donate action.
   - Support Now now uses the dedicated checkout route.
   - Existing Copy Link remains.

6. Campaign description fallback.
   - Public campaign listing and detail can fall back to the public Basic Information short description when the top-level campaign description is empty.

7. Campaign statistics.
   - Public campaign detail continues to show Target, Raised and Supporters from the backend metrics.
   - Added a progress bar/percentage where target and calculated progress are available.
   - Raised is not made manually editable in the public UI; it remains calculated from confirmed paid transactions by the backend.

8. Back-navigation from payment.
   - Dedicated campaign checkout page has a prominent Back to Donate link.

## Intentionally not changed in this step

- Admin Campaign Builder/public-private approval workflow.
- Campaign poster creation/upload workflow.
- Date-picker/calendar implementation in Campaign Builder.
- Manual raised-amount administration.
- Payment gateway credentials or provider integrations.
- GitHub repository state.

GitHub was not committed to, pushed to, branched, or otherwise modified by this step.

---


# SOURCE: `STEP27_DONATE_VISUAL_INTERFACE_REDESIGN.md`

# STEP 27 — Donate Visual Interface Redesign

## Approved direction
Use the supplied reference/interface concept as the visual direction for the public Donate page: compact, elegant, animated, spacious where it matters, and designed so Donation Opportunities and Campaigns are visible together without unnecessary scrolling on desktop.

## Implemented
- Donation Opportunities: compact six-column desktop layout; three-column tablet; two-column mobile.
- Reduced tile padding, icon size, typography and vertical footprint.
- Campaigns: four-column desktop layout; two-column tablet; one-column mobile.
- Reduced campaign card footprint while retaining poster, description, target/progress and actions.
- Added subtle hover lift/shadow motion for opportunities and campaigns.
- Kept Support Campaign as its own actionable button.
- Preserved Campaign Details navigation separately from direct support.
- Reduced Donate page top/section spacing so Campaigns move upward.

## Data rule
The frontend displays all campaigns returned by the public catalogue that are published and active. It does not fabricate additional campaigns. If only one appears, check Admin campaign publication/status and the public catalogue data.

## Visual principle
The public Donate page should feel like a polished giving experience rather than a generic NGO template: compact opportunity choices, strong campaign imagery, clear hierarchy, graceful motion, and direct support actions.

---


# SOURCE: `STEP28_RECYCLE_BIN_DONATE_ADMIN_ALIGNMENT.md`

# STEP 28 — Recycle Bin + Donate Admin Alignment

## Implemented
- Added Admin → System → Recycle Bin.
- Supported Admin delete actions move records to the Recycle Bin before removal.
- Added restore, permanent delete and empty-bin operations.
- Added Contribution delete endpoint and UI action.
- Contribution cards now use consistent responsive alignment.
- Donate Admin workspace widened to use the available horizontal space.
- Fundraising Campaigns now align side-by-side in a responsive grid.
- Public Donate Campaigns use a responsive 1/2/3-column grid.

## Recovery note
The supplied V13 package contains an empty `backend/data/contributions.json` and empty `backend/data/audit-events.json`. The specific contribution already deleted from the user's live local data is therefore not recoverable from the supplied package without the live data/backup. No donor or payment record was fabricated.

## Constraints
- GitHub untouched.
- No commit, push, branch or PR.

---


# SOURCE: `STEP_CURRENT_CHANGELOG.md`

# Current Change Log — Campaign Generated Communication Studio

Date: 2026-09-04

## Locked workflow
- Campaign data is the single source of truth.
- Generate Campaign is separate from Publish Campaign.
- Generated Form provides PDF/Print, Word and JPEG outputs for office/reference use.
- After generation, Admin can open a Communication Studio from the same campaign.
- Communication formats include Facebook, Instagram Square, Instagram Portrait, Instagram Story, Reel, WhatsApp Status, WhatsApp Square, Facebook Story and Custom Size.
- Admin can provide a free-text creative prompt.
- Admin can upload a logo, upload an image, and add an optional text box.
- Custom width/height are supported for Custom format.
- Multiple generated creative variants are retained in campaignDetails.socialDesigns.
- Any generated creative can be selected as the campaign thumbnail.
- Campaign thumbnail is an asset; campaign structured data remains the master source.
- Public Donate uses the selected campaign thumbnail before the visitor selects amount/quantity and proceeds to payment.
- No compulsory fields or minimum field count.
- Selected sections are initially open in Fill Campaign.
- GitHub remains untouched.

## Implementation note
The current package includes a local deterministic creative fallback and the Communication Studio UI. A real external AI image/design provider is not configured in the project, so the package does not claim live model-generated artwork yet. The UI and data structure are prepared so a secure backend AI provider can be connected later without changing campaign data architecture.


## V57 — CampaignBuilder JSX syntax fix
- Fixed Babel parser error at CampaignBuilder.tsx line 92 in generatedForm().
- Rewrote deeply nested generatedForm JSX into structured multiline JSX.
- TypeScript JSX transpilation verified with zero syntax diagnostics.
- No workflow logic changed by this syntax-only correction.


## V44 — Sahara Core Programs + Admin Reconciliation
- Added stable `programKey` values to the 11 canonical Sahara Core Programs.
- Added an Admin-only, explicit **Sync 11 Sahara Programs** reconciliation action.
- Legacy Sahara program titles are safely mapped to the canonical names without deleting unrelated records.
- Successful MongoDB program reads/writes now refresh the JSON last-known-good snapshot.
- Settings now refresh JSON snapshots after successful MongoDB reads/writes and bootstrap MongoDB only when the live settings document is genuinely absent.
- Main Sahara pillar-card Explore buttons are Admin-controlled and off by default.
- V43 remains untouched; V44 is built from a separate copy.

---


# SOURCE: `SYSTEM_DIAGNOSTICS_STEP20.md`

# Step 20 — System Diagnostics, Error Handling & Admin Search

## Admin
- System → System Health / Diagnostics
- Global Search button in the Admin header
- Diagnostics filters: ALL / ERROR / WARN / INFO and text search
- Search results open canonical Admin modules

## Frontend failure handling
A root Error Boundary presents a friendly failure page with an Error ID instead of a blank screen and links to Admin diagnostics.

## Backend diagnostics
Protected endpoints:
- GET /api/v1/admin/system/health
- GET /api/v1/admin/system/diagnostics
- DELETE /api/v1/admin/system/diagnostics
- GET /api/v1/admin/search?q=...

Recent backend failures are held in a bounded in-memory diagnostic buffer for the running process. This is intentionally not a replacement for production log storage.

## Local diagnostic command
From project root:
`npm run diagnose`

The command checks Node, source folders, dependency presence, environment hints, media directory and frontend compilation.

## Security note
Diagnostics must never expose passwords, OTPs, session identifiers, reset tokens, secrets or production stack traces to public visitors.

---


# SOURCE: `V47_LATEST_FIX_REPORT.md`

# Spandana V47 — Latest Mobile / Canonical Settings Fixes

Built from the V47+ working copy supplied in this conversation. Earlier V46/V47 archives remain untouched.

## Included fixes
- Removed the obsolete global `FontSizeControl` rendering path; the mobile Navigation Accessibility Bar is the single active accessibility UI.
- Accessibility timing: first top-of-page appearance defaults to 3 seconds; later returns to the top default to 2 seconds.
- Accessibility controls use compact responsive sizing so Text Size and Paper White remain readable and tappable at 390/375/360px.
- Mobile header defaults improved: logo width/height/slot increased and header remains protected from quick-action/hamburger compression.
- Mobile header logo position is canonicalized under `nav.design.mobile`; derived `nav.mobile.stripItems` and duplicate `nav.mobile.headerHeight` are no longer active.
- Page Builder mobile/desktop visibility now drives the same nested `visibilityMobile` / `visibilityDesktop` keys that Home actually reads. The old mismatched mobile suffix checks are removed.
- Removed the duplicate `Video Section (Mobile)` Page Builder entry. Featured Spotlight remains the single Vision & Mission media panel; its mobile visibility is now named `featuredSpotlightMobile`.
- Vision Admin now calls this control “Show Featured Spotlight on Mobile”, so it is correct for video, image, campaign, event, story, etc.
- Removed the second mobile AdsCarousel embedded inside Vision & Mission. Ads/Announcements is now one canonical Page Builder section.
- Floating Menu is explicitly a first-time mobile hamburger Explore hint: it anchors below the actual hamburger, is not draggable, and remains one-time via localStorage.
- Floating Menu Admin no longer exposes nonfunctional desktop/button/position/scroll-trigger controls for this mobile-only hint.
- Floating Menu legacy `floating_menu` is still accepted only as a migration input; `floatingMenu` is the canonical owner.
- Added narrow legacy Hero Button 1 migration: an old exact “Sahara Community Centers” value is migrated to “Emergency Aid & Relief” with `/#emergency-aid`, without overwriting any other custom Hero label.
- Canonicalization persists those narrowly-scoped migrations back to Mongo when Mongo is connected and refreshes the JSON last-known-good snapshot.
- No destructive seed or broad JSON→Mongo overwrite was added.
- Homepage Emergency Aid & Relief is now a canonical Page Builder section with desktop/mobile visibility and ordering; its CRUD tab no longer exposes a duplicate homepage visibility switch.
- Existing Page Builder orders are migrated to place Emergency Aid immediately after Hero without disturbing other order entries.
- Mobile accessibility font scaling now removes any legacy inline root font-size and applies scaling only inside the mobile breakpoint; desktop typography is left unchanged. Paper White is likewise scoped to mobile during viewport changes.

## Deliberately not included
- No new Featured Spotlight Carousel type was added yet; existing Image / Poster and other spotlight types remain available. This can be considered later without creating a second spotlight system.
- Legacy unused source files/components are not used by the active App navigation path and were not broadly refactored.

## Validation
- JSON settings files parse successfully.
- Backend `node --check` passed for `backend/models/Settings.js` and `index.js`.
- Frontend dependency installation/build could not be completed in this environment because the dependency install timed out; no claim of a full Vite build is made.

---


# SOURCE: `V47_MOBILE_HEADER_FIX_REPORT.md`

# Spandana V47 — Mobile Header & Accessibility Fix

Built from an untouched copy of V46.

## Scope
- Mobile public header only; desktop navigation architecture preserved.
- Fixed the mobile logo being constrained by the old 72px image cap.
- Replaced the fragile mobile single-row flex behaviour with protected logo / action / hamburger zones.
- Added granular mobile controls in Admin → Navigation → Design Header → Mobile.
- Added responsive accessibility-bar layout so Text Size and Paper White do not collide.
- Added a Recommended Mobile Layout action for a safe baseline.
- Added Live Mobile Page Preview using the actual Home page in a real iframe viewport at 390px, 375px, and 360px.
- Unsaved navigation/header changes are pushed into the preview immediately.

## New mobile design controls
- Header height
- Horizontal padding
- Logo width
- Logo max height
- Logo area width
- Logo scale
- Logo X/Y offset
- Quick-action gap
- Quick-action minimum width
- Quick-action icon size
- Quick-action label size
- Action-area padding
- Hamburger button size
- Hamburger icon size
- Gap before hamburger
- Hamburger X/Y offset
- Accessibility bar height
- Accessibility outer padding
- Accessibility group gap
- Accessibility control height
- Compact A width
- Labeled A width
- Paper White width
- Accessibility font size

## Preview safety
The preview uses postMessage between the Admin page and a same-origin Home-page iframe. The iframe only accepts preview messages from the same origin and does not write settings to MongoDB. Saving/publishing remains under the existing Admin workflow.

## Data safety
No MongoDB migration or destructive seed was added. V46 remains untouched.

---


# SOURCE: `V50_NAVIGATION_ACCESSIBILITY_SCROLL_AND_DESIGNER_ACCESS.md`

# V50 — Navigation Accessibility Scroll + Always-Available Header Designer

## Changes
- Desktop accessibility controls remain visible at the top of the page and hide while scrolling down; they return when scroll position reaches the top.
- Mobile accessibility behavior is not changed by this desktop scroll behavior.
- Desktop accessibility control appearance and Paper White styling are preserved.
- Admin → Main Menu / Navigation → Design Header is now available regardless of whether the navigation structure has been edited or marked `structureManaged`.
- “Continue to Visual Designer” is likewise available without changing menu placements.
- Added Admin guidance that header design is independent of menu editing.
- No navigation item labels, destinations, or placement defaults were changed by this patch.

## Validation
- Backend JavaScript syntax checks passed for existing backend files.
- Existing JSON settings snapshot validated.
- Frontend full TypeScript build was not run because this source ZIP does not contain installed frontend dependencies; this is the same dependency limitation as prior builds.

---


# SOURCE: `V52_NAVIGATION_DESIGNER_LIVE_HEADER_PREVIEW.md`

# V52 — Navigation Designer Live Header Preview

Implemented on top of V51.

## Scope
- Preserve V51 public-only accessibility controls and Admin exclusion.
- Keep current canonical menu items, labels, destinations, and placement unchanged.
- Navigation Designer now renders the same `Nav` component used by the public frontend inside the design canvas.
- Preview sizing is constrained to the designer canvas instead of using viewport width, preventing the header from escaping/clipping the preview.
- Desktop preview now uses desktop logo sizing controls rather than mobile sizing values.
- Header preview reflects current navigation structure plus unsaved designer changes.
- Header properties remain live-editable (height, padding, logo/action gap, background, border, etc.).

## Admin workflow
- `Design Header` remains accessible without modifying the current menu structure.
- The designer is explicitly presented as the live header renderer, not a generic skeleton.

## Validation
- ZIP integrity checked after packaging.
- Full Vite build was not available because frontend dependencies are not installed in the supplied project copy.

---


# SOURCE: `V53_NAVIGATION_VERIFICATION_REPORT.md`

# V53 Navigation Verification Report

## Build integrity
- Source copied from V52: PASS
- V52 source left untouched: PASS
- Modified TS/TSX files parsed/transpiled with TypeScript 5.8.3: PASS
- Backend `server.js` syntax check: PASS
- Root `index.js` syntax check: PASS

## Browser verification
Status: **NOT EXECUTED IN BUILD ENVIRONMENT**

Reason: the frontend dependency tree was not complete and the environment could not complete `npm ci`; offline install reported a missing cached `zod@3.24.4` tarball. No claim of live browser verification is made.

## Required release command
After installing project dependencies and starting the app:

`npm run test:navigation`

The suite must pass before V53 is considered browser-verified.

## Required scenarios
- Public desktop header: Home, Sahara Community Centers, Joy Zone, Blog, Get Involved, Donate, Shop.
- Public mobile header: Donate, Join Us, Joy Zone, Shop, hamburger; no overlap.
- Designer desktop preview: same menu and all three CTAs.
- Designer tablet preview: real 768px responsive viewport.
- Designer mobile preview: real mobile viewport; no header overlap.
- Draft message updates are reflected in the same real `Nav` component.

---


# SOURCE: `V53_TRUE_NAVIGATION_VISUAL_DESIGNER.md`

# V53 — True Navigation Visual Designer + Browser QA Gate

## Source
Built from V52. V52 remains untouched.

## Purpose
Replace the Admin Header Designer's simulated in-page header with an isolated, real frontend header preview running in a real browser viewport. The same `Nav` component and responsive CSS used by the public site are rendered by the preview route.

## Implemented
- Added `/__admin/header-preview` route.
- Added `HeaderPreview` host that receives draft navigation/settings through `postMessage`.
- Added preview visibility/live-stream settings to `Nav` so the preview can faithfully render public-state filtering.
- Added an explicit `showAccessibilityPreview` capability so visitor accessibility controls can appear in the visual preview without reintroducing them into the Admin UI.
- Replaced the Admin designer center mock header with an iframe using the real header preview route.
- Desktop, tablet and mobile now use real iframe viewport widths; mobile uses the selected 360/375/390 width.
- Draft changes are pushed into the header iframe immediately.
- Preview element selection is sent back to Admin so the existing property panels remain usable.
- Suppressed global visitor overlays on the header-only preview route.
- Added Playwright navigation QA suite covering public header, preview header, desktop CTAs, mobile quick actions, overlap, tablet breakpoint and draft message updates.

## Critical defects addressed
1. Desktop `Home` disappearing from the designer preview.
2. Desktop `Get Involved`, `Donate`, `Shop` disappearing from the designer preview.
3. Mobile preview using a desktop browser breakpoint while pretending to be mobile.
4. Mobile logo/quick-action/hamburger overlap caused by simulated responsive state.
5. Preview/public state drift caused by missing preview visibility/live-stream state.

## Verification rule
A release is not called browser-verified unless the Playwright suite passes against the running application. Static TypeScript transpilation and backend syntax checks are supporting checks only.

## Environment limitation during this build
The supplied build environment did not have a complete frontend dependency installation. An offline dependency install failed because required npm tarballs were not cached. Therefore a live browser run could not be executed in this build environment. The V53 QA suite is included in the ZIP and must be run after dependencies are installed and the application is running.

---


# SOURCE: `V54_PLAYWRIGHT_NAVIGATION_TEST_HARNESS_FIX.md`

# V54 — Playwright Navigation Test Harness Fix

This version is based on V53 and leaves V53 untouched.

## Fixes
- Playwright config no longer combines `testDir` with a CLI directory argument; it uses `testDir: "."` and an explicit `testMatch` for `tests/navigation/**/*.spec.ts`.
- `test:navigation` now invokes Playwright only with `--config`, removing ambiguous duplicate test discovery.
- Root `package.json` declares `@playwright/test` explicitly at `1.63.0`, matching the verified local installation used for this test harness.
- Navigation spec registration is kept directly at module level without `test.describe` wrappers, reducing loader-context ambiguity while retaining all assertions.

## Safety
- MongoDB is not touched.
- No seed/reset/import is run.
- V53 is not modified.

## Verification
Browser execution must be run on the user's machine after dependencies and Chromium are installed. This package does not claim browser tests passed merely from static inspection.

---


# SOURCE: `V55_PLAYWRIGHT_NAVIGATION_TEST_HARNESS_FIX.md`

# V55 — Playwright Navigation Test Harness Fix

## Purpose
V54 still failed before executing any test because `test()` declarations in `tests/navigation/header.spec.ts` were at top level outside a synchronous `test.describe()` suite. Playwright therefore reported `Playwright Test did not expect test() to be called here` and then `No tests found`.

## V55 correction
- Wrapped all navigation tests in one synchronous `test.describe("navigation header", () => { ... })` suite.
- Kept the V54 test config and canonical navigation assertions unchanged.
- Root `package.json` retains `@playwright/test` at `1.63.0` so the runner dependency is explicit.
- No MongoDB seed/reset/import or application data changes.
- V54 remains untouched.

## Verification status
- Source structure checked after correction.
- Browser execution was not performed in this build environment because the full project dependency installation did not complete within the available execution window.
- On the developer machine, run from the project root:

```powershell
npm install
npx playwright install chromium
npm run test:navigation
```

Do not run seed/reset commands for this QA test.

---


# SOURCE: `V56_WINDOWS_CANONICAL_PATH_AND_PLAYWRIGHT_FIX.md`

# V56 — Windows Canonical Project Path & Playwright Runner Hardening

Canonical development path requested for this project:

`C:\\Users\\HI\\Downloads\\spandana-praveen-main`

## What changed

1. The Playwright navigation test suite is now scoped directly to `./tests/navigation` instead of scanning the whole project tree.
2. `npm run test:navigation` now uses `scripts/run-playwright-navigation.mjs`.
3. The launcher resolves the project's **real filesystem path** with Node's `fs.realpathSync()` and changes into that path before starting Playwright.
4. The launcher invokes the local Playwright CLI from the project root, preventing accidental use of another project installation.
5. No absolute `C:\\Users\\...` path is embedded in the application or test configuration. The requested canonical path is documentation/development convention, not a hard-coded runtime dependency.

## Why this matters

Windows treats path casing as equivalent for normal filesystem access, but tooling can still observe different path strings. Playwright resolves test/config paths and uses those paths during test collection. The launcher therefore normalizes the working directory to the filesystem's real path before Playwright starts.

Playwright documents that `testDir` is resolved relative to the configuration file and recommends scoping it to the test directory. This version follows that pattern.

## Run

From exactly:

`C:\\Users\\HI\\Downloads\\spandana-praveen-main`

Run:

```powershell
npm run test:navigation
```

The normal prerequisites remain:

```powershell
npm install
npx playwright install chromium
```

The web application must be running for the browser tests unless the test environment is otherwise configured.

## Release rule

A successful package build does **not** mean browser QA passed. Browser QA is only marked PASS after `npm run test:navigation` completes successfully on the user's machine.

---


# SOURCE: `V57_NAVIGATION_QA_HARDENING.md`

# V57 Navigation QA Hardening

Built from V56 as a separate copy. V56 remains untouched.

## Changes
- Canonical Windows development root remains `C:\Users\HI\Downloads\spandana-praveen-main`.
- Navigation Playwright mobile project now uses Chromium at a real 390x844 viewport instead of iPhone/WebKit.
- Public desktop header assertion is restricted to the 1440px desktop project; tablet is tested separately through the true preview test.
- Public page navigation uses `domcontentloaded` with a bounded 15-second navigation timeout so a hanging asset/network request cannot consume the entire 30-second test timeout.
- Tablet responsive assertion checks that the hamburger is hidden, not absent from the DOM.
- Existing strict header visibility assertions remain; no functional assertion was removed.

## Verification status
Source/config validation is included in the build process. Browser execution must be run in the user's local project because the development server and current application state are local. Do not claim browser verification passed until `npm run test:navigation` completes successfully.

---


# SOURCE: `V58_MOBILE_NAVIGATION_QA_SELECTOR_FIX.md`

# V58 Mobile Navigation QA Selector Fix

Built from V57 without modifying V57.

## Change
The mobile quick-action assertions now scope text lookup to the canonical `[data-nav-editor-id="mobile-strip"]` container. This avoids Playwright selecting the hidden desktop CTA `Donate` before the visible mobile-strip `Donate`.

## Preserved
- Canonical Windows path: `C:\Users\HI\Downloads\spandana-praveen-main`
- Chromium-only navigation projects
- Tablet hidden-hamburger assertion
- Strict public desktop assertions
- True iframe header preview architecture

## Verification
Source/package ZIP integrity is checked at packaging time. Browser QA is intentionally not claimed here; run `npm run test:navigation` in the user's environment.

---


# SOURCE: `V59_NAVIGATION_QA_BOUNDINGBOX_FIX.md`

# V59 — Navigation QA BoundingBox Fix

Built from V58 as a separate copy. V58 remains untouched.

## Fix
The mobile public navigation QA test correctly scoped the four quick actions to the mobile strip, but its bounding-box helpers detached Playwright Locator#boundingBox from the locator instance. V59 calls `boundingBox()` directly on each locator, preventing the `_withElement` TypeError.

The mobile preview test already used direct `boundingBox()` calls and is unchanged.

## Verification
- Source-level TypeScript syntax check: required before release.
- ZIP integrity: required before release.
- Browser Playwright verification: must be run from the canonical Windows project path and reported separately; this build environment does not claim that browser verification passed.

---


# SOURCE: `V60_NAVIGATION_QA_BOUNDINGBOX_FIX.md`

# V60 — Navigation QA BoundingBox Fix

Built from V59 only. V59 remains untouched.

## Purpose

The mobile navigation QA suite still contained a detached Playwright `boundingBox` method pattern in the packaged test file. The failing code stored `boundingBox` as a property and later invoked it as a standalone function, causing:

`TypeError: Cannot read properties of undefined (reading '_withElement')`

## Fix

All mobile geometry checks now retain the Playwright Locator objects and invoke:

- `logoLocator.boundingBox()`
- `hamburgerLocator.boundingBox()`
- `stripLocator.boundingBox()`

The selector scoping from V58 remains intact: mobile quick actions are queried inside `[data-nav-editor-id="mobile-strip"]`.

## Verification status

- Source inspection: PASS
- Detached `boundingBox` pattern: removed
- ZIP integrity: required PASS before release
- Browser Playwright suite: must be run on the user's Windows environment; not claimed here.

---


# SOURCE: `V61_1_VISUAL_QA_COMMAND_FIX.md`

# V61.1 — Dedicated Visual QA Command Fix

V61.1 is built from V61 in a separate copy. V61 remains untouched.

## Correction

V61's `test:navigation:visual` script accidentally invoked the normal 18-test navigation suite. V61.1 corrects this by adding a dedicated `tests/navigation/visual.spec.ts` suite and making `test:navigation:visual` invoke that file directly.

## Visual gate

The dedicated suite compares the public header and the isolated Header Designer preview at the same browser viewport using CSS geometry for:
- desktop: root, logo, desktop menu, CTA group
- tablet: root, logo, desktop menu, CTA group
- mobile: root, logo, mobile quick-action strip, hamburger

It also captures paired public/Designer screenshots under `qa/navigation-artifacts/visual-*` for manual inspection.

This is a visual-fidelity/geometry gate, not a claim of pixel-perfect identity. A true pixel-diff baseline should be introduced separately if desired.

---


# SOURCE: `V61_2_BUILD_REPORT.md`

# V61.2 Build Report

Source: V61.1 Dedicated Visual QA
Output: V61.2 Visual QA Timeout Hardening

V61.1 was not modified.

Files changed:
- frontend/src/pages/admin/HeaderPreview.tsx
- tests/navigation/visual.spec.ts
- playwright.navigation.config.ts
- V61_2_VISUAL_QA_TIMEOUT_HARDENING.md
- V61_2_BUILD_REPORT.md

Validation:
- TypeScript syntax: PASS
- JSON package parse: PASS
- ZIP integrity: pending packaging
- Browser tests: NOT EXECUTED in build environment

---


# SOURCE: `V61_2_VISUAL_QA_TIMEOUT_HARDENING.md`

# V61.2 — Visual QA Timeout Hardening

Built from V61.1 only. V61.1 remains untouched.

## Purpose

V61.1 exposed desktop and tablet visual-QA timeouts while mobile visual geometry passed. V61.2 hardens the test harness without changing navigation design or canonical navigation data.

## Changes

- Added an explicit preview readiness handshake (`spandana-admin-header-preview-ping` / `spandana-admin-header-preview-ready`) so Playwright never sends the settings payload before the React preview listener is registered.
- Added explicit HTTP readiness/error handling for `/api/settings`.
- Added bounded preview navigation and readiness waits with diagnostic intent.
- Increased the suite test timeout from 30s to 60s for the slower visual workflow.
- Forced the visual suite to one worker so desktop/tablet browser work cannot contend for local MERN/Vite resources.
- Kept the existing mobile geometry gate unchanged.

## Verification in build environment

- TypeScript transpile/syntax validation: PASS.
- Package/config parsing: PASS.
- Browser execution: NOT RUN in the build environment because the project dependencies/server are supplied by the user's local environment.

## Important

This is QA/test-harness hardening, not a claim that the public header or Designer is pixel-perfect. The user's local `npm run test:navigation:visual` run is the release evidence for browser execution.

---


# SOURCE: `V61_3_PUBLIC_SPA_READINESS_QA_FIX.md`

# V61.3 — Public SPA Readiness QA Fix

Built from V61.2 only. V61.2 remains untouched.

## Problem found in V61.2
Desktop and tablet visual tests timed out in `page.goto("/")` while waiting for `domcontentloaded`. Mobile completed successfully. This means the visual gate was using document lifecycle completion as a proxy for React application readiness.

## Fix
The public visual tests now navigate with `waitUntil: "commit"` and explicitly wait for `.spandana-nav-root` to become visible. This tests the actual application readiness condition required by the visual comparison rather than requiring the SPA document lifecycle event to finish within the navigation timeout.

The existing 60-second Playwright test timeout and single-worker execution remain intact.

## Scope
- QA harness only.
- No Nav component changes.
- No navigation labels/destinations/order changes.
- No settings/data changes.
- Mobile test logic preserved.

## Expected result
Desktop and tablet should proceed to the actual public-vs-Designer geometry comparison. If either still fails, the failure should occur at a specific readiness/geometry assertion rather than being hidden behind `domcontentloaded`.

---


# SOURCE: `V61_BUILD_REPORT.md`

# Spandana V61 Build Report

## Source baseline
Built from `Spandana_V60_NAVIGATION_QA_BOUNDINGBOX_FIX_FULL.zip` in a separate working copy. V60 is not modified.

## V61 scope
Only Navigation/Header visual-QA hardening was changed. The public header implementation, canonical menu structure, responsive design, and Admin visual designer architecture were not redesigned.

## Changes
1. Capture public desktop header screenshot alongside Designer desktop screenshot.
2. Capture public mobile header screenshot alongside Designer mobile screenshot.
3. Add desktop geometry parity checks between public and Designer renderings.
4. Add mobile geometry parity checks between public and Designer renderings at the same 390px CSS viewport.
5. Compare CSS geometry rather than displayed screenshot pixels, avoiding false failures caused by browser/device preview scaling.
6. Add a `test:navigation:visual` npm script alias for the same hardened navigation suite.

## Why this matters
The supplied Chrome screenshots were displayed at a scaled factor. A header that is 80 CSS pixels high can appear around 100 image pixels at 1.25x display scaling. V61 avoids treating displayed screenshot pixels as CSS layout measurements.

## Validation performed in build environment
- Source brace/parenthesis balance checks: PASS
- Existing backend JS syntax checks: PASS
- ZIP integrity: PASS
- Playwright browser execution: NOT RUN in build environment (dependencies/browser runtime are environment-dependent).

## User-side release gate
Run:

`npm run test:navigation`

Then require 0 failures and inspect the four artifacts:
- `qa/navigation-artifacts/public-desktop-header.png`
- `qa/navigation-artifacts/designer-desktop-header.png`
- `qa/navigation-artifacts/public-mobile-header.png`
- `qa/navigation-artifacts/designer-mobile-header.png`

The visual parity assertions are part of the automated test suite.

---


# SOURCE: `V61_VISUAL_FIDELITY_QA_HARDENING.md`

# V61 — Visual Fidelity QA Hardening

## Purpose
V61 keeps the V60 navigation implementation intact and adds a stronger visual-QA gate around the Header Designer.

## What changed
- Public desktop/mobile header screenshots are now captured as QA artifacts.
- Designer desktop/mobile screenshots continue to be captured.
- Desktop Designer preview is compared with the public header at the same browser viewport for invariant root/element heights.
- Mobile Designer preview is compared with the public header at the same 390px CSS viewport for invariant root height and key logo/strip/hamburger geometry.
- Comparisons use CSS geometry rather than raw screenshot pixels so browser screenshot scaling/device-pixel-ratio cannot create false failures.
- Existing functional tests remain unchanged in intent.

## Important visual-QA interpretation
The supplied browser screenshots can appear larger than CSS pixels because the browser/device preview may be displayed at a scaled factor. V61 deliberately measures CSS-pixel geometry through Playwright instead of inferring dimensions from the displayed screenshot image.

Therefore, a visible 80px header rendered at 1.25x can appear approximately 100 image pixels while still being exactly 80 CSS pixels. This prevents the false 72/80/100px diagnosis that can happen when judging screenshots by their displayed pixel dimensions.

## Artifacts
After `npm run test:navigation`, inspect:
- `qa/navigation-artifacts/public-desktop-header.png`
- `qa/navigation-artifacts/designer-desktop-header.png`
- `qa/navigation-artifacts/public-mobile-header.png`
- `qa/navigation-artifacts/designer-mobile-header.png`

## Release gate
A V61 navigation QA run is considered clean when:
- applicable Playwright tests report 0 failures;
- public and Designer header geometry parity assertions pass;
- desktop, tablet, and mobile responsive assertions pass;
- draft-to-preview synchronization passes.

This is a tested QA gate, not a claim of universal 100% correctness for every browser/device.

---


# SOURCE: `V62_BUILD_REPORT.md`

# V62 Build Report

## Version
Spandana V62 — True Header Environment + Tablet Responsive Safety

## Base
V61.3 (`Spandana_V61_3_PUBLIC_SPA_READINESS_QA_FIX_FULL.zip`)

## Preservation
V61.3 was not modified. V62 was produced from a separate extracted copy.

## Modified files
- `frontend/src/components/nav.tsx`
- `frontend/src/pages/admin/HeaderPreview.tsx`
- `tests/navigation/visual.spec.ts`
- `V62_TRUE_HEADER_ENVIRONMENT_AND_TABLET_SAFETY.md`
- `V62_BUILD_REPORT.md`

## Main implementation
1. Header Designer preview now renders a representative live homepage hero context behind the real navigation renderer.
2. Header preview accepts and applies page settings from the existing preview message so hero context follows the same draft/live settings payload.
3. Tablet preview is now a first-class preview device in `Nav`/`HeaderPreview`.
4. Intermediate-width CSS prevents desktop menu and CTA collisions.
5. Playwright visual QA now checks menu/CTA non-overlap at tablet width and verifies the preview context background exists.

## Static validation
- TS/TSX diagnostics: PASS.
- Backend Node syntax: PASS.
- Playwright runner syntax: PASS.
- package JSON: PASS.
- ZIP integrity: PASS after packaging.

## Browser validation status
NOT EXECUTED in the build environment.

The user must run the Playwright suites locally before V62 is treated as browser-verified.

---


# SOURCE: `V62_TRUE_HEADER_ENVIRONMENT_AND_TABLET_SAFETY.md`

# Spandana V62 — True Header Environment + Tablet Responsive Safety

## Source
- Built from **Spandana V61.3** in a separate working copy.
- V61.3 remains untouched.

## Purpose
V62 addresses the two concrete gaps found during forensic comparison of V61.3 with the user's live desktop/mobile header screenshots:

1. The Admin Header Designer rendered the real `Nav` component and the real draft data, but its preview background was plain white. The public homepage header is transparent over the page/hero environment, so the accessibility row could look different in the Designer even when the header itself was correct.
2. At intermediate desktop/tablet widths, the desktop menu and CTA group could collide. V62 adds a responsive safety zone and automated collision checks.

## Changes
### Header Designer environment
- `HeaderPreview` now receives the page settings used by the live page.
- The preview stage renders a representative homepage hero context behind the header using the current desktop/mobile hero image/fallback configuration.
- The public hero's blue overlay treatment is represented in the preview context.
- Draft/page settings are updated through the existing postMessage preview channel, so the context follows the same settings payload as the navigation.

### Tablet responsive safety
- Added an intermediate-width safety zone for 768–1100 CSS px.
- Desktop menu is compacted and positioned to the left at intermediate widths.
- CTA group is compacted and kept against the right edge.
- Logo is safely inset.
- The existing desktop 1440px and mobile 390px layouts are not intentionally redesigned.
- HeaderPreview now recognizes `device=tablet` and Nav can use the tablet design bucket during preview.

### Automated QA
- Added a reusable Playwright element-intersection check for menu/CTA collision.
- Tablet public header and Designer preview both receive collision assertions.
- Designer desktop/tablet preview must expose a page-context hero background.
- Existing geometry comparisons and screenshot artifact generation remain in place.

## Verification completed in build environment
- TypeScript syntax/diagnostics: PASS for modified TS/TSX files.
- `backend/server.js` Node syntax: PASS.
- Playwright runner syntax: PASS.
- `package.json` parse: PASS.
- Browser tests: **NOT EXECUTED in this build environment** because Playwright/browser dependencies are not installed in the packaged working copy.
- Full frontend build: **NOT EXECUTED** because frontend dependencies are not installed in the packaged working copy.

## User-side verification required
Run from the exact canonical Windows project path:

`C:\Users\HI\Downloads\spandana-praveen-main`

Then run:

`npm run test:navigation`

and:

`npm run test:navigation:visual`

Review the generated files under:

`qa\navigation-artifacts\`

The release should only be considered browser-verified after those local runs report zero failures.

---


# SOURCE: `V63_BUILD_REPORT.md`

# V63 Build Report — True Home Shell Header Designer

## Baseline
Built from a separate extracted copy of V62. V62 remains untouched and is the protected navigation baseline.

## Scope
Only the Header Designer preview fidelity was reopened. Canonical navigation structure and public information architecture were not intentionally changed.

## Implementation
- Header Designer iframe route now renders the real `Home` page shell in `adminPreview=1` mode.
- The Home preview uses the production `Nav` component—the same component rendered by public pages.
- Preview accepts draft navigation, logo, visibility and live-stream settings through the existing postMessage bridge.
- Desktop/tablet/mobile preview device modes are supported by the Home preview.
- Editor element selections are forwarded from the real Nav back to Admin.
- Desktop Designer canvas uses a 1440px preview viewport and scrolls horizontally when the Admin canvas is narrower.
- Mobile quick actions use deterministic four-column slots so Donate, Join Us, Joy Zone and Shop remain visible within the protected middle zone.
- Header preview no longer uses a synthetic hero/background implementation.

## QA hardening
- Header tests now load the preview in `adminPreview=1` mode.
- Visual tests assert the expected visible desktop labels in the Designer: Home, Sahara Community Centers, Joy Zone, Blog, Get Involved, Donate, Shop.
- Visual tests assert the expected visible mobile labels in the Designer: Donate, Join Us, Joy Zone, Shop, plus the hamburger.
- Existing geometry and tablet overlap tests remain.

## Static validation
- TypeScript transpile diagnostics: PASS for all changed TS/TSX test/source files.
- `node --check backend/server.js`: PASS.
- `node --check scripts/run-playwright-navigation.mjs`: PASS.
- `package.json` JSON parse: PASS.
- ZIP integrity: verified after packaging.

## Browser verification
NOT EXECUTED in the build environment. The build environment does not contain the project's installed browser-test dependencies. Run the supplied Playwright suites on the user's canonical Windows installation before treating V63 as QA-passed.

## Required user QA
From:
`C:\Users\HI\Downloads\spandana-praveen-main`

Run:
`npm run test:navigation`
`npm run test:navigation:visual`

Then inspect the generated screenshots in:
`qa\navigation-artifacts`

Do not manually alter navigation settings before these checks.

---


# SOURCE: `V63_TRUE_HOME_SHELL_HEADER_DESIGNER.md`

# V63 — True Home Shell Header Designer

## Purpose
The Header Designer preview now uses the same Home page shell as production instead of a synthetic hero wrapper. The iframe still receives draft navigation/settings through postMessage, but the rendered header is the production `Nav` component inside the production Home page context.

## Changes
- Header preview route renders `Home` in `adminPreview=1` mode.
- Home preview accepts desktop/tablet/mobile device modes.
- Home preview accepts navigation, logo, page visibility, and live-stream draft data.
- Nav selection events are forwarded back to the Admin designer.
- Desktop Designer viewport is 1440px wide and scrollable inside the Admin canvas.
- Tablet is 768px; mobile remains 360/375/390px.
- Mobile quick-action strip uses four deterministic grid slots so Donate, Join Us, Joy Zone, and Shop cannot disappear due flex sizing.
- Automated visual tests now assert the expected visible labels in the Designer for desktop, tablet, and mobile.

## Freeze boundary
The canonical navigation structure is unchanged. This change reopens only Header Designer preview fidelity.

---


# SOURCE: `V64_BUILD_REPORT.md`

# V64 Build Report

Source: V63 copy. V63 remains untouched.

Static validation: source edits applied; browser verification must be run from the user's canonical Windows installation.

---


# SOURCE: `V64_HEADER_DESIGNER_TRUE_CANONICAL_RENDER_FIX.md`

# V64 — Header Designer True Canonical Render Fix

V64 reopens only the Header Designer preview layer; the canonical navigation structure remains unchanged.

## Fixes
- Header preview route now renders the production `Nav` directly inside a minimal page-context shell.
- Preview settings are received through an explicit ready/message handshake.
- Mobile logo, four quick actions, and hamburger receive explicit grid placement.
- Admin Designer preview uses a real virtual viewport (1440/768/390) and scales the complete viewport to fit the available Designer canvas, preventing desktop CTA clipping.
- Added an Admin Designer smoke regression test for complete desktop and mobile visible navigation.

## Protected
- Canonical menu structure
- CTA destinations/labels
- Mobile quick-action structure
- V62/V63 navigation behavior

---


# SOURCE: `V65_VISUAL_QA_CONTEXT_SELECTOR_FIX.md`

# V65 — Visual QA Context Selector Fix

## Problem
V64 introduced a lightweight header preview shell using a root `<div>` rather than a semantic `<section>`. The visual QA test still searched for `section:first()`, causing desktop and tablet visual tests to fail even though the preview header itself loaded and the canonical navigation assertions passed.

## Fix
The visual QA now targets the stable `[data-header-preview-root="true"]` preview context and verifies its representative blue page-context background. A dedicated `[data-preview-page-context="true"]` marker was also added for future screenshot/DOM QA.

## Scope
No navigation structure, menu labels, CTA destinations, mobile actions, or Mongo/data settings were changed.

---


# SOURCE: `V66_BUILD_REPORT.md`

# V66 Build Report

Built from V65 in a separate working copy. V65 remains untouched.

Changes:
- `frontend/src/pages/home.tsx`: added true public-route `headerOnly` preview mode and ready handshake support.
- `frontend/src/pages/admin/tabs/NavigationTab.tsx`: Header Designer iframe now loads `/?adminPreview=1&headerOnly=1&device=...`.

Validation performed in build environment:
- Source inspection: PASS
- TypeScript transpile diagnostics: PASS
- ZIP integrity: PASS
- Browser QA: NOT EXECUTED in build environment; run locally before release.

---


# SOURCE: `V66_TRUE_PUBLIC_HOME_ROUTE_HEADER_DESIGNER.md`

# V66 — True Public Home Route Header Designer

## Purpose
The Admin Header Designer preview now loads the actual public `/` Home route in an isolated iframe using `adminPreview=1&headerOnly=1`, rather than a surrogate header-preview route. The same production `Home` shell and production `Nav` component render in the preview.

## Guarantees
- Real public Home route and responsive browser viewport.
- Same production Nav component.
- Same page settings/hero context.
- Draft navigation is still pushed by postMessage.
- Header-only mode prevents the full Home page from making the Designer canvas unnecessarily tall.
- Existing public navigation structure is unchanged.

## Scope
Only Header Designer preview rendering changed. No public navigation labels, destinations, ordering, or MongoDB data are changed by this build.

---


# SOURCE: `V67_BUILD_REPORT.md`

# V67 Build Report

Source: V66 clean copy. V66 remains untouched.

Changed:
- frontend/src/pages/admin/tabs/NavigationTab.tsx
- tests/navigation/visual.spec.ts
- V67_HEADER_DESIGNER_PUBLISHED_NAV_HYDRATION_FIX.md
- V67_BUILD_REPORT.md

Validation performed:
- TypeScript transpile diagnostics: PASS for NavigationTab and visual.spec.ts
- Node syntax: PASS for backend/server.js and scripts/run-playwright-navigation.mjs
- package.json parse: PASS
- ZIP integrity: PASS

Browser verification in build environment: NOT EXECUTED. User-side browser QA is required after clean installation.

---


# SOURCE: `V67_HEADER_DESIGNER_PUBLISHED_NAV_HYDRATION_FIX.md`

# V67 — Header Designer Published Navigation Hydration Fix

## Problem fixed
The Admin Header Designer was initially rendering the canonical header and then replacing it with the Admin draft navigation structure. Because the Admin draft can contain an incomplete or stale placement structure, the Designer could lose Home and all desktop CTAs, or show only Joy Zone on mobile, even while the public site remained correct.

## Correct architecture
The Header Designer is a visual header editor, not a second menu editor. It now uses the published `/api/settings` navigation structure as the canonical structure for the visual preview while retaining the current Admin draft for live-editable design values.

This prevents an incomplete Admin draft from silently becoming the preview's menu structure.

## Scope
- No MongoDB mutation.
- No public navigation mutation.
- No automatic save or publish.
- No Home Page settings changes.
- Existing menu/structure editing remains available in the Select Menu stage.

## QA
A dedicated regression test simulates the published canonical navigation and verifies all seven desktop items and all four mobile quick actions survive the Admin Designer hydration path.

---


# SOURCE: `V69_BUILD_REPORT.md`

# V69 Build Report

Source: V68

Changes:
- Hardened Playwright navigation preview setup to use embedded live settings (`window.__SITE_SETTINGS__`) instead of directly fetching `/api/settings`.
- Added V69 documentation.

Preservation:
- V68 source remains untouched.
- No MongoDB data or navigation settings are modified by this build.

Validation:
- Source diff limited to navigation QA test helpers and V69 documentation.
- ZIP integrity verified after packaging.
- Full browser QA must be run on the user's Windows environment.

---


# SOURCE: `V69_HEADER_DESIGNER_QA_EMBEDDED_SETTINGS_FIX.md`

# V69 — Header Designer QA Embedded Live Settings Fix

## Purpose
V68 successfully made the Admin Header Designer visually reproduce the real website environment. The remaining Playwright investigation failures were caused by the QA harness directly calling `/api/settings`, which returned HTTP 500 / an empty response during the test run.

## Fix
The navigation QA helpers now consume the same live settings object embedded into the SPA HTML by the backend (`window.__SITE_SETTINGS__`). This is the server-side live settings snapshot already used to prevent first-paint settings races.

The tests no longer depend on an additional `/api/settings` round trip merely to populate the isolated header preview.

## Scope
- QA/test harness only.
- No MongoDB schema changes.
- No public navigation layout changes.
- No Header Designer UI changes.
- No canonical navigation changes.
- V68 remains untouched.

## Verification expectation
On the user's Windows installation, rerun:

`npm run test:navigation`

and

`npm run test:navigation:visual`

If these pass, the remaining failures were test-harness transport failures rather than header rendering failures.

---


# SOURCE: `V70_BUILD_REPORT.md`

# V70 Build Report

Source: V69

Changes: Playwright navigation/visual preview helpers are self-contained and no longer depend on `window.__SITE_SETTINGS__` on the Vite-served preview route.

Static checks: test files parsed as TypeScript source; no production application code changed.
Browser QA: not executed in the build environment; run locally with the user's installed Playwright/Chromium.

---


# SOURCE: `V70_HEADER_DESIGNER_QA_PREVIEW_SELF_CONTAINED.md`

# V70 Header Designer QA — Preview Self-Contained

## Root cause fixed
V69 made Playwright depend on `window.__SITE_SETTINGS__` being injected into `/__admin/header-preview`. That injection is performed by the production backend SPA fallback, but the Playwright preview route is served by the Vite development server during local QA. Therefore the preview page can render correctly while the QA harness sees no embedded settings.

## V70 change
Navigation QA no longer requires embedded settings or a second `/api/settings` request just to load the isolated Header Designer preview. It waits for the real production `Nav` component to render, then tests what is actually visible.

The draft-message regression test still sends an explicit canonical navigation payload when it needs to test message-driven updates.

## What is not changed
- No MongoDB data or schema changes.
- No public Header/Navigation layout changes.
- No canonical navigation settings changes.
- No Admin Designer rendering changes.
- V69 remains untouched.

## Expected QA result
The prior `Embedded live settings are unavailable in the test page` failures should disappear. The tests will now validate the actual isolated preview rather than an environment-specific HTML injection mechanism.

---


# SOURCE: `V72_BUILD_REPORT.md`

# V72 Build Report

Source: V71_HEADER_DESIGNER_VISUAL_QA_HELPERS

Changed production files:
- frontend/src/components/nav.tsx
- frontend/src/pages/admin/tabs/NavigationTab.tsx

Added documentation:
- V72_MOBILE_HEADER_ACTION_CONTROLS.md
- V72_BUILD_REPORT.md

Validation:
- NavigationTab.tsx TypeScript transpile: PASS
- nav.tsx TypeScript transpile: PASS
- ZIP integrity: PASS
- Full frontend dependency build: not executed in build environment
- Browser QA: not executed in build environment

No changes were made to MongoDB schema/data, public navigation structure, or Live Page Preview.

---


# SOURCE: `V72_MOBILE_HEADER_ACTION_CONTROLS.md`

# V72 — Mobile Header Action Controls

Built from V71. V71 remains untouched.

## Scope
- Mobile Header Designer only.
- Public Header/Navigation behavior is preserved.
- Live Page Preview is preserved.
- MongoDB/data/schema are untouched.

## New controls
The Mobile Header Strip designer now supports:
- Move all four actions horizontally together.
- Move all four actions vertically together.
- Set the same icon size for all four actions.
- Set the same scale for all four actions.
- Reset all four action positions/sizes.
- Individual fine-tuning for Donate, Join Us, Joy Zone and Shop: X, Y, icon size and scale.

## Rendering behavior
Each mobile action combines the group adjustment with its individual adjustment, while preserving existing item presentation styles. Icon containers grow with the icon size so larger icons do not remain trapped in the old fixed 28px container.

## Validation
- TypeScript transpile/syntax validation: PASS for modified TSX files.
- ZIP integrity: PASS.
- Browser QA should be run from the user's installed project before considering V72 released, using the existing navigation and visual QA commands.

---


# SOURCE: `V73_HEADER_DESIGNER_CONTROL_AUDIT.md`

# V73 Header Designer Control Audit

## Scope
- Mobile Header Strip controls in Admin → Design Header.
- Center preview remains the production Nav component in the isolated Header Preview iframe.
- Public Header/Navigation and Live Page Preview are unchanged.

## Findings fixed
1. **All-4 X/Y movement did not reach internal Link elements.**
   - The production `Nav` calculated `itemX`/`itemY` including group + individual offsets, but the internal `<Link>` branch only applied the page-specific offset.
   - V73 applies the same effective transform to both internal and external mobile actions.
2. **All-4 scale did not reach internal Link elements.**
   - Same root cause; V73 uses the calculated group × individual × page scale for internal links too.
3. **Right properties panel was part of the page scroll.**
   - V73 makes the right property panel sticky with its own vertical scroll, keeping the mobile preview visible while working through lower controls.
4. **Designer center area was itself an overflow scroller.**
   - V73 removes the center panel's independent overflow so the sticky right panel can remain alongside the preview.

## Control contract
### All 4 together
- Horizontal offset: -30..30 px
- Vertical offset: -30..30 px
- Icon size: 16..42 px
- Scale: 70..140%
- Reset all four

### Individual fine tune
For Donate, Join Us, Joy Zone and Shop:
- X: -20..20 px
- Y: -20..20 px
- Icon size: 16..42 px
- Scale: 70..140%

### Other Mobile Header Strip controls
- Item gap: 0..20 px
- Item minimum width: 40..70 px
- Label text size: 9..16 px
- Action area padding: 0..16 px

## Verification
- Source-level handler audit completed for all controls above.
- TypeScript syntax validation completed for modified files.
- Browser QA should be run in the user's local environment before V73 is promoted to the main master folder.

---


# SOURCE: `V74_BUILD_REPORT.md`

# V74 Build Report

Built from V73 as a separate copy. V73 remains untouched.

Changes:
- Header Designer workspace sticky/independent property panel behavior.
- Fixed shared mobile action scale persistence/application.
- Fixed shared mobile action atomic state writes.
- Fixed percentage unit labels.
- Added explicit mobile side-space explanation.
- Canonicalized Donate/Get Involved/Shop labels and Shop URL in Nav.
- Added mobile Designer control regression tests.
- Removed mobile accessibility timing controls that had no production consumer; stored legacy values are preserved.

Validation:
- TypeScript transpile diagnostics: PASS (NavigationTab, Nav, control spec).
- ZIP integrity: to be verified after packaging.
- Browser QA: not executed in build environment.

---


# SOURCE: `V74_HEADER_DESIGNER_COMPLETE_CONTROL_AUDIT.md`

# V74 — Header Designer Complete Control Audit

## Scope
Focused revision from V73. Public Header/Navigation architecture and Live Page Preview behavior remain preserved.

## Confirmed fixes
- Shared mobile action X/Y controls are read by production Nav and now remain in one atomic settings update.
- Shared mobile action icon-size control writes the global value and all four item values atomically.
- Shared mobile action scale control writes the correct percentage value (`n / 100`) instead of the previous erroneous `1`.
- Percentage controls display `%` instead of `px` where applicable.
- Designer properties panel now has independent viewport-height scrolling and the Designer shell no longer clips sticky behavior.
- Designer top device/action bar is sticky while editing.
- Mobile Header Strip explicitly explains where left/right reserved whitespace comes from.
- Canonical Donate/Get Involved/Shop labels and Shop URL are resolved from the same canonical navigation settings used by the header, so mobile actions follow canonical action configuration.
- Added browser control tests for shared action movement/size/scale, individual action controls, and independent properties-panel scrolling.

## Mobile Header Strip control matrix
| Control | State | Production read | Notes |
|---|---|---|---|
| Move all 4 horizontally | PASS | `mobile.actionOffsetX` | Applied to each action |
| Move all 4 vertically | PASS | `mobile.actionOffsetY` | Applied to each action |
| Icon size — all 4 | PASS | `mobile.actionIconSize` + item overrides | Atomic write |
| Scale — all 4 | PASS | `mobile.actionScale` + item overrides | Atomic percentage write fixed |
| Reset all 4 | PASS | Removes action overrides | Falls back to defaults |
| Donate X/Y | PASS | `actionItems.donate` | Individual transform |
| Donate icon size | PASS | `actionItems.donate.iconSize` | Individual |
| Donate scale | PASS | `actionItems.donate.scale` | Percentage |
| Join Us X/Y | PASS | `actionItems.get-involved` | Individual |
| Join Us icon size | PASS | `actionItems.get-involved.iconSize` | Individual |
| Join Us scale | PASS | `actionItems.get-involved.scale` | Percentage |
| Joy Zone X/Y | PASS | `actionItems.joyzone` | Individual |
| Joy Zone icon size | PASS | `actionItems.joyzone.iconSize` | Individual |
| Joy Zone scale | PASS | `actionItems.joyzone.scale` | Percentage |
| Shop X/Y | PASS | `actionItems.shop` | Individual |
| Shop icon size | PASS | `actionItems.shop.iconSize` | Individual |
| Shop scale | PASS | `actionItems.shop.scale` | Percentage |
| Item gap | PASS | `mobile.itemGap` | Layout |
| Item minimum width | PASS | `mobile.itemMinWidth` | Layout |
| Label text size | PASS | `mobile.fontSize` | Layout |
| Action area padding | PASS | `mobile.actionAreaPadding` | Layout |

## Other mobile Designer controls
- Header height, horizontal padding, action-area gap/padding, background and border: wired to `design.mobile` and consumed by Nav.
- Logo width/max-height/slot width/scale/X/Y: wired and consumed by Nav.
- Hamburger frame, button size, icon size, gap, X/Y, radius, background and border: wired and consumed by Nav.
- Hamburger action height/gap/font size: wired and consumed by Nav.
- Drawer width/side/font size: wired and consumed by Nav.

## Accessibility audit finding
The current production Nav intentionally does not render the mobile accessibility bar (`hidden md:flex`), while the Admin mobile Designer historically exposed mobile accessibility controls. This is a product/architecture mismatch, not something to fake with a state-only control. V74 does not silently change the public mobile header. The timing-only controls were removed from the panel because they had no production consumer. The remaining mobile accessibility controls should be treated as a separate, explicit future implementation if the mobile accessibility bar is to become public.

## Canonical mobile icons
The icon glyph selection remains deterministic by canonical action ID (Donate, Get Involved, Joy Zone, Shop). Labels and destinations now follow canonical navigation settings. This preserves the approved four-action mobile strip without creating a second menu database.

## QA added
`tests/navigation/mobile-designer-controls.spec.ts`
- Shared four-action movement, icon size and scale behavior.
- Individual Donate control behavior.
- Independent properties-panel scroll / preview visibility.

Browser execution is not claimed in this build environment. Run `npm run test:navigation`, `npm run test:navigation:visual`, and `npm run test:navigation:controls` in the local installation before promoting V74 to the master folder.

---

# V76 — SYSTEM MEMORY, EXPORT & DOCUMENT CONSOLIDATION

## Purpose

V76 establishes the first in-application System Knowledge Center and consolidates the project's fragmented Markdown documentation into one canonical file.

## Canonical documentation

- `docs/SPANDANA_SYSTEM_KNOWLEDGE.md` is the single Markdown knowledge file shipped with this build.
- The file contains the prior Markdown documents separated by source headings, plus this V76 system-memory record.
- Credential-like values are redacted in the consolidated documentation.

## Admin System Knowledge Center

Admin → System → System Knowledge & Export provides:

- Natural-language-style question prompts for common architecture, recovery, database, SEO, Sahara, Header/Navigation, developer/version and technology-stack questions.
- Search over the consolidated project documentation.
- Current machine-readable system manifest.
- Download of the consolidated Markdown knowledge file.
- Download of a redacted JSON system snapshot.

## System snapshot

The Admin snapshot records, when available:

- Runtime information.
- MongoDB connection state and collection data.
- Current site settings.
- API inventory reference.
- Frontend/backend/root package manifests.
- Relevant environment-variable inventory with secrets redacted.
- Project file inventory.
- Consolidated system knowledge.

Passwords, tokens, secrets, API keys, private keys and MongoDB credentials are redacted and are never intended to be exported.

## Recovery principle

The snapshot is an operational knowledge/data export, not a byte-for-byte replacement for a source-control repository or hosting provider. The long-term architecture should maintain independent code, database, media and infrastructure backups so hosting expiry cannot become the only recovery point.

## Important limitation

MongoDB collection export is JSON-based in V76. A native BSON backup/restore pipeline and independently stored scheduled disaster-recovery copies remain a future hardening layer unless separately implemented.

## V76 Build Validation Record

- Built from V75 in a separate working copy; V75 remains untouched.
- Consolidated 92 project Markdown files into this single canonical knowledge file.
- Removed the 92 fragmented Markdown files from the build; exactly one project Markdown file remains: `docs/SPANDANA_SYSTEM_KNOWLEDGE.md`.
- Backend route syntax validation passed for `backend/routes/v1/system.js`, `backend/routes/v1/index.js`, and `index.js`.
- `package.json` parsing passed.
- The full frontend production build was not executed in the build environment because the V75 archive does not ship installed frontend dependencies and this environment did not have the TypeScript/Vite toolchain installed. Do not interpret this as a frontend browser-QA pass.
- Browser QA for the new System Knowledge Center was not executed in this build environment and must be run after installation in the canonical Windows project folder.


# Current Knowledge Center / Recovery Truth — V76

## Knowledge Center architecture
The interactive Knowledge Center is an explanatory and indexing layer, not a second source-code repository. The central machine-readable knowledge record is `docs/system-knowledge.json`. Current persisted settings are read from the canonical settings store, and repository references are discovered from the actual project tree. Source code is not duplicated into the knowledge database.

Search can answer system/design questions, inspect current setting paths and values (with sensitive values redacted), and find repository references such as `frontend/src/.../index.tsx`. Selecting a result opens its explanation and implementation reference in the right-side detail panel.

## Recovery outside the Admin Panel
The repository now ships recovery mechanisms outside the Admin UI:

- Admin password recovery from the Admin login/recovery flow using verified email/mobile OTP and optional backup questions.
- Docker `restart: unless-stopped` for automatic container restart after ordinary process/container failure.
- PM2 restart support through `deploy.sh` for VPS-style deployments.
- `scripts/recovery/recovery-status.mjs` to inspect the recovery capabilities available on the host.
- `scripts/recovery/backup-system.mjs` to back up JSON data, uploads, documentation and the current Git commit, with optional MongoDB dump when `mongodump` and `MONGO_URI` are available.
- `scripts/recovery/restore-system.mjs` to restore file-based data/uploads/docs and MongoDB dumps when available.
- `scripts/recovery/rollback-and-redeploy.sh` to create a backup, optionally move to a known-good Git commit, rebuild/restart with Docker or PM2, and perform a local health check.

### Important limitation
These tools provide the recovery mechanism in the repository. They do not by themselves create an off-site backup destination, deployment-provider account, DNS failover, or independent hosting environment. Those external resources must be configured and tested operationally.

## Recovery architecture (V78)

The system has an independent Recovery Console outside the Admin Panel and a verified Recovery Point system. Recovery Points include database state when MongoDB is configured, all persisted settings (live/draft/history), JSON data, uploads, documentation/knowledge, and a Git commit reference when available. Settings draft saves create lightweight settings snapshots; settings publishing creates a full Recovery Point. A Recovery Point is marked GOOD only after artifact and application-health verification. Production still requires a configured durable secondary/off-host backup destination for host-level disaster protection.
## Recovery Console — what each action does

The independent Recovery Console exists so emergency recovery does not depend on the Admin Panel. Email OTP unlocks a short-lived recovery session.

- **Check System:** diagnostics only; does not restore or modify the system.
- **Create Backup Now:** creates and verifies a Recovery Point.
- **Restart Application:** restarts the main application; health can then be checked.
- **Recover Last Good:** restores the latest VERIFIED GOOD Recovery Point, attempting to preserve the current state first.
- **Restore this point:** restores a specifically selected GOOD Recovery Point after confirmation and a pre-restore safety snapshot when possible.
- **Lock / Sign Out:** destroys the recovery session and returns to OTP login.
- There is no browser Exit action that can safely stop the recovery-console server; stopping the server is an infrastructure operation.

Only GOOD/verified Recovery Points are restorable.

## SER — Safe Verification and Environment Routing

- **Local development:** if `RECOVERY_APP_URL` is not set and `NODE_ENV` is not production, SER checks the main application at `http://localhost:3000`.
- **Production:** if `RECOVERY_APP_URL` is not set and `NODE_ENV=production`, SER uses the Docker application address `http://spandana:5000`. Production may explicitly set `RECOVERY_APP_URL` when its application address differs.
- **Verify SER Safely:** a non-destructive test that checks recovery email configuration, Gmail SMTP, application health, recovery-point index, and Docker availability. In local non-Docker testing, Docker is treated as not required rather than a failed prerequisite. It does not restore, delete, or restart anything.
- **Check System:** performs the current application health check and refreshes the recovery-point status.
- **Create Backup Now:** creates a recovery point through the verified backup service.
- **Restart Application:** requests a Docker restart of the `spandana-app` container; it requires Docker availability.
- **Recover Last Good / Restore this point:** destructive recovery operations; only VERIFIED GOOD points may be restored and a safety backup is attempted first.
- **Lock / Sign Out:** clears the SER session; it does not stop the Recovery Console service.


## SER Safe Verification
The Recovery Console safe verification checks recovery email configuration, Gmail SMTP, main application health, recovery-point index, and Docker availability. In local non-Docker testing, Docker is informational/not required; in production it can be required. It performs no restore or restart operation. Local application health uses the backend status endpoint; production may use the Docker service address. Manual and scheduled Recovery Console backups establish the SER process’s own MongoDB connection before taking the native MongoDB snapshot, because SER runs independently of the main application process.
