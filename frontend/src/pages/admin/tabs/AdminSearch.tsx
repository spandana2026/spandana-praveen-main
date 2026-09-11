import { useEffect, useState } from "react";
import { Search, ArrowUpRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const ROUTES: Record<string, string> = {
  "main menu / navigation": "/admin/navigation", navigation: "/admin/navigation", programs: "/admin/programs", "donation opportunities": "/admin/donate", donations: "/admin/donate", donate: "/admin/donate", events: "/admin/events", blog: "/admin/blog", testimonials: "/admin/testimonials", volunteers: "/admin/volunteers", team: "/admin/team", "emergency campaigns": "/admin/emergency-aid", media: "/admin/gallery", "media library": "/admin/gallery", settings: "/admin/siteinfo", "site settings": "/admin/siteinfo"
};

export default function AdminSearch({ onClose }: { onClose?: () => void }) {
  const [, navigate] = useLocation();
  const [q, setQ] = useState(""); const [results, setResults] = useState<any[]>([]); const [busy, setBusy] = useState(false);
  useEffect(()=>{ const t=setTimeout(async()=>{ if(q.trim().length<2){setResults([]);return;} setBusy(true); try{const r=await fetch(`/api/v1/admin/search?q=${encodeURIComponent(q)}&limit=50`,{credentials:"include"}); if(r.ok) setResults((await r.json()).results||[]);} finally{setBusy(false);} },220); return()=>clearTimeout(t)},[q]);
  function open(r:any){ const route=ROUTES[String(r.module||"").toLowerCase()] || "/admin/dashboard"; navigate(route); onClose?.(); }
  return <div className="w-full max-w-2xl"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search programs, events, people, media, navigation, settings…" className="w-full rounded-2xl border border-border bg-background pl-11 pr-12 py-4 text-base shadow-sm" />{busy&&<Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" size={18}/>}</div>{q.length>=2&&<div className="mt-3 rounded-2xl border border-border bg-card shadow-xl overflow-hidden">{results.length?results.map(r=><button key={`${r.module}-${r.recordId}`} onClick={()=>open(r)} className="w-full text-left px-4 py-3 hover:bg-muted/60 border-b border-border last:border-0"><div className="flex items-center justify-between gap-4"><div><div className="font-semibold text-sm">{r.title}</div><div className="text-xs text-muted-foreground capitalize">{r.module}</div><div className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.excerpt}</div></div><ArrowUpRight size={16} className="shrink-0 text-muted-foreground"/></div></button>):<div className="px-4 py-8 text-center text-sm text-muted-foreground">No matching Admin records.</div>}</div>}</div>;
}
