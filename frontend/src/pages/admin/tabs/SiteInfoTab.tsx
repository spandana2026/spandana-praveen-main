import { Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard, Field } from "./shared";
import type { SiteSettings } from "../types";

interface Props {
  settings: SiteSettings;
  updateSettings: (path: (string | number)[], val: unknown) => void;
  saving: boolean;
  onSave: () => void;
}

export default function SiteInfoTab({ settings, updateSettings, saving, onSave }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold">Global Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Only settings that are genuinely site-wide and do not belong to another module.</p>
        </div>
        <Button className="rounded-full gap-2" onClick={onSave} disabled={saving}>{saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Draft</>}</Button>
      </div>

      <SectionCard title="Organisation Information" description="Canonical contact details available across the site. Content modules should reference these values instead of maintaining their own copies.">
        <Field label="Organisation Email Address"><Input type="email" value={settings.contact?.email ?? ""} onChange={(e) => updateSettings(["contact", "email"], e.target.value)} placeholder="spandanacareaidfoundation@gmail.com" /></Field>
        <Field label="Primary Phone Number"><Input value={settings.contact?.phone ?? ""} onChange={(e) => updateSettings(["contact", "phone"], e.target.value)} placeholder="+91 98765 43210" /></Field>
        <Field label="Office / Mailing Address"><Textarea value={settings.contact?.address ?? ""} onChange={(e) => updateSettings(["contact", "address"], e.target.value)} className="min-h-[90px] resize-none" placeholder="Spandana Care Aid Foundation, Vijayawada, Andhra Pradesh" /></Field>
      </SectionCard>

      <SectionCard title="Content Protection" description="Global site-protection behaviour. Security-specific administration can later move into the System area without changing this setting's purpose.">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
          <input type="checkbox" id="contentProtectionEnabled" checked={settings.contentProtection !== false} onChange={(e) => updateSettings(["contentProtection"], e.target.checked)} className="w-4 h-4 accent-primary" />
          <label htmlFor="contentProtectionEnabled" className="text-sm font-medium cursor-pointer select-none">Enable right-click &amp; copy protection</label>
        </div>
      </SectionCard>
    </div>
  );
}
