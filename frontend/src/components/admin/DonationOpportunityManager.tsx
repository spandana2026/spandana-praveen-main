import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Save, X, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SectionCard, Field } from "@/pages/admin/tabs/shared";
import { donationOpportunitiesService } from "@/services/donationOpportunitiesService.js";

import type { DonationOpportunity } from "@/services/donationTypes";

type FormState = Omit<DonationOpportunity, "id">;

const EMPTY: FormState = {
  title: "",
  description: "",
  icon: "❤️",
  type: "fixed",
  geography: "both",
  pricing: {
    INR: { presets: [500, 1000, 2500], monthlyPresets: [500, 1000, 2500], unitCost: null, unitName: "" },
    USD: { presets: [6, 12, 30], monthlyPresets: [6, 12, 30], unitCost: null, unitName: "" },
  },
  quantityPresets: [1, 2, 5, 10],
  targetQuantity: null,
  targetAmountINR: null,
  targetAmountUSD: null,
  impactText: "",
  active: true,
  published: true,
  order: 0,
};

function normalizeItem(item: DonationOpportunity): FormState {
  return {
    title: item.title ?? "",
    description: item.description ?? "",
    icon: item.icon ?? "❤️",
    type: item.type === "unit" ? "unit" : "fixed",
    geography: item.geography ?? "both",
    pricing: {
      INR: {
        presets: item.pricing?.INR?.presets ?? [],
        monthlyPresets: item.pricing?.INR?.monthlyPresets ?? [],
        unitCost: item.pricing?.INR?.unitCost ?? null,
        unitName: item.pricing?.INR?.unitName ?? "",
      },
      USD: {
        presets: item.pricing?.USD?.presets ?? [],
        monthlyPresets: item.pricing?.USD?.monthlyPresets ?? [],
        unitCost: item.pricing?.USD?.unitCost ?? null,
        unitName: item.pricing?.USD?.unitName ?? "",
      },
    },
    quantityPresets: item.quantityPresets ?? [],
    targetQuantity: item.targetQuantity ?? null,
    targetAmountINR: item.targetAmountINR ?? null,
    targetAmountUSD: item.targetAmountUSD ?? null,
    impactText: item.impactText ?? "",
    active: item.active !== false,
    published: item.published !== false,
    order: Number(item.order) || 0,
  };
}

function parseList(value: string): number[] {
  return value.split(",").map(v => Number(v.trim())).filter(v => Number.isFinite(v) && v > 0);
}

function fieldNumbers(values?: number[]) {
  return (values ?? []).join(", ");
}

export default function DonationOpportunityManager({ token, showFeedback }: { token: string; showFeedback?: (type: "success" | "error", msg: string) => void }) {
  const [items, setItems] = useState<DonationOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await donationOpportunitiesService.listAdmin();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      showFeedback?.("error", err instanceof Error ? err.message : "Could not load donation opportunities.");
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => { void load(); }, [load]);

  const sorted = useMemo(() => [...items].sort((a, b) => (a.order || 0) - (b.order || 0)), [items]);

  const startNew = () => {
    setEditing("new");
    setForm({ ...EMPTY, pricing: { INR: { presets: [500, 1000, 2500], monthlyPresets: [500, 1000, 2500] }, USD: { presets: [6, 12, 30], monthlyPresets: [6, 12, 30] } } });
  };

  const startEdit = (item: DonationOpportunity) => {
    setEditing(item.id);
    setForm(normalizeItem(item));
  };

  const update = (patch: Partial<FormState>) => setForm(prev => ({ ...prev, ...patch }));
  const updatePricing = (currency: "INR" | "USD", patch: Partial<DonationPricing>) => {
    setForm(prev => ({ ...prev, pricing: { ...prev.pricing, [currency]: { ...prev.pricing[currency], ...patch } } }));
  };

  const save = async () => {
    if (!form.title.trim()) {
      showFeedback?.("error", "Please enter a donation opportunity title.");
      return;
    }
    setSaving(true);
    try {
      if (editing === "new") {
        const created = await donationOpportunitiesService.create(form);
        setItems(prev => [...prev, created]);
        showFeedback?.("success", "Donation opportunity added.");
      } else if (editing) {
        const updated = await donationOpportunitiesService.update(editing, form);
        setItems(prev => prev.map(item => item.id === editing ? updated : item));
        showFeedback?.("success", "Donation opportunity updated.");
      }
      setEditing(null);
    } catch (err) {
      showFeedback?.("error", err instanceof Error ? err.message : "Could not save donation opportunity.");
    } finally {
      setSaving(false);
    }
  };

  const moveItem = async (id: string, direction: -1 | 1) => {
    const current = [...sorted];
    const index = current.findIndex((x) => x.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return;
    [current[index], current[nextIndex]] = [current[nextIndex], current[index]];
    try {
      const updated = await Promise.all(current.map((item, i) => donationOpportunitiesService.update(item.id, { ...normalizeItem(item), order: i + 1 })));
      setItems(updated);
      showFeedback?.("success", "Donation opportunity order updated.");
    } catch (err) {
      showFeedback?.("error", err instanceof Error ? err.message : "Could not update display order.");
      void load();
    }
  };

  const moveByDrag = async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const current = [...sorted];
    const from = current.findIndex((x) => x.id === fromId);
    const to = current.findIndex((x) => x.id === toId);
    if (from < 0 || to < 0) return;
    const [moved] = current.splice(from, 1);
    current.splice(to, 0, moved);
    try {
      const updated = await Promise.all(current.map((item, i) => donationOpportunitiesService.update(item.id, { ...normalizeItem(item), order: i + 1 })));
      setItems(updated);
      showFeedback?.("success", "Donation opportunity order updated.");
    } catch (err) {
      showFeedback?.("error", err instanceof Error ? err.message : "Could not update display order.");
      void load();
    }
  };

  const remove = async (item: DonationOpportunity) => {
    if (!window.confirm(`Remove “${item.title}” from the donation catalogue?`)) return;
    try {
      await donationOpportunitiesService.delete(item.id);
      setItems(prev => prev.filter(row => row.id !== item.id));
      showFeedback?.("success", "Donation opportunity removed.");
    } catch (err) {
      showFeedback?.("error", err instanceof Error ? err.message : "Could not remove donation opportunity.");
    }
  };

  return (
    <div id="donation-opportunities"><SectionCard title="Specific Needs / Donation Opportunities" defaultOpen={true}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold text-foreground">Admin-managed giving catalogue</p>
          <p className="text-[11px] text-muted-foreground mt-1">Add as many support opportunities as you need. Fixed amounts and unit-based giving use the same source for Donate and Your Impact.</p>
        </div>
        <Button size="sm" className="rounded-full gap-2 shrink-0" onClick={startNew}><Plus size={14} /> Add</Button>
      </div>

      {sorted.length > 0 && (
        <div className="rounded-2xl border bg-background/70 p-3 mb-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div><p className="text-xs font-semibold">Public display order</p><p className="text-[11px] text-muted-foreground">Drag an item or use ↑ ↓. Numbers update automatically.</p></div>
          </div>
          <div className="space-y-1.5">
            {sorted.map((item, index) => (
              <div key={item.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void moveByDrag(e.dataTransfer.getData("text/plain"), item.id); }} className="flex items-center gap-2 rounded-xl border bg-card px-2.5 py-2 hover:border-primary/30 transition-colors">
                <GripVertical size={15} className="text-muted-foreground shrink-0 cursor-grab" />
                <span className="w-6 text-center text-[11px] font-bold text-primary">{index + 1}</span>
                <span className="text-base">{item.icon || "♥"}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title}</span>
                <Button type="button" size="icon" variant="ghost" className="h-7 w-7 rounded-lg" disabled={index===0} onClick={() => void moveItem(item.id,-1)}><ChevronUp size={14}/></Button>
                <Button type="button" size="icon" variant="ghost" className="h-7 w-7 rounded-lg" disabled={index===sorted.length-1} onClick={() => void moveItem(item.id,1)}><ChevronDown size={14}/></Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editing && (
        <div className="border border-violet-200 bg-violet-50/50 rounded-2xl p-4 mb-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{editing === "new" ? "New donation opportunity" : "Edit donation opportunity"}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">This record is the source used by the public Donate page and Your Impact.</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setEditing(null)}><X size={16} /></Button>
          </div>

          <div className="grid grid-cols-[64px_1fr] gap-3">
            <Field label="Icon"><Input value={form.icon} onChange={e => update({ icon: e.target.value })} className="text-center text-xl" /></Field>
            <Field label="Title"><Input value={form.title} onChange={e => update({ title: e.target.value })} placeholder="Sponsor a School Kit" /></Field>
          </div>
          <Field label="Short Description"><Textarea value={form.description} onChange={e => update({ description: e.target.value })} rows={2} placeholder="What the donor is helping support" /></Field>
          <Field label="Impact Message"><Textarea value={form.impactText ?? ""} onChange={e => update({ impactText: e.target.value })} rows={2} placeholder="Shown in Your Impact when this opportunity is selected" /></Field>

          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Type">
              <select value={form.type} onChange={e => update({ type: e.target.value as FormState["type"] })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="fixed">Fixed Amount</option>
                <option value="unit">Unit Based</option>
              </select>
            </Field>
            <Field label="Catalogue">
              <select value={form.geography} onChange={e => update({ geography: e.target.value as FormState["geography"] })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="india">India</option>
                <option value="international">International</option>
                <option value="both">Both</option>
              </select>
            </Field>
            <Field label="Display Order"><Input type="number" value={form.order} onChange={e => update({ order: Number(e.target.value) || 0 })} /></Field>
          </div>

          {form.type === "fixed" ? (
            <div className="grid md:grid-cols-2 gap-3">
              <div className="border border-border rounded-xl p-3 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">🇮🇳 India · INR</p>
                <Field label="One-time preset amounts"><Input value={fieldNumbers(form.pricing.INR?.presets)} onChange={e => updatePricing("INR", { presets: parseList(e.target.value) })} placeholder="500, 1000, 2500" /></Field><Field label="Monthly preset amounts"><Input value={fieldNumbers(form.pricing.INR?.monthlyPresets)} onChange={e => updatePricing("INR", { monthlyPresets: parseList(e.target.value) })} placeholder="500, 1000, 2500" /></Field>
              </div>
              <div className="border border-border rounded-xl p-3 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">🌍 International · USD</p>
                <Field label="One-time preset amounts"><Input value={fieldNumbers(form.pricing.USD?.presets)} onChange={e => updatePricing("USD", { presets: parseList(e.target.value) })} placeholder="6, 12, 30" /></Field><Field label="Monthly preset amounts"><Input value={fieldNumbers(form.pricing.USD?.monthlyPresets)} onChange={e => updatePricing("USD", { monthlyPresets: parseList(e.target.value) })} placeholder="6, 12, 30" /></Field>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="border border-border rounded-xl p-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">🇮🇳 India · INR</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Cost / unit"><Input type="number" min="0" value={form.pricing.INR?.unitCost ?? ""} onChange={e => updatePricing("INR", { unitCost: Number(e.target.value) || null })} /></Field>
                    <Field label="Unit name"><Input value={form.pricing.INR?.unitName ?? ""} onChange={e => updatePricing("INR", { unitName: e.target.value })} placeholder="bicycle" /></Field>
                  </div>
                </div>
                <div className="border border-border rounded-xl p-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">🌍 International · USD</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Cost / unit"><Input type="number" min="0" value={form.pricing.USD?.unitCost ?? ""} onChange={e => updatePricing("USD", { unitCost: Number(e.target.value) || null })} /></Field>
                    <Field label="Unit name"><Input value={form.pricing.USD?.unitName ?? ""} onChange={e => updatePricing("USD", { unitName: e.target.value })} placeholder="item" /></Field>
                  </div>
                </div>
              </div>
              <Field label="Quantity buttons"><Input value={fieldNumbers(form.quantityPresets)} onChange={e => update({ quantityPresets: parseList(e.target.value).map(Math.round) })} placeholder="1, 2, 5, 10" /></Field>
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Target quantity"><Input type="number" min="0" value={form.targetQuantity ?? ""} onChange={e => update({ targetQuantity: Number(e.target.value) || null })} /></Field>
                <Field label="Target amount · INR"><Input type="number" min="0" value={form.targetAmountINR ?? ""} onChange={e => update({ targetAmountINR: Number(e.target.value) || null })} /></Field>
                <Field label="Target amount · USD"><Input type="number" min="0" value={form.targetAmountUSD ?? ""} onChange={e => update({ targetAmountUSD: Number(e.target.value) || null })} /></Field>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/70">
            <div className="flex items-center gap-2 text-xs"><Switch checked={form.active} onCheckedChange={v => update({ active: v })} /> Active</div>
            <div className="flex items-center gap-2 text-xs"><Switch checked={form.published} onCheckedChange={v => update({ published: v })} /> Published</div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" className="rounded-full" onClick={() => setEditing(null)}>Cancel</Button>
              <Button className="rounded-full gap-2" onClick={save} disabled={saving}>{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save</Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-10 flex justify-center text-muted-foreground"><Loader2 className="animate-spin" size={20} /></div>
      ) : sorted.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-border rounded-2xl">
          <p className="text-sm font-medium">No donation opportunities yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add the first one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background">
              <GripVertical size={15} className="text-muted-foreground/40 shrink-0" />
              <span className="text-lg shrink-0">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{item.title}</p>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full">{item.type === "unit" ? "Unit" : "Fixed"}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{item.geography}</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {item.published ? <Eye size={14} className="text-emerald-600" /> : <EyeOff size={14} className="text-muted-foreground" />}
                {item.active ? <span className="text-[9px] text-emerald-700">Active</span> : <span className="text-[9px] text-muted-foreground">Off</span>}
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => startEdit(item)} aria-label={`Edit ${item.title}`}><Pencil size={14} /></Button>
              <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:text-destructive" onClick={() => void remove(item)} aria-label={`Delete ${item.title}`}><Trash2 size={14} /></Button>
            </div>
          ))}
        </div>
      )}
    </SectionCard></div>
  );
}
