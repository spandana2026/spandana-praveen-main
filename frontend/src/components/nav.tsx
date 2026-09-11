import { Link, useLocation } from "wouter";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Heart, ShoppingBag, HeartHandshake, BookOpen,
  ChevronDown, Shield, Brain, Radio, Gamepad2, Images,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktopFontSize, type DesktopFontSizeLevel } from "@/hooks/use-font-size-desktop";

const DEFAULT_LINKS: Array<{ id?: string; label: string; href: string; enabled?: boolean; mobileLabel?: string; children?: Array<{ id?: string; label: string; href: string; enabled?: boolean }> }> = [
  { id: "home", label: "Home", href: "/" },
  { id: "sahara", label: "Sahara Community Centers", href: "/sahara" },
  { id: "joyzone", label: "Joy Zone", href: "/fun-zone" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "get-involved", label: "Get Involved", mobileLabel: "Join Us", href: "/volunteer" },
  { id: "donate", label: "Donate", href: "/donate" },
  { id: "shop", label: "Shop", href: "/shop" },
];

interface NavSettings {
  links?: Array<{ id?: string; label: string; href: string; enabled?: boolean; mobileLabel?: string; children?: Array<{ id?: string; label: string; href: string; enabled?: boolean }> }>;
  donateLabel?: string;
  getInvolvedLabel?: string;
  shopLabel?: string;
  shopUrl?: string;
  itemStyles?: Record<string, { desktop?: any; mobile?: any; }>;
  design?: {
    desktop?: { headerHeight?: number; menuPosition?: "left" | "center" | "right"; menuVerticalAlign?: "top" | "center" | "bottom"; menuOffsetY?: number; menuOffsetX?: number; menuGap?: number; menuFontSize?: number; menuColor?: string; menuHoverColor?: string; activeColor?: string; background?: string; borderColor?: string; horizontalPadding?: number; logoScale?: number; menuScale?: number; ctaScale?: number; logoOffsetX?: number; logoOffsetY?: number; ctaOffsetX?: number; ctaOffsetY?: number; ctaGap?: number; };
    tablet?: { headerHeight?: number; menuPosition?: "left" | "center" | "right"; menuVerticalAlign?: "top" | "center" | "bottom"; menuOffsetY?: number; menuOffsetX?: number; menuGap?: number; menuFontSize?: number; menuColor?: string; menuHoverColor?: string; activeColor?: string; background?: string; borderColor?: string; horizontalPadding?: number; logoScale?: number; menuScale?: number; ctaScale?: number; logoOffsetX?: number; logoOffsetY?: number; ctaOffsetX?: number; ctaOffsetY?: number; ctaGap?: number; };
    mobile?: { actionItems?: Record<string, { offsetX?: number; offsetY?: number; iconSize?: number; scale?: number }>; actionOffsetX?: number; actionOffsetY?: number; actionIconSize?: number; actionScale?: number; logoPosition?: "left" | "center" | "right"; headerHeight?: number; menuGap?: number; stripOffsetY?: number; stripOffsetX?: number; fontSize?: number; textColor?: string; iconColor?: string; background?: string; borderColor?: string; horizontalPadding?: number; logoScale?: number; logoWidth?: number; logoMaxHeight?: number; logoSlotWidth?: number; stripScale?: number; logoOffsetX?: number; logoOffsetY?: number; itemGap?: number; itemMinWidth?: number; actionAreaGap?: number; actionAreaPadding?: number; iconSize?: number; hamburgerSize?: number; hamburgerBoxSize?: number; hamburgerGap?: number; hamburgerOffsetX?: number; hamburgerOffsetY?: number; drawerSide?: "left" | "right"; drawerWidth?: number; drawerOffsetY?: number; drawerFontSize?: number; drawerBackground?: string; drawerTextColor?: string; drawerOverlayColor?: string; drawerOverlayOpacity?: number; mobileCtaHeight?: number; mobileCtaGap?: number; mobileCtaFontSize?: number; accessibility?: { enabled?: boolean; topOnly?: boolean; hideOnScroll?: boolean; height?: number; gap?: number; fontSize?: number; background?: string; borderColor?: string; horizontalPadding?: number; buttonHeight?: number; groupGap?: number; compactButtonWidth?: number; labeledButtonWidth?: number; paperWidth?: number; controlPadding?: number; }; };
    dropdown?: { position?: "left" | "center" | "right"; width?: number; itemGap?: number; itemPaddingY?: number; itemPaddingX?: number; fontSize?: number; background?: string; textColor?: string; hoverBackground?: string; borderColor?: string; radius?: number; shadow?: string; offsetY?: number; };
  };
  mobile?: { headerHeight?: number; logoScale?: number; logoPosition?: "left" | "center" | "right"; stripItems?: Array<{ id: string; label: string; href: string; enabled?: boolean; icon?: string }> };
}

interface LiveSettings {
  enabled?: boolean;
  title?: string;
}

// Cache the last-known /api/settings response so the navbar can hydrate
// instantly on the very next load/reload instead of starting from a blank
// {} state. Without this, hidden admin links briefly fall back to
// DEFAULT_LINKS (all visible) until the network request resolves, which is
// the "hidden link flashes then disappears" glitch.
const NAV_CACHE_KEY = "spandana:nav-settings-cache";

function readNavCache(): any {
  try {
    const raw = localStorage.getItem(NAV_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeNavCache(d: any) {
  try {
    localStorage.setItem(NAV_CACHE_KEY, JSON.stringify(d));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

interface NavEditorProps {
  previewMode?: boolean;
  previewDevice?: "desktop" | "tablet" | "mobile";
  previewSettings?: NavSettings;
  previewLogoUrl?: string;
  previewPageVisibility?: Record<string, boolean>;
  previewLiveSettings?: LiveSettings;
  showAccessibilityPreview?: boolean;
  editorSelectedId?: string | null;
  onEditorSelect?: (id: string) => void;
  onEditorDragStart?: (id: string, clientX: number, clientY: number) => void;
  interactivePreview?: boolean;
}

export default function Nav({ previewMode = false, previewDevice = "desktop", previewSettings, previewLogoUrl, previewPageVisibility, previewLiveSettings, showAccessibilityPreview = false, editorSelectedId, onEditorSelect, onEditorDragStart, interactivePreview = false }: NavEditorProps = {}) {
  const isBuilderMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("builder") === "1";
  const [open, setOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [mobileOpenMap, setMobileOpenMap] = useState<Record<string, boolean>>({});
  const [mobilePrograms, setMobilePrograms] = useState(false);
  const [location] = useLocation();
  const { level: desktopLevel, paperWhite: desktopPaperWhite, setTo: setDesktopTo, togglePaper: toggleDesktopPaper } = useDesktopFontSize();
  const [desktopAccessibilityVisible, setDesktopAccessibilityVisible] = useState(true);

  // Desktop accessibility controls stay visible at the very top and hide while
  // the visitor scrolls down. They reappear only when the page returns to top.
  useEffect(() => {
    if (previewMode) return;
    const onScroll = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setDesktopAccessibilityVisible(window.scrollY <= 4);
      } else {
        setDesktopAccessibilityVisible(true);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [previewMode]);
  const isHome = location === "/";
  const cachedSettings = useRef<any>(readNavCache());
  const [navSettings, setNavSettings] = useState<NavSettings>(previewSettings ?? cachedSettings.current?.nav ?? {});
  const [liveSettings, setLiveSettings] = useState<LiveSettings>(cachedSettings.current?.liveStream ?? {});
  const [logoUrl, setLogoUrl] = useState(previewLogoUrl || cachedSettings.current?.branding?.logoUrl || "/logo.png");
  const [logoScale, setLogoScale] = useState(parseFloat(cachedSettings.current?.branding?.logoScale) || 1);
  const [logoPosition, setLogoPosition] = useState<"left" | "center" | "right">(cachedSettings.current?.branding?.logoPosition ?? "left");
  const [pageVisibility, setPageVisibility] = useState<Record<string, boolean>>(cachedSettings.current?.visibility ?? {});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tabletDesign = navSettings.design?.tablet ?? {};
  const desktopDesign = previewMode && previewDevice === "tablet" ? tabletDesign : (navSettings.design?.desktop ?? {});
  const mobileDesign = navSettings.design?.mobile ?? {};
  const dropdownDesign = navSettings.design?.dropdown ?? {};
  const mobileLogoPosition = mobileDesign.logoPosition ?? "left";
  const desktopMenuColor = desktopDesign.menuColor ?? undefined;
  const desktopHoverColor = desktopDesign.menuHoverColor ?? "#0033A0";
  const desktopActiveColor = desktopDesign.activeColor ?? desktopHoverColor;
  const desktopBg = desktopDesign.background ?? "hsl(var(--background) / 0.95)";
  const desktopBorder = desktopDesign.borderColor ?? "rgba(229,231,235,0.5)";
  const mobileBg = mobileDesign.background ?? "hsl(var(--background) / 0.95)";
  const mobileBorder = mobileDesign.borderColor ?? "rgba(229,231,235,0.5)";

  useEffect(() => {
    if (previewMode) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.nav) setNavSettings(d.nav);
        if (d?.liveStream) setLiveSettings(d.liveStream);
        if (d?.branding?.logoUrl) setLogoUrl(d.branding.logoUrl);
        if (d?.branding?.logoScale) setLogoScale(parseFloat(d.branding.logoScale) || 1);
        if (d?.branding?.logoPosition) setLogoPosition(d.branding.logoPosition);
        if (d?.visibility) setPageVisibility(d.visibility);
        // Refresh the cache so the *next* load/reload starts from this
        // known-good state instead of defaults.
        writeNavCache(d);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!previewMode) return;
    setNavSettings(previewSettings ?? {});
    if (previewLogoUrl) setLogoUrl(previewLogoUrl);
    if (previewPageVisibility) setPageVisibility(previewPageVisibility);
    if (previewLiveSettings) setLiveSettings(previewLiveSettings);
  }, [previewMode, previewSettings, previewLogoUrl, previewPageVisibility, previewLiveSettings]);

  const effectiveLogoUrl = previewLogoUrl || logoUrl;
  const showDesktopPreview = previewMode ? previewDevice !== "mobile" : true;
  const showMobilePreview = previewMode ? previewDevice === "mobile" : true;
  // In the live site the desktop and mobile controls must be mutually exclusive.
  // In the visual designer, previewDevice still controls which device is rendered.
  const desktopVisibilityClass = previewMode
    ? (showDesktopPreview ? "flex" : "hidden")
    : "hidden md:flex";
  const mobileVisibilityClass = previewMode
    ? (showMobilePreview ? "flex" : "hidden")
    : "flex md:hidden";
  const getItemPresentation = (item: any) => {
    const styles = navSettings.itemStyles?.[item.id ?? item.href ?? item.label] as any;
    const device = previewDevice === "mobile" ? "mobile" : previewDevice === "tablet" ? "tablet" : "desktop";
    return styles?.[device] ?? item?.style ?? {};
  };
  const getMobileLabel = (item: any) => item?.mobileLabel ?? (item?.id === "get-involved" ? "Join Us" : item?.label) ?? "";
  const editorEventProps = (id: string) => (previewMode && !interactivePreview) || isBuilderMode ? {
    "data-nav-editor-id": id,
    onPointerDown: (e: any) => { e.preventDefault(); e.stopPropagation(); onEditorSelect?.(id); onEditorDragStart?.(id, e.clientX, e.clientY); },
    onClick: (e: any) => { e.preventDefault(); e.stopPropagation(); onEditorSelect?.(id); },
  } : { "data-nav-editor-id": id };

  const rawLinks = (() => {
    const canonicalId = (l: any) => {
      if (l?.id) return l.id;
      const byHref: Record<string, string> = { "/": "home", "/sahara": "sahara", "/fun-zone": "joyzone", "/blog": "blog", "/gallery": "gallery", "/volunteer": "get-involved", "/donate": "donate", "/shop": "shop", "/#vision": "vision" };
      return byHref[l?.href] ?? l?.label?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    };
    const current = (navSettings.links?.length ? navSettings.links : DEFAULT_LINKS).filter((l) => l.id !== "community-initiatives" && l.label !== "Community Initiatives" && l.id !== "vision" && l.href !== "/#vision");
    const normalized = current.map((l) => ({ ...l, id: canonicalId(l), children: l.id === "sahara" ? undefined : (l.children?.length ? l.children : undefined) }));
    const keys = new Set(normalized.map((l) => l.id));
    const merged = normalized.map((l) => ({ ...l, children: l.children?.length ? l.children : undefined }));

    // Keep canonical top-level items available when older settings omit them.
    // Sahara is intentionally a standalone header item: Physical Care and
    // Mental Care are reached from inside the Sahara page, not this menu.
    for (const base of DEFAULT_LINKS) {
      const key = base.id ?? base.href ?? base.label;
      if (!keys.has(key)) merged.push({ ...base });
    }
    return merged;
  })();
  const donateLabel = navSettings.donateLabel ?? "Donate";
  const getInvolvedLabel = navSettings.getInvolvedLabel ?? "Get Involved";
  const shopLabel = navSettings.shopLabel ?? "Shop";
  const shopUrl = navSettings.shopUrl ?? "";

  const PAGE_VIS_MAP: Record<string, string> = {
    "/blog": "pageBlog", "/gallery": "pageGallery", "/fun-zone": "pageFunZone",
    "/sahara": "pageSahara", "/#vision": "pageVision", "/vision": "pageVision",
    "/volunteer": "pageGetInvolved", "/donate": "pageDonate", "/shop": "pageShop",
  };
  const showDonate = pageVisibility.pageDonate !== false;
  const showGetInvolved = pageVisibility.pageGetInvolved !== false;
  const showShop = pageVisibility.pageShop !== false;

  const canonicalizedLinks = rawLinks.map((item: any) => {
    if (item.id === "donate") return { ...item, label: donateLabel, mobileLabel: item.mobileLabel ?? donateLabel };
    if (item.id === "get-involved") return { ...item, label: getInvolvedLabel, mobileLabel: item.mobileLabel ?? "Join Us" };
    if (item.id === "shop") return { ...item, label: shopLabel, href: shopUrl || item.href };
    return item;
  });
  const links = canonicalizedLinks
    .filter(l => l.enabled !== false)
    .filter(l => { const visKey = PAGE_VIS_MAP[l.href]; return !visKey || pageVisibility[visKey] !== false; })
    .map(l => ({ ...l, href: l.href.startsWith("/#") && isHome ? l.href.slice(1) : l.href }))
    .filter((l, idx, arr) => arr.findIndex(x => x.href === l.href) === idx);

  const structure = navSettings.structure;
  const orderedByIds = (source: any[], selectedIds?: string[]) => {
    if (!Array.isArray(selectedIds)) return source;
    const map = new Map(source.map(x => [x.id, x]));
    return selectedIds.map(id => map.get(id)).filter(Boolean);
  };
  const defaultDesktopMenuIds = ["home", "sahara", "joyzone", "blog"];
  const defaultDesktopCtaIds = ["get-involved", "donate", "shop"];
  const mainLinks = structure?.desktopMenuIds ? orderedByIds(links, structure.desktopMenuIds) : orderedByIds(links, defaultDesktopMenuIds);
  const headerCtas = structure?.desktopCtaIds ? orderedByIds(links, structure.desktopCtaIds) : orderedByIds(links, defaultDesktopCtaIds);
  const defaultMobileHamburgerIds = ["home", "sahara", "joyzone", "blog", "gallery"];
  const defaultMobileCtaIds = ["donate", "get-involved", "shop"];
  const hamburgerIds = structure?.hamburgerIds ? orderedByIds(links, structure.hamburgerIds) : orderedByIds(links, defaultMobileHamburgerIds);
  const mobileCtaIds = structure?.mobileCtaIds ? orderedByIds(links, structure.mobileCtaIds) : orderedByIds(links, defaultMobileCtaIds);

  const openDropdown = (id: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenDropdownId(id);
  };
  const closeDropdown = () => {
    hoverTimeout.current = setTimeout(() => setOpenDropdownId(null), 180);
  };
  const toggleMobileChildren = (id: string) => setMobileOpenMap(prev => ({...prev, [id]: !prev[id]}));

  const renderDesktopChildren = (items: any[], parentKey: string, depth = 0): any => (items ?? []).filter((item) => item.enabled !== false).map((item) => {
    const itemKey = `${parentKey}-${item.id ?? item.href ?? item.label}`;
    const childHas = (item.children ?? []).some((c: any) => c.enabled !== false);
    const ps = getItemPresentation(item);
    const Icon = item.label === "Mental Care" ? Brain : Shield;
    return <div key={itemKey} className={`relative ${childHas ? "group/submenu" : ""}`}>
      <Link {...editorEventProps(`child-${item.id ?? item.href ?? item.label}`)} href={item.href} onClick={(e) => { if (previewMode) { e.preventDefault(); e.stopPropagation(); onEditorSelect?.(`child-${item.id ?? item.href ?? item.label}`); } else setOpenDropdownId(null); }} className={`flex items-center group/item ${previewMode && editorSelectedId === `child:${item.id}` ? "ring-2 ring-primary rounded-md" : ""}`} style={{ gap: `${dropdownDesign.itemGap ?? 12}px`, padding: `${dropdownDesign.itemPaddingY ?? 14}px ${dropdownDesign.itemPaddingX ?? 16}px`, fontSize: `${Number(ps.fontSize ?? dropdownDesign.fontSize ?? 14)}px`, color: ps.color ?? undefined, transform: `translate(${itemX}px, ${itemY}px) scale(${itemScale})`, transformOrigin: "left center" }}>
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover/item:bg-primary transition-colors"><Icon size={13} className="text-primary group-hover/item:text-white" /></div>
        <p className="font-semibold text-foreground group-hover/item:text-primary transition-colors flex-1">{item.label}</p>
        {childHas && <ChevronDown size={13} className="-rotate-90 text-muted-foreground" />}
      </Link>
      {childHas && <div className={`absolute left-full top-0 ml-1 min-w-[220px] overflow-hidden border shadow-xl ${previewMode && openDropdownId === itemKey ? "block" : "hidden group-hover/submenu:block"}`} style={{ background: dropdownDesign.background ?? "#ffffff", color: dropdownDesign.textColor ?? "#111827", borderColor: dropdownDesign.borderColor ?? "#e5e7eb", borderRadius: `${dropdownDesign.radius ?? 16}px`, boxShadow: dropdownDesign.shadow ?? "0 20px 45px rgba(0,0,0,.14)", zIndex: 70 }}>{renderDesktopChildren(item.children, itemKey, depth + 1)}</div>}
    </div>;
  });
  const renderMobileChildren = (items: any[], parentKey: string, depth = 0): any => (items ?? []).filter((item) => item.enabled !== false).map((item) => {
    const itemId = item.id ?? item.href ?? item.label;
    const key = `${parentKey}-${itemId}`;
    const hasChildren = (item.children ?? []).some((c: any) => c.enabled !== false);
    const ps = getItemPresentation(item);
    const Icon = item.label === "Mental Care" ? Brain : Shield;
    return <div key={key} className="py-0.5">
      <div className="flex items-center gap-1">
        <Link {...editorEventProps(`child-${itemId}`)} href={item.href} className="flex-1 flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-primary/5" style={{color: ps.color ?? undefined,fontSize:`${Number(ps.fontSize ?? 14)}px`,transform:`translate(${Number(ps.offsetX ?? 0)}px, ${Number(ps.offsetY ?? 0)}px) scale(${Number(ps.scale ?? 1)})`,transformOrigin:"left center"}} onClick={(e) => { if (previewMode) { e.preventDefault(); e.stopPropagation(); } else setOpen(false); }}><div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon size={13} className="text-primary"/></div><span className="font-semibold flex-1">{item.label}</span></Link>
        {hasChildren && <button onClick={() => toggleMobileChildren(key)} className="p-2" aria-label={`Toggle ${item.label} submenu`}><ChevronDown size={15} className={mobileOpenMap[key] ? "rotate-180 text-primary" : ""}/></button>}
      </div>
      {hasChildren && <AnimatePresence>{mobileOpenMap[key] && <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="ml-4 pl-3 border-l border-primary/20">{renderMobileChildren(item.children,key,depth+1)}</motion.div>}</AnimatePresence>}
    </div>;
  });

  return (
    <nav
      className={`${previewMode ? "absolute" : "fixed"} spandana-nav-root top-0 left-0 right-0 z-50 backdrop-blur-md`}
      style={{
        width: previewMode ? "100%" : "100vw",
        maxWidth: previewMode ? "100%" : "100vw",
        marginLeft: 0,
        marginRight: 0,
        boxSizing: "border-box",
        borderBottom: `1px solid ${previewDevice === "mobile" ? mobileBorder : desktopBorder}`,
        ["--nav-mobile-h" as string]: `${mobileDesign.headerHeight ?? 80}px`,
        ["--nav-desktop-h" as string]: `${desktopDesign.headerHeight ?? 80}px`,
        ["--nav-desktop-accessibility-h" as string]: desktopAccessibilityVisible ? "28px" : "0px",
        ["--nav-mobile-pad" as string]: `${mobileDesign.horizontalPadding ?? 12}px`,
        ["--nav-desktop-pad" as string]: `${desktopDesign.horizontalPadding ?? 48}px`,
        ["--nav-mobile-bg" as string]: mobileBg,
        ["--nav-desktop-bg" as string]: desktopBg,
        ["--nav-mobile-border" as string]: mobileBorder,
        ["--nav-desktop-border" as string]: desktopBorder,
      } as CSSProperties}
    >
      <style>{`
        .spandana-nav-root .spandana-nav-logo {
          left: var(--mobile-logo-left) !important;
          right: var(--mobile-logo-right) !important;
          top: 50% !important;
          transform: var(--mobile-logo-transform) !important;
        }
        .spandana-nav-root .spandana-nav-logo-image {
          max-width: none;
          max-height: none;
        }
        .spandana-nav-root .spandana-nav-row { box-sizing: border-box; }
        @media (max-width: 767px) {
          .spandana-nav-root .spandana-nav-row {
            display: grid;
            grid-template-columns: var(--mobile-logo-slot, 92px) minmax(0, 1fr) var(--mobile-hamburger-slot, 40px);
            column-gap: var(--mobile-row-gap, 6px);
            padding-inline: var(--mobile-row-pad, 8px);
          }
        }
        .spandana-nav-root .spandana-nav-mobile-strip {
          min-width: 0;
        }
        @media (max-width: 767px) {
          /* Four approved quick actions always get a deterministic slot.
             This prevents a long label, font scaling, or browser flex sizing
             from hiding Donate/Join Us/Shop behind the centered Joy Zone item. */
          .spandana-nav-root .spandana-nav-mobile-strip {
            display: grid !important;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            align-items: center;
            justify-items: center;
            width: 100%;
            gap: 2px !important;
            overflow: hidden;
          }
          .spandana-nav-root .spandana-nav-mobile-strip > a {
            min-width: 0 !important;
            width: 100%;
            max-width: 72px;
          }
        }
        .spandana-nav-root .spandana-nav-accessibility {
          display: flex; align-items: center; justify-content: space-between; width: 100%; box-sizing: border-box; min-width: 0;
        }
        .spandana-nav-root .spandana-nav-accessibility-fonts { min-width: 0; flex: 0 1 auto; display: flex; align-items: center; justify-content: flex-start; overflow: hidden; }
        .spandana-nav-root .spandana-nav-accessibility-fonts button { flex: 0 1 auto; }
        .spandana-nav-root .spandana-nav-accessibility-paper { flex: 0 0 auto; }
        @media (max-width: 390px) {
          .spandana-nav-root .spandana-nav-accessibility { gap: 3px !important; }
          .spandana-nav-root .spandana-nav-accessibility-fonts { gap: 2px !important; }
          .spandana-nav-root .spandana-nav-accessibility-paper { padding-inline: 4px !important; }
        }
        @media (max-width: 360px) {
          .spandana-nav-root .spandana-nav-accessibility { gap: 2px !important; padding-inline: 4px !important; }
          .spandana-nav-root .spandana-nav-accessibility-fonts { gap: 1px !important; }
          .spandana-nav-root .spandana-nav-accessibility-fonts button { height: 34px !important; }
          .spandana-nav-root .spandana-nav-accessibility-paper { height: 34px !important; }
        }
        @media (min-width: 768px) and (max-width: 1100px) {
          /* Responsive safety zone: keep the approved desktop information architecture
             while preventing menu/CTA collisions at intermediate widths. */
          .spandana-nav-root [data-nav-editor-id="desktop-menu"] {
            left: 120px !important;
            right: auto !important;
            max-width: none !important;
            padding-inline: 0 !important;
            gap: 10px !important;
            font-size: 12px !important;
            transform: translate(0, -50%) scale(0.95) !important;
            transform-origin: left center !important;
          }
          .spandana-nav-root [data-nav-editor-id="desktop-menu"] > * {
            font-size: 12px !important;
          }
          .spandana-nav-root [data-nav-editor-id="cta-group"] {
            right: 20px !important;
            gap: 6px !important;
            transform: translate(0, calc(-50% + var(--cta-offset-y, 0px))) scale(0.88) !important;
            transform-origin: right center !important;
          }
          .spandana-nav-root [data-nav-editor-id="cta-group"] > a {
            padding-inline: 12px !important;
            padding-block: 6px !important;
            font-size: 12px !important;
          }
          .spandana-nav-root .spandana-nav-logo {
            left: 24px !important;
          }
        }
        @media (min-width: 768px) {
          .spandana-nav-root .spandana-nav-logo {
            left: var(--desktop-logo-left) !important;
            right: var(--desktop-logo-right) !important;
            top: 50% !important;
            transform: var(--desktop-logo-transform) !important;
          }
          .spandana-nav-root .spandana-nav-logo-image {
            max-width: none;
            max-height: 84px;
          }
        }
      `}</style>
      {/* ── Row 1: Main nav (logo + links + actions) ── */}
      <div
        className={`${previewMode ? "spandana-nav-row relative items-center" : "spandana-nav-row relative items-center h-[var(--nav-mobile-h)] md:h-[var(--nav-desktop-h)]"}`}
        style={{
          ["--nav-mobile-h" as string]: `${mobileDesign.headerHeight ?? 80}px`,
          ["--nav-desktop-h" as string]: `${desktopDesign.headerHeight ?? 80}px`,
          height: previewMode ? `${previewDevice === "mobile" ? (mobileDesign.headerHeight ?? 80) : (desktopDesign.headerHeight ?? 80)}px` : undefined,
          ["--mobile-nav-pad" as string]: `${mobileDesign.horizontalPadding ?? 12}px`,
          ["--desktop-nav-pad" as string]: `${desktopDesign.horizontalPadding ?? 48}px`,
          ["--mobile-logo-left" as string]: mobileLogoPosition === "center" ? "50%" : mobileLogoPosition === "right" ? "auto" : "0px",
          ["--mobile-logo-right" as string]: mobileLogoPosition === "right" ? "0px" : "auto",
          ["--mobile-logo-transform" as string]: mobileLogoPosition === "center" ? "translate(-50%, -50%) translate(var(--logo-x-mobile), var(--logo-y-mobile)) scale(var(--logo-scale-mobile))" : "translate(var(--logo-x-mobile), -50%) translateY(var(--logo-y-mobile)) scale(var(--logo-scale-mobile))",
          ["--desktop-logo-left" as string]: logoPosition === "center" ? "50%" : logoPosition === "right" ? "auto" : "var(--desktop-nav-pad)",
          ["--desktop-logo-right" as string]: logoPosition === "right" ? "var(--desktop-nav-pad)" : "auto",
          ["--desktop-logo-transform" as string]: logoPosition === "center" ? "translate(-50%, -50%) translate(var(--logo-x-desktop), var(--logo-y-desktop)) scale(var(--logo-scale-desktop))" : "translate(var(--logo-x-desktop), -50%) translateY(var(--logo-y-desktop)) scale(var(--logo-scale-desktop))",
          display: previewMode ? (previewDevice === "mobile" ? "grid" : "flex") : undefined,
          gridTemplateColumns: previewMode && previewDevice === "mobile" ? `${Number(mobileDesign.logoSlotWidth ?? 78)}px minmax(0, 1fr) ${Number(mobileDesign.hamburgerBoxSize ?? 40)}px` : undefined,
          columnGap: previewMode && previewDevice === "mobile" ? `${Number(mobileDesign.actionAreaGap ?? 6)}px` : undefined,
          paddingInline: previewMode && previewDevice === "mobile" ? `${Number(mobileDesign.horizontalPadding ?? 8)}px` : undefined,
          ["--mobile-logo-slot" as string]: `${Number(mobileDesign.logoSlotWidth ?? 78)}px`,
          ["--mobile-hamburger-slot" as string]: `${Number(mobileDesign.hamburgerBoxSize ?? 40)}px`,
          ["--mobile-row-gap" as string]: `${Number(mobileDesign.actionAreaGap ?? 6)}px`,
          ["--mobile-row-pad" as string]: `${Number(mobileDesign.horizontalPadding ?? 8)}px`,
        } as CSSProperties}
      >

        {/* Logo — independently scalable and movable */}
        <Link
          {...editorEventProps("logo")}
          href="/"
          onClick={(e) => {
            if (previewMode || location === "/") {
              e.preventDefault();
              if (!previewMode) window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={`spandana-nav-logo relative md:absolute flex items-center justify-center shrink-0 opacity-90 hover:opacity-100 transition-opacity cursor-pointer ${previewMode && editorSelectedId === "logo" ? "ring-2 ring-primary ring-offset-2 rounded-md" : ""}`}
          style={{
            top: "50%",
            ["--logo-x-mobile" as string]: `${mobileDesign.logoOffsetX ?? 0}px`,
            ["--logo-y-mobile" as string]: `${mobileDesign.logoOffsetY ?? 0}px`,
            ["--logo-scale-mobile" as string]: String(mobileDesign.logoScale ?? 1),
            ["--logo-x-desktop" as string]: `${desktopDesign.logoOffsetX ?? 0}px`,
            ["--logo-y-desktop" as string]: `${desktopDesign.logoOffsetY ?? 0}px`,
            ["--logo-scale-desktop" as string]: String(desktopDesign.logoScale ?? logoScale),
            ["--mobile-logo-left" as string]: mobileLogoPosition === "center" ? "50%" : mobileLogoPosition === "right" ? "auto" : "0px",
            ["--mobile-logo-right" as string]: mobileLogoPosition === "right" ? "0px" : "auto",
            ["--mobile-logo-transform" as string]: mobileLogoPosition === "center"
              ? "translate(-50%, -50%) translate(var(--logo-x-mobile), var(--logo-y-mobile)) scale(var(--logo-scale-mobile))"
              : "translate(var(--logo-x-mobile), -50%) translateY(var(--logo-y-mobile)) scale(var(--logo-scale-mobile))",
            ["--desktop-logo-left" as string]: logoPosition === "center" ? "50%" : logoPosition === "right" ? "auto" : `${desktopDesign.horizontalPadding ?? 48}px`,
            ["--desktop-logo-right" as string]: logoPosition === "right" ? `${desktopDesign.horizontalPadding ?? 48}px` : "auto",
            ["--desktop-logo-transform" as string]: logoPosition === "center"
              ? "translate(-50%, -50%) translate(var(--logo-x-desktop), var(--logo-y-desktop)) scale(var(--logo-scale-desktop))"
              : "translate(var(--logo-x-desktop), -50%) translateY(var(--logo-y-desktop)) scale(var(--logo-scale-desktop))",
            width: `${Number(previewMode && previewDevice !== "mobile" ? (desktopDesign.logoSlotWidth ?? 78) : (mobileDesign.logoSlotWidth ?? 78))}px`,
            maxWidth: `${Number(previewMode && previewDevice !== "mobile" ? (desktopDesign.logoSlotWidth ?? 78) : (mobileDesign.logoSlotWidth ?? 78))}px`,
            height: "100%",
            gridColumn: previewMode && previewDevice === "mobile" ? "1" : undefined,
            gridRow: previewMode && previewDevice === "mobile" ? "1" : undefined,
          } as CSSProperties}
        >
          <img
            src={effectiveLogoUrl}
            alt="Spandana Care Aid Foundation"
            width={190}
            height={80}
            className="spandana-nav-logo-image h-auto object-contain"
            style={{ width: `${Number(previewMode && previewDevice !== "mobile" ? (desktopDesign.logoWidth ?? 64) : (mobileDesign.logoWidth ?? 64))}px`, maxWidth: `${Number(previewMode && previewDevice !== "mobile" ? (desktopDesign.logoWidth ?? 64) : (mobileDesign.logoWidth ?? 64))}px`, maxHeight: `${Number(previewMode && previewDevice !== "mobile" ? (desktopDesign.logoMaxHeight ?? 64) : (mobileDesign.logoMaxHeight ?? 64))}px` }}
          />
        </Link>

      {/* ── Desktop links ── */}
      <div
        data-nav-editor-id="desktop-menu"
        className={`${desktopVisibilityClass} items-center absolute`}
        style={{
          left: desktopDesign.menuPosition === "left" ? `${Math.max(180, (desktopDesign.horizontalPadding ?? 48) + 150)}px` : desktopDesign.menuPosition === "right" ? "auto" : "50%",
          right: desktopDesign.menuPosition === "right" ? `${Math.max(180, (desktopDesign.horizontalPadding ?? 48) + 170)}px` : "auto",
          transform: `${desktopDesign.menuPosition === "center" || !desktopDesign.menuPosition ? `translate(-50%, -50%) translate(${desktopDesign.menuOffsetX ?? 0}px, ${desktopDesign.menuOffsetY ?? 0}px)` : `translate(${desktopDesign.menuOffsetX ?? 0}px, calc(-50% + ${desktopDesign.menuOffsetY ?? 0}px))`} scale(${Number(desktopDesign.menuScale ?? 1)})`,
          top: "50%",
          alignItems: desktopDesign.menuVerticalAlign === "top" ? "flex-start" : desktopDesign.menuVerticalAlign === "bottom" ? "flex-end" : "center",
          gap: `${desktopDesign.menuGap ?? 28}px`,
          fontSize: `${desktopDesign.menuFontSize ?? 14}px`,
          color: desktopMenuColor,
          paddingInline: `${desktopDesign.horizontalPadding ?? 0}px`,
          maxWidth: "calc(100% - 360px)",
          whiteSpace: "nowrap",
        }}
      >
        {mainLinks.map((l) => {
          const hasChildren = (l.children ?? []).some((item) => item.enabled !== false);

          if (hasChildren) {
            return (
              <div
                key={l.id ?? l.href ?? l.label}
                {...editorEventProps(`desktop-item-${l.id ?? l.href ?? l.label}`)}
                className={`relative ${previewMode && editorSelectedId === `item:${l.id ?? l.href ?? l.label}` ? "ring-2 ring-primary rounded-md" : ""}`}
                ref={dropdownRef}
                onMouseEnter={() => openDropdown(l.id ?? l.href ?? l.label)}
                onMouseLeave={closeDropdown}
                style={{
                  transform: `translate(${Number(getItemPresentation(l).offsetX ?? 0)}px, ${Number(getItemPresentation(l).offsetY ?? 0)}px) scale(${Number(getItemPresentation(l).scale ?? 1)})`,
                  transformOrigin: "center center",
                  fontSize: `${Number(getItemPresentation(l).fontSize ?? desktopDesign.menuFontSize ?? 14)}px`,
                  color: getItemPresentation(l).color ?? undefined,
                }}
              >
                {/* Parent menu trigger */}
                <Link
                  href={l.href}
                  className="flex items-center gap-1 transition-colors group"
                  style={{ color: openDropdownId === (l.id ?? l.href ?? l.label) ? desktopActiveColor : desktopMenuColor }}
                  onFocus={() => openDropdown(l.id ?? l.href ?? l.label)}
                  onClick={(e) => { if (previewMode) { e.preventDefault(); e.stopPropagation(); onEditorSelect?.(`desktop-item-${l.id ?? l.href ?? l.label}`); } else { setOpenDropdownId(null); } }}
                >
                  {l.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${openDropdownId === (l.id ?? l.href ?? l.label) ? "rotate-180 text-primary" : ""}`}
                  />
                </Link>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {openDropdownId === (l.id ?? l.href ?? l.label) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute top-full ${dropdownDesign.position === "left" ? "left-0" : dropdownDesign.position === "right" ? "right-0" : "left-1/2 -translate-x-1/2"} overflow-hidden border shadow-xl`}
                      style={{
                        width: `${dropdownDesign.width ?? 256}px`,
                        marginTop: `${dropdownDesign.offsetY ?? 0}px`,
                        background: dropdownDesign.background ?? "#ffffff",
                        color: dropdownDesign.textColor ?? "#111827",
                        borderColor: dropdownDesign.borderColor ?? "#e5e7eb",
                        borderRadius: `${dropdownDesign.radius ?? 16}px`,
                        boxShadow: dropdownDesign.shadow ?? "0 20px 45px rgba(0,0,0,.14)",
                        zIndex: 60,
                      }}
                      onMouseEnter={() => openDropdown(l.id ?? l.href ?? l.label)}
                      onMouseLeave={closeDropdown}
                    >
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t" style={{ background: dropdownDesign.background ?? "#ffffff", borderColor: dropdownDesign.borderColor ?? "#e5e7eb" }} />

                      {/* Sub-items — recursive for child/grandchild/deeper menus */}
                      {renderDesktopChildren(l.children ?? [], `root-${l.id ?? l.href ?? l.label}`)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return l.href.startsWith("#") || l.href.startsWith("/#") ? (
            <a {...editorEventProps(`desktop-item-${l.id ?? l.href ?? l.label}`)} key={l.label} href={l.href} className="transition-colors hover:text-[var(--nav-hover)]" style={{ color: getItemPresentation(l).color ?? desktopMenuColor, ["--nav-hover" as string]: desktopHoverColor, fontSize: `${Number(getItemPresentation(l).fontSize ?? desktopDesign.menuFontSize ?? 14)}px`, transform: `translate(${Number(getItemPresentation(l).offsetX ?? 0)}px, ${Number(getItemPresentation(l).offsetY ?? 0)}px) scale(${Number(getItemPresentation(l).scale ?? 1)})` }}>{l.label}</a>
          ) : (
            <Link {...editorEventProps(`desktop-item-${l.id ?? l.href ?? l.label}`)} key={l.label} href={l.href} className="transition-colors hover:text-[var(--nav-hover)]" style={{ color: getItemPresentation(l).color ?? desktopMenuColor, ["--nav-hover" as string]: desktopHoverColor, fontSize: `${Number(getItemPresentation(l).fontSize ?? desktopDesign.menuFontSize ?? 14)}px`, transform: `translate(${Number(getItemPresentation(l).offsetX ?? 0)}px, ${Number(getItemPresentation(l).offsetY ?? 0)}px) scale(${Number(getItemPresentation(l).scale ?? 1)})` }}>{l.label}</Link>
          );
        })}

      </div>

      {/* ── Desktop CTA — selected from the same canonical menu tree ── */}
      <div {...editorEventProps("cta-group")}
        data-nav-editor-id="cta-group"
        className={`${desktopVisibilityClass} items-center absolute`} style={{ gap: `${desktopDesign.ctaGap ?? 12}px`, right: `${desktopDesign.horizontalPadding ?? 48}px`, top: "50%", transform: `translate(${desktopDesign.ctaOffsetX ?? 0}px, calc(-50% + ${desktopDesign.ctaOffsetY ?? 0}px)) scale(${Number(desktopDesign.ctaScale ?? 1)})`, ["--cta-offset-y" as string]: `${desktopDesign.ctaOffsetY ?? 0}px` }}>
        {headerCtas.map((item:any) => {
          const destination = item.id === "shop" && shopUrl ? shopUrl : item.href;
          const isExternal = typeof destination === "string" && destination.startsWith("http");
          const content = <><span>{item.label}</span></>;
          const commonProps = {
            key: item.id ?? destination ?? item.label,
            className: `rounded-full px-5 py-2 text-sm font-semibold ${item.id === "donate" ? "border border-primary text-primary bg-background/80" : "bg-primary text-primary-foreground"}`,
            style: {
              fontSize: `${Number(getItemPresentation(item).fontSize ?? 14)}px`,
              transform: `translate(${Number(getItemPresentation(item).offsetX ?? 0)}px, ${Number(getItemPresentation(item).offsetY ?? 0)}px) scale(${Number(getItemPresentation(item).scale ?? 1)})`,
              color: getItemPresentation(item).color ?? undefined,
            },
          };
          return isExternal
            ? <a {...editorEventProps(`cta-${item.id ?? destination ?? item.label}`)} {...commonProps} href={destination} target="_blank" rel="noopener noreferrer">{content}</a>
            : <Link {...editorEventProps(`cta-${item.id ?? destination ?? item.label}`)} {...commonProps} href={destination}>{content}</Link>;
        })}
        {liveSettings.enabled && (
          <Link href="/live" className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-colors shadow-sm"><Radio size={12} className="animate-pulse" />LIVE</Link>
        )}
      </div>

      {/* ── Mobile Header Strip ── */}
      <div
        {...editorEventProps("mobile-strip")} data-nav-editor-id="mobile-strip"
        className={`${mobileVisibilityClass} spandana-nav-mobile-strip items-center justify-center min-w-0 overflow-hidden scrollbar-none`}
        style={{
          gap: `${mobileDesign.itemGap ?? 4}px`,
          fontSize: `${mobileDesign.fontSize ?? 11}px`,
          color: mobileDesign.textColor ?? "#0033A0",
          minWidth: 0,
          width: "100%",
          overflow: "hidden",
          transform: `translate(${mobileDesign.stripOffsetX ?? 0}px, ${mobileDesign.stripOffsetY ?? 0}px) scale(${Number(mobileDesign.stripScale ?? 1)})`,
          paddingInline: `${mobileDesign.actionAreaPadding ?? 0}px`,
          gridColumn: previewMode && previewDevice === "mobile" ? "2" : undefined,
          gridRow: previewMode && previewDevice === "mobile" ? "1" : undefined,
        }}
      >
        {(() => {
          const fallbackIds = ["donate", "get-involved", "joyzone", "shop"];
          const ids = structure?.mobileStripIds ? structure.mobileStripIds : fallbackIds;
          return ids.map((id) => {
            const canonical = rawLinks.find(x => x.id === id);
            if (!canonical) return null;
            const item = { ...canonical };
            item.label = getMobileLabel(canonical);
          const external = item.href.startsWith("http");
          const ps = getItemPresentation(item);
          const itemDesign = (mobileDesign.actionItems?.[item.id!] || {}) as any;
          const cls = "shrink-0 font-bold tracking-wide whitespace-nowrap transition-colors flex flex-col items-center justify-center gap-0.5 leading-none ";
          const props = editorEventProps(`mobile-item-${item.id}`);
          const iconSize = Number(itemDesign.iconSize ?? mobileDesign.actionIconSize ?? mobileDesign.iconSize ?? 24);
          const itemX = Number(mobileDesign.actionOffsetX ?? 0) + Number(itemDesign.offsetX ?? 0) + Number(ps.offsetX ?? 0);
          const itemY = Number(mobileDesign.actionOffsetY ?? 0) + Number(itemDesign.offsetY ?? 0) + Number(ps.offsetY ?? 0);
          const itemScale = Number(mobileDesign.actionScale ?? 1) * Number(itemDesign.scale ?? 1) * Number(ps.scale ?? 1);
          const icon = item.id === "donate" ? <Heart size={iconSize}/> : item.id === "get-involved" ? <HeartHandshake size={iconSize}/> : item.id === "joyzone" ? <Gamepad2 size={iconSize}/> : item.id === "shop" ? <ShoppingBag size={iconSize}/> : item.id === "gallery" ? <Images size={iconSize}/> : <BookOpen size={iconSize}/>;
          const content = <><span className="flex items-center justify-center" style={{ color: mobileDesign.iconColor ?? "#0033A0", height: `${Math.max(28, iconSize + 4)}px` }}>{icon}</span><span>{getMobileLabel(item)}</span></>;
          return external ? (
            <a {...props} key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className={cls} style={{ color: ps.color ?? mobileDesign.textColor ?? "#0033A0", fontSize: `${Number(ps.fontSize ?? mobileDesign.fontSize ?? 11)}px`, minWidth: `${Number(mobileDesign.itemMinWidth ?? 48)}px`, transform: `translate(${itemX}px, ${itemY}px) scale(${itemScale})` }}>{content}</a>
          ) : (
            <Link {...props} key={item.id} href={item.href} className={cls} style={{ color: ps.color ?? mobileDesign.textColor ?? "#0033A0", fontSize: `${Number(ps.fontSize ?? mobileDesign.fontSize ?? 11)}px`, minWidth: `${Number(mobileDesign.itemMinWidth ?? 48)}px`, transform: `translate(${itemX}px, ${itemY}px) scale(${itemScale})` }}>{content}</Link>
          );
          });
        })()}
      </div>

        <button
          {...editorEventProps("hamburger")}
          type="button"
          className={`${mobileVisibilityClass} relative shrink-0 items-center justify-center ${mobileDesign.hamburgerFrame === true ? "border bg-background shadow-sm" : "border-0 bg-transparent shadow-none"} ${previewMode && editorSelectedId === "hamburger" ? "ring-2 ring-primary" : ""}`}
          style={{
            width: `${mobileDesign.hamburgerBoxSize ?? 40}px`, height: `${mobileDesign.hamburgerBoxSize ?? 40}px`,
            marginLeft: `${mobileDesign.hamburgerGap ?? 0}px`,
            borderRadius: mobileDesign.hamburgerFrame === true ? `${mobileDesign.hamburgerRadius ?? 12}px` : "0px",
            borderColor: mobileDesign.hamburgerFrame === true ? (mobileDesign.hamburgerBorderColor ?? "#e5e7eb") : "transparent",
            background: mobileDesign.hamburgerFrame === true ? (mobileDesign.hamburgerBackground ?? mobileBg) : "transparent",
            transform: `translate(${mobileDesign.hamburgerOffsetX ?? 0}px, ${mobileDesign.hamburgerOffsetY ?? 0}px)`,
            gridColumn: previewMode && previewDevice === "mobile" ? "3" : undefined,
            gridRow: previewMode && previewDevice === "mobile" ? "1" : undefined,
          }}
          onClick={(e) => { if (previewMode && !interactivePreview) { e.preventDefault(); e.stopPropagation(); onEditorSelect?.("hamburger"); return; } setOpen(v => !v); }}
          aria-label={open ? "Close menu" : "Open menu"}
          data-spandana-hamburger="true"
        >
          {open ? <X size={mobileDesign.hamburgerSize ?? 28} style={{ color: mobileDesign.iconColor ?? "#0033A0" }} /> : <Menu size={mobileDesign.hamburgerSize ?? 28} style={{ color: mobileDesign.iconColor ?? "#0033A0" }} />}
        </button>

      </div>{/* end Row 1 */}

      {/* Public-only accessibility controls: never render inside Admin/preview UI. */}
      {(!previewMode || showAccessibilityPreview) && (
        <div
          className="hidden md:flex w-full items-center justify-start overflow-hidden"
          aria-hidden={!desktopAccessibilityVisible}
          style={{
            height: desktopAccessibilityVisible ? "28px" : "0px",
            minHeight: desktopAccessibilityVisible ? "28px" : "0px",
            paddingInline: "10px",
            boxSizing: "border-box",
            opacity: desktopAccessibilityVisible ? 1 : 0,
            transform: desktopAccessibilityVisible ? "translateY(0)" : "translateY(-6px)",
            pointerEvents: desktopAccessibilityVisible ? "auto" : "none",
            transition: "height 180ms ease, min-height 180ms ease, opacity 140ms ease, transform 180ms ease",
          }}
        >
          <span className="sr-only">Accessibility controls</span>
          <div
            className="inline-flex items-center h-[26px] shrink-0 rounded-full"
            style={{
              gap: "6px",
              padding: "2px 7px",
              background: "rgba(0, 51, 160, 0.72)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 1px 4px rgba(0,0,0,.12)",
              color: "#FFFFFF",
              boxSizing: "border-box",
            }}
          >
          <div className="flex items-center h-full shrink-0" style={{ gap: "2px" }}>
            {([
              { level: 0 as DesktopFontSizeLevel, size: "12px", label: "Normal", width: "58px" },
              { level: 1 as DesktopFontSizeLevel, size: "14px", width: "24px" },
              { level: 2 as DesktopFontSizeLevel, size: "16px", width: "24px" },
              { level: 3 as DesktopFontSizeLevel, size: "18px", label: "Elderly", width: "58px" },
            ]).map((fl) => (
              <button
                key={fl.level}
                type="button"
                onClick={() => setDesktopTo(fl.level)}
                title={fl.label ? `${fl.label} text size` : `Text size level ${fl.level + 1}`}
                aria-label={fl.label ? `${fl.label} text size` : `Text size level ${fl.level + 1}`}
                className="flex items-center justify-center h-[22px] rounded-full transition-all"
                style={{
                  width: fl.width,
                  padding: "0 4px",
                  gap: "3px",
                  fontSize: fl.size,
                  lineHeight: 1,
                  fontWeight: desktopLevel === fl.level ? 700 : 500,
                  color: "#FFFFFF",
                  background: desktopLevel === fl.level ? "#C85A0A" : "transparent",
                }}
              >
                <span style={{ fontSize: fl.size, lineHeight: 1 }}>A</span>
                {fl.label && <span style={{ fontSize: "9px", lineHeight: 1, whiteSpace: "nowrap" }}>{fl.label}</span>}
              </button>
            ))}
          </div>
          <span aria-hidden="true" style={{ height: "16px", width: "1px", background: "#D8B77B", marginInline: "2px" }} />
          <button
            type="button"
            onClick={toggleDesktopPaper}
            aria-label={desktopPaperWhite ? "Disable paper white mode" : "Enable paper white mode"}
            className="flex items-center justify-center h-[22px] rounded-full transition-all"
            style={{
              gap: "5px",
              padding: "0 7px",
              color: desktopPaperWhite ? "#7A461A" : "#5F4A36",
              background: desktopPaperWhite ? "#F5E7CF" : "transparent",
              border: `1px solid ${desktopPaperWhite ? "#D9B77B" : "#D8C7AA"}`,
              fontSize: "9px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <BookOpen size={12} />
            <span>Paper White</span>
            <span style={{ width: "25px", height: "13px", borderRadius: "999px", background: desktopPaperWhite ? "#C85A0A" : "#B9B1A6", display: "inline-flex", alignItems: "center", padding: "1px" }}>
              <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 2px rgba(0,0,0,.18)", transform: desktopPaperWhite ? "translateX(11px)" : "translateX(0)", transition: "transform .2s ease" }} />
            </span>
          </button>
          </div>
        </div>
      )}

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && showMobilePreview && (
          <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 top-[var(--nav-mobile-h)] z-40 bg-black md:hidden"
            style={{ backgroundColor: mobileDesign.drawerOverlayColor ?? "#000000", opacity: mobileDesign.drawerOverlayOpacity ?? 0.18 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`${mobileVisibilityClass} absolute top-full z-50 bg-background border-b border-border shadow-lg py-6 flex-col gap-1 overflow-y-auto`}
            style={{
              left: mobileDesign.drawerSide === "left" ? 0 : "auto",
              right: mobileDesign.drawerSide === "right" || !mobileDesign.drawerSide ? 0 : "auto",
              width: `${mobileDesign.drawerWidth ?? 390}px`,
              maxWidth: "100vw",
              maxHeight: "calc(100vh - 5rem)",
              marginTop: `${mobileDesign.drawerOffsetY ?? 0}px`,
              paddingInline: `${mobileDesign.horizontalPadding ?? 20}px`,
              background: mobileDesign.drawerBackground ?? mobileBg,
              color: mobileDesign.drawerTextColor ?? "#111827",
              borderColor: mobileBorder,
              fontSize: `${mobileDesign.drawerFontSize ?? 16}px`,
            }}
          >
            {hamburgerIds.map((l) => {
              const hasChildren = (l.children ?? []).some((item) => item.enabled !== false);
              const itemId = l.id ?? l.href ?? l.label;
              const ps = getItemPresentation(l);
              const displayLabel = getMobileLabel(l);
              if (hasChildren) return (
                <div key={itemId}>
                  <div className="flex items-center justify-between">
                    <Link {...editorEventProps(`mobile-drawer-item-${itemId}`)} href={l.href} className="font-medium text-foreground hover:text-primary py-2 flex-1" style={{ fontSize: `${Number(ps.fontSize ?? mobileDesign.drawerFontSize ?? 16)}px`, color: ps.color ?? mobileDesign.drawerTextColor ?? undefined }} onClick={(e) => { if (previewMode) { e.preventDefault(); e.stopPropagation(); } else setOpen(false); }}>{displayLabel}</Link>
                    <button onClick={() => toggleMobileChildren(itemId)} className="p-2 text-muted-foreground hover:text-primary" aria-label={`Toggle ${l.label} submenu`}><ChevronDown size={16} className={mobileOpenMap[itemId] ? "rotate-180 text-primary" : ""}/></button>
                  </div>
                  <AnimatePresence>{mobileOpenMap[itemId] && <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="overflow-hidden"><div className="ml-3 pl-3 border-l-2 border-primary/20">
                    {renderMobileChildren(l.children ?? [], itemId, 0)}
                  </div></motion.div>}</AnimatePresence>
                </div>
              );
              return l.href.startsWith("#") || l.href.startsWith("/#") ? <a {...editorEventProps(`mobile-drawer-item-${itemId}`)} key={itemId} href={l.href} onClick={(e) => { if (previewMode && !interactivePreview) { e.preventDefault(); e.stopPropagation(); } else setOpen(false); }} className="font-medium text-foreground hover:text-primary py-2" style={{fontSize:`${Number(ps.fontSize ?? mobileDesign.drawerFontSize ?? 16)}px`, color: ps.color ?? mobileDesign.drawerTextColor ?? undefined}}>{displayLabel}</a> : <Link {...editorEventProps(`mobile-drawer-item-${itemId}`)} key={itemId} href={l.href} onClick={(e) => { if (previewMode && !interactivePreview) { e.preventDefault(); e.stopPropagation(); } else setOpen(false); }} className="font-medium text-foreground hover:text-primary py-2" style={{fontSize:`${Number(ps.fontSize ?? mobileDesign.drawerFontSize ?? 16)}px`, color: ps.color ?? mobileDesign.drawerTextColor ?? undefined}}>{displayLabel}</Link>;
            })}

            <div className="mt-4 pt-4 border-t border-border flex flex-col" style={{ gap: `${mobileDesign.mobileCtaGap ?? 12}px` }}>
              {mobileCtaIds.map((item: any) => {
                const destination = item.id === "shop" && shopUrl ? shopUrl : item.href;
                const isExternal = typeof destination === "string" && destination.startsWith("http");
                const label = getMobileLabel(item);
                const icon = item.id === "donate" ? <Heart size={20}/> : item.id === "get-involved" ? <HeartHandshake size={20}/> : item.id === "joyzone" ? <Gamepad2 size={20}/> : item.id === "shop" ? <ShoppingBag size={20}/> : <BookOpen size={20}/>;
                const cls = `w-full rounded-full px-5 py-3 flex items-center justify-center gap-2 font-semibold border ${item.id === "donate" ? "border-primary text-primary bg-background" : "bg-primary text-primary-foreground border-primary"}`;
                const props = editorEventProps(`mobile-cta-${item.id}`);
                const ctaStyle = { minHeight: `${mobileDesign.mobileCtaHeight ?? 56}px`, fontSize: `${mobileDesign.mobileCtaFontSize ?? 17}px` };
                return isExternal ? <a {...props} key={item.id} href={destination} target="_blank" rel="noopener noreferrer" className={cls} style={ctaStyle}>{icon}<span>{label}</span></a> : <Link {...props} key={item.id} href={destination} className={cls} style={ctaStyle} onClick={(e) => { if (previewMode) { e.preventDefault(); e.stopPropagation(); } else setOpen(false); }}>{icon}<span>{label}</span></Link>;
              })}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}