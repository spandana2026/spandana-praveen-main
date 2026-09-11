import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Eye, Menu, Monitor, Save, Smartphone, Tablet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SiteSettings } from "../types";

interface NavItem { id?: string; label: string; href: string; enabled?: boolean; mobileLabel?: string; children?: NavItem[]; desktopPlacement?: "menu" | "cta"; destinationType?: string; }
interface Props {
  settings: SiteSettings;
  updateSettings: (path: (string | number)[], val: unknown) => void;
  saving: boolean;
  onSave: () => void;
  publishNow?: () => void;
}
type Device = "desktop" | "tablet" | "mobile";
type Placement = "desktopMenu" | "desktopCta" | "mobileStrip" | "hamburger" | "mobileCta";

const DEFAULT_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "sahara", label: "Sahara Community Centers", href: "/sahara" },
  { id: "joyzone", label: "Joy Zone", href: "/fun-zone" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "get-involved", label: "Get Involved", href: "/volunteer", desktopPlacement: "cta", mobileLabel: "Join Us" },
  { id: "donate", label: "Donate", href: "/donate", desktopPlacement: "cta" },
  { id: "shop", label: "Shop", href: "/shop", desktopPlacement: "cta" },
];

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }
function normalize(items: NavItem[]): NavItem[] {
  const hrefIds: Record<string, string> = { "/": "home", "/sahara": "sahara", "/fun-zone": "joyzone", "/blog": "blog", "/gallery": "gallery", "/volunteer": "get-involved", "/donate": "donate", "/shop": "shop", "/#vision": "vision" };
  return items.map((x, i) => ({ ...x, id: x.id || hrefIds[x.href] || `nav-${i}-${x.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, enabled: x.enabled !== false, children: x.children ? normalize(x.children) : undefined }));
}
function ids(items: NavItem[]) { return items.map(x => x.id!).filter(Boolean); }
function unique(list: string[]) { return [...new Set(list)]; }

function initialStructure(nav: any, items: NavItem[]) {
  const all = ids(items);
  const existing = nav?.structure;
  const desiredDesktopMenu = ["home", "sahara", "joyzone", "blog"].filter(id => all.includes(id));
  const desiredDesktopCta = ["get-involved", "donate", "shop"].filter(id => all.includes(id));
  const desiredMobileStrip = ["donate", "get-involved", "joyzone", "shop"].filter(id => all.includes(id));
  const desiredHamburger = ["home", "sahara", "joyzone", "blog", "gallery"].filter(id => all.includes(id));
  const desiredMobileCta = ["donate", "get-involved", "shop"].filter(id => all.includes(id));
  if (existing && (existing.desktopMenuIds || existing.desktopCtaIds || existing.mobileStripIds || existing.hamburgerIds || existing.mobileCtaIds)) {
    return {
      desktopMenuIds: unique((existing.desktopMenuIds || desiredDesktopMenu).filter((id: string) => all.includes(id))),
      desktopCtaIds: unique((existing.desktopCtaIds || desiredDesktopCta).filter((id: string) => all.includes(id))),
      mobileStripIds: unique((existing.mobileStripIds || desiredMobileStrip).filter((id: string) => all.includes(id))),
      hamburgerIds: unique((existing.hamburgerIds || desiredHamburger).filter((id: string) => all.includes(id))),
      mobileCtaIds: unique((existing.mobileCtaIds || desiredMobileCta).filter((id: string) => all.includes(id))),
    };
  }
  return { desktopMenuIds: desiredDesktopMenu, desktopCtaIds: desiredDesktopCta, mobileStripIds: unique(desiredMobileStrip), hamburgerIds: desiredHamburger, mobileCtaIds: desiredMobileCta };
}

function SmallControl({ label, value, min, max, step = 1, unit = "px", onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (n: number) => void }) {
  return <label className="block"><span className="text-[11px] font-semibold text-muted-foreground">{label}</span><div className="flex items-center gap-2 mt-1"><Input type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))} className="h-9"/><span className="text-[11px] text-muted-foreground">{unit}</span></div></label>;
}

export default function NavigationTab({ settings, updateSettings, saving, onSave, publishNow }: Props) {
  const [draft, setDraft] = useState<any>(() => clone(settings.nav || {}));
  const [stage, setStage] = useState<"structure" | "designer">("structure");
  const [device, setDevice] = useState<Device>("desktop");
  const [selected, setSelected] = useState<"header" | "logo" | "desktopMenu" | "desktopCta" | "mobileStrip" | "hamburger" | "mobileCta" | "accessibility" | "drawer">("header");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [livePreviewDevice, setLivePreviewDevice] = useState<Device>("mobile");
  const [previewWidth, setPreviewWidth] = useState<360 | 375 | 390>(390);
  const previewFrameRef = useRef<HTMLIFrameElement | null>(null);
  const headerPreviewFrameRef = useRef<HTMLIFrameElement | null>(null);
  const headerPreviewCanvasRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [lastSaved, setLastSaved] = useState<any>(() => clone(settings.nav || {}));
  const [publishedNav, setPublishedNav] = useState<any>(null);
  const [publishedSettings, setPublishedSettings] = useState<any>(null);

  const items = useMemo(() => {
    const current = normalize(clone(draft.links?.length ? draft.links : DEFAULT_NAV)).filter((x: any) => x.id !== "community-initiatives" && x.label !== "Community Initiatives" && x.id !== "vision" && x.href !== "/#vision");
    const defaults = normalize(clone(DEFAULT_NAV)).filter((x: any) => x.id !== "vision");
    const map = new Map(current.map((x) => [x.id!, x]));
    for (const base of defaults) if (!map.has(base.id!)) map.set(base.id!, base);
    return Array.from(map.values());
  }, [draft.links]);
  const [structure, setStructure] = useState(() => initialStructure(draft, items));

  useEffect(() => {
    const next: any = clone(settings.nav || {});
    setDraft(next); setLastSaved(next); setStructure(initialStructure(next, normalize(clone(next.links?.length ? next.links : DEFAULT_NAV))));
  }, [settings.nav]);

  const update = (mutator: (n: any) => void) => {
    const next = clone(draft); mutator(next); setDraft(next); updateSettings(["nav"], next);
  };
  const applyStructure = (nextStructure: any) => {
    setStructure(nextStructure);
    update(n => {
      n.structureManaged = true;
      n.structure = nextStructure;
      n.links = items.map(item => ({ ...item, desktopPlacement: nextStructure.desktopCtaIds.includes(item.id) ? "cta" : "menu" }));
    });
  };
  const togglePlacement = (id: string, placement: Placement) => {
    const next = clone(structure);
    const key = `${placement}Ids` as keyof typeof next;
    const current = next[key] as string[];
    const has = current.includes(id);
    next[key] = has ? current.filter(x => x !== id) : [...current, id];
    // A top-level item has one desktop destination and can independently appear in either mobile experience.
    if (placement === "desktopMenu" && !has) next.desktopCtaIds = next.desktopCtaIds.filter(x => x !== id);
    if (placement === "desktopCta" && !has) next.desktopMenuIds = next.desktopMenuIds.filter(x => x !== id);
    applyStructure(next);
  };
  const movePlacement = (placement: Placement, id: string, delta: number) => {
    const next = clone(structure); const key = `${placement}Ids` as keyof typeof next; const arr = [...(next[key] as string[])]; const i = arr.indexOf(id); const j = i + delta;
    if (i < 0 || j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; next[key] = arr; applyStructure(next);
  };
  const enabled = (id: string, placement: Placement) => (structure[`${placement}Ids` as keyof typeof structure] as string[]).includes(id);
  const placementLabel = (item: NavItem, placement: Placement) => (placement === "mobileStrip" || placement === "mobileCta" || placement === "hamburger") ? (item.mobileLabel || (item.id === "get-involved" ? "Join Us" : item.label)) : item.label;

  const design = draft.design || {};
  const dkey = device === "tablet" ? "tablet" : device;
  const d = design[dkey] || {};
  const mobile = design.mobile || {};
  const setDesign = (key: string, value: any, deviceKey = dkey) => update(n => { n.design ||= {}; n.design[deviceKey] ||= {}; n.design[deviceKey][key] = value; });
  const setMobile = (key: string, value: any) => update(n => { n.design ||= {}; n.design.mobile ||= {}; n.design.mobile[key] = value; });
  const MOBILE_ACTION_IDS = ["donate", "get-involved", "joyzone", "shop"] as const;
  const setAllMobileActions = (field: "offsetX" | "offsetY" | "iconSize" | "scale", value: number) => update(n => {
    n.design ||= {}; n.design.mobile ||= {}; n.design.mobile.actionItems ||= {};
    const globalKey = field === "offsetX" ? "actionOffsetX" : field === "offsetY" ? "actionOffsetY" : field === "iconSize" ? "actionIconSize" : "actionScale";
    n.design.mobile[globalKey] = value;
    for (const id of MOBILE_ACTION_IDS) { n.design.mobile.actionItems[id] ||= {}; n.design.mobile.actionItems[id][field] = value; }
  });
  const resetAllMobileActions = () => update(n => {
    n.design ||= {}; n.design.mobile ||= {};
    delete n.design.mobile.actionItems;
    delete n.design.mobile.actionOffsetX; delete n.design.mobile.actionOffsetY;
    delete n.design.mobile.actionIconSize; delete n.design.mobile.actionScale;
  });
  const logoUrl = (settings as any).branding?.logoUrl || (settings as any).branding?.logoUrlWhite || "/logo.png";
  const virtualPreviewWidth = device === "mobile" ? previewWidth : device === "tablet" ? 768 : 1440;
  const virtualPreviewHeight = device === "mobile" ? 760 : device === "tablet" ? 520 : 420;

  useEffect(() => {
    const el = headerPreviewCanvasRef.current;
    if (!el) return;
    const updateScale = () => {
      const available = Math.max(280, el.clientWidth);
      setPreviewScale(Math.min(1, available / virtualPreviewWidth));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    window.addEventListener("resize", updateScale);
    return () => { observer.disconnect(); window.removeEventListener("resize", updateScale); };
  }, [device, previewWidth, virtualPreviewWidth]);

  // Header Designer is a visual editor for the header, not a second menu editor.
  // Admin settings are the draft document and may contain an incomplete/stale
  // navigation structure. The public header, however, is driven by the published
  // settings. Use the published navigation structure for the preview while keeping
  // the current draft design values so the Designer remains live-editable.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then(r => { if (!r.ok) throw new Error(`settings ${r.status}`); return r.json(); })
      .then((live: any) => {
        if (!cancelled) {
          setPublishedSettings(clone(live || {}));
          setPublishedNav(clone(live?.nav || {}));
        }
      })
      .catch(() => { if (!cancelled) setPublishedNav(null); });
    return () => { cancelled = true; };
  }, []);

  const previewNav = useMemo(() => {
    const next = clone(draft);
    const live = publishedNav;

    // Match the public Nav fallback exactly. The published API may legitimately
    // omit nav.structure; never resurrect a partial Admin draft structure in
    // that case, because doing so makes the Designer differ from the live site.
    const publishedLinks = normalize(clone(live?.links?.length ? live.links : DEFAULT_NAV))
      .filter((x: any) => x.id !== "community-initiatives" && x.label !== "Community Initiatives" && x.id !== "vision" && x.href !== "/#vision");
    const canonicalDefaults = normalize(clone(DEFAULT_NAV));
    const linkMap = new Map(publishedLinks.map((x) => [x.id!, x]));
    for (const base of canonicalDefaults) if (!linkMap.has(base.id!)) linkMap.set(base.id!, base);
    next.links = Array.from(linkMap.values());

    if (live && typeof live === "object" && live.structure && typeof live.structure === "object") {
      next.structure = clone(live.structure);
      next.structureManaged = live.structureManaged ?? true;
    } else {
      delete next.structure;
      delete next.structureManaged;
    }
    return next;
  }, [draft, items, structure, publishedNav]);
  const previewPageSettings = useMemo(() => clone(publishedSettings || settings as any), [publishedSettings, settings]);
  const previewVisibility = useMemo(() => clone(publishedSettings?.visibility ?? (settings as any).visibility ?? {}), [publishedSettings, settings]);
  const previewLiveStream = useMemo(() => clone(publishedSettings?.liveStream ?? (settings as any).liveStream ?? {}), [publishedSettings, settings]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "spandana-admin-header-preview-ready") {
        const source = event.source as Window | null;
        source?.postMessage({ type: "spandana-admin-header-preview", settings: previewPageSettings, nav: previewNav, logoUrl, visibility: previewVisibility, liveStream: previewLiveStream }, window.location.origin);
      }
      if (event.data?.type === "spandana-admin-header-preview-select" && typeof event.data.id === "string") {
        const id = event.data.id as string;
        if (id === "logo") setSelected("logo");
        else if (id === "desktop-menu" || id.startsWith("desktop-item-")) setSelected("desktopMenu");
        else if (id === "cta-group" || id.startsWith("cta-")) setSelected("desktopCta");
        else if (id === "mobile-strip" || id.startsWith("mobile-item-")) setSelected("mobileStrip");
        else if (id === "hamburger") setSelected("hamburger");
        else if (id === "mobile-cta-group" || id.startsWith("mobile-cta-")) setSelected("mobileCta");
        else if (id === "accessibility") setSelected("accessibility");
        else if (id === "drawer") setSelected("drawer");
        else setSelected("header");
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [previewNav, previewPageSettings, previewVisibility, previewLiveStream, logoUrl, settings]);

  const sendHeaderPreview = () => {
    const frame = headerPreviewFrameRef.current;
    frame?.contentWindow?.postMessage({
      type: "spandana-admin-header-preview",
      settings: previewPageSettings,
      nav: previewNav,
      logoUrl,
      visibility: previewVisibility,
      liveStream: previewLiveStream,
    }, window.location.origin);
  };

  useEffect(() => {
    sendHeaderPreview();
  }, [previewNav, previewPageSettings, previewVisibility, previewLiveStream, logoUrl, device, previewWidth]);

  const livePreviewViewportWidth = livePreviewDevice === "mobile" ? previewWidth : livePreviewDevice === "tablet" ? 768 : 1440;
  const livePreviewFrameHeight = livePreviewDevice === "mobile" ? "calc(100vh - 190px)" : "calc(100vh - 180px)";

  useEffect(() => {
    if (!previewOpen || !previewFrameRef.current) return;
    const frame = previewFrameRef.current;
    const send = () => frame.contentWindow?.postMessage({ type: "spandana-admin-preview", settings: previewPageSettings, nav: previewNav, logoUrl }, window.location.origin);
    frame.addEventListener("load", send);
    send();
    return () => frame.removeEventListener("load", send);
  }, [previewOpen, livePreviewDevice, previewWidth, previewNav, previewPageSettings, logoUrl]);

  const applyRecommendedMobile = () => update(n => {
    n.design ||= {}; n.design.mobile ||= {};
    Object.assign(n.design.mobile, {
      headerHeight: 72, horizontalPadding: 8, logoWidth: 84, logoMaxHeight: 72, logoSlotWidth: 92,
      itemGap: 4, itemMinWidth: 48, actionAreaGap: 6, actionAreaPadding: 0, iconSize: 24,
      hamburgerSize: 28, hamburgerBoxSize: 40, hamburgerGap: 0,
      accessibility: { ...(n.design.mobile.accessibility || {}), enabled: true, topOnly: true, hideOnScroll: true, firstDisplaySeconds: 3, repeatDisplaySeconds: 2, height: 50, gap: 5, fontSize: 12, horizontalPadding: 6, buttonHeight: 38, groupGap: 4, compactButtonWidth: 32, labeledButtonWidth: 58, paperWidth: 100, controlPadding: 3 }
    });
  });

  const saveDraft = () => { setLastSaved(clone(draft)); onSave(); };
  const publishDraft = () => { onSave(); if (publishNow) window.setTimeout(() => publishNow(), 900); };

  const placementNames: Array<{ key: Placement; title: string; desc: string }> = [
    { key: "desktopMenu", title: "Desktop Main Menu", desc: "Primary navigation shown across desktop." },
    { key: "desktopCta", title: "Desktop Header Actions", desc: "Action buttons such as Donate, Get Involved, Shop." },
    { key: "mobileStrip", title: "Mobile Header Strip", desc: "Compact icon + label shortcuts beside the logo." },
    { key: "hamburger", title: "Mobile Hamburger Main Menu", desc: "Main pages revealed when the hamburger drawer opens." },
    { key: "mobileCta", title: "Mobile Hamburger Actions", desc: "Large action buttons inside the hamburger drawer." },
  ];

  return <div className="w-full space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-2xl font-serif font-bold">Main Menu / Navigation</h2><p className="text-sm text-muted-foreground">Your current navigation stays intact. Design the actual header with a live rendering of the same navigation component.</p></div>
      <div className="flex flex-wrap items-center gap-2"><Button type="button" variant={stage === "structure" ? "default" : "outline"} onClick={() => setStage("structure")}>1. Select Menu</Button><Button type="button" variant={stage === "designer" ? "default" : "outline"} onClick={() => setStage("designer")} >2. Design Header</Button>{stage === "designer" && device === "mobile" && <Button type="button" variant="outline" onClick={applyRecommendedMobile}>Recommended Mobile Layout</Button>}</div>
    </div>

    {stage === "structure" && <div className="rounded-2xl border bg-background overflow-hidden">
      <div className="p-5 border-b"><div className="font-semibold">Build the Navigation Structure</div><p className="text-sm text-muted-foreground mt-1">Select which canonical navigation items appear in each placement. The same item can appear in multiple placements; changing its destination stays consistent everywhere.</p><p className="text-xs text-muted-foreground mt-2">Header design is independent of menu editing. You can open <strong>Design Header</strong> at any time without changing the current menu.</p></div>
      <div className="p-4 overflow-x-auto"><div className="min-w-[900px] rounded-xl border overflow-hidden">
        <div className="grid grid-cols-[minmax(250px,1.4fr)_repeat(5,minmax(145px,1fr))] bg-muted/40 border-b text-xs font-bold">
          <div className="p-3">Navigation Item</div>{placementNames.map(p => <div key={p.key} className="p-3 text-center">{p.title}</div>)}
        </div>
        {items.map((item, index) => <div key={item.id} className="grid grid-cols-[minmax(250px,1.4fr)_repeat(5,minmax(145px,1fr))] border-b last:border-b-0 items-center">
          <div className="p-3"><div className="font-semibold text-sm">{item.label}</div><div className="text-[11px] text-muted-foreground truncate">{item.href}</div>{item.children?.length ? <div className="text-[10px] text-muted-foreground mt-1">{item.children.length} submenu items</div> : null}</div>
          {placementNames.map(p => <div key={p.key} className="p-3 flex justify-center"><button type="button" onClick={() => togglePlacement(item.id!, p.key)} className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${enabled(item.id!, p.key) ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`} aria-label={`${enabled(item.id!, p.key) ? "Remove" : "Add"} ${item.label} ${p.title}`}><Check size={16}/></button></div>)}
        </div>)}
      </div></div>
      <div className="p-5 bg-muted/20 border-t"><div className="grid md:grid-cols-2 gap-4">
        {placementNames.map(p => { const list = structure[`${p.key}Ids` as keyof typeof structure] as string[]; return <div key={p.key} className="rounded-xl border bg-background p-3"><div className="font-semibold text-sm">{p.title}</div><div className="text-xs text-muted-foreground mt-1 mb-2">{p.desc}</div>{list.length ? <div className="space-y-1">{list.map((id, i) => <div key={id} className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm"><span className="w-5 text-[10px] text-muted-foreground">{i + 1}</span><span className="flex-1">{placementLabel(items.find(x => x.id === id) || { id, label: id, href: "" }, p.key)}</span><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => movePlacement(p.key, id, -1)} disabled={i === 0}><ChevronUpIcon/></Button><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => movePlacement(p.key, id, 1)} disabled={i === list.length - 1}><ChevronDown/></Button></div>)}</div> : <div className="text-xs text-muted-foreground py-3">Nothing selected.</div>}</div>; })}
      </div></div>
      <div className="p-5 flex flex-wrap justify-end gap-2"><Button type="button" variant="outline" onClick={() => setStage("designer")}>Continue to Visual Designer</Button><Button type="button" onClick={saveDraft} disabled={saving}><Save size={15}/>Save Draft</Button></div>
    </div>}

    {stage === "designer" && <div className="rounded-2xl border bg-background overflow-visible">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-muted/20 sticky top-0 z-20 bg-background/95 backdrop-blur-sm"><Button type="button" variant={device === "desktop" ? "default" : "outline"} size="sm" onClick={() => setDevice("desktop")}><Monitor size={14}/>Desktop</Button><Button type="button" variant={device === "tablet" ? "default" : "outline"} size="sm" onClick={() => setDevice("tablet")}><Tablet size={14}/>Tablet</Button><Button type="button" variant={device === "mobile" ? "default" : "outline"} size="sm" onClick={() => setDevice("mobile")}><Smartphone size={14}/>Mobile</Button><div className="ml-auto flex gap-2"><Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}><Eye size={15}/>Live Page Preview</Button><Button type="button" onClick={saveDraft} disabled={saving}><Save size={15}/>Save Draft</Button>{publishNow && <Button type="button" variant="secondary" onClick={publishDraft}>Publish</Button>}</div></div>
      <div className="grid lg:grid-cols-[250px_minmax(0,1fr)_300px] min-h-[720px] items-start">
        <aside className="border-r p-3 bg-muted/10"><div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Header Components</div><div className="space-y-1">{([['header','Header Outer'],['logo','Logo'],['desktopMenu','Desktop Main Menu'],['desktopCta','Desktop Actions'],['mobileStrip','Mobile Header Strip'],['hamburger','Hamburger Button'],['mobileCta','Hamburger Actions'],['accessibility','Accessibility Bar'],['drawer','Hamburger Drawer']] as const).filter(([id]) => device === 'mobile' ? ['header','logo','mobileStrip','hamburger','mobileCta','accessibility','drawer'].includes(id) : id !== 'mobileStrip' && id !== 'hamburger' && id !== 'mobileCta' && id !== 'accessibility' && id !== 'drawer').map(([id,label]) => <button type="button" key={id} onClick={() => setSelected(id)} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${selected === id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{label}</button>)}</div><div className="mt-5 rounded-xl border bg-background p-3 text-xs text-muted-foreground">This designer edits the real navigation component. There are no free-floating inner/outer boxes to drag around.</div></aside>
        <main className="bg-slate-100 p-5 overflow-visible min-w-0">
          <div ref={headerPreviewCanvasRef} className="flex justify-center w-full overflow-hidden">
            <div
              className="bg-white rounded-2xl shadow-xl overflow-hidden border shrink-0"
              style={{ width: `${virtualPreviewWidth * previewScale}px`, height: `${virtualPreviewHeight * previewScale}px` }}
            >
              <div
                className="relative bg-white origin-top-left"
                style={{ width: `${virtualPreviewWidth}px`, height: `${virtualPreviewHeight}px`, transform: `scale(${previewScale})` }}
              >
                <iframe
                  key={`${device}-${previewWidth}`}
                  ref={headerPreviewFrameRef}
                  title={`Spandana live header preview ${device}`}
                  src={`/?adminPreview=1&headerOnly=1&device=${device === 'mobile' ? 'mobile' : device === 'tablet' ? 'tablet' : 'desktop'}`}
                  className="absolute inset-0 block border-0 bg-white"
                  style={{ width: `${virtualPreviewWidth}px`, height: `${virtualPreviewHeight}px` }}
                />
              </div>
            </div>
          </div>
        </main>
        <aside className="border-l p-4 sticky top-16 self-start h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain bg-background/95 backdrop-blur-sm"><div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Live Header Properties</div>
          {selected === "header" && <PropertyGroup title="Header Outer"><SmallControl label="Header height" value={Number(d.headerHeight ?? (device === "mobile" ? 72 : 80))} min={56} max={140} onChange={n => setDesign("headerHeight", n)}/><SmallControl label="Horizontal padding" value={Number(d.horizontalPadding ?? (device === "mobile" ? 8 : 48))} min={0} max={48} onChange={n => setDesign("horizontalPadding", n)}/><SmallControl label="Logo/action gap" value={Number(d.actionAreaGap ?? 6)} min={0} max={24} onChange={n => setDesign("actionAreaGap", n)}/><SmallControl label="Action area padding" value={Number(d.actionAreaPadding ?? 0)} min={0} max={20} onChange={n => setDesign("actionAreaPadding", n)}/><div className="mt-3"><label className="text-[11px] font-semibold text-muted-foreground">Background</label><Input className="h-9 mt-1 p-1" type="color" value={d.background || "#ffffff"} onChange={e => setDesign("background", e.target.value)}/></div><div className="mt-3"><label className="text-[11px] font-semibold text-muted-foreground">Border</label><Input className="h-9 mt-1 p-1" type="color" value={d.borderColor || "#e5e7eb"} onChange={e => setDesign("borderColor", e.target.value)}/></div></PropertyGroup>}
          {selected === "logo" && <PropertyGroup title="Logo"><SmallControl label="Logo width" value={Number(d.logoWidth ?? 64)} min={40} max={110} onChange={n => setDesign("logoWidth", n)}/><SmallControl label="Logo max height" value={Number(d.logoMaxHeight ?? 64)} min={40} max={90} onChange={n => setDesign("logoMaxHeight", n)}/><SmallControl label="Logo area width" value={Number(d.logoSlotWidth ?? 78)} min={60} max={120} onChange={n => setDesign("logoSlotWidth", n)}/><SmallControl unit="%" label="Logo scale" value={Math.round(Number(d.logoScale ?? 1) * 100)} min={70} max={150} step={5} onChange={n => setDesign("logoScale", n / 100)}/><div className="mt-3"><label className="text-[11px] font-semibold text-muted-foreground">Position</label><div className="grid grid-cols-3 gap-1 mt-1">{(['left','center','right'] as const).map(pos => <Button key={pos} type="button" size="sm" variant={(mobile.logoPosition || 'left') === pos ? 'default' : 'outline'} onClick={() => setMobile('logoPosition', pos)}>{pos}</Button>)}</div></div><SmallControl label="Logo X offset" value={Number(d.logoOffsetX ?? 0)} min={-60} max={60} onChange={n => setDesign("logoOffsetX", n)}/><SmallControl label="Logo Y offset" value={Number(d.logoOffsetY ?? 0)} min={-40} max={40} onChange={n => setDesign("logoOffsetY", n)}/></PropertyGroup>}
          {selected === "desktopMenu" && <PropertyGroup title="Desktop Main Menu"><SmallControl label="Menu gap" value={Number(d.menuGap ?? 24)} min={0} max={80} onChange={n => setDesign("menuGap", n)}/><SmallControl label="Font size" value={Number(d.menuFontSize ?? 14)} min={10} max={24} onChange={n => setDesign("menuFontSize", n)}/><div className="mt-3"><label className="text-[11px] font-semibold text-muted-foreground">Menu alignment</label><div className="grid grid-cols-3 gap-1 mt-1">{(['left','center','right'] as const).map(pos => <Button key={pos} type="button" size="sm" variant={(d.menuPosition || 'center') === pos ? 'default' : 'outline'} onClick={() => setDesign("menuPosition", pos)}>{pos}</Button>)}</div></div></PropertyGroup>}
          {selected === "desktopCta" && <PropertyGroup title="Desktop Actions"><SmallControl label="Gap" value={Number(d.ctaGap ?? 10)} min={0} max={40} onChange={n => setDesign("ctaGap", n)}/><SmallControl unit="%" label="Button scale" value={Math.round(Number(d.ctaScale ?? 1) * 100)} min={70} max={150} step={5} onChange={n => setDesign("ctaScale", n / 100)}/></PropertyGroup>}
          {selected === "mobileStrip" && <PropertyGroup title="Mobile Header Strip"><p className="text-xs text-muted-foreground">Control all four mobile actions together. These settings apply the same X/Y position, icon size and scale to Donate, Join Us, Joy Zone and Shop. Existing individual item adjustments can still be fine-tuned in the action list below.</p><div className="rounded-xl border bg-slate-50 p-3 mb-3"><div className="text-xs font-bold">Mobile Header Side Space</div><div className="text-[11px] text-muted-foreground mt-1">Left space is controlled by Logo → Logo area width. Right space is controlled by Hamburger Button → Button size. Header → Horizontal padding controls the outer edge spacing.</div></div><div className="rounded-xl border bg-muted/20 p-3 space-y-3"><div className="text-xs font-bold">All 4 Actions — Same Values</div><SmallControl label="Move all 4 horizontally" value={Number(mobile.actionOffsetX ?? 0)} min={-30} max={30} onChange={n => setMobile("actionOffsetX", n)}/><SmallControl label="Move all 4 vertically" value={Number(mobile.actionOffsetY ?? 0)} min={-30} max={30} onChange={n => setMobile("actionOffsetY", n)}/><SmallControl label="Icon size — all 4" value={Number(mobile.actionIconSize ?? mobile.iconSize ?? 24)} min={16} max={42} onChange={n => setAllMobileActions("iconSize", n)}/><SmallControl unit="%" label="Scale — all 4" value={Math.round(Number(mobile.actionScale ?? 1) * 100)} min={70} max={140} step={5} onChange={n => setAllMobileActions("scale", n / 100)}/><Button type="button" variant="outline" className="w-full" onClick={resetAllMobileActions}>Reset all 4 action positions &amp; sizes</Button></div><div className="pt-2"><div className="text-xs font-bold mb-2">Individual Fine Tune</div><div className="space-y-2">{MOBILE_ACTION_IDS.map(id => { const item = mobile.actionItems?.[id] || {}; const label = id === "get-involved" ? "Join Us" : id === "joyzone" ? "Joy Zone" : id === "donate" ? "Donate" : "Shop"; return <div key={id} className="rounded-lg border p-2"><div className="text-xs font-semibold mb-2">{label}</div><div className="grid grid-cols-2 gap-2"><SmallControl label="X" value={Number(item.offsetX ?? 0)} min={-20} max={20} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.actionItems ||= {}; v.design.mobile.actionItems[id] ||= {}; v.design.mobile.actionItems[id].offsetX = n; })}/><SmallControl label="Y" value={Number(item.offsetY ?? 0)} min={-20} max={20} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.actionItems ||= {}; v.design.mobile.actionItems[id] ||= {}; v.design.mobile.actionItems[id].offsetY = n; })}/><SmallControl label="Icon size" value={Number(item.iconSize ?? mobile.actionIconSize ?? mobile.iconSize ?? 24)} min={16} max={42} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.actionItems ||= {}; v.design.mobile.actionItems[id] ||= {}; v.design.mobile.actionItems[id].iconSize = n; })}/><SmallControl unit="%" label="Scale %" value={Math.round(Number(item.scale ?? 1) * 100)} min={70} max={140} step={5} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.actionItems ||= {}; v.design.mobile.actionItems[id] ||= {}; v.design.mobile.actionItems[id].scale = n / 100; })}/></div></div>; })}</div></div><SmallControl label="Item gap" value={Number(mobile.itemGap ?? 4)} min={0} max={20} onChange={n => setMobile("itemGap", n)}/><SmallControl label="Item minimum width" value={Number(mobile.itemMinWidth ?? 48)} min={40} max={70} onChange={n => setMobile("itemMinWidth", n)}/><SmallControl label="Label text size" value={Number(mobile.fontSize ?? 11)} min={9} max={16} onChange={n => setMobile("fontSize", n)}/><SmallControl label="Action area padding" value={Number(mobile.actionAreaPadding ?? 0)} min={0} max={16} onChange={n => setMobile("actionAreaPadding", n)}/></PropertyGroup>}
          {selected === "hamburger" && <PropertyGroup title="Hamburger Button"><div className="flex items-center justify-between rounded-lg border p-2.5"><div><div className="text-sm font-semibold">Outer Frame</div><div className="text-[11px] text-muted-foreground">Show or hide the box around the hamburger icon.</div></div><Button type="button" size="sm" variant={(mobile.hamburgerFrame === true) ? "default" : "outline"} onClick={() => setMobile("hamburgerFrame", mobile.hamburgerFrame !== true)}> {(mobile.hamburgerFrame === true) ? "ON" : "OFF"}</Button></div><SmallControl label="Button size" value={Number(mobile.hamburgerBoxSize ?? 40)} min={34} max={56} onChange={n => setMobile("hamburgerBoxSize", n)}/><SmallControl label="Icon size" value={Number(mobile.hamburgerSize ?? 28)} min={18} max={42} onChange={n => setMobile("hamburgerSize", n)}/><SmallControl label="Gap before hamburger" value={Number(mobile.hamburgerGap ?? 0)} min={0} max={20} onChange={n => setMobile("hamburgerGap", n)}/><SmallControl label="X offset" value={Number(mobile.hamburgerOffsetX ?? 0)} min={-20} max={20} onChange={n => setMobile("hamburgerOffsetX", n)}/><SmallControl label="Y offset" value={Number(mobile.hamburgerOffsetY ?? 0)} min={-20} max={20} onChange={n => setMobile("hamburgerOffsetY", n)}/><SmallControl label="Border radius" value={Number(mobile.hamburgerRadius ?? 12)} min={0} max={30} onChange={n => setMobile("hamburgerRadius", n)}/><div className="grid grid-cols-2 gap-2 mt-3"><div><label className="text-[11px] font-semibold text-muted-foreground">Box background</label><Input className="h-9 mt-1 p-1" type="color" value={mobile.hamburgerBackground || '#ffffff'} onChange={e => setMobile('hamburgerBackground', e.target.value)}/></div><div><label className="text-[11px] font-semibold text-muted-foreground">Border colour</label><Input className="h-9 mt-1 p-1" type="color" value={mobile.hamburgerBorderColor || '#e5e7eb'} onChange={e => setMobile('hamburgerBorderColor', e.target.value)}/></div></div></PropertyGroup>}
          {selected === "mobileCta" && <PropertyGroup title="Hamburger Actions"><p className="text-xs text-muted-foreground">These are the large action buttons shown below the Mobile Hamburger Main Menu. Choose the items and their order in Step 1.</p><SmallControl label="Button height" value={Number(mobile.mobileCtaHeight ?? 56)} min={44} max={72} onChange={n => setMobile("mobileCtaHeight", n)}/><SmallControl label="Button gap" value={Number(mobile.mobileCtaGap ?? 12)} min={4} max={24} onChange={n => setMobile("mobileCtaGap", n)}/><SmallControl label="Button text size" value={Number(mobile.mobileCtaFontSize ?? 17)} min={12} max={22} onChange={n => setMobile("mobileCtaFontSize", n)}/></PropertyGroup>}
          {selected === "accessibility" && <PropertyGroup title="Mobile Accessibility Bar"><div className="flex items-center justify-between rounded-lg border p-2.5"><div><div className="text-sm font-semibold">Show accessibility bar</div><div className="text-[11px] text-muted-foreground">Text Size and Paper White appear directly below the mobile header.</div></div><Button type="button" size="sm" variant={mobile.accessibility?.enabled !== false ? "default" : "outline"} onClick={() => update(n => { n.design ||= {}; n.design.mobile ||= {}; n.design.mobile.accessibility ||= {}; n.design.mobile.accessibility.enabled = n.design.mobile.accessibility.enabled === false; })}>{mobile.accessibility?.enabled !== false ? "ON" : "OFF"}</Button></div><div className="flex items-center justify-between rounded-lg border p-2.5"><div><div className="text-sm font-semibold">Show only at top</div><div className="text-[11px] text-muted-foreground">Hide the bar after the visitor scrolls down; show it again at the top.</div></div><Button type="button" size="sm" variant={mobile.accessibility?.topOnly !== false ? "default" : "outline"} onClick={() => update(n => { n.design ||= {}; n.design.mobile ||= {}; n.design.mobile.accessibility ||= {}; n.design.mobile.accessibility.topOnly = n.design.mobile.accessibility.topOnly === false; })}>{mobile.accessibility?.topOnly !== false ? "ON" : "OFF"}</Button></div><SmallControl label="Bar height" value={Number(mobile.accessibility?.height ?? 54)} min={44} max={80} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.height = n; })}/><SmallControl label="Outer padding" value={Number(mobile.accessibility?.horizontalPadding ?? 8)} min={0} max={24} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.horizontalPadding = n; })}/><SmallControl label="Group gap" value={Number(mobile.accessibility?.groupGap ?? 6)} min={0} max={16} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.groupGap = n; })}/><SmallControl label="Control height" value={Number(mobile.accessibility?.buttonHeight ?? 40)} min={34} max={48} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.buttonHeight = n; })}/><SmallControl label="Compact A width" value={Number(mobile.accessibility?.compactButtonWidth ?? 34)} min={30} max={50} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.compactButtonWidth = n; })}/><SmallControl label="Labeled A width" value={Number(mobile.accessibility?.labeledButtonWidth ?? 54)} min={48} max={82} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.labeledButtonWidth = n; })}/><SmallControl label="Paper White width" value={Number(mobile.accessibility?.paperWidth ?? 96)} min={84} max={140} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.paperWidth = n; })}/><SmallControl label="Control font size" value={Number(mobile.accessibility?.fontSize ?? 14)} min={11} max={18} onChange={n => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.fontSize = n; })}/><div className="grid grid-cols-2 gap-2 mt-2"><div><label className="text-[11px] font-semibold text-muted-foreground">Background</label><Input className="h-9 mt-1 p-1" type="color" value={mobile.accessibility?.background || '#fbfaf5'} onChange={e => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.background = e.target.value; })}/></div><div><label className="text-[11px] font-semibold text-muted-foreground">Border</label><Input className="h-9 mt-1 p-1" type="color" value={mobile.accessibility?.borderColor || '#e5e1d6'} onChange={e => update(v => { v.design ||= {}; v.design.mobile ||= {}; v.design.mobile.accessibility ||= {}; v.design.mobile.accessibility.borderColor = e.target.value; })}/></div></div></PropertyGroup>}
          {selected === "drawer" && <PropertyGroup title="Hamburger Drawer"><p className="text-xs text-muted-foreground">The drawer contains the Mobile Hamburger Main Menu first, followed by the Mobile Hamburger Actions selected in Step 1.</p><SmallControl label="Drawer width" value={Number(mobile.drawerWidth ?? 390)} min={260} max={430} onChange={n => setMobile("drawerWidth", n)}/><div className="mt-3"><label className="text-[11px] font-semibold text-muted-foreground">Drawer side</label><div className="grid grid-cols-2 gap-1 mt-1"><Button type="button" size="sm" variant={(mobile.drawerSide || 'right') === 'left' ? 'default' : 'outline'} onClick={() => setMobile('drawerSide','left')}>Left</Button><Button type="button" size="sm" variant={(mobile.drawerSide || 'right') === 'right' ? 'default' : 'outline'} onClick={() => setMobile('drawerSide','right')}>Right</Button></div></div><SmallControl label="Drawer text size" value={Number(mobile.drawerFontSize ?? 16)} min={12} max={24} onChange={n => setMobile("drawerFontSize", n)}/></PropertyGroup>}
        </aside>
      </div>
    </div>}

    {previewOpen && <div className="fixed inset-0 z-[100] bg-black/50 p-3 md:p-6 flex items-center justify-center"><div className="w-full max-w-[1540px] h-full max-h-[940px] bg-background rounded-2xl overflow-hidden shadow-2xl flex flex-col"><div className="p-3 border-b flex flex-wrap items-center justify-between gap-3"><div><div className="font-semibold">Live Page Preview</div><div className="text-xs text-muted-foreground">Actual Home page at the selected device viewport. Unsaved navigation changes are pushed into it immediately.</div></div><div className="flex flex-wrap items-center justify-end gap-1.5"><Button type="button" size="sm" variant={livePreviewDevice === "desktop" ? "default" : "outline"} onClick={() => setLivePreviewDevice("desktop")}><Monitor size={14}/>Desktop</Button><Button type="button" size="sm" variant={livePreviewDevice === "tablet" ? "default" : "outline"} onClick={() => setLivePreviewDevice("tablet")}><Tablet size={14}/>Tablet</Button><Button type="button" size="sm" variant={livePreviewDevice === "mobile" ? "default" : "outline"} onClick={() => setLivePreviewDevice("mobile")}><Smartphone size={14}/>Mobile</Button>{livePreviewDevice === "mobile" && <><Button type="button" size="sm" variant={previewWidth === 390 ? "default" : "outline"} onClick={() => setPreviewWidth(390)}>390px</Button><Button type="button" size="sm" variant={previewWidth === 375 ? "default" : "outline"} onClick={() => setPreviewWidth(375)}>375px</Button><Button type="button" size="sm" variant={previewWidth === 360 ? "default" : "outline"} onClick={() => setPreviewWidth(360)}>360px</Button></>}<Button type="button" variant="outline" onClick={() => setPreviewOpen(false)}><X size={15}/>Close</Button></div></div><div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-100"><div className="mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border" style={{ width: `${livePreviewViewportWidth}px`, maxWidth: livePreviewDevice === "mobile" ? "100%" : undefined }}><iframe ref={previewFrameRef} title={`Spandana Home ${livePreviewDevice} live preview`} src={`/?adminPreview=1&device=${livePreviewDevice}`} className="block border-0" style={{ width: `${livePreviewViewportWidth}px`, height: livePreviewFrameHeight, minHeight: "700px" }} /></div></div></div></div>}
  </div>;
}

function PropertyGroup({ title, children }: { title: string; children?: any }) { return <div className="rounded-xl border p-3 space-y-3"><div className="font-semibold text-sm">{title}</div>{children}</div>; }
function ChevronUpIcon() { return <ChevronLeft className="rotate-90" size={14}/>; }
