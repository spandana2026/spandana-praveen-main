import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShieldCheck,
  UsersRound,
  Leaf,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  Landmark,
  Loader2,
  QrCode,
  Smartphone,
} from "lucide-react";
import { Link } from "wouter";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import CommunityChat from "@/components/community-chat";
import { supportService } from "@/services/supportService";
import type { DonationOpportunity } from "@/services/donationTypes";

interface Settings {
  donatePage?: {
    heading?: string;
    subheading?: string;
    headingMobile?: string;
    subheadingMobile?: string;
    taxNote?: string;
    geoAutoSwitch?: boolean;
    upiApps?: Record<string, boolean>;
    internationalCurrencies?: string[];
    design?: {
      supportCards?: any;
      opportunityCards?: any;
      mobile?: { cardGap?: number; sectionPadding?: number; opportunityHorizontalScroll?: boolean };
    };
  };
  upiId?: string;
  upiName?: string;
  upiQrUrl?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  bankBranch?: string;
  razorpayLink?: string;
  cashfreeLink?: string;
  paypalLink?: string;
  stripeLink?: string;
}

interface Currency {
  code: string;
  symbol: string;
  flag: string;
  name: string;
}

const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "AUD", symbol: "A$", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "CAD", symbol: "C$", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", flag: "🇸🇬", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham" },
];

const fallbackRates: Record<string, number> = {
  USD: 1,
  AUD: 1.5,
  EUR: 0.85,
  GBP: 0.75,
  CAD: 1.38,
  SGD: 1.28,
  AED: 3.67,
};


function upiUrl(id: string, name: string, amount: string) {
  return `upi://pay?pa=${encodeURIComponent(id)}&pn=${encodeURIComponent(name)}&tn=${encodeURIComponent("Donation to Spandana")}&cu=INR${amount ? `&am=${amount}` : ""}`;
}

function formatMoney(value: number, currency: string) {
  const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency;
  return `${symbol}${Number(value || 0).toLocaleString(currency === "INR" ? "en-IN" : "en-US", { maximumFractionDigits: 2 })}`;
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
      onClick={() =>
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        })
      }
    >
      {done ? <CheckCircle2 size={13} /> : <Copy size={13} />} {done ? "Copied" : "Copy"}
    </button>
  );
}

export default function DonatePage() {
  const [settings, setSettings] = useState<Settings>({});
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);
  const [opportunities, setOpportunities] = useState<DonationOpportunity[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donorType, setDonorType] = useState<"indian" | "intl">("indian");
  const [openOpportunity, setOpenOpportunity] = useState<string | null>(null);
  const [givingFrequency, setGivingFrequency] = useState<"one-time" | "monthly" | "custom">("one-time");
  const [target, setTarget] = useState<any | null>(null);
  const [amount, setAmount] = useState(0);
  const [custom, setCustom] = useState("");
  const [qty, setQty] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const [donor, setDonor] = useState({ name: "", email: "", mobile: "", country: "" });
  const [providerReference, setProviderReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [bankOpen, setBankOpen] = useState(false);

  const pathCampaignMatch = window.location.pathname.match(/^\/campaigns\/([^/]+)\/support$/);
  const params = new URLSearchParams(window.location.search);
  const requestedCampaignId = pathCampaignMatch?.[1] || params.get("campaignId");
  const requestedRequirementId = params.get("requirementId");
  const checkoutMode = Boolean(pathCampaignMatch);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => (r.ok ? r.json() : {})),
      supportService.catalog(),
      fetch("/api/v1/support/payment-profiles").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/v1/support/currency-rates")
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({})),
    ])
      .then(([s, c, p, r]) => {
        setSettings(s || {});
        setOpportunities(c?.opportunities || []);
        setCampaigns(c?.campaigns || []);
        setRequirements(c?.requirements || []);
        setPayments(Array.isArray(p) ? p : []);
        setRates(r?.rates || fallbackRates);
      })
      .catch(() => setError("Giving options are temporarily unavailable."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview");
    const admin = localStorage.getItem("spandana_admin_token");
    if (admin && (preview === "india" || preview === "international")) {
      setDonorType(preview === "international" ? "intl" : "indian");
      return;
    }
    if (settings.donatePage?.geoAutoSwitch === false) return;
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => {
        if (d?.country_code && d.country_code !== "IN") setDonorType("intl");
      })
      .catch(() => {});
  }, [settings.donatePage?.geoAutoSwitch]);

  const visible = useMemo(
    () => opportunities.filter((o) => o.geography === "both" || o.geography === (donorType === "indian" ? "india" : "international")),
    [opportunities, donorType],
  );

  const enabledCodes = settings.donatePage?.internationalCurrencies?.length
    ? settings.donatePage.internationalCurrencies
    : ["USD", "AUD", "EUR", "GBP", "CAD", "SGD", "AED"];
  const enabledCurrencies = CURRENCIES.filter((c) => enabledCodes.includes(c.code));
  const intlCurrency = enabledCurrencies.find((c) => c.code === currency) || enabledCurrencies[0] || CURRENCIES[0];

  const activeOpportunity = visible.find((o) => o.id === openOpportunity);
  const active = target || activeOpportunity;
  const options = target?.donationOptions || {};
  const activeType =
    target?.type === "requirement"
      ? "requirement"
      : target?.type === "campaign" && options.showPerUnit
        ? "unit"
        : target?.type === "campaign"
          ? "fixed"
          : activeOpportunity?.type || "fixed";
  const inrPresets = options.presetAmountsINR?.length ? options.presetAmountsINR : activeOpportunity?.pricing?.INR?.presets || [];
  const usdPresets = options.presetAmountsUSD?.length ? options.presetAmountsUSD : activeOpportunity?.pricing?.USD?.presets || [];
  const allowCustom = options ? options.allowCustomAmount !== false : true;
  const unitPrice = target?.unitCost ?? (donorType === "indian" ? activeOpportunity?.pricing?.INR?.unitCost : activeOpportunity?.pricing?.USD?.unitCost);
  const baseAmount = custom ? Number(custom) || 0 : amount;
  const totalBase = (activeType === "unit" || activeType === "requirement") && unitPrice ? Number(unitPrice) * qty : baseAmount;
  const rate = rates[currency] || fallbackRates[currency] || 1;
  const displayTotal = donorType === "indian" ? totalBase : totalBase * rate;
  const currencySymbol = donorType === "indian" ? "₹" : intlCurrency.symbol;
  const transactionCurrency = donorType === "indian" ? "INR" : "USD";

  const intlProfiles = payments.filter((p) => p.geography === "international" || p.geography === "both");
  const indiaProfiles = payments.filter((p) => p.geography === "india" || p.geography === "both");

  const openTarget = (t: any) => {
    setTarget(t);
    setOpenOpportunity(t?.type === "opportunity" ? t.id : null);
    setGivingFrequency("one-time");
    setAmount(0);
    setCustom("");
    setQty(1);
    setConfirmation(null);
  };

  const openOpp = (o: DonationOpportunity) => {
    setTarget(null);
    const nextOpen = openOpportunity === o.id ? null : o.id;
    setOpenOpportunity(nextOpen);
    setGivingFrequency("one-time");
    setAmount(0);
    setCustom("");
    setQty(o.quantityPresets?.[0] || 1);
    setConfirmation(null);
  };

  useEffect(() => {
    if (!requestedCampaignId && !checkoutMode) {
      setTarget(null);
      setConfirmation(null);
      setAmount(0);
      setCustom("");
      setQty(1);
      setProviderReference("");
      setBankOpen(false);
    }
    if (loading || !requestedCampaignId || !campaigns.length) return;
    const campaign = campaigns.find((c) => String(c.id) === String(requestedCampaignId));
    if (!campaign) {
      setError("This campaign is no longer available for support.");
      return;
    }
    setTarget({
      type: "campaign",
      id: campaign.id,
      title: campaign.title,
      description: campaign.description || campaign.campaignDetails?.sections?.basic?.shortDescription || "",
      currency: campaign.currency,
      image: campaign.image || "",
      donationOptions: campaign.donationOptions || {},
      unitCost: campaign.donationOptions?.perUnitCost ?? null,
      unitName: campaign.donationOptions?.perUnitName || "",
    });
    setAmount(0);
    setCustom("");
    setQty(1);
    setConfirmation(null);
  }, [loading, requestedCampaignId, campaigns]);

  useEffect(() => {
    if (loading || !requestedRequirementId || !requirements.length) return;
    const requirement = requirements.find((r) => String(r.id) === String(requestedRequirementId));
    if (!requirement) { setError("This specific need is no longer available."); return; }
    setTarget({
      type: "requirement",
      id: requirement.id,
      title: requirement.title,
      description: requirement.description || "",
      currency: requirement.currency || "INR",
      unitCost: requirement.unitCost ?? null,
      unitName: requirement.unitName || "",
    });
    if (params.get("support") !== "1") { setAmount(0); setCustom(""); setQty(1); }
    setConfirmation(null);
  }, [loading, requestedRequirementId, requirements]);

  useEffect(() => {
    if (!target || params.get("support") !== "1") return;
    const timer = window.setTimeout(() => {
      document.getElementById("donate-checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [target, params.get("support")]);

  const submit = async (paymentMethod: string, provider: string, checkoutUrl?: string) => {
    setSubmitting(true);
    try {
      const res = await supportService.createContribution({
        supportType: "cash",
        donorName: donor.name,
        donorEmail: donor.email,
        donorMobile: donor.mobile,
        country: donor.country,
        targetType: target?.type || "opportunity",
        targetId: target?.id || activeOpportunity?.id,
        title: active?.title || "",
        quantity: activeType === "unit" || activeType === "requirement" ? qty : null,
        unitName: target?.unitName || (donorType === "indian" ? activeOpportunity?.pricing?.INR?.unitName : activeOpportunity?.pricing?.USD?.unitName),
        amount: totalBase,
        currency: transactionCurrency,
        paymentMethod,
        provider,
        providerReference,
        recurring: givingFrequency === "monthly",
      });
      setConfirmation(res);
      if (checkoutUrl) {
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        if (paymentMethod === "upi") {
          if (isMobile) {
            window.location.href = checkoutUrl;
          } else {
            setBankOpen(true);
            setError("On desktop, scan the UPI QR code with PhonePe, Google Pay or another UPI app. The payment remains pending until it is verified.");
          }
        } else {
          window.location.href = checkoutUrl;
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record your contribution.");
    } finally {
      setSubmitting(false);
    }
  };

  const PaymentMethods = () => {
    if (!paymentReady) return null;
    if (confirmation) {
      return (
        <div className="mt-4 rounded-2xl border bg-background p-4">
          <CheckCircle2 className="text-emerald-600" size={22} />
          <p className="font-semibold mt-2">Contribution recorded</p>
          <p className="text-sm text-muted-foreground mt-1">
            Reference: {confirmation.transaction?.reference || confirmation.contribution?.reference}
          </p>
        </div>
      );
    }
    const profiles = donorType === "indian" ? indiaProfiles : intlProfiles;
    const methods = profiles.flatMap((p: any) => p.methods || []).filter((m: any) => m.enabled !== false && m.type !== "upi");
    return (
      <div className="mt-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Choose how you would like to give</p>
        {donorType === "indian" && settings.upiId && (
          <div className="grid sm:grid-cols-2 gap-2">
            <button
              disabled={submitting}
              onClick={() => submit("upi", "upi", upiUrl(settings.upiId!, settings.upiName || "Spandana", totalBase.toFixed(2)))}
              className="rounded-2xl bg-primary text-primary-foreground px-4 py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Smartphone size={17} /> {typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? "Pay with UPI App" : "Pay by UPI / Show QR"}
            </button>
            {settings.upiQrUrl && (
              <button
                type="button"
                onClick={() => setBankOpen((v) => !v)}
                className="rounded-2xl border px-4 py-3 font-semibold flex items-center justify-center gap-2"
              >
                <QrCode size={17} /> Show UPI QR
              </button>
            )}
          </div>
        )}
        {settings.bankAccountNumber && (
          <button
            type="button"
            onClick={() => setBankOpen((v) => !v)}
            className="w-full rounded-2xl border px-4 py-3 font-semibold text-left flex items-center justify-between"
          >
            <span className="flex items-center gap-2"><Landmark size={17} /> Bank Transfer</span>
            {bankOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
        {bankOpen && (
          <div className="rounded-2xl bg-background border p-4 text-xs space-y-3">
            {settings.upiQrUrl && donorType === "indian" && (
              <div className="flex flex-col items-center gap-2 pb-3 border-b">
                <img src={settings.upiQrUrl} alt="UPI QR" className="w-40 h-40 object-contain bg-white rounded-xl" />
                <span>{settings.upiName || "Spandana Care Aid Foundation"} · {settings.upiId}</span>
                <CopyBtn text={settings.upiId || ""} />
              </div>
            )}
            {[
              ["Account Name", settings.bankAccountName],
              ["Account Number", settings.bankAccountNumber],
              ["IFSC / SWIFT", settings.bankIfsc],
              ["Bank", settings.bankName],
              ["Branch", settings.bankBranch],
            ]
              .filter((x) => x[1])
              .map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-right">{value}</span>
                </div>
              ))}
          </div>
        )}
        {methods.map((m: any) => (
          <button
            key={m.type + m.label}
            disabled={submitting}
            onClick={() => submit(m.type, m.type, m.checkoutUrl)}
            className="w-full rounded-2xl border px-4 py-3 font-semibold text-left flex items-center justify-between disabled:opacity-50"
          >
            <span>{m.label}</span><ArrowRight size={15} />
          </button>
        ))}
        {donorType === "indian" && settings.razorpayLink && (
          <button
            disabled={submitting}
            onClick={() => submit("gateway", "razorpay", settings.razorpayLink)}
            className="w-full rounded-2xl border px-4 py-3 font-semibold flex items-center justify-between disabled:opacity-50"
          >
            <span className="flex items-center gap-2"><CreditCard size={17} /> Credit / Debit Card · Razorpay</span>
            <ArrowRight size={15} />
          </button>
        )}
        {donorType === "intl" && settings.paypalLink && (
          <button disabled={submitting} onClick={() => submit("gateway", "paypal", settings.paypalLink)} className="w-full rounded-2xl border px-4 py-3 font-semibold flex items-center justify-between">
            <span>PayPal</span><ArrowRight size={15} />
          </button>
        )}
        {donorType === "intl" && settings.stripeLink && (
          <button disabled={submitting} onClick={() => submit("gateway", "stripe", settings.stripeLink)} className="w-full rounded-2xl border px-4 py-3 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2"><CreditCard size={17} /> Card · Stripe</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    );
  };

  const paymentReady = totalBase > 0;

  const AmountChooser = () => (
    <>
      {activeType === "unit" || activeType === "requirement" ? (
        <div>
          <p className="text-sm font-semibold">Choose quantity</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {(active?.quantityPresets?.length ? active.quantityPresets : [1, 2, 5, 10]).map((q: number) => (
              <button
                key={q}
                type="button"
                onClick={() => { setQty(q); setCustom(""); }}
                className={`px-3.5 py-2 rounded-xl border font-semibold ${qty === q && !custom ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary/40"}`}
              >
                {q} {active?.unitName || "units"}
              </button>
            ))}
            <input type="number" min="1" value={custom} onChange={(e) => { setCustom(e.target.value); setQty(Number(e.target.value) || 1); }} placeholder="Custom" className="w-28 rounded-xl border px-3 py-2" />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold">Choose an amount</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {(donorType === "indian" ? inrPresets : usdPresets).map((v: number) => (
              <button
                key={v}
                type="button"
                onClick={() => { setAmount(v); setCustom(""); }}
                className={`px-3.5 py-2 rounded-xl border font-semibold ${amount === v && !custom ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary/40"}`}
              >
                {currencySymbol}{donorType === "indian" ? v.toLocaleString("en-IN") : (v * rate).toFixed(0)}
              </button>
            ))}
            {allowCustom && <input type="number" min="1" value={custom} onChange={(e) => { setCustom(e.target.value); setAmount(0); }} placeholder="Custom amount" className="w-36 rounded-xl border px-3 py-2" />}
          </div>
        </div>
      )}
      {donorType === "intl" && (
        <div className="mt-3">
          <label className="text-xs font-semibold">Display currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-2 rounded-xl border px-3 py-2 bg-background w-full">
            {enabledCurrencies.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
          </select>
        </div>
      )}
    </>
  );

  const CheckoutPanel = ({ compact = false }: { compact?: boolean }) => {
    if (!active) return null;
    return (
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        id="donate-checkout"
        className={`rounded-[2rem] border bg-card shadow-sm overflow-hidden ${compact ? "mt-5" : "mt-8"}`}
      >
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#E6E0D5]">
            {active.image && <img src={active.image} alt={active.title} className="w-full aspect-[16/9] object-cover rounded-2xl mb-5" />}
            <p className="text-xs uppercase tracking-[0.18em] text-primary font-bold">Support</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">{active.title}</h2>
            {active.description && <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">{active.description}</p>}
            {target?.type === "campaign" && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border bg-background p-3"><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Target</p><p className="font-semibold mt-1">{formatMoney(Number(target.targetAmount || campaigns.find((c) => c.id === target.id)?.targetAmount || 0), target.currency || "INR")}</p></div>
                <div className="rounded-2xl border bg-background p-3"><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Raised</p><p className="font-semibold mt-1">{formatMoney(Number(campaigns.find((c) => c.id === target.id)?.metrics?.raised || 0), target.currency || "INR")}</p></div>
              </div>
            )}
          </div>
          <div className="p-6 md:p-8">
            <AmountChooser />
            {paymentReady && (
              <div className="mt-5 rounded-2xl border bg-background p-4 md:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="text-xs text-muted-foreground">Your contribution</p><p className="text-3xl font-serif font-bold mt-1">{currencySymbol}{displayTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p></div>
                  <span className="text-xs rounded-full bg-muted px-3 py-1.5">Secure giving</span>
                </div>
                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  <input value={donor.name} onChange={(e) => setDonor({ ...donor, name: e.target.value })} placeholder="Name" className="rounded-xl border px-3 py-2.5 bg-background" />
                  <input value={donor.email} onChange={(e) => setDonor({ ...donor, email: e.target.value })} placeholder="Email" className="rounded-xl border px-3 py-2.5 bg-background" />
                  <input value={donor.mobile} onChange={(e) => setDonor({ ...donor, mobile: e.target.value })} placeholder="Mobile" className="rounded-xl border px-3 py-2.5 bg-background" />
                  <input value={donor.country} onChange={(e) => setDonor({ ...donor, country: e.target.value })} placeholder="Country" className="rounded-xl border px-3 py-2.5 bg-background" />
                </div>
                <input value={providerReference} onChange={(e) => setProviderReference(e.target.value)} placeholder="Payment reference / UTR (optional)" className="w-full rounded-xl border px-3 py-2.5 mt-3 bg-background" />
                <PaymentMethods />
              </div>
            )}
            {!paymentReady && <p className="mt-5 text-xs text-muted-foreground">Choose an amount or quantity to continue to payment.</p>}
          </div>
        </div>
      </motion.section>
    );
  };

  const OpportunityCard = ({ o }: { o: DonationOpportunity }) => {
    const isOpen = openOpportunity === o.id;
    return (
      <motion.button type="button" whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} onClick={() => openOpp(o)}
        className={`group min-w-0 w-full text-left rounded-2xl border p-4 transition-all ${isOpen ? "border-[#087CF0] bg-[#087CF0] text-white shadow-lg" : "border-[#DDE8F4] bg-white hover:border-[#9BC8F5] hover:shadow-md"}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><span className={`inline-flex text-[10px] uppercase tracking-[0.16em] font-bold ${isOpen ? "text-white/70" : "text-[#087CF0]"}`}>Give towards</span><span className="block mt-1 font-serif text-lg leading-tight">{o.title}</span></div>
          <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isOpen ? "bg-white/15" : "bg-[#F3F7F1] text-[#087CF0]"}`}><ArrowRight size={15}/></span>
        </div>
      </motion.button>
    );
  };

  const SupportCard = ({ item }: { item: any }) => {
    const isCampaign = item.supportKind === 'campaign';
    const title = item.title || 'Untitled';
    const description = item.description || item.campaignDetails?.sections?.basic?.shortDescription || '';
    const detailsPath = isCampaign ? `/campaigns/${encodeURIComponent(item.id)}` : `/requirements/${encodeURIComponent(item.id)}`;
    const supportPath = isCampaign ? `/donate?campaignId=${encodeURIComponent(item.id)}&support=1` : `/donate?requirementId=${encodeURIComponent(item.id)}&support=1`;
    const progress = Number(item.metrics?.progress ?? item.progress ?? 0);
    const targetAmount = Number(item.targetAmount || 0);
    const needValue = Number(item.targetAmount || item.unitCost || 0);
    return (
      <motion.article whileHover={{ y: -5 }} className="group flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-[#DDE8F4] bg-white shadow-[0_8px_28px_rgba(30,55,40,.06)] transition-all duration-300">
        <Link href={detailsPath} className="block overflow-hidden relative h-32 md:h-36 bg-[#EEF6FF]">
          {isCampaign && item.image ? <img src={item.image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="h-full w-full flex items-center justify-center"><div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center text-[#087CF0]">{isCampaign ? <Sparkles size={28}/> : <Heart size={28}/>}</div></div>}
          <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#087CF0]">{isCampaign ? 'Campaign' : 'Specific Need'}</span>
        </Link>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-serif text-xl leading-tight text-[#0B2F57]">{title}</h3>
          {description && <p className="mt-2 text-sm leading-6 text-[#5B6B7D] line-clamp-3">{description}</p>}
          {isCampaign && targetAmount > 0 && <div className="mt-5"><div className="flex justify-between text-xs text-[#5B6B7D]"><span>Progress</span><strong className="text-[#0B2F57]">{Math.round(Math.min(100, Math.max(0, progress)))}%</strong></div><div className="h-2 rounded-full bg-[#E4EEF8] mt-2 overflow-hidden"><div className="h-full bg-[#087CF0] rounded-full" style={{width:`${Math.min(100,Math.max(0,progress))}%`}} /></div><div className="flex justify-between text-[11px] mt-2 text-[#6C7D90]"><span>Target</span><strong>{formatMoney(targetAmount,item.currency||'INR')}</strong></div></div>}
          {!isCampaign && needValue > 0 && <p className="mt-4 text-sm font-semibold text-[#0B2F57]">{item.targetAmount ? `Target ${formatMoney(needValue,item.currency||'INR')}` : `${formatMoney(needValue,item.currency||'INR')} per ${item.unitName||'unit'}`}</p>}
          <div className="mt-5 pt-4 border-t border-[#E5EDF6]"><a href={supportPath} className="inline-flex items-center font-bold text-sm text-[#087CF0]">Support this {isCampaign ? 'campaign' : 'need'} <ArrowRight size={15} className="ml-2"/></a></div>
        </div>
      </motion.article>
    );
  };

  const heading = settings.donatePage?.heading || "Give Hope";
  const sub = settings.donatePage?.subheading || "Your support helps us empower individuals and communities through physical and mental well-being. Together, we can create lasting change.";
  const tax = settings.donatePage?.taxNote || "Thank you for supporting Spandana Care Aid Foundation.";
  const mixedSupport = useMemo(() => {
    const rows = [
      ...campaigns.filter((c) => c.published !== false && c.status === "active").map((c) => ({ ...c, supportKind: "campaign" as const })),
      ...requirements.filter((r) => r.published !== false && r.status !== "archived" && r.visibility !== "private").map((r) => ({ ...r, supportKind: "requirement" as const })),
    ];
    return rows.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || String(a.title || "").localeCompare(String(b.title || "")));
  }, [campaigns, requirements]);
  const noGiving = !loading && visible.length === 0 && mixedSupport.length === 0;

  if (checkoutMode) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-10">
          <Link href="/donate" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Back to Donate</Link>
          {error && <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
          {loading || !target ? (
            <div className="py-24 text-center text-muted-foreground"><Loader2 className="inline animate-spin mr-2" size={18} /> Loading campaign…</div>
          ) : (
            <>
              <header className="max-w-3xl mt-7">
                <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Support {target.title}</h1>
                <p className="mt-3 text-muted-foreground">Choose your contribution and continue to the available payment options.</p>
              </header>
              <CheckoutPanel />
            </>
          )}
        </main>
        <Footer />
        <CommunityChat />
      </div>
    );
  }

  const handleStartGiving = () => {
    if (visible[0]) openOpp(visible[0]);
    else if (mixedSupport[0]) openTarget({ type: mixedSupport[0].supportKind, id: mixedSupport[0].id, title: mixedSupport[0].title, description: mixedSupport[0].description || "", image: mixedSupport[0].image || "", donationOptions: mixedSupport[0].donationOptions || {}, unitCost: mixedSupport[0].unitCost ?? null, unitName: mixedSupport[0].unitName || "" });
    window.setTimeout(() => document.getElementById("give-now")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const design = settings.donatePage?.design || {};
  // Featured support is one mixed public list: Campaigns + Requirements, with the first 3 shown.
  const activeFeaturedSupport = mixedSupport.slice(0, 3);
  const activeSpecificNeeds = visible.filter((o) => o.active !== false && o.published !== false).slice(0, 4);
  const heroEyebrow = design.heroEyebrow || "";
  const heroCta = design.heroCta || "Donate Now";
  const heroLine1 = design.heroLine1 || "Give Hope";
  const heroLine2 = design.heroLine2 || "Build Brighter";
  const heroLine3 = design.heroLine3 || "Tomorrows";
  const heroSideText = design.heroSideText || "A kinder\ntomorrow\nis possible";
  const heroBrushText = design.heroBrushText || "Small acts.\nBig change.";
  const impactHeading = design.impactHeading || "Our Impact";
  const finalCtaHeading = design.finalCtaHeading || "Let’s build a brighter, kinder tomorrow.";
  const finalCtaText = design.finalCtaText || "Every thoughtful act helps create stronger communities and a future built with hope.";
  const heroImage = design.heroImage || "/images/hero-indian.png";
  const donationImage = design.donationImage || "/images/hero-indian.png";
  const showPathways = design.showPathways !== false;
  const showCampaigns = design.showCampaigns !== false;
  const showRequirements = design.showRequirements !== false;
  const showDonation = design.showDonation !== false;
  const showImpact = design.showImpact !== false;
  const showFinalCta = design.showFinalCta !== false;
  const pathwaysHeading = design.pathwaysHeading || "Choose Your Giving Pathway";
  const pathwaysLinkLabel = design.pathwaysLinkLabel || "Learn more about our programs";
  const campaignsHeading = design.campaignsHeading || "Featured Campaigns";
  const campaignsDescription = design.campaignsDescription || "Real stories. Real change. Be part of something bigger.";
  const campaignsLinkLabel = design.campaignsLinkLabel || "View all campaigns";
  const requirementsHeading = design.requirementsHeading || "Specific Needs";
  const requirementsDescription = design.requirementsDescription || "Support where it’s needed most right now.";
  const requirementsLinkLabel = design.requirementsLinkLabel || "View all needs";
  const donationHeading = design.donationHeading || "Make a Donation";
  const donationDescription = design.donationDescription || "Every contribution, big or small, creates a meaningful impact.";
  const impactDescription = design.impactDescription || "Every contribution can become an act of care.";
  const finalCtaLabel = design.finalCtaLabel || "Donate Now";
  const physicalTitle = design.physicalTitle || settings.programsSection?.physical?.title || "Physical Care";
  const physicalDescription = design.physicalDescription || settings.programsSection?.physical?.subtitle || "Support health, nutrition and essential care for a healthier tomorrow.";
  const mentalTitle = design.mentalTitle || settings.programsSection?.mental?.title || "Mental Well-being";
  const mentalDescription = design.mentalDescription || settings.programsSection?.mental?.subtitle || "Help provide counselling, support and safe spaces for brighter minds.";
  const physicalImage = design.physicalImage || "/images/physical.png";
  const mentalImage = design.mentalImage || "/images/mental.png";
  const physicalCta = design.physicalCta || "";
  const mentalCta = design.mentalCta || "";
  const heroBenefit1 = design.heroBenefit1 || "Healthier\nCommunities";
  const heroBenefit2 = design.heroBenefit2 || "Brighter\nFutures";
  const heroBenefit3 = design.heroBenefit3 || "Stronger\nFamilies";
  const heroBenefit4 = design.heroBenefit4 || "A Kinder\nTomorrow";
  const campaignBadge = design.campaignBadge || "Health";
  const campaignCta = design.campaignCta || "Support This Campaign";
  const requirementCta = design.requirementCta || "";
  const donationQuote = design.donationQuote || "Small acts.\nwhen done together,\nmake a big difference.";
  const donationAttribution = design.donationAttribution || "— Team Spandana";
  const donationSecureLabel = design.donationSecureLabel || "Donate Securely";
  const selectedOpportunityPresets = activeOpportunity ? (donorType === "indian" ? activeOpportunity.pricing?.INR : activeOpportunity.pricing?.USD) : undefined;
  const selectedPresetAmounts = givingFrequency === "monthly"
    ? (selectedOpportunityPresets?.monthlyPresets?.length ? selectedOpportunityPresets.monthlyPresets : (selectedOpportunityPresets?.presets || []))
    : (selectedOpportunityPresets?.presets || []);
  const impactStat1Label = design.impactStat1Label || "Lives Touched";
  const impactStat2Label = design.impactStat2Label || "Children Supported";
  const impactStat3Label = design.impactStat3Label || "Community Programs";
  const impactStat4Label = design.impactStat4Label || "Dedicated Volunteers";

  return (
    <div className="min-h-screen bg-white text-[#09294D] overflow-x-hidden">
      <Nav />
      <main>
        {/* HERO — blue reference design */}
        <section className="relative pt-[80px]">
          <div className="relative min-h-[400px] md:min-h-[455px] overflow-hidden bg-[#062746]">
            <img src={heroImage} alt="Community supported by Spandana" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#062746]/96 via-[#0A3156]/82 to-[#062746]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062746]/65 via-transparent to-transparent" />
            <div className="relative z-10 max-w-[1280px] mx-auto min-h-[400px] md:min-h-[455px] px-5 sm:px-8 lg:px-10 flex items-center">
              <div className="max-w-[650px] text-white py-10 md:py-12">
                {heroEyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7DD7FF] mb-3">{heroEyebrow}</p>}
                <h1 className="font-serif font-bold text-5xl sm:text-6xl md:text-[68px] leading-[0.93] tracking-[-0.035em]">
                  <span className="block">{heroLine1}</span>
                  <span className="block">{heroLine2}</span>
                  <span className="block text-[#13B7FF]">{heroLine3}</span>
                </h1>
                <div className="mt-5 text-base md:text-[17px] leading-7 text-white/85 max-w-[600px]" dangerouslySetInnerHTML={{ __html: sub }} />
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={handleStartGiving} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#087CF0] px-7 py-3.5 font-bold shadow-lg shadow-black/20 hover:bg-[#006FE6] transition">{heroCta}<Heart size={17}/></button>
                  <a href="#our-work" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/5 px-7 py-3.5 font-semibold hover:bg-white/10 transition">{design.heroSecondaryCta || "See Our Impact"} <ArrowRight size={17}/></a>
                </div>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[650px]">
                  {[[heroBenefit1,UsersRound],[heroBenefit2,Sparkles],[heroBenefit3,UsersRound],[heroBenefit4,Heart]].map(([label,I]: any) => <div key={label} className="flex items-center gap-2.5"><span className="w-9 h-9 rounded-full bg-[#087CF0]/30 border border-white/20 flex items-center justify-center"><I size={17}/></span><span className="text-[12px] font-semibold leading-tight whitespace-pre-line">{label}</span></div>)}
                </div>
              </div>
            </div>
            <div className="absolute right-6 md:right-12 top-28 md:top-32 hidden lg:block text-right text-white/90 max-w-[190px]">
              <p className="font-serif text-2xl leading-tight whitespace-pre-line">{heroSideText}</p>
              <Heart className="ml-auto mt-3 text-[#13B7FF]" size={27}/>
              <p className="mt-8 inline-block -rotate-3 bg-[#086CC8] px-5 py-2 font-serif text-xl text-white shadow-sm whitespace-pre-line">{heroBrushText}</p>
            </div>
          </div>
        </section>

        {/* PATHWAYS — frozen two-card layout */}
        {showPathways && <section id="our-work" className="py-6 md:py-7 bg-white">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex items-end justify-between gap-4 mb-4"><h2 className="font-serif font-bold text-3xl md:text-[34px] tracking-tight">{pathwaysHeading}</h2><span className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#087CF0]">{pathwaysLinkLabel} <ArrowRight size={15}/></span></div>
            <div className="grid md:grid-cols-2 gap-4">
              <article className="relative overflow-hidden rounded-xl border border-[#DCEBEA] bg-gradient-to-r from-[#F3FBF9] to-[#EAF7F3] min-h-[96px]">
                <div className="absolute right-0 top-0 h-full w-[31%] opacity-25"><img src={physicalImage} alt="" className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-[#F3FBF9] to-transparent"/></div>
                <div className="relative z-10 p-4 md:p-5 flex items-center gap-4 max-w-[88%]"><div className="w-14 h-14 shrink-0 rounded-full bg-white border border-[#D7E8E2] text-[#0B8C62] flex items-center justify-center shadow-sm"><Heart size={28}/></div><div><h3 className="font-serif text-xl md:text-2xl font-bold">{physicalTitle}</h3><p className="mt-1 text-sm leading-5 text-[#4F6675] max-w-[520px]">{physicalDescription}</p>{physicalCta && <span className="text-xs font-semibold text-[#087CF0] mt-1 inline-block">{physicalCta}</span>}</div></div><a href="/programs/physical-health" aria-label={`Open ${physicalTitle}`} className="absolute right-5 bottom-4 w-8 h-8 rounded-full bg-[#087CF0] text-white flex items-center justify-center hover:bg-[#006FE6] transition"><ArrowRight size={15}/></a>
              </article>
              <article className="relative overflow-hidden rounded-xl border border-[#D8E5F5] bg-gradient-to-r from-[#F2F8FF] to-[#E8F2FF] min-h-[96px]">
                <div className="absolute right-0 top-0 h-full w-[31%] opacity-25"><img src={mentalImage} alt="" className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-[#F2F8FF] to-transparent"/></div>
                <div className="relative z-10 p-4 md:p-5 flex items-center gap-4 max-w-[88%]"><div className="w-14 h-14 shrink-0 rounded-full bg-white border border-[#D4E2F4] text-[#087CF0] flex items-center justify-center shadow-sm"><Sparkles size={28}/></div><div><h3 className="font-serif text-xl md:text-2xl font-bold">{mentalTitle}</h3><p className="mt-1 text-sm leading-5 text-[#4F6675] max-w-[520px]">{mentalDescription}</p>{mentalCta && <span className="text-xs font-semibold text-[#087CF0] mt-1 inline-block">{mentalCta}</span>}</div></div><span className="absolute right-5 bottom-4 w-8 h-8 rounded-full bg-[#087CF0] text-white flex items-center justify-center"><ArrowRight size={15}/></span>
              </article>
            </div>
          </div>
        </section>}

        {/* FEATURED SUPPORT — mixed Campaigns + Requirements, exactly 3 */}
        {showCampaigns && activeFeaturedSupport.length > 0 && <section className="py-6 md:py-7 bg-white">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex items-end justify-between gap-4"><div><h2 className="font-serif font-bold text-3xl md:text-[34px] tracking-tight">{campaignsHeading}</h2><p className="mt-0.5 text-sm text-[#53697D]">{campaignsDescription}</p></div><a href="#give-now" className="hidden md:inline-flex items-center text-sm font-semibold text-[#087CF0]">{campaignsLinkLabel} <ArrowRight size={15} className="ml-2"/></a></div>
            <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeFeaturedSupport.map((item:any)=>{
                const isCampaign = item.supportKind === 'campaign';
                const targetAmount=Number(item.targetAmount||0); const raised=Number(item.metrics?.raised||item.raisedAmount||0); const progress=targetAmount>0?Math.min(100,Math.max(0,(raised/targetAmount)*100)):0;
                const detailsPath = isCampaign ? `/campaigns/${encodeURIComponent(item.id)}` : `/requirements/${encodeURIComponent(item.id)}`;
                const supportLabel = isCampaign ? campaignCta : (requirementCta || 'Support This Need');
                return <article key={`${item.supportKind}-${item.id}`} className="flex overflow-hidden rounded-xl border border-[#DDE8F4] bg-white shadow-[0_5px_18px_rgba(30,55,90,.06)] min-h-[145px]">
                  <div className="w-[34%] min-w-[34%] bg-[#EEF6FF] overflow-hidden">{item.image?<img src={item.image} alt="" className="h-full w-full object-cover"/>:<div className="h-full min-h-[145px] flex items-center justify-center bg-gradient-to-br from-[#EAF4FF] to-[#DCEEFF]"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#087CF0]">{isCampaign ? 'Campaign' : 'Need'}</span></div>}</div>
                  <div className="p-3.5 flex-1 min-w-0 flex flex-col"><span className="self-start rounded-full bg-[#EEF6FF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[#087CF0]">{item.program || item.category || (isCampaign ? campaignBadge : 'Specific Need')}</span><h3 className="font-serif font-bold text-lg leading-tight mt-1.5 line-clamp-2">{item.title}</h3><p className="mt-1 text-[11px] leading-4 text-[#52697C] line-clamp-2">{item.description || item.campaignDetails?.sections?.basic?.shortDescription || ''}</p>{isCampaign && targetAmount>0&&<div className="mt-auto pt-2"><div className="flex justify-between text-[10px] font-semibold"><span>{formatMoney(raised,item.currency||'INR')} raised</span><span className="text-[#5F7183]">of {formatMoney(targetAmount,item.currency||'INR')}</span></div><div className="h-1.5 rounded-full bg-[#E4EEF8] mt-1 overflow-hidden"><div className="h-full rounded-full bg-[#22A86B]" style={{width:`${progress}%`}}/></div></div>}<a href={detailsPath} className="mt-2 inline-flex items-center justify-center rounded-md bg-[#087CF0] text-white px-2.5 py-2 text-[11px] font-bold">{supportLabel}</a></div>
                </article>
              })}
            </div>
          </div>
        </section>}

        {/* SPECIFIC NEEDS — sourced directly from Donation Opportunities */}
        {showRequirements && activeSpecificNeeds.length > 0 && <section className="py-6 md:py-7 bg-[#FBFDFF] border-y border-[#E8EFF6]">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex items-end justify-between gap-4"><div><h2 className="font-serif font-bold text-3xl md:text-[34px] tracking-tight">{requirementsHeading}</h2><p className="mt-0.5 text-sm text-[#53697D]">{requirementsDescription}</p></div><span className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#087CF0]">{requirementsLinkLabel} <ArrowRight size={15}/></span></div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5">{activeSpecificNeeds.map((item:any)=><button key={item.id} type="button" onClick={()=>openOpp(item)} className={`group flex items-center gap-2.5 rounded-xl border bg-white px-3 py-2.5 text-left shadow-[0_4px_16px_rgba(10,60,110,.04)] hover:-translate-y-0.5 hover:shadow-md transition ${openOpportunity===item.id ? 'border-[#087CF0] ring-2 ring-[#087CF0]/15 bg-[#F7FBFF]' : 'border-[#DCE7F1]'}`}><div className="min-w-0 flex-1"><p className="font-semibold text-xs leading-tight line-clamp-2">{item.title}</p><p className="mt-1 text-[10px] text-[#6B7C8F] line-clamp-1">{item.description || 'Support this need'}</p></div><span className="shrink-0 w-7 h-7 rounded-full bg-[#087CF0] text-white flex items-center justify-center"><ArrowRight size={13}/></span></button>)}</div>
          </div>
        </section>}

        {/* DONATION — frozen blue donation strip */}
        {showDonation && <section id="give-now" className="relative py-6 md:py-7 overflow-hidden bg-[#EAF4FF]">
          <div className="absolute right-0 top-0 bottom-0 w-[40%] hidden lg:block"><img src={donationImage} alt="" className="h-full w-full object-cover object-center"/><div className="absolute inset-0 bg-gradient-to-l from-[#0B3658]/75 via-[#0B3658]/25 to-transparent"/></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-[820px]"><h2 className="font-serif font-bold text-3xl md:text-[34px] tracking-tight">{donationHeading}</h2><p className="mt-0.5 text-sm text-[#52697C]">{donationDescription}</p></div>
            <div className="mt-3 max-w-[720px] rounded-xl bg-white/95 backdrop-blur-sm p-3.5 md:p-4 shadow-[0_10px_30px_rgba(10,60,110,.10)] border border-white">
              <div className="inline-flex rounded-md overflow-hidden border border-[#D9E5F0] bg-[#F4F8FC]"><button type="button" onClick={()=>{setGivingFrequency('one-time');setAmount(0);setCustom('');}} className={`px-6 py-2 font-semibold text-xs border-r border-[#D9E5F0] ${givingFrequency==='one-time'?'bg-white text-[#0B2F57]':'text-[#52697C]'}`}>{design.donationOneTimeLabel || 'One-time'}</button><button type="button" onClick={()=>{setGivingFrequency('monthly');setAmount(0);setCustom('');}} className={`px-6 py-2 font-semibold text-xs border-r border-[#D9E5F0] ${givingFrequency==='monthly'?'bg-white text-[#0B2F57]':'text-[#52697C]'}`}>{design.donationMonthlyLabel || 'Monthly'}</button><button type="button" onClick={()=>{setGivingFrequency('custom');setAmount(0);setCustom('');}} className={`px-6 py-2 font-semibold text-xs ${givingFrequency==='custom'?'bg-white text-[#0B2F57]':'text-[#52697C]'}`}>{design.donationCustomLabel || 'Other'}</button></div>
              {!activeOpportunity ? null : activeOpportunity.type === 'unit' ? <div className="mt-4"><AmountChooser/></div> : <div className="mt-4">
                {givingFrequency === 'custom' ? <div><p className="text-sm font-semibold">Enter your amount</p><input type="number" min="1" value={custom} onChange={e=>{setCustom(e.target.value);setAmount(0)}} placeholder="Custom amount" className="mt-3 w-full max-w-[240px] rounded-xl border border-[#D8E3ED] px-3 py-2.5 bg-white"/></div> : <div><p className="text-sm font-semibold">Choose an amount</p><div className="flex flex-wrap gap-2 mt-3">{(selectedPresetAmounts || []).map((v:number)=><button key={v} type="button" onClick={()=>{setAmount(v);setCustom('')}} className={`px-3.5 py-2 rounded-xl border font-semibold ${amount===v&&!custom?'bg-[#087CF0] text-white border-[#087CF0]':'border-[#DDE8F4] bg-white hover:border-[#087CF0]'}`}>{currencySymbol}{donorType==='indian'?v.toLocaleString('en-IN'):(v*rate).toFixed(0)}</button>)}</div></div>}
                {paymentReady && <div className="mt-4 border-t border-[#E5EDF6] pt-3"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] text-[#52697C]">Your contribution</p><p className="font-serif text-2xl mt-0.5">{currencySymbol}{displayTotal.toLocaleString(undefined,{maximumFractionDigits:2})}{givingFrequency==='monthly'?' / month':''}</p></div><span className="text-[10px] font-bold text-[#087CF0] flex items-center gap-1"><ShieldCheck size={13}/> Secure giving</span></div><div className="mt-3 grid sm:grid-cols-2 gap-2.5"><input value={donor.name} onChange={e=>setDonor({...donor,name:e.target.value})} placeholder="Name" className="rounded-lg border border-[#D8E3ED] px-3 py-2.5 text-sm bg-[#F7FAFF]"/><input value={donor.email} onChange={e=>setDonor({...donor,email:e.target.value})} placeholder="Email" className="rounded-lg border border-[#D8E3ED] px-3 py-2.5 text-sm bg-[#F7FAFF]"/><input value={donor.mobile} onChange={e=>setDonor({...donor,mobile:e.target.value})} placeholder="Mobile" className="rounded-lg border border-[#D8E3ED] px-3 py-2.5 text-sm bg-[#F7FAFF]"/><input value={donor.country} onChange={e=>setDonor({...donor,country:e.target.value})} placeholder="Country" className="rounded-lg border border-[#D8E3ED] px-3 py-2.5 text-sm bg-[#F7FAFF]"/></div><input value={providerReference} onChange={e=>setProviderReference(e.target.value)} placeholder="Payment reference / UTR (optional)" className="w-full rounded-lg border border-[#D8E3ED] px-3 py-2.5 mt-2.5 text-sm bg-[#F7FAFF]"/><button type="button" onClick={()=>document.getElementById("donation-payment-methods")?.scrollIntoView({behavior:"smooth",block:"center"})} className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[#087CF0] text-white px-5 py-2.5 text-xs font-bold"><ShieldCheck size={14}/>{donationSecureLabel}</button><div id="donation-payment-methods"><PaymentMethods/></div></div>}
              </div>}
              {activeOpportunity && <button type="button" onClick={()=>{setOpenOpportunity(null);setAmount(0);setCustom('');}} className="mt-3 text-xs font-semibold text-[#52697C] hover:text-[#087CF0]">Clear selected need</button>}
            </div>
            <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-[310px] text-white text-right pr-2"><p className="font-serif text-xl leading-tight whitespace-pre-line">“{donationQuote}”</p><p className="mt-2 text-xs font-semibold text-white/80">{donationAttribution}</p><Heart className="ml-auto mt-2 text-[#13B7FF]" size={22}/></div>
          </div>
        </section>}

        {/* IMPACT / TRUST */}
        {showImpact && <section className="py-6 md:py-7 bg-white">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between gap-5"><div><h2 className="font-serif font-bold text-3xl md:text-[34px]">{impactHeading}</h2><p className="mt-0.5 text-sm text-[#53697D]">{impactDescription}</p></div></div>
            <div className="mt-4 grid md:grid-cols-4 gap-2.5">{[[opportunities.length,impactStat1Label,UsersRound],[activeFeaturedSupport.length,impactStat2Label,Sparkles],[activeSpecificNeeds.length,impactStat3Label,Heart],[2,impactStat4Label,ShieldCheck]].map(([value,label,I]:any)=><div key={label} className="rounded-xl border border-[#DFE9F3] bg-[#F7FAFF] p-3.5 text-center"><div className="mx-auto w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#087CF0] shadow-sm"><I size={20}/></div><p className="font-serif font-bold text-xl mt-2">{value}</p><p className="text-[10px] text-[#53697D] mt-0.5">{label}</p></div>)}</div>
            <div className="mt-3 rounded-xl border border-[#DCE7F1] bg-[#F7FAFF] p-4 flex items-center gap-4"><div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#087CF0] shrink-0"><Heart size={21}/></div><div className="flex-1"><p className="font-serif text-base md:text-lg font-bold">“{design.testimonialText || "Every contribution is an opportunity to care, strengthen a community and build hope."}”</p><p className="mt-1 text-xs text-[#53697D]">{design.testimonialAttribution || "— Spandana Care Aid Foundation"}</p></div></div>
          </div>
        </section>}

        {/* FINAL CTA */}
        {showFinalCta && <section className="py-8 md:py-10 bg-white">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10"><div className="relative overflow-hidden rounded-[28px] min-h-[250px] flex items-center bg-[#062746] text-white"><img src={design.finalCtaImage || heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30"/><div className="absolute inset-0 bg-gradient-to-r from-[#062746] via-[#062746]/88 to-transparent"/><div className="relative z-10 max-w-2xl p-8 md:p-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#7DD7FF]">Together we care</p><h2 className="font-serif font-bold text-3xl md:text-4xl mt-2">{finalCtaHeading}</h2><p className="mt-3 text-white/75 max-w-xl">{finalCtaText}</p><button onClick={handleStartGiving} className="mt-6 inline-flex items-center rounded-full bg-[#087CF0] text-white px-6 py-3.5 font-bold">{finalCtaLabel} <Heart size={17} className="ml-2"/></button></div></div></div>
        </section>}
      </main>
      <p className="max-w-4xl mx-auto px-4 text-xs text-[#6C7D90] text-center pb-7">{tax}</p>
      <Footer />
      <CommunityChat />
    </div>
  );
}
