import { Globe, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard, Field } from "./shared";
import type { SiteSettings } from "../types";

interface Props {
  settings: SiteSettings;
  updateSettings: (path: (string | number)[], val: unknown) => void;
  saving: boolean;
  onSave: () => void;
}

export default function SocialMediaTab({ settings, updateSettings, saving, onSave }: Props) {
  const platforms = [
    ["facebook", "Facebook"], ["instagram", "Instagram"], ["twitter", "Twitter / X"], ["youtube", "YouTube"], ["linkedin", "LinkedIn"],
  ] as const;
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-serif font-bold">Social Media</h2><p className="text-sm text-muted-foreground mt-1">Canonical social profiles used across the site</p></div>
        <Button className="rounded-full gap-2" onClick={onSave} disabled={saving}>{saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Draft</>}</Button>
      </div>
      <SectionCard title="Social Media Links" description="These links are the canonical organisation profiles. Presentation areas should reference them rather than maintain copies.">
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground"><Globe size={14} /> Leave a platform blank when the organisation does not use it.</div>
        {platforms.map(([key, label]) => (
          <Field key={key} label={label}>
            <Input value={settings.social?.[key] ?? ""} onChange={(e) => updateSettings(["social", key], e.target.value)} placeholder={`https://${key === "twitter" ? "x" : key}.com/...`} />
          </Field>
        ))}
      </SectionCard>
    </div>
  );
}
