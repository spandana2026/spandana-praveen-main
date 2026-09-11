import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import AdminLayout      from "@/components/admin/AdminLayout";
import TabControlBar    from "@/components/admin/TabControlBar";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import RichTextEditor   from "@/components/admin/RichTextEditor";

// Already-separate component tabs
import EmergencyAidTab from "@/components/admin/EmergencyAidTab";
import GalleryTab             from "@/components/admin/GalleryTab";
import SeoTab                 from "@/components/admin/SeoTab";
import LiveStreamTab          from "@/components/admin/LiveStreamTab";
import ShopAdminTab           from "@/components/admin/ShopAdminTab";
import PageBuilderTab         from "@/components/admin/PageBuilderTab";
import FloatingMenuTab        from "@/components/admin/FloatingMenuTab";

// Split tab files — one per tab
import VolunteerAppsTab     from "./tabs/VolunteerAppsTab";
import EventsTab            from "./tabs/EventsTab";
import SubscribersTab       from "./tabs/SubscribersTab";
import FooterTab            from "./tabs/FooterTab";
import GamesTab             from "./tabs/GamesTab";
import DashboardTab         from "./tabs/DashboardTab";
import HeroTab              from "./tabs/HeroTab";
import VisionTab            from "./tabs/VisionTab";
import ProgramsTab          from "./tabs/ProgramsTab";
import SuccessStoriesTab    from "./tabs/SuccessStoriesTab";
import TestimonialsTab      from "./tabs/TestimonialsTab";
import TimelineTab          from "./tabs/TimelineTab";
import VolunteersTab        from "./tabs/VolunteersTab";
import SiteInfoTab          from "./tabs/SiteInfoTab";
import BrandingTab           from "./tabs/BrandingTab";
import SocialMediaTab        from "./tabs/SocialMediaTab";
import ImpactTab            from "./tabs/ImpactTab";
import SaharaTab            from "./tabs/SaharaTab";
import ThemeTab             from "./tabs/ThemeTab";
import NavigationTab        from "./tabs/NavigationTab";
import CoreValuesTab        from "./tabs/CoreValuesTab";
import BlogTab              from "./tabs/BlogTab";
import AdsTab               from "./tabs/AdsTab";
import TeamTab              from "./tabs/TeamTab";
import GetInvolvedTab       from "./tabs/GetInvolvedTab";
import PeopleParticipationTab from "./tabs/PeopleParticipationTab";
import DonateTab            from "./tabs/DonateTab";
import FunZoneTab           from "./tabs/FunZoneTab";
import SecurityTab          from "./tabs/SecurityTab";
import SystemHealthTab      from "./tabs/SystemHealthTab";
import RecycleBinTab        from "./tabs/RecycleBinTab";
import SystemKnowledgeTab   from "./tabs/SystemKnowledgeTab";

import type { SiteSettings, Tab } from "./types";

const TOKEN_KEY = "spandana_admin_token";

function normalizeSettings(data: Partial<SiteSettings>): SiteSettings {
  const emptyPillar = { label: "", title: "", subtitle: "", items: [] };
  return {
    ...data,
    hero: { badge: "", title: "", titleItalic: "", description: "", button1: "", button2: "", ...data.hero },
    stats: data.stats ?? [],
    vision: { heading: "", content: "", ...data.vision },
    mission: { heading: "", content: "", ...data.mission },
    centerCaption: data.centerCaption ?? "",
    timeline: data.timeline ?? [],
    values: data.values ?? [],
    coreValuesSection: {
      badge: "Our Core Values",
      taglines: ["Build People Up", "Help People Grow", "Because People Matter"],
      descriptions: [],
      ...data.coreValuesSection,
    },
    getInvolved: { title: "", subtitle: "", ...data.getInvolved },
    contact: { email: "", phone: "", ...data.contact },
    footer: { copyright: "", ...data.footer },
    programsSection: {
      title: "",
      subtitle: "",
      ...data.programsSection,
      physical: { ...emptyPillar, ...data.programsSection?.physical },
      mental: { ...emptyPillar, ...data.programsSection?.mental },
    },
    impactSection: data.impactSection ?? { heading: "", headingItalic: "", subtitle: "", note: "", tiers: [] },
    volunteerPage: {
      ...(data.volunteerPage as any),
      banner: { heading: "Let’s Connect. Let’s Make a Difference.", subheading: "Everyone has something valuable to share.", image: "/images/hero-indian.png", logo: "/images/spandana-original-logo.png", ...(data.volunteerPage as any)?.banner },
      form: { ...(data.volunteerPage as any)?.form },
      labels: { ...(data.volunteerPage as any)?.labels },
      placeholders: { ...(data.volunteerPage as any)?.placeholders },
      mainProfessionOptions: (data.volunteerPage as any)?.mainProfessionOptions ?? (data.volunteerPage as any)?.professionOptions ?? [],
      additionalProfessionOptions: (data.volunteerPage as any)?.additionalProfessionOptions ?? (data.volunteerPage as any)?.professionOptions ?? [],
      skillsOptions: (data.volunteerPage as any)?.skillsOptions ?? [], interestOptions: (data.volunteerPage as any)?.interestOptions ?? [], contributionOptions: (data.volunteerPage as any)?.contributionOptions ?? [], connectionOptions: ["Someone introduced me", "Other"], helpOptions: (data.volunteerPage as any)?.helpOptions ?? [], professionalPathways: (data.volunteerPage as any)?.professionalPathways ?? {}, specializations: (data.volunteerPage as any)?.specializations ?? {},
    },
    quickLinks: data.quickLinks?.length ? data.quickLinks : [
      { id: "site-settings", label: "Site Settings", tab: "siteinfo", enabled: true },
      { id: "navigation", label: "Main Menu / Navigation", tab: "navigation", enabled: true },
      { id: "events", label: "Events", tab: "events", enabled: true },
      { id: "gallery", label: "Media Library", tab: "gallery", enabled: true },
      { id: "programs", label: "Core Programs", tab: "programs", enabled: true },
      { id: "footer", label: "Footer", tab: "footer", enabled: true },
    ],
  } as SiteSettings;
}

const TAB_TO_PREVIEW_PATH: Partial<Record<Tab, string>> = {
  hero: "/", vision: "/", siteinfo: "/", theme: "/", navigation: "/",
  corevalues: "/", timeline: "/", impact: "/", testimonials: "/",
  dashboard: "/", volunteers: "/", successstories: "/", footer: "/",
  subscribers: "/", programs: "/", sahara: "/sahara", "emergency-aid": "/#emergency-aid", "page-builder": "/",
  "floating-menu": "/", "values-crud": "/core-values",
  donate: "/donate",
  "fun-zone": "/fun-zone", games: "/fun-zone", "game-listings": "/fun-zone", ads: "/fun-zone",
  blog: "/blog", "blog-posts-crud": "/blog",
  shop: "/shop", gallery: "/gallery", events: "/events",
  "get-involved": "/volunteer",
  "people-participation": "/volunteer",
  "health-programs": "/programs/physical-health",
  "physical-health": "/programs/physical-health",
  "mental-health": "/programs/mental-health",
  visionpage: "/vision", storiespage: "/success-stories",
  "stories-crud": "/success-stories",
  testimonialspage: "/testimonials", "testimonials-crud": "/testimonials",
  "live-stream": "/live",
  team: "/team", seo: "/",
};


function ForgotPasswordPanel({ onBack }: { onBack: () => void }) {
  const [channel,setChannel]=useState<"email"|"mobile">("email");
  const [identifier,setIdentifier]=useState(""); const [challenge,setChallenge]=useState(""); const [otp,setOtp]=useState("");
  const [requiresAnswers,setRequiresAnswers]=useState(false); const [answers,setAnswers]=useState<string[]>([]);
  const [newPassword,setNewPassword]=useState(""); const [confirm,setConfirm]=useState(""); const [step,setStep]=useState<"start"|"otp"|"answers"|"reset">("start");
  const [error,setError]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
  async function start(){setBusy(true);setError("");setMessage("");try{const r=await fetch('/api/v1/auth/admin/recovery/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({channel,identifier,purpose:'recovery'}),credentials:'include'});const d=await r.json();if(d.challenge){setChallenge(d.challenge);setStep('otp');setMessage('Verification code sent to the configured recovery channel.');}else setMessage(d.message||'If the recovery details match, a verification code has been sent.');if(!r.ok&&d.error)setError(d.error);}catch{setError('Could not start recovery.')}finally{setBusy(false)}}
  async function verify(){setBusy(true);setError('');try{const r=await fetch('/api/v1/auth/admin/recovery/verify-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({challenge,otp}),credentials:'include'});const d=await r.json();if(!r.ok){setError(d.error||'Verification failed');return;}setRequiresAnswers(!!d.requiresBackupQuestions);if(d.requiresBackupQuestions)setStep('answers');else setStep('reset');}finally{setBusy(false)}}
  async function verifyAnswers(){setBusy(true);setError('');try{const r=await fetch('/api/v1/auth/admin/recovery/verify-answers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({challenge,answers}),credentials:'include'});const d=await r.json();if(!r.ok){setError(d.error||'Backup verification failed');return;}setStep('reset');}finally{setBusy(false)}}
  async function reset(){if(newPassword.length<12){setError('Password must be at least 12 characters.');return;}if(newPassword!==confirm){setError('Passwords do not match.');return;}setBusy(true);setError('');try{const r=await fetch('/api/v1/auth/admin/recovery/reset',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({challenge,newPassword}),credentials:'include'});const d=await r.json();if(!r.ok){setError(d.error||'Password reset failed');return;}setMessage('Password reset successfully. Return to Admin login.');setStep('start');setChallenge('');setOtp('');setNewPassword('');setConfirm('');}finally{setBusy(false)}}
  return <div className="min-h-screen flex items-center justify-center bg-background p-4"><div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg space-y-5"><div><h1 className="text-2xl font-serif font-bold">Admin Recovery</h1><p className="text-sm text-muted-foreground mt-1">Recover access using a verified email or mobile number.</p></div>{error&&<div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{error}</div>}{message&&<div className="text-sm bg-emerald-600/10 text-emerald-700 px-4 py-3 rounded-xl">{message}</div>}
  {step==='start'&&<div className="space-y-4"><div className="flex gap-2"><button onClick={()=>setChannel('email')} className={`flex-1 rounded-xl border px-3 py-2 ${channel==='email'?'bg-primary text-primary-foreground':''}`}>Email</button><button onClick={()=>setChannel('mobile')} className={`flex-1 rounded-xl border px-3 py-2 ${channel==='mobile'?'bg-primary text-primary-foreground':''}`}>Mobile</button></div><input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder={channel==='email'?'Recovery email':'Recovery mobile'} className="w-full rounded-xl border border-input bg-background px-4 py-3"/><button onClick={start} disabled={busy||!identifier} className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 font-semibold">Send verification code</button></div>}
  {step==='otp'&&<div className="space-y-4"><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit verification code" className="w-full rounded-xl border border-input bg-background px-4 py-3"/><button onClick={verify} disabled={busy||otp.length<6} className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 font-semibold">Verify code</button></div>}
  {step==='answers'&&<div className="space-y-4"><p className="text-sm">Additional backup verification</p>{answers.map((a,i)=><input key={i} value={a} onChange={e=>setAnswers(xs=>xs.map((x,j)=>j===i?e.target.value:x))} placeholder={`Answer ${i+1}`} className="w-full rounded-xl border border-input bg-background px-4 py-3"/>)}<button onClick={()=>setAnswers(xs=>[...xs,''])} disabled={answers.length>=3} className="w-full rounded-xl border border-border px-4 py-3">+ Add answer</button><button onClick={verifyAnswers} disabled={busy||!answers.length} className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 font-semibold">Verify backup answers</button></div>}
  {step==='reset'&&<div className="space-y-4"><input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="New password (12+ characters)" className="w-full rounded-xl border border-input bg-background px-4 py-3"/><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm new password" className="w-full rounded-xl border border-input bg-background px-4 py-3"/><button onClick={reset} disabled={busy} className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 font-semibold">Reset password</button></div>}
  <button onClick={onBack} className="w-full text-sm text-muted-foreground hover:text-foreground">← Back to Admin login</button></div></div>;
}

export default function Admin() {
  const [token,     setToken]     = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [loginError,setLoginError]= useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [location, navigate] = useLocation();
  const tab = (location.replace(/^\/admin\/?/, "") || "dashboard") as Tab;
  const setTab = (id: Tab) => navigate(`/admin/${id}`);

  // Legacy Admin tab aliases are redirected to the single canonical owner.
  // The underlying files/data remain in the repository for migration safety;
  // they are no longer independent Admin surfaces.
  const legacyTabRedirects: Record<string, string> = {
    "health-programs": "programs",
    "physical-health": "sahara",
    "mental-health": "sahara",
    "visionpage": "vision",
    "storiespage": "successstories",
    "testimonialspage": "testimonials",
    "blog-posts-crud": "blog",
    "stories-crud": "successstories",
    "testimonials-crud": "testimonials",
    "values-crud": "corevalues",
    "games": "fun-zone",
    "game-listings": "fun-zone",
  };
  useEffect(() => {
    const canonical = legacyTabRedirects[tab];
    if (canonical && location !== `/admin/${canonical}`) navigate(`/admin/${canonical}`);
  }, [tab, location]);
  useEffect(() => { (window as any).__spandanaSetTab = setTab; return () => { delete (window as any).__spandanaSetTab; }; }, []);

  const [settings,      setSettings]      = useState<SiteSettings | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [publishing,    setPublishing]    = useState(false);
  const [hasDraft,      setHasDraft]      = useState(false);
  const [scheduleAt,    setScheduleAt]    = useState("");
  const [scheduledAt,   setScheduledAt]   = useState<string | null>(null);
  const [historyEntries,setHistoryEntries]= useState<Array<{ index: number; publishedAt: string }>>([]);
  const [feedback,      setFeedback]      = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const isLoggedIn = !!token;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/auth/admin/session", { credentials: "include" })
      .then(async r => { if (!cancelled && r.ok) setToken("cookie-session"); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setCheckingSession(false); });
    return () => { cancelled = true; };
  }, []);

  function showFeedback(type: "success" | "error", msg: string) {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3500);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoggingIn(true); setLoginError("");
    try {
      const res  = await fetch("/api/v1/auth/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const json = await res.json() as { error?: string };
      if (res.ok) { setToken("cookie-session"); setPassword(""); }
      else setLoginError(json.error ?? "Invalid password");
    } catch { setLoginError("Could not connect to server"); }
    finally { setLoggingIn(false); }
  }

  async function handleLogout() { try { await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" }); } finally { setToken(""); } }

  const loadSettings = useCallback(async () => {
    const res = await fetch("/api/v1/admin/settings/draft", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setSettings(normalizeSettings(await res.json() as SiteSettings));
    const statusRes = await fetch("/api/v1/admin/settings/status", { headers: { Authorization: `Bearer ${token}` } });
    if (statusRes.ok) {
      const s = await statusRes.json() as { hasDraft: boolean; history: Array<{ index: number; publishedAt: string }>; scheduledAt?: string };
      setHasDraft(s.hasDraft);
      setScheduledAt(s.scheduledAt ?? null);
      setHistoryEntries(s.history ?? []);
    }
  }, [token]);

  useEffect(() => { if (isLoggedIn) loadSettings(); }, [isLoggedIn, tab, loadSettings]);

  function updateSettings(path: (string | number)[], val: unknown) {
    setSettings((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev) as Record<string, unknown>;
      let cur: Record<string, unknown> = next;
      for (let i = 0; i < path.length - 1; i++) {
        const k = path[i] as string;
        if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
        cur = cur[k] as Record<string, unknown>;
      }
      cur[path[path.length - 1] as string] = val;
      return next as unknown as SiteSettings;
    });
  }

  async function saveSettings(): Promise<boolean> {
    if (!settings) return false;
    setSaving(true);
    try {
      const res = await fetch("/api/v1/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(settings) });
      if (res.ok) { showFeedback("success", "Draft saved"); setHasDraft(true); return true; }
      else { showFeedback("error", "Save failed"); return false; }
    } catch { showFeedback("error", "Save failed"); return false; } finally { setSaving(false); }
  }

  async function publishNow() {
    setPublishing(true);
    try {
      const res = await fetch("/api/v1/admin/settings/publish", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { showFeedback("success", "Published!"); setHasDraft(false); }
      else showFeedback("error", "Publish failed");
    } finally { setPublishing(false); }
  }

  async function schedulePublish() { showFeedback("success", `Scheduled for ${scheduleAt}`); }
  async function cancelSchedule()  { setScheduledAt(null); }

  async function revertTo(index: number) {
    const res = await fetch(`/api/v1/admin/settings/history/${index}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { const data = await res.json() as SiteSettings; setSettings(data); showFeedback("success", "Reverted to previous version. Save draft to keep."); }
    else showFeedback("error", "Revert failed");
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (checkingSession) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Checking secure session…</div>;
  if (!isLoggedIn) {
    if (recoveryMode) return <ForgotPasswordPanel onBack={() => setRecoveryMode(false)} />;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-lg space-y-5">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-serif font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">Spandana Care Aid Foundation</p>
          </div>
          {loginError && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{loginError}</p>}
          <div className="relative">
            <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm" autoFocus />
            <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
          <button type="submit" disabled={loggingIn || !password} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {loggingIn && <Loader2 size={16} className="animate-spin" />}
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
          <button type="button" onClick={() => setRecoveryMode(true)} className="w-full text-sm text-muted-foreground hover:text-foreground">Forgot / reset password?</button>
        </form>
      </div>
    );
  }

  // ── Shared props for settings-based tabs ─────────────────────────────────
  const settingsProps = { settings: settings!, updateSettings, setSettings, token, saving, onSave: saveSettings, showFeedback, publishNow };

  return (
    <AdminLayout onLogout={handleLogout}>
      {/* Global feedback toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-sm font-medium ${feedback.type === "success" ? "bg-emerald-600 text-white" : "bg-destructive text-white"}`}>
            {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Per-tab control bar */}
      <TabControlBar
        tab={tab}
        settings={settings as Record<string, unknown> | null}
        updateSettings={updateSettings}
        saveSettings={saveSettings}
        publishNow={publishNow}
        schedulePublish={schedulePublish}
        cancelSchedule={cancelSchedule}
        saving={saving}
        publishing={publishing}
        hasDraft={hasDraft}
        scheduledAt={scheduledAt}
        historyEntries={historyEntries}
        revertTo={revertTo}
        scheduleAt={scheduleAt}
        setScheduleAt={setScheduleAt}
      />

      {/* ── Tab Router ── */}
      {tab === "dashboard"           && settings && <DashboardTab token={token} settings={settings} updateSettings={updateSettings} onSave={saveSettings} saving={saving} />}
      {tab === "hero"          && settings && <HeroTab             {...settingsProps} />}
      {tab === "vision"        && settings && <VisionTab           {...settingsProps} />}
      {tab === "programs"      && <ProgramsTab token={token} showFeedback={showFeedback} />}
      {tab === "successstories"&& settings && <SuccessStoriesTab   {...settingsProps} />}
      {tab === "testimonials"  && settings && <TestimonialsTab     {...settingsProps} />}
      {tab === "timeline"      && settings && <TimelineTab         {...settingsProps} />}
      {tab === "volunteers"    && settings && <VolunteersTab       {...settingsProps} />}
      {tab === "siteinfo"      && settings && <SiteInfoTab         {...settingsProps} />}
      {tab === "branding"      && settings && <BrandingTab         {...settingsProps} />}
      {tab === "social-media"  && settings && <SocialMediaTab      settings={settings} updateSettings={updateSettings} saving={saving} onSave={saveSettings} />}
      {tab === "impact"        && settings && <ImpactTab           {...settingsProps} />}
      {tab === "sahara"        && settings && <SaharaTab           {...settingsProps} />}
      {tab === "theme"         && settings && <ThemeTab            {...settingsProps} />}
      {tab === "navigation"    && settings && <NavigationTab       {...settingsProps} />}
      {tab === "corevalues"    && settings && <CoreValuesTab       {...settingsProps} />}
      {tab === "people-participation" && settings && <PeopleParticipationTab {...settingsProps} />}
      {tab === "get-involved"    && settings && <GetInvolvedTab     {...settingsProps} />}
      {tab === "donate"          && settings && <DonateTab          {...settingsProps} />}
      {tab === "fun-zone"        && settings && <FunZoneTab         {...settingsProps} />}
      {tab === "ads"             && settings && <AdsTab             {...settingsProps} />}
      {tab === "blog"            && settings && <BlogTab            {...settingsProps} />}
      {tab === "team"            && settings && <TeamTab            {...settingsProps} />}
      {tab === "security"        && <SecurityTab showFeedback={showFeedback} />}
      {tab === "system-health"  && <SystemHealthTab showFeedback={showFeedback} />}
      {tab === "recycle-bin"    && <RecycleBinTab showFeedback={showFeedback} />}
      {tab === "system-knowledge" && <SystemKnowledgeTab token={token} showFeedback={showFeedback} />}
      {tab === "subscribers"     && <SubscribersTab  token={token} />}
      {tab === "footer"          && settings && <FooterTab settings={settings} updateSettings={updateSettings} />}
      {tab === "events"          && <EventsTab       token={token} />}
      {tab === "games"           && settings && <GamesTab settings={settings} updateSettings={updateSettings} />}
      {tab === "volunteer-apps"  && <VolunteerAppsTab token={token} />}
      {tab === "shop"            && <ShopAdminTab     token={token} />}
      {tab === "gallery"         && <GalleryTab       token={token} />}
      {tab === "emergency-aid" && <EmergencyAidTab token={token} />}
      {tab === "seo"             && settings && <SeoTab settings={settings} updateSettings={updateSettings} token={token} />}
      {tab === "live-stream"     && settings && <LiveStreamTab settings={settings} updateSettings={updateSettings} token={token} onSave={saveSettings} />}
      {tab === "page-builder"    && <PageBuilderTab   token={token} />}
      {tab === "floating-menu"   && settings && <FloatingMenuTab settings={settings} updateSettings={updateSettings} token={token} onSave={saveSettings} />}
    </AdminLayout>
  );
}
