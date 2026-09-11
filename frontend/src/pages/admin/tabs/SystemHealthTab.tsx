import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, XCircle, Trash2 } from "lucide-react";

type Check = { status: "ok" | "warn" | "error"; message: string };
type Health = { status: string; timestamp: string; env: string; uptimeSeconds: number; checks: Record<string, Check>; summary: { total: number; errors: number; warnings: number }; lastError?: any };
type EventItem = { id: string; timestamp: string; area: string; type: string; code: string; message: string; requestId?: string; details?: any };

export default function SystemHealthTab({ showFeedback }: { showFeedback: (type: "success" | "error", msg: string) => void }) {
  const [health, setHealth] = useState<Health | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [h, d] = await Promise.all([
        fetch("/api/v1/admin/system/health", { credentials: "include" }),
        fetch(`/api/v1/admin/system/diagnostics${filter === "ALL" ? "" : `?type=${encodeURIComponent(filter)}`}`, { credentials: "include" }),
      ]);
      if (h.ok) setHealth(await h.json());
      if (d.ok) setEvents((await d.json()).events || []);
    } catch { showFeedback("error", "Could not load system diagnostics"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [filter]);

  async function clear() {
    const r = await fetch("/api/v1/admin/system/diagnostics", { method: "DELETE", credentials: "include" });
    if (r.ok) { setEvents([]); showFeedback("success", "Diagnostic log cleared"); }
  }

  const visible = events.filter(e => !search || `${e.code} ${e.area} ${e.message} ${e.requestId || ""}`.toLowerCase().includes(search.toLowerCase()));
  const iconFor = (s: string) => s === "ok" ? <CheckCircle2 size={18} className="text-emerald-600" /> : s === "warn" ? <AlertTriangle size={18} className="text-amber-600" /> : <XCircle size={18} className="text-red-600" />;

  return <div className="space-y-6 max-w-6xl">
    <div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-bold">System Health</h2><p className="text-sm text-muted-foreground mt-1">A single place to see what is running, what is failing, and what happened most recently.</p></div><button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold"> <RefreshCw size={15} className={loading ? "animate-spin" : ""}/> Refresh</button></div>
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{health && Object.entries(health.checks).map(([key, c]) => <div key={key} className="rounded-2xl border border-border bg-card p-4"><div className="flex items-center gap-2 mb-2">{iconFor(c.status)}<span className="font-semibold capitalize">{key}</span></div><p className="text-xs text-muted-foreground">{c.message}</p></div>)}</section>
    <section className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between mb-4"><div><h3 className="font-bold">Diagnostics</h3><p className="text-xs text-muted-foreground">Recent frontend/backend/database/media events.</p></div><button onClick={clear} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs"><Trash2 size={13}/> Clear log</button></div>
      <div className="flex flex-wrap gap-2 mb-4"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search errors, codes, request IDs…" className="flex-1 min-w-[240px] rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />{["ALL","ERROR","WARN","INFO"].map(x=><button key={x} onClick={()=>setFilter(x)} className={`rounded-xl px-3 py-2 text-xs border ${filter===x?"bg-primary text-white border-primary":"border-border text-muted-foreground"}`}>{x}</button>)}</div>
      <div className="space-y-2">{visible.length ? visible.map(e=><details key={e.id} className="rounded-xl border border-border p-3"><summary className="cursor-pointer list-none"><div className="flex flex-wrap items-center gap-3"><span className="text-[11px] text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</span><span className="font-mono text-xs font-semibold">{e.code}</span><span className="text-xs uppercase tracking-wide text-muted-foreground">{e.area}</span><span className={e.type==="ERROR"?"text-red-600":e.type==="WARN"?"text-amber-600":"text-emerald-600"}>{e.message}</span></div></summary><div className="mt-3 text-xs space-y-1 text-muted-foreground">{e.requestId&&<div>Request ID: <span className="font-mono">{e.requestId}</span></div>}{e.details&&<pre className="overflow-auto rounded-lg bg-muted/40 p-3">{JSON.stringify(e.details,null,2)}</pre>}</div></details>) : <p className="text-sm text-muted-foreground py-6 text-center">No matching diagnostic events.</p>}</div>
    </section>
    {health?.lastError && <section className="rounded-2xl border border-red-200 bg-red-50 p-5"><h3 className="font-bold text-red-900">Last error</h3><p className="text-sm text-red-800 mt-1">{health.lastError.code}: {health.lastError.message}</p></section>}
  </div>;
}
