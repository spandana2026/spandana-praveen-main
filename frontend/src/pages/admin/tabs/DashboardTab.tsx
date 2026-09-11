// Auto-extracted from admin.tsx — DashboardTab
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SectionCard } from "./shared";
import type { SiteSettings } from "../types";
import {
  Save, Loader2, Plus, Trash2, Pencil, X, Eye, EyeOff,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Upload, Download, RefreshCw, ExternalLink, Lock, KeyRound,
  UserCheck, UserX, UserPlus, CalendarDays, MapPin, Clock,
  Send, History, Megaphone, Image, Globe, DollarSign, Mail,
  Star, FileText, FolderOpen, UsersRound,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch }   from "@/components/ui/switch";

interface StatusData {
  status: string;
  env: string;
  timestamp: string;
  storage: {
    mongo: {
      configured: boolean;
      connected: boolean;
      mode: "mongodb" | "json-fallback";
      readyState: number;
    };
  };
}

interface Props {
  token: string;
  settings: SiteSettings;
  updateSettings: (path: (string | number)[], val: unknown) => void;
  onSave: () => void;
  saving: boolean;
}

const QUICK_LINK_DESTINATIONS = [
  ["dashboard", "Dashboard"], ["siteinfo", "Site Settings"], ["navigation", "Main Menu / Navigation"],
  ["branding", "Branding"], ["social-media", "Social Media"], ["theme", "Theme & Fonts"], ["hero", "Hero"],
  ["vision", "Vision / Featured Spotlight"], ["programs", "Core Programs"], ["sahara", "Sahara Community Centers"],
  ["emergency-aid", "Emergency Aid & Relief"], ["events", "Events"], ["blog", "Blog"], ["get-involved", "Get Involved"],
  ["donate", "Donate"], ["volunteer-apps", "Volunteer Applications"], ["volunteers", "Volunteers"],
  ["footer", "Footer"], ["seo", "SEO"], ["ads", "Ad Banners"], ["fun-zone", "Joy Zone"], ["shop", "Shop & NEENAS"],
  ["gallery", "Media Library"], ["page-builder", "Page Builder"],
] as const;

export default function DashboardTab({ token, settings, updateSettings, onSave, saving }: Props) {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [editingQuickLink, setEditingQuickLink] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/status")
      .then((r) => r.json())
      .then((d: StatusData) => { setStatus(d); setLoadingStatus(false); })
      .catch(() => { setStatusError("Could not reach the API server."); setLoadingStatus(false); });
  }, []);

  const mongo = status?.storage?.mongo;
  const isConnected = !!mongo?.configured && !!mongo?.connected;
  const isFallback = mongo?.mode === "json-fallback";

  return (
    <div className="space-y-6">
      <SectionCard title="System Status">
        {loadingStatus && (
          <p className="text-sm text-gray-500 py-2">Checking status…</p>
        )}
        {statusError && (
          <p className="text-sm text-red-600 py-2">{statusError}</p>
        )}
        {status && (
          <div className="space-y-4">
            {/* DB status */}
            <div className={`rounded-lg border p-4 ${isConnected ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-block w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-amber-400"}`} />
                <span className="font-semibold text-sm">
                  {isConnected ? "MongoDB Connected" : "Dev Mode — JSON File Storage"}
                </span>
              </div>
              {isFallback && (
                <div className="text-xs text-amber-800 space-y-1">
                  <p>{mongo?.configured ? "MONGO_URI is set but the connection could not be established." : "No MONGO_URI is configured."} All data is saved to local JSON files in <code className="bg-amber-100 px-1 rounded">backend/data/</code>.</p>
                  <p className="font-medium mt-2">To connect MongoDB:</p>
                  <ol className="list-decimal list-inside space-y-0.5 pl-1">
                    <li>Set <code className="bg-amber-100 px-1 rounded">MONGO_URI</code> in <code className="bg-amber-100 px-1 rounded">backend/.env</code>.</li>
                    <li>If using MongoDB Atlas, allow-list your server's IP under Network Access.</li>
                    <li>Restart the backend server.</li>
                    <li>Return here — the status badge will turn green.</li>
                  </ol>
                </div>
              )}
              {isConnected && (
                <p className="text-xs text-green-800">MongoDB is connected. All reads/writes use the live database.</p>
              )}
            </div>

            {/* Environment row */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <span><strong>Environment:</strong> {status.env}</span>
              <span><strong>API Status:</strong> {status.status}</span>
              <span><strong>Last checked:</strong> {new Date(status.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Quick Links">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Shortcuts to existing Admin modules. They do not own or duplicate content.</p>
          </div>
          <button
            type="button"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-bold hover:opacity-90"
            onClick={() => {
              const current = [...(settings.quickLinks ?? [])];
              const item = { id: `quick-${Date.now()}`, label: "New Quick Link", tab: "dashboard", enabled: true };
              updateSettings(["quickLinks"], [...current, item]);
            }}
          >
            <Plus size={13} /> Add Quick Link
          </button>
        </div>

        <div className="space-y-2">
          {(settings.quickLinks ?? []).map((item, index, arr) => (
            <div key={item.id} className={`rounded-xl border p-3 ${item.enabled === false ? "opacity-60 bg-muted/30" : "bg-background"}`}>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" title="Move up" disabled={index === 0} onClick={() => { const a=[...arr]; [a[index-1],a[index]]=[a[index],a[index-1]]; updateSettings(["quickLinks"],a); }} className="h-8 w-8 rounded-lg border border-border disabled:opacity-30"><ChevronUp size={13}/></button>
                  <button type="button" title="Move down" disabled={index === arr.length-1} onClick={() => { const a=[...arr]; [a[index+1],a[index]]=[a[index],a[index+1]]; updateSettings(["quickLinks"],a); }} className="h-8 w-8 rounded-lg border border-border disabled:opacity-30"><ChevronDown size={13}/></button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.label || "Untitled Quick Link"}</p>
                  <p className="text-[11px] text-muted-foreground truncate">/admin/{item.tab}</p>
                </div>
                <button type="button" className="h-8 px-3 rounded-lg border border-border text-xs font-semibold hover:bg-muted" onClick={() => navigate(`/admin/${item.tab}`)} title="Open Admin destination"><ExternalLink size={13} className="inline mr-1"/>Open</button>
                <button type="button" className="h-8 px-3 rounded-lg border border-border text-xs font-semibold hover:bg-muted" onClick={() => setEditingQuickLink(editingQuickLink === item.id ? null : item.id)}>{editingQuickLink === item.id ? <><X size={13} className="inline mr-1"/>Close</> : <><Pencil size={13} className="inline mr-1"/>Edit</>}</button>
                <button type="button" className="h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-foreground" onClick={() => { const a=[...arr]; a[index]={...a[index],enabled:a[index].enabled===false}; updateSettings(["quickLinks"],a); }} title={item.enabled===false?"Show":"Hide"}>{item.enabled===false?<EyeOff size={13}/>:<Eye size={13}/>}</button>
                <button type="button" className="h-8 w-8 rounded-lg border border-border text-destructive hover:bg-destructive/10" onClick={() => { const a=arr.filter((_,i)=>i!==index); updateSettings(["quickLinks"],a); }} title="Remove"><Trash2 size={13}/></button>
              </div>
              {editingQuickLink === item.id && (
                <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Label</label>
                    <Input value={item.label} onChange={(e) => { const a=[...arr]; a[index]={...a[index],label:e.target.value}; updateSettings(["quickLinks"],a); }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Admin Destination</label>
                    <select value={item.tab} onChange={(e) => { const a=[...arr]; a[index]={...a[index],tab:e.target.value}; updateSettings(["quickLinks"],a); }} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                      {QUICK_LINK_DESTINATIONS.map(([value,label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <Button type="button" className="rounded-full gap-2" onClick={onSave} disabled={saving}>{saving ? <><Loader2 size={14} className="animate-spin"/>Saving...</> : <><Save size={14}/>Save Quick Links</>}</Button>
        </div>
      </SectionCard>
    </div>
  );
}



