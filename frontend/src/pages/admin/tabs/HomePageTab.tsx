import { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical, Eye, EyeOff, Save, Loader2, ChevronUp, ChevronDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "./shared";
import type { SiteSettings } from "../types";

interface Props { settings: SiteSettings; updateSettings: (path: (string | number)[], val: unknown) => void; saving: boolean; onSave: () => void; }
interface Section { key: string; label: string; desc: string; icon: string; editTab?: string; }

const SECTIONS: Section[] = [
  { key: "hero", label: "Hero", desc: "Main hero banner, logo, headline, buttons and media.", icon: "01", editTab: "hero" },
  { key: "impactTicker", label: "Impact Ticker", desc: "Scrolling impact/statements strip below the hero.", icon: "02", editTab: "impact" },
  { key: "visionMission", label: "Vision & Mission", desc: "Vision/Mission content with its reusable Featured Spotlight.", icon: "03", editTab: "vision" },
  { key: "coreValues", label: "Core Values", desc: "Core values presentation.", icon: "04", editTab: "corevalues" },
  { key: "testimonials", label: "Testimonials", desc: "Community voices / testimonial carousel.", icon: "05", editTab: "testimonials" },
  { key: "programs", label: "Core Programs", desc: "Canonical programs presented through Sahara Community Centers.", icon: "06", editTab: "programs" },
  { key: "emergencyAid", label: "Emergency Aid & Relief", desc: "Homepage reference to the independent Emergency Response system.", icon: "07", editTab: "emergency-aid" },
  { key: "impactCalculator", label: "Your Impact", desc: "Donation impact calculator and impact tiers.", icon: "08", editTab: "impact" },
  { key: "volunteerSpotlight", label: "Volunteer Spotlight", desc: "Featured volunteer stories and contribution highlights.", icon: "09", editTab: "volunteers" },
  { key: "campaignWidget", label: "Campaign Widget", desc: "Campaign progress presentation.", icon: "10", editTab: "donate" },
  { key: "newsletter", label: "Newsletter", desc: "Homepage newsletter subscription presentation.", icon: "11", editTab: "subscribers" },
  { key: "timeline", label: "Timeline", desc: "Organisation history and milestones.", icon: "12", editTab: "timeline" },
  { key: "ads", label: "Ad Banners", desc: "Sponsor / announcement placements.", icon: "13", editTab: "ads" },
];

const DEFAULT_ORDER = SECTIONS.map(s => s.key);
function mergeOrder(stored: string[] | undefined): string[] {
  const valid = (stored ?? []).filter(k => DEFAULT_ORDER.includes(k));
  return [...valid, ...DEFAULT_ORDER.filter(k => !valid.includes(k))];
}

export default function HomePageTab({ settings, updateSettings, saving, onSave }: Props) {
  const [order, setOrder] = useState<string[]>(() => mergeOrder(settings.sectionOrderDesktop ?? settings.sectionOrder));
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => settings.visibilityDesktop ?? settings.visibility ?? {});
  const [dragKey, setDragKey] = useState<string | null>(null);

  useEffect(() => { setOrder(mergeOrder(settings.sectionOrderDesktop ?? settings.sectionOrder)); setVisibility(settings.visibilityDesktop ?? settings.visibility ?? {}); }, [settings.sectionOrderDesktop, settings.sectionOrder, settings.visibilityDesktop, settings.visibility]);

  const items = useMemo(() => order.map(key => SECTIONS.find(s => s.key === key)).filter(Boolean) as Section[], [order]);

  const commitOrder = (next: string[]) => { setOrder(next); updateSettings(["sectionOrderDesktop"], next); updateSettings(["sectionOrder"], next); };
  const commitVisibility = (key: string, value: boolean) => { const next = { ...visibility, [key]: value }; setVisibility(next); updateSettings(["visibilityDesktop", key], value); updateSettings(["visibility", key], value); };
  const move = (index: number, delta: number) => { const to = index + delta; if (to < 0 || to >= order.length) return; const next = [...order]; [next[index], next[to]] = [next[to], next[index]]; commitOrder(next); };
  const reset = () => commitOrder(DEFAULT_ORDER);

  return <div className="max-w-3xl mx-auto">
    <div className="flex items-center justify-between mb-6">
      <div><h2 className="text-2xl font-serif font-bold">Home Page</h2><p className="text-sm text-muted-foreground mt-1">Control the homepage sections, order and visibility. Edit the content from each section's owner.</p></div>
      <Button className="rounded-full gap-2" onClick={onSave} disabled={saving}>{saving ? <><Loader2 size={14} className="animate-spin"/>Saving...</> : <><Save size={14}/>Save Layout</>}</Button>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-xs text-blue-800">This is the authoritative homepage flow. Drag sections or use ↑ ↓. Page Builder controls presentation; domain tabs control the actual content.</div>

    <SectionCard title="Homepage Sections" description="Drag and drop, move up/down, show/hide. Desktop order is the shared default; Mobile may override it in Page Builder when necessary.">
      <div className="space-y-2">
        {items.map((section, index) => {
          const visible = visibility[section.key] !== false;
          return <div key={section.key} draggable onDragStart={() => setDragKey(section.key)} onDragOver={(e)=>e.preventDefault()} onDrop={()=>{
            if (!dragKey || dragKey === section.key) return;
            const from = order.indexOf(dragKey), to = order.indexOf(section.key); if (from < 0 || to < 0) return;
            const next=[...order]; next.splice(from,1); next.splice(to,0,dragKey); commitOrder(next); setDragKey(null);
          }} className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${visible ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-70"}`}>
            <GripVertical size={17} className="text-muted-foreground/50 shrink-0 cursor-grab"/>
            <span className="w-6 text-center text-[10px] font-bold text-muted-foreground/50">{index+1}</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{section.icon}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold">{section.label}</p><p className="text-xs text-muted-foreground truncate">{section.desc}</p></div>
            <div className="flex items-center gap-1 shrink-0">
              <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg" disabled={index===0} onClick={()=>move(index,-1)}><ChevronUp size={13}/></Button>
              <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg" disabled={index===items.length-1} onClick={()=>move(index,1)}><ChevronDown size={13}/></Button>
              {section.editTab && <Button type="button" variant="ghost" size="sm" className="h-8 px-2 rounded-lg gap-1" onClick={()=>window.__spandanaSetTab?.(section.editTab!)}><Pencil size={12}/>Edit</Button>}
              <Switch checked={visible} onCheckedChange={(v)=>commitVisibility(section.key,v)} />
            </div>
          </div>;
        })}
      </div>
      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={()=>{const v=Object.fromEntries(DEFAULT_ORDER.map(k=>[k,true]));setVisibility(v);updateSettings(["visibilityDesktop"],v);updateSettings(["visibility"],v);}}><Eye size={13}/>Show All</Button>
        <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={()=>{const v=Object.fromEntries(DEFAULT_ORDER.map(k=>[k,false]));setVisibility(v);updateSettings(["visibilityDesktop"],v);updateSettings(["visibility"],v);}}><EyeOff size={13}/>Hide All</Button>
        <Button variant="ghost" size="sm" className="rounded-lg" onClick={reset}>Reset Order</Button>
      </div>
    </SectionCard>
  </div>;
}
