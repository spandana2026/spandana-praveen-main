import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Loader2, Plus, Trash2, Pencil, X, Eye, EyeOff,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Upload, Download, RefreshCw, ExternalLink, Lock, KeyRound,
  UserCheck, UserX, UserPlus, CalendarDays, MapPin, Clock,
  Send, History, Megaphone, Image, Globe, Gamepad2,
  ToggleLeft, ToggleRight, DollarSign, Mail, Sheet,
  Star, Building2, Navigation, UsersRound, FileText, FolderOpen,
} from "lucide-react";
import MediaLibraryPicker from "@/components/admin/MediaLibraryPicker";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch }   from "@/components/ui/switch";
import { SectionCard, Field, Label, DeviceTabs, VisibilityToggleRow } from "./shared";
import type { SiteSettings } from "./types";
import RichTextEditor from "@/components/admin/RichTextEditor";
import DonationOpportunityManager from "@/components/admin/DonationOpportunityManager";
import SupportAdminPanel from "@/components/admin/SupportAdminPanel";

interface Props {
  settings: SiteSettings;
  updateSettings: (path: (string | number)[], val: unknown) => void;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings | null>>;
  token: string;
  saving: boolean;
  onSave: () => void;
  showFeedback: (type: "success" | "error", msg: string) => void;
}

export default function DonateTab({ settings, updateSettings, setSettings, token, saving, onSave, showFeedback }: Props) {
  const d = settings.donatePage?.design ?? {};
  const setD = (key: string, value: unknown) => updateSettings(["donatePage", "design", key], value);
  const Toggle = ({ label, description, value, onChange }: { label: string; description?: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 px-3 py-3">
      <div><p className="text-sm font-semibold">{label}</p>{description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}</div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl font-serif font-bold">Donate Page</h2>
          <p className="text-sm text-muted-foreground mt-1">One frozen public layout, with every section managed from Admin. No visual/canvas editor.</p>
        </div>
        <div className="flex gap-2">
          <a href="/donate?preview=india" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold"><Eye size={15}/> Preview</a>
          <Button className="rounded-full gap-2" onClick={onSave} disabled={saving}>{saving ? <><Loader2 size={14} className="animate-spin"/>Saving…</> : <><Save size={14}/>Save Changes</>}</Button>
        </div>
      </div>

      <SectionCard title="Frozen Donate Page Layout" defaultOpen>
        <div className="rounded-2xl border border-[#D8E5F5] bg-[#F7FBFF] p-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#087CF0]">Layout locked</p>
          <p className="text-sm font-semibold mt-1">Hero → Physical Care + Mental Care → Featured Campaigns → Specific Needs → Make a Donation → Our Impact → Final CTA</p>
          <p className="text-[11px] text-muted-foreground mt-1">The structure and visual design stay fixed. The controls below change content, visibility and data selection only.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <Toggle label="Physical + Mental pathways" description="Keep the two giving pathways visible." value={d.showPathways !== false} onChange={v=>setD("showPathways",v)} />
          <Toggle label="Featured Campaigns" description="Show up to 3 published active campaigns marked Featured." value={d.showCampaigns !== false} onChange={v=>setD("showCampaigns",v)} />
          <Toggle label="Specific Needs" description="Show up to 4 published Donation Opportunities as Specific Needs." value={d.showRequirements !== false} onChange={v=>setD("showRequirements",v)} />
          <Toggle label="Make a Donation" description="Use the selected Specific Needs as the donation source." value={d.showDonation !== false} onChange={v=>setD("showDonation",v)} />
          <Toggle label="Our Impact" description="Show live catalogue/pathway counts or configured values." value={d.showImpact !== false} onChange={v=>setD("showImpact",v)} />
          <Toggle label="Final CTA" description="Show the closing Donate call-to-action." value={d.showFinalCta !== false} onChange={v=>setD("showFinalCta",v)} />
        </div>
      </SectionCard>

      <SectionCard title="1 · Hero — Give Hope / Build Brighter Tomorrows" defaultOpen>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Hero eyebrow"><Input value={d.heroEyebrow ?? "Together with Hope"} onChange={e=>setD("heroEyebrow",e.target.value)} /></Field>
          <Field label="Primary button"><Input value={d.heroCta ?? "Donate Now"} onChange={e=>setD("heroCta",e.target.value)} /></Field>
          <Field label="Hero line 1"><Input value={d.heroLine1 ?? "Give Hope"} onChange={e=>setD("heroLine1",e.target.value)} /></Field>
          <Field label="Hero line 2"><Input value={d.heroLine2 ?? "Build Brighter"} onChange={e=>setD("heroLine2",e.target.value)} /></Field>
          <Field label="Hero line 3"><Input value={d.heroLine3 ?? "Tomorrows"} onChange={e=>setD("heroLine3",e.target.value)} /></Field>
          <Field label="Hero side message"><Textarea value={d.heroSideText ?? "A kinder\ntomorrow\nis possible"} onChange={e=>setD("heroSideText",e.target.value)} rows={3}/></Field>
          <Field label="Hero brush message"><Textarea value={d.heroBrushText ?? "Small acts.\nBig change."} onChange={e=>setD("heroBrushText",e.target.value)} rows={2}/></Field>
          <Field label="Secondary button"><Input value={d.heroSecondaryCta ?? "See Our Impact"} onChange={e=>setD("heroSecondaryCta",e.target.value)} /></Field>
          <Field label="Hero image URL"><Input value={d.heroImage ?? "/images/hero-indian.png"} onChange={e=>setD("heroImage",e.target.value)} /></Field>
          <Field label="Hero benefit 1"><Input value={d.heroBenefit1 ?? "Healthier\nCommunities"} onChange={e=>setD("heroBenefit1",e.target.value)} /></Field>
          <Field label="Hero benefit 2"><Input value={d.heroBenefit2 ?? "Brighter\nFutures"} onChange={e=>setD("heroBenefit2",e.target.value)} /></Field>
          <Field label="Hero benefit 3"><Input value={d.heroBenefit3 ?? "Stronger\nFamilies"} onChange={e=>setD("heroBenefit3",e.target.value)} /></Field>
          <Field label="Hero benefit 4"><Input value={d.heroBenefit4 ?? "A Kinder\nTomorrow"} onChange={e=>setD("heroBenefit4",e.target.value)} /></Field>
        </div>
        <div className="mt-3"><MediaLibraryPicker token={token} value={d.heroImage ?? "/images/hero-indian.png"} accept="image" onSelect={url=>setD("heroImage",url)} description="Use the Indian Spandana image; this is the default little-girl image." /></div>
        <div className="mt-4 rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold">Main heading</p>
          <p className="text-sm mt-1">The frozen visual heading remains <strong>Give Hope / Build Brighter / Tomorrows</strong>. The supporting paragraph comes from Page Header below.</p>
        </div>
      </SectionCard>

      <SectionCard title="2 · Giving Pathways — Physical Care + Mental Care" defaultOpen>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#DCEBEA] p-4 bg-[#F7FCFB]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#087CF0]">Physical Care</p>
            <p className="text-sm font-semibold mt-2">Managed from Admin → Programs → Physical</p>
            <p className="text-[11px] text-muted-foreground mt-1">The Donate page uses the Physical programme title/subtitle, so changes made in Programs can flow here without duplicate entry.</p>
            <a href="/admin?tab=programs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087CF0] mt-3"><ExternalLink size={13}/> Open Programs</a>
          </div>
          <div className="rounded-2xl border border-[#D8E5F5] p-4 bg-[#F7FBFF]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#087CF0]">Mental Care</p>
            <p className="text-sm font-semibold mt-2">Managed from Admin → Programs → Mental</p>
            <p className="text-[11px] text-muted-foreground mt-1">The Donate page uses the Mental programme title/subtitle, keeping the programme system as the source of truth.</p>
            <a href="/admin?tab=programs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087CF0] mt-3"><ExternalLink size={13}/> Open Programs</a>
          </div>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <Field label="Section heading"><Input value={d.pathwaysHeading ?? "Choose Your Giving Pathway"} onChange={e=>setD("pathwaysHeading",e.target.value)} /></Field>
          <Field label="Section link label"><Input value={d.pathwaysLinkLabel ?? "Learn more about our programs"} onChange={e=>setD("pathwaysLinkLabel",e.target.value)} /></Field>
          <Field label="Physical card title"><Input value={d.physicalTitle ?? "Physical Well-being"} onChange={e=>setD("physicalTitle",e.target.value)} /></Field>
          <Field label="Mental card title"><Input value={d.mentalTitle ?? "Mental Well-being"} onChange={e=>setD("mentalTitle",e.target.value)} /></Field>
          <Field label="Physical card description"><Textarea value={d.physicalDescription ?? "Support health, nutrition and essential care for a healthier tomorrow."} onChange={e=>setD("physicalDescription",e.target.value)} rows={2}/></Field>
          <Field label="Mental card description"><Textarea value={d.mentalDescription ?? "Help provide counselling, support and safe spaces for brighter minds."} onChange={e=>setD("mentalDescription",e.target.value)} rows={2}/></Field>
          <Field label="Physical card image URL"><Input value={d.physicalImage ?? "/images/physical.png"} onChange={e=>setD("physicalImage",e.target.value)} /></Field>
          <Field label="Mental card image URL"><Input value={d.mentalImage ?? "/images/mental.png"} onChange={e=>setD("mentalImage",e.target.value)} /></Field>
          <Field label="Physical card small label"><Input value={d.physicalCta ?? ""} onChange={e=>setD("physicalCta",e.target.value)} placeholder="Optional" /></Field>
          <Field label="Mental card small label"><Input value={d.mentalCta ?? ""} onChange={e=>setD("mentalCta",e.target.value)} placeholder="Optional" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="3 · Featured Campaigns" defaultOpen>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Section heading"><Input value={d.campaignsHeading ?? "Featured Campaigns"} onChange={e=>setD("campaignsHeading",e.target.value)} /></Field>
          <Field label="Section description"><Input value={d.campaignsDescription ?? "Real stories. Real change. Be part of something bigger."} onChange={e=>setD("campaignsDescription",e.target.value)} /></Field>
          <Field label="Link label"><Input value={d.campaignsLinkLabel ?? "View all campaigns"} onChange={e=>setD("campaignsLinkLabel",e.target.value)} /></Field>
          <Field label="Cards to show"><Input value="3" readOnly /></Field>
          <Field label="Default campaign badge"><Input value={d.campaignBadge ?? "Health"} onChange={e=>setD("campaignBadge",e.target.value)} /></Field>
          <Field label="Campaign button label"><Input value={d.campaignCta ?? "Support This Campaign"} onChange={e=>setD("campaignCta",e.target.value)} /></Field>
        </div>
        <div className="mt-4 rounded-xl border border-[#D8E5F5] bg-[#F7FBFF] p-3 text-[11px] text-muted-foreground">Featured support is one combined public list of active Campaigns and public Requirements. The first 3 items in the shared display order appear here, using the same compact card format. Nothing is duplicated in Donate.</div>
        <div className="flex flex-wrap gap-4 mt-3">
          <a href="/admin/donate#overview" className="inline-flex items-center gap-2 text-xs font-semibold text-[#087CF0]"><ExternalLink size={13}/> Manage featured order</a>
          <a href="/admin/donate#campaigns" className="inline-flex items-center gap-2 text-xs font-semibold text-[#087CF0]"><ExternalLink size={13}/> Open Campaign Management</a>
        </div>
      </SectionCard>

      <SectionCard title="4 · Specific Needs" defaultOpen>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Section heading"><Input value={d.requirementsHeading ?? "Specific Needs"} onChange={e=>setD("requirementsHeading",e.target.value)} /></Field>
          <Field label="Section description"><Input value={d.requirementsDescription ?? "Support where it’s needed most right now."} onChange={e=>setD("requirementsDescription",e.target.value)} /></Field>
          <Field label="Link label"><Input value={d.requirementsLinkLabel ?? "View all needs"} onChange={e=>setD("requirementsLinkLabel",e.target.value)} /></Field>
          <Field label="Cards to show"><Input value="4" readOnly /></Field>
          <Field label="Requirement card small label"><Input value={d.requirementCta ?? ""} onChange={e=>setD("requirementCta",e.target.value)} placeholder="Optional" /></Field>
        </div>
        <div className="mt-4 rounded-xl border border-[#D8E5F5] bg-[#F7FBFF] p-3 text-[11px] text-muted-foreground">Specific Needs are the published Donation Opportunities. The Donate page uses the same catalogue, with a maximum of 4 cards.</div>
        <a href="#donation-opportunities" className="inline-flex items-center gap-2 text-xs font-semibold text-[#087CF0] mt-3"><ExternalLink size={13}/> Open Donation Opportunities</a>
      </SectionCard>

      <SectionCard title="5 · Make a Donation — Linked to Specific Needs" defaultOpen>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Section heading"><Input value={d.donationHeading ?? "Make a Donation"} onChange={e=>setD("donationHeading",e.target.value)} /></Field>
          <Field label="Section description"><Input value={d.donationDescription ?? "Every contribution, big or small, creates a meaningful impact."} onChange={e=>setD("donationDescription",e.target.value)} /></Field>
          <Field label="One-time label"><Input value={d.donationOneTimeLabel ?? "One-time"} onChange={e=>setD("donationOneTimeLabel",e.target.value)} /></Field>
          <Field label="Monthly label"><Input value={d.donationMonthlyLabel ?? "Monthly"} onChange={e=>setD("donationMonthlyLabel",e.target.value)} /></Field>
          <Field label="Other amount label"><Input value={d.donationCustomLabel ?? "Other"} onChange={e=>setD("donationCustomLabel",e.target.value)} /></Field>
          <Field label="Donation image URL"><Input value={d.donationImage ?? "/images/hero-indian.png"} onChange={e=>setD("donationImage",e.target.value)} /></Field>
          <Field label="Donation quote"><Textarea value={d.donationQuote ?? "Small acts.\nwhen done together,\nmake a big difference."} onChange={e=>setD("donationQuote",e.target.value)} rows={3}/></Field>
          <Field label="Donation quote attribution"><Input value={d.donationAttribution ?? "— Team Spandana"} onChange={e=>setD("donationAttribution",e.target.value)} /></Field>
          <Field label="Secure button label"><Input value={d.donationSecureLabel ?? "Donate Securely"} onChange={e=>setD("donationSecureLabel",e.target.value)} /></Field>
        </div>
        <div className="mt-3"><MediaLibraryPicker token={token} value={d.donationImage ?? "/images/hero-indian.png"} accept="image" onSelect={url=>setD("donationImage",url)} description="Indian/community imagery only for this section; the little-girl image is the safe default." /></div>
        <div className="mt-4 rounded-xl border border-[#D8E5F5] bg-[#F7FBFF] p-3">
          <p className="text-sm font-semibold">Single source of truth</p>
          <p className="text-[11px] text-muted-foreground mt-1">This section is linked to the Specific Needs / Donation Opportunities above. No amounts are maintained here. Each need supplies its own one-time and monthly presets; Custom Amount is donor-entered.</p>
        </div>
      </SectionCard>

      <SectionCard title="6 · Our Impact / Trust" defaultOpen>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Section heading"><Input value={d.impactHeading ?? "Our Impact"} onChange={e=>setD("impactHeading",e.target.value)} /></Field>
          <Field label="Section description"><Input value={d.impactDescription ?? "Every contribution can become an act of care."} onChange={e=>setD("impactDescription",e.target.value)} /></Field>
          <div className="md:col-span-2"><Field label="Trust / impact message"><Textarea value={d.testimonialText ?? "Every contribution is an opportunity to care, strengthen a community and build hope."} onChange={e=>setD("testimonialText",e.target.value)} rows={2}/></Field></div>
          <Field label="Attribution"><Input value={d.testimonialAttribution ?? "— Spandana Care Aid Foundation"} onChange={e=>setD("testimonialAttribution",e.target.value)} /></Field>
          <Field label="Stat 1 label"><Input value={d.impactStat1Label ?? "Lives Touched"} onChange={e=>setD("impactStat1Label",e.target.value)} /></Field>
          <Field label="Stat 2 label"><Input value={d.impactStat2Label ?? "Children Supported"} onChange={e=>setD("impactStat2Label",e.target.value)} /></Field>
          <Field label="Stat 3 label"><Input value={d.impactStat3Label ?? "Community Programs"} onChange={e=>setD("impactStat3Label",e.target.value)} /></Field>
          <Field label="Stat 4 label"><Input value={d.impactStat4Label ?? "Dedicated Volunteers"} onChange={e=>setD("impactStat4Label",e.target.value)} /></Field>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">We will only add verified impact figures here. No invented numbers or testimonials.</p>
      </SectionCard>

      <SectionCard title="7 · Final CTA" defaultOpen>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="CTA heading"><Input value={d.finalCtaHeading ?? "Let’s build a brighter, kinder tomorrow."} onChange={e=>setD("finalCtaHeading",e.target.value)} /></Field>
          <Field label="Button label"><Input value={d.finalCtaLabel ?? "Donate Now"} onChange={e=>setD("finalCtaLabel",e.target.value)} /></Field>
          <div className="md:col-span-2"><Field label="CTA text"><Textarea value={d.finalCtaText ?? "Every thoughtful act helps create stronger communities and a future built with hope."} onChange={e=>setD("finalCtaText",e.target.value)} rows={3}/></Field></div>
          <Field label="CTA image URL"><Input value={d.finalCtaImage ?? "/images/hero-indian.png"} onChange={e=>setD("finalCtaImage",e.target.value)} /></Field>
        </div>
        <div className="mt-3"><MediaLibraryPicker token={token} value={d.finalCtaImage ?? "/images/hero-indian.png"} accept="image" onSelect={url=>setD("finalCtaImage",url)} description="Default uses the same Indian Spandana visual language." /></div>
      </SectionCard>

      <SectionCard title="Page Header & Tax / 80G" defaultOpen>
        <DeviceTabs>{(view) => view === "desktop" ? (
          <div className="grid gap-4">
            <Field label="Donate page supporting heading"><Input value={settings.donatePage?.heading ?? "Give Hope"} onChange={e=>updateSettings(["donatePage","heading"],e.target.value)} /></Field>
            <RichTextEditor label="Donate page supporting paragraph" value={settings.donatePage?.subheading ?? "Your support helps us empower individuals and communities through physical and mental well-being. Together, we can create lasting change."} onChange={html=>updateSettings(["donatePage","subheading"],html)} minHeight={80} />
          </div>
        ) : (
          <div className="grid gap-4"><Field label="Heading (Mobile)"><Input value={settings.donatePage?.headingMobile ?? ""} onChange={e=>updateSettings(["donatePage","headingMobile"],e.target.value)} /></Field><RichTextEditor label="Subheading (Mobile)" value={settings.donatePage?.subheadingMobile ?? ""} onChange={html=>updateSettings(["donatePage","subheadingMobile"],html)} minHeight={70}/></div>
        )}</DeviceTabs>
        <RichTextEditor label="Tax / 80G Note" value={settings.donatePage?.taxNote ?? ""} onChange={html=>updateSettings(["donatePage","taxNote"],html)} minHeight={70} />
      </SectionCard>

              <SupportAdminPanel showFeedback={showFeedback} />
              <DonationOpportunityManager token={token} showFeedback={showFeedback} />
              <SectionCard title="UPI Payment">
                <Field label="UPI ID"><Input value={settings.upiId ?? ""} onChange={(e) => updateSettings(["upiId"], e.target.value)} placeholder="spandana@upi" /></Field>
                <Field label="UPI Account Name"><Input value={settings.upiName ?? ""} onChange={(e) => updateSettings(["upiName"], e.target.value)} placeholder="Spandana Care Aid Foundation" /></Field>
                <Field label="UPI QR Code Image">
                  <div className="flex flex-col gap-2">
                    {settings.upiQrUrl && (
                      <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-xl border border-border">
                        <img src={settings.upiQrUrl} alt="QR Code" className="w-16 h-16 object-contain rounded-lg border border-border bg-white" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">QR Code uploaded</p>
                          <p className="text-[10px] text-muted-foreground truncate">{settings.upiQrUrl}</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10 text-xs" onClick={() => updateSettings(["upiQrUrl"], "")}>Remove</Button>
                      </div>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append("file", file);
                        try {
                          const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
                          const data = await res.json() as { url?: string; error?: string };
                          if (data.url) { updateSettings(["upiQrUrl"], data.url); showFeedback("success", "QR code uploaded!"); }
                          else showFeedback("error", data.error ?? "Upload failed");
                        } catch { showFeedback("error", "Upload failed"); }
                      }} />
                      <span className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/40 rounded-xl py-3 text-sm text-muted-foreground hover:text-primary transition-colors bg-muted/20">
                        <Upload size={15} /> {settings.upiQrUrl ? "Replace QR Code" : "Upload QR Code Image"}
                      </span>
                    </label>
                        <MediaLibraryPicker token={token} value={settings.upiQrUrl} accept="image" onSelect={(url) => updateSettings(["upiQrUrl"], url)} description="or select QR from Media Library" />
                  </div>
                </Field>
                <div className="mt-4 pt-4 border-t border-border/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">UPI App Buttons (Mobile)</p>
                  <p className="text-[11px] text-muted-foreground mb-3 -mt-1">Choose which UPI apps appear as quick-tap buttons on mobile. All are shown by default.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { key: "phonepe", label: "PhonePe",  emoji: "🟣" },
                      { key: "tez",     label: "GPay",     emoji: "🔵" },
                      { key: "paytm",   label: "Paytm",    emoji: "🩵" },
                      { key: "upi",     label: "BHIM/UPI", emoji: "🟢" },
                    ] as const).map(({ key, label, emoji }) => (
                      <div key={key} className="flex items-center justify-between bg-muted/30 rounded-xl px-3 py-2 border border-border/60">
                        <span className="text-sm text-foreground">{emoji} {label}</span>
                        <Switch
                          checked={settings.donatePage?.upiApps?.[key] !== false}
                          onCheckedChange={v => updateSettings(["donatePage", "upiApps", key], v)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-3">
                  <Field label="🇮🇳 Indian Tab Label">
                    <Input
                      value={settings.donatePage?.indianTabLabel ?? ""}
                      onChange={(e) => updateSettings(["donatePage", "indianTabLabel"], e.target.value)}
                      placeholder="🇮🇳 Indian Donor"
                    />
                  </Field>
                  <Field label="🌍 International Tab Label">
                    <Input
                      value={settings.donatePage?.intlTabLabel ?? ""}
                      onChange={(e) => updateSettings(["donatePage", "intlTabLabel"], e.target.value)}
                      placeholder="🌍 International / NRI"
                    />
                  </Field>
                </div>
                <div className="mt-4 pt-4 border-t border-border/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">International Display Currencies</p>
                  <p className="text-[11px] text-muted-foreground mb-3">USD is the base configuration currency. Enable the currencies donors may use for display. INR is intentionally excluded.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[['USD','US Dollar'],['AUD','Australian Dollar'],['EUR','Euro'],['GBP','British Pound'],['CAD','Canadian Dollar'],['SGD','Singapore Dollar'],['AED','UAE Dirham']].map(([code,label]) => {
                      const enabled = settings.donatePage?.internationalCurrencies?.length ? settings.donatePage.internationalCurrencies.includes(code) : true;
                      return <div key={code} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-2"><span className="text-xs font-medium">{code}</span><Switch checked={enabled} onCheckedChange={(v) => { const current = settings.donatePage?.internationalCurrencies?.length ? settings.donatePage.internationalCurrencies : ['USD','AUD','EUR','GBP','CAD','SGD','AED']; const next = v ? Array.from(new Set([...current,code])) : current.filter(x => x !== code || code === 'USD'); updateSettings(['donatePage','internationalCurrencies'], next.includes('USD') ? next : ['USD', ...next]); }} /></div>;
                    })}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Geo Auto-Switch Tab</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Auto-select the International tab for visitors outside India</p>
                  </div>
                  <Switch
                    checked={settings.donatePage?.geoAutoSwitch !== false}
                    onCheckedChange={v => updateSettings(["donatePage", "geoAutoSwitch"], v)}
                  />
                </div>
              </SectionCard>
              <SectionCard title="Bank Transfer" defaultOpen={false}>
                <Field label="Account Name"><Input value={settings.bankAccountName ?? ""} onChange={(e) => updateSettings(["bankAccountName"], e.target.value)} placeholder="Spandana Care Aid Foundation" /></Field>
                <Field label="Account Number"><Input value={settings.bankAccountNumber ?? ""} onChange={(e) => updateSettings(["bankAccountNumber"], e.target.value)} placeholder="XXXXXXXXXXXXXXXXXX" /></Field>
                <Field label="IFSC Code"><Input value={settings.bankIfsc ?? ""} onChange={(e) => updateSettings(["bankIfsc"], e.target.value)} placeholder="SBIN0001234" /></Field>
                <Field label="Bank Name"><Input value={settings.bankName ?? ""} onChange={(e) => updateSettings(["bankName"], e.target.value)} placeholder="State Bank of India" /></Field>
                <Field label="Branch"><Input value={settings.bankBranch ?? ""} onChange={(e) => updateSettings(["bankBranch"], e.target.value)} placeholder="Hyderabad Main Branch" /></Field>
              </SectionCard>
              <SectionCard title="Online Payment Links" defaultOpen={false}>
                <p className="text-[11px] text-muted-foreground -mt-1 mb-3">Toggle each method on to show it on the donate page. Save the link even if the toggle is off — it won't appear until you enable it.</p>
                {[
                  { key: "Razorpay",  showKey: "showRazorpay",  linkKey: "razorpayLink",  ph: "https://razorpay.me/...",                    desc: "🇮🇳 Indian cards · Net banking · UPI · Wallets · International" },
                  { key: "Cashfree",  showKey: "showCashfree",  linkKey: "cashfreeLink",  ph: "https://payments.cashfree.com/forms/...",    desc: "🇮🇳 Indian & international · Cards · UPI · Net banking" },
                  { key: "PayPal",    showKey: "showPaypal",    linkKey: "paypalLink",    ph: "https://paypal.me/...",                       desc: "🌍 International & NRI donors" },
                  { key: "Stripe",    showKey: "showStripe",    linkKey: "stripeLink",    ph: "https://buy.stripe.com/...",                  desc: "🌍 International donors · USD / EUR / GBP" },
                ].map(({ key, showKey, linkKey, ph, desc }) => (
                  <div key={key} className="mb-3 rounded-xl border border-border bg-muted/20 overflow-hidden">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <Switch checked={(settings as Record<string, unknown>)[showKey] === true} onCheckedChange={(v) => updateSettings([showKey], v)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none">{key}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{desc}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${(settings as Record<string, unknown>)[showKey] ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {(settings as Record<string, unknown>)[showKey] ? "ON" : "OFF"}
                      </span>
                    </div>
                    <div className="px-3 pb-3 border-t border-border/50">
                      <Input className="mt-2 text-xs" value={(settings as Record<string, unknown>)[linkKey] as string | undefined ?? ""} onChange={(e) => updateSettings([linkKey], e.target.value)} placeholder={ph} />
                    </div>
                  </div>
                ))}
              </SectionCard>

              <SectionCard title="🌍 International FCRA Notice" defaultOpen={false}>
                <p className="text-xs text-muted-foreground -mt-1 mb-3">
                  Shown as an info box on the International / NRI donor tab of the donate page.
                </p>
                <div className="flex items-center justify-between mb-4 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Show FCRA Registered badge</p>
                    <p className="text-[10px] text-emerald-700/70 dark:text-emerald-400/70 mt-0.5">Green "FCRA Registered ✓" pill shown at top of international tab</p>
                  </div>
                  <Switch
                    checked={settings.donatePage?.fcraEnabled !== false}
                    onCheckedChange={v => updateSettings(["donatePage", "fcraEnabled"], v)}
                  />
                </div>
                <RichTextEditor
                  label="FCRA Notice Text"
                  value={settings.donatePage?.intlNote ?? ""}
                  onChange={html => updateSettings(["donatePage", "intlNote"], html)}
                  minHeight={70}
                  placeholder="Spandana Care Aid Foundation is FCRA-registered. All international donations comply with FCRA regulations. A receipt is issued for all contributions."
                />
              </SectionCard>

              <div className="flex justify-end mt-6">
                <Button className="rounded-full gap-2" onClick={onSave} disabled={saving}>{saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Save Draft</>}</Button>
              </div>
            </div>
  );
}

