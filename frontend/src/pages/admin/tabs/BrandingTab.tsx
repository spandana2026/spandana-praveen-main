import { Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard, Field } from "./shared";
import MediaLibraryPicker from "@/components/admin/MediaLibraryPicker";
import type { SiteSettings } from "../types";

interface Props {
  settings: SiteSettings;
  updateSettings: (path: (string | number)[], val: unknown) => void;
  token: string;
  saving: boolean;
  onSave: () => void;
  showFeedback: (type: "success" | "error", msg: string) => void;
}

export default function BrandingTab({ settings, updateSettings, token, saving, onSave, showFeedback }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-serif font-bold">Branding</h2><p className="text-sm text-muted-foreground mt-1">Organisation identity, logos and brand presentation defaults</p></div>
        <Button className="rounded-full gap-2" onClick={onSave} disabled={saving}>{saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Draft</>}</Button>
      </div>

      <SectionCard title="Branding & Logo">
        <Field label="Primary Logo (Navigation & Emails)">
          {settings.branding?.logoUrl && (
            <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-xl border border-border mb-2">
              <img src={settings.branding.logoUrl} alt="Logo" className="w-14 h-14 object-contain rounded-lg border border-border bg-white p-1" />
              <div className="flex-1 min-w-0"><p className="text-xs font-medium">Logo uploaded</p><p className="text-[10px] text-muted-foreground">PNG with transparent background recommended</p></div>
              <Button type="button" variant="outline" size="sm" className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10 text-xs" onClick={() => updateSettings(["branding", "logoUrl"], "")}>Remove</Button>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="file" accept="image/png,image/svg+xml,image/webp" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              const form = new FormData(); form.append("file", file);
              try {
                const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
                const data = await res.json() as { url?: string; error?: string };
                if (data.url) { updateSettings(["branding", "logoUrl"], data.url); showFeedback("success", "Logo uploaded!"); }
                else showFeedback("error", data.error ?? "Upload failed");
              } catch { showFeedback("error", "Upload failed"); }
            }} />
            <span className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/50 rounded-xl py-3 text-sm text-muted-foreground hover:text-primary transition-colors bg-muted/20">
              <Upload size={15} /> {settings.branding?.logoUrl ? "Replace Logo" : "Upload Logo (PNG or SVG)"}
            </span>
          </label>
          <MediaLibraryPicker token={token} value={settings.branding?.logoUrl} accept="image" onSelect={(url) => updateSettings(["branding", "logoUrl"], url)} description="or select an existing brand asset" />
          <p className="text-[11px] text-muted-foreground">Used in navigation, footer, and email templates. PNG with transparent background preferred.</p>
        </Field>

        <Field label="White Logo (for dark backgrounds — footer, banners)">
          {settings.branding?.logoUrlWhite && (
            <div className="flex items-center gap-3 p-2 bg-[#0a0f1e] rounded-xl border border-border mb-2">
              <img src={settings.branding.logoUrlWhite} alt="White Logo" className="w-14 h-14 object-contain rounded-lg p-1" />
              <div className="flex-1 min-w-0"><p className="text-xs font-medium text-white/70">White logo uploaded</p><p className="text-[10px] text-white/40">Used in the footer and dark-background areas</p></div>
              <Button type="button" variant="outline" size="sm" className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10 text-xs" onClick={() => updateSettings(["branding", "logoUrlWhite"], "")}>Remove</Button>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="file" accept="image/png,image/svg+xml,image/webp" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              const form = new FormData(); form.append("file", file);
              try {
                const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
                const data = await res.json() as { url?: string; error?: string };
                if (data.url) { updateSettings(["branding", "logoUrlWhite"], data.url); showFeedback("success", "White logo uploaded!"); }
                else showFeedback("error", data.error ?? "Upload failed");
              } catch { showFeedback("error", "Upload failed"); }
            }} />
            <span className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/50 rounded-xl py-3 text-sm text-muted-foreground hover:text-primary transition-colors bg-muted/20">
              <Upload size={15} /> {settings.branding?.logoUrlWhite ? "Replace White Logo" : "Upload White Logo (PNG or SVG)"}
            </span>
          </label>
          <MediaLibraryPicker token={token} value={settings.branding?.logoUrlWhite} accept="image" onSelect={(url) => updateSettings(["branding", "logoUrlWhite"], url)} description="or select an existing white logo" />
          <p className="text-[11px] text-muted-foreground">If not uploaded, the primary logo is used as fallback.</p>
        </Field>

        <Field label="Logo Scale">
          <div className="flex items-center gap-4">
            <input type="range" min={0.5} max={2.0} step={0.05} value={settings.branding?.logoScale ?? 1} onChange={(e) => updateSettings(["branding", "logoScale"], parseFloat(e.target.value))} className="flex-1 accent-primary h-2 cursor-pointer" />
            <span className="text-sm font-mono font-bold text-primary w-12 text-right shrink-0">{(settings.branding?.logoScale ?? 1).toFixed(2)}×</span>
          </div>
        </Field>

        <Field label="Logo Alignment (Header)">
          <div className="grid grid-cols-3 gap-2">
            {(["left", "center", "right"] as const).map((pos) => (
              <button key={pos} type="button" onClick={() => updateSettings(["branding", "logoPosition"], pos)} className={`h-10 rounded-xl border text-xs font-semibold capitalize flex items-center justify-center gap-1.5 transition-all ${(settings.branding?.logoPosition ?? "left") === pos ? "bg-primary text-white border-primary shadow-sm" : "border-border bg-background hover:border-primary/40"}`}>
                {pos === "left" && "← Left"}{pos === "center" && "• Center"}{pos === "right" && "Right →"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Organisation Tagline">
          <Input value={settings.branding?.tagline ?? ""} onChange={(e) => updateSettings(["branding", "tagline"], e.target.value)} placeholder="Building Communities through Social Architecture." />
        </Field>
      </SectionCard>
    </div>
  );
}
