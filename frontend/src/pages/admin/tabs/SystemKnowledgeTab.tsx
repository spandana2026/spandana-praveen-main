import { useEffect, useMemo, useState } from "react";
import { BookOpen, Database, Download, FileCode2, History, Search, Server, ShieldCheck, Settings2, RefreshCw, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";

interface Props { token: string; showFeedback: (type: "success" | "error", msg: string) => void; }
type Domain = { id:string; label:string; records:any[] };
type Result = { id:string; title:string; domainId:string; domainLabel:string; answer?:string; status?:string; tags?:string[]; path?:string; bytes?:number; modifiedAt?:string; currentValue?:any; settingPath?:string; relatedFiles?:string[]; relatedSettings?:string[]; };
type Knowledge = { knowledgeBase:{purpose:string; domains:Domain[]; recordCount:number}; manifest:any; documentation:string };

const areas = [
  { id:"all", label:"All Knowledge", icon:BookOpen },
  { id:"settings", label:"Settings & Design", icon:Settings2 },
  { id:"database", label:"Database", icon:Database },
  { id:"security", label:"Security & Recovery", icon:ShieldCheck },
  { id:"infrastructure", label:"Infrastructure", icon:Server },
  { id:"history", label:"Project History", icon:History },
];

function pretty(v:any){ if(v===undefined) return "—"; if(typeof v==='string') return v; try{return JSON.stringify(v,null,2)}catch{return String(v)} }
function fmtBytes(n?:number){ if(!n) return ""; if(n<1024) return `${n} B`; if(n<1024*1024) return `${(n/1024).toFixed(1)} KB`; return `${(n/1024/1024).toFixed(1)} MB`; }

export default function SystemKnowledgeTab({ token, showFeedback }: Props) {
  const [knowledge,setKnowledge]=useState<Knowledge|null>(null);
  const [results,setResults]=useState<Result[]>([]);
  const [selected,setSelected]=useState<Result|null>(null);
  const [query,setQuery]=useState("");
  const [area,setArea]=useState("all");
  const [busy,setBusy]=useState(false);
  const [searching,setSearching]=useState(false);

  async function load(){
    setBusy(true);
    try{
      const r=await fetch("/api/v1/admin/system/knowledge",{headers:{Authorization:`Bearer ${token}`},credentials:"include"});
      if(!r.ok) throw new Error("Knowledge could not be loaded");
      const d=await r.json(); setKnowledge(d);
    }catch(e){showFeedback("error",e instanceof Error?e.message:"Could not load System Knowledge");}
    finally{setBusy(false)}
  }
  useEffect(()=>{load()},[]);

  async function search(){
    const q=query.trim();
    if(q.length<2 && area==="all"){setResults([]);setSelected(null);return;}
    setSearching(true);
    try{
      const suffix=area==='all'?"":`&area=${encodeURIComponent(area)}`;
      const r=await fetch(`/api/v1/admin/system/knowledge/search?q=${encodeURIComponent(q)}${suffix}`,{headers:{Authorization:`Bearer ${token}`},credentials:"include"});
      if(!r.ok) throw new Error("Search failed");
      const d=await r.json(); setResults(d.results||[]); setSelected((d.results||[])[0]||null);
    }catch(e){showFeedback("error",e instanceof Error?e.message:"Knowledge search failed");}
    finally{setSearching(false)}
  }
  useEffect(()=>{const t=setTimeout(search,220);return()=>clearTimeout(t)},[query,area]);

  const quick = useMemo(()=>{
    if(!knowledge) return [];
    const records=knowledge.knowledgeBase.domains.flatMap(d=>d.records.map(r=>({...r,domainId:d.id,domainLabel:d.label})));
    return records.slice(0,8);
  },[knowledge]);

  function downloadText(filename:string,text:string,type="text/plain"){
    const blob=new Blob([text],{type}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
  }
  async function exportSnapshot(){
    setBusy(true);try{const r=await fetch("/api/v1/admin/system/export",{headers:{Authorization:`Bearer ${token}`},credentials:"include"});if(!r.ok)throw new Error("System export failed");downloadText(`Spandana_System_Snapshot_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(await r.json(),null,2),"application/json");showFeedback("success","System snapshot downloaded")}catch(e){showFeedback("error",e instanceof Error?e.message:"Export failed")}finally{setBusy(false)}
  }

  const manifest=knowledge?.manifest;
  return <div className="space-y-5 max-w-[1500px] mx-auto" data-system-knowledge="true">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
      <div><div className="flex items-center gap-2 text-primary text-sm font-semibold"><BookOpen size={17}/> Spandana System Memory</div><h1 className="text-3xl md:text-4xl font-serif font-bold mt-1">System Knowledge Center</h1><p className="text-muted-foreground mt-2 max-w-4xl">Ask what the system does, why a setting or button exists, where it is configured, how the database works, and what recovery exists outside the Admin Panel. Code stays in the repository; this center references it instead of copying it.</p></div>
      <div className="flex gap-2"><button onClick={load} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold"><RefreshCw size={15} className={busy?"animate-spin":""}/> Refresh</button><button onClick={exportSnapshot} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-bold"><Download size={15}/> System Snapshot</button></div>
    </div>

    <div className="grid xl:grid-cols-[220px_minmax(0,1fr)_390px] gap-4 min-h-[680px]">
      <aside className="bg-card border rounded-2xl p-3 h-fit sticky top-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 pb-2">Knowledge Areas</p>
        {areas.map(a=>{const I=a.icon;return <button key={a.id} onClick={()=>setArea(a.id)} className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-left mb-1 ${area===a.id?"bg-primary text-primary-foreground":"hover:bg-muted"}`}><I size={16}/>{a.label}</button>})}
        <div className="mt-4 p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground">{knowledge?.knowledgeBase.recordCount||0} indexed knowledge records plus live repository references.</div>
      </aside>

      <section className="bg-card border rounded-2xl overflow-hidden min-w-0">
        <div className="p-4 border-b sticky top-0 bg-card z-10"><div className="flex gap-3 items-center"><Search size={18} className="text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="Ask or search: Publish button, MongoDB, recovery, index.tsx…" className="flex-1 bg-transparent outline-none text-sm"/>{searching&&<RefreshCw size={15} className="animate-spin text-muted-foreground"/>}</div><p className="text-[11px] text-muted-foreground mt-2">Searches system knowledge, current settings and the actual repository index.</p></div>
        <div className="p-4 space-y-3">
          {!query.trim() && <><div className="rounded-xl border border-primary/20 bg-primary/5 p-4"><div className="font-semibold">Ask the system</div><p className="text-sm text-muted-foreground mt-1">Examples: “Why is this header button here?”, “What have you done for recovery outside Admin?”, “What is the database source of truth?”, “Find index.tsx”.</p></div><div className="grid sm:grid-cols-2 gap-2">{quick.map(r=><button key={r.id} onClick={()=>{setQuery(r.title);setArea(r.domainId)}} className="text-left rounded-xl border p-3 hover:bg-muted"><div className="font-semibold text-sm">{r.title}</div><div className="text-xs text-muted-foreground mt-1">{r.domainLabel}</div></button>)}</div></>}
          {query.trim() && <div className="text-xs text-muted-foreground px-1">{results.length} result{results.length===1?'':'s'} for <span className="font-semibold text-foreground">{query}</span></div>}
          {query.trim() && results.map(r=><button key={r.id} onClick={()=>setSelected(r)} className={`w-full text-left rounded-xl border p-4 transition ${selected?.id===r.id?"border-primary bg-primary/5":"hover:bg-muted"}`}><div className="flex items-start gap-3"><div className="mt-0.5">{r.domainId==='repository'?<FileCode2 size={17}/>:r.domainId==='database'?<Database size={17}/>:r.domainId==='security'?<ShieldCheck size={17}/>:r.domainId==='infrastructure'?<Server size={17}/>:<Settings2 size={17}/>}</div><div className="min-w-0"><div className="font-semibold text-sm truncate">{r.title}</div><div className="text-xs text-muted-foreground mt-1">{r.domainLabel}{r.path?` · ${r.path}`:""}</div><p className="text-sm mt-2 line-clamp-2 text-muted-foreground">{r.answer||"Repository source reference."}</p></div></div></button>)}
          {query.trim() && !results.length && <div className="py-16 text-center text-sm text-muted-foreground">Nothing found. Try a button name, setting label, feature name, database term, recovery term, or repository filename.</div>}
        </div>
      </section>

      <aside className="bg-card border rounded-2xl overflow-hidden min-w-0">
        <div className="p-4 border-b"><div className="text-xs uppercase tracking-wider text-muted-foreground">Knowledge Detail</div><h2 className="font-bold mt-1">{selected?.title||"Select a result"}</h2></div>
        <div className="p-5 space-y-5">
          {selected ? <>
            <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Answer</div><p className="text-sm leading-6 mt-2">{selected.answer||"This item is a reference to the actual repository source."}</p></div>
            <div className="flex items-center gap-2 text-xs">{selected.status==='partial'?<><AlertTriangle size={15} className="text-amber-600"/><span>Partially implemented / depends on external infrastructure</span></>:selected.status==='repository-source'?<><FileCode2 size={15}/><span>Repository source — not duplicated here</span></>:<><CheckCircle2 size={15} className="text-emerald-600"/><span>{selected.status||"Knowledge record"}</span></>}</div>
            {selected.settingPath&&<div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Setting path</div><code className="block mt-2 rounded-lg bg-muted p-3 text-xs break-all">{selected.settingPath}</code><div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-3">Current value</div><pre className="mt-2 rounded-lg bg-muted p-3 text-xs overflow-auto max-h-40">{pretty(selected.currentValue)}</pre></div>}
            {selected.path&&<div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Repository reference</div><code className="block mt-2 rounded-lg bg-muted p-3 text-xs break-all">{selected.path}</code><div className="text-xs text-muted-foreground mt-2">{fmtBytes(selected.bytes)}{selected.modifiedAt?` · updated ${new Date(selected.modifiedAt).toLocaleString()}`:""}</div></div>}
            {Boolean(selected.relatedFiles?.length)&&<div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Implementation references</div><div className="mt-2 space-y-1">{selected.relatedFiles.map(f=><code key={f} className="block text-xs bg-muted rounded px-2 py-1 break-all">{f}</code>)}</div></div>}
            {Boolean(selected.tags?.length)&&<div className="flex flex-wrap gap-1">{selected.tags.slice(0,12).map(t=><span key={t} className="text-[10px] rounded-full border px-2 py-1">{t}</span>)}</div>}
            {selected.domainId==='repository'&&<div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-5">The Knowledge Center does not maintain a second copy of source code. The repository remains the code source of truth; this record exists so system questions can point to the real implementation.</div>}
          </> : <div className="py-12 text-center text-sm text-muted-foreground">Search for a system concept or repository filename to inspect its details here.</div>}
        </div>
        {manifest&&<div className="border-t p-4"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Live system facts</div><div className="grid grid-cols-2 gap-2 mt-3 text-xs"><div className="rounded-lg bg-muted p-2">Recovery points<br/><b>{manifest.recovery?.recoveryPointCount ?? 0}</b></div><div className="rounded-lg bg-muted p-2">Last good<br/><b>{manifest.recovery?.latestGoodRecoveryPoint ? 'Available' : 'None yet'}</b></div><div className="rounded-lg bg-muted p-2">DB<br/><b>{manifest.database?.connected?'MongoDB connected':'JSON fallback / offline'}</b></div><div className="rounded-lg bg-muted p-2">Repo files<br/><b>{manifest.repository?.filesIndexed||0}</b></div><div className="rounded-lg bg-muted p-2">Password recovery<br/><b>{manifest.recovery?.passwordRecoveryOutsidePanel?'Available':'Not available'}</b></div><div className="rounded-lg bg-muted p-2">Recovery tooling<br/><b>{manifest.recovery?.recoveryTooling?'Available':'Missing'}</b></div><div className="rounded-lg bg-muted p-2">External backup<br/><b>{manifest.recovery?.secondaryDestinationConfigured?'Configured':'Not configured'}</b></div></div></div>}
      </aside>
    </div>
  </div>;
}
