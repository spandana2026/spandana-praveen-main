import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Brain, Building2, ChevronRight, Clock, Heart, HeartHandshake,
  Mail, MapPin, Shield, Sparkles, Star, Users,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import VolunteerModal from "@/components/volunteer-modal";

interface SaharaStat { number: string; label: string; visible?: boolean; order?: number; }
interface SaharaHour { day: string; time: string; visible?: boolean; }
interface PillarHighlight { label: string; value: string; visible?: boolean; order?: number; }
interface PillarPageConfig {
  enabled?: boolean;
  badge?: string;
  title?: string;
  titleItalic?: string;
  heroDescription?: string;
  heroImage?: string;
  introHeading?: string;
  intro?: string;
  whyHeading?: string;
  whyBody?: string;
  focusHeading?: string;
  focusBody?: string;
  programSectionHeading?: string;
  programSectionSubtext?: string;
  programCardCta?: string;
  pillarCardCtaVisible?: boolean;
  pillarCardCtaLabel?: string;
  backToProgramsLabel?: string;
  backToProgramsHref?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButton1?: string;
  ctaButton1Href?: string;
  ctaButton2?: string;
  ctaButton2Href?: string;
  highlights?: PillarHighlight[];
}
interface SaharaPage {
  hero: { badge: string; title: string; titleItalic: string; description: string; button1: string; button2: string; button1Href?: string; button2Href?: string; visible?: boolean; badgeVisible?: boolean; titleVisible?: boolean; descriptionVisible?: boolean; button1Visible?: boolean; button2Visible?: boolean };
  about: { badge?: string; heading: string; headingItalic: string; para1: string; para2: string; image?: string; imageAlt?: string; storyLabel?: string; storyValue?: string; establishedLabel?: string; establishedValue?: string; readMoreLabel?: string; readLessLabel?: string; visible?: boolean; badgeVisible?: boolean; headingVisible?: boolean; para1Visible?: boolean; para2Visible?: boolean; imageVisible?: boolean; storyVisible?: boolean; establishedVisible?: boolean; readMoreVisible?: boolean };
  stats: SaharaStat[];
  statsVisible?: boolean;
  pillars: { sectionBadge?: string; heading?: string; subtext?: string; sectionVisible?: boolean; sectionBadgeVisible?: boolean; headingVisible?: boolean; subtextVisible?: boolean; physical: PillarPageConfig; mental: PillarPageConfig };
  visitSection: { heading: string; headingItalic: string; inclusiveNote: string; visible?: boolean; headingVisible?: boolean; inclusiveNoteVisible?: boolean; directionsVisible?: boolean; contactVisible?: boolean; hoursVisible?: boolean; directionsLabel?: string; directionsUrl?: string };
  hours: SaharaHour[];
  contact: { address: string; email: string };
  cta: { title: string; titleItalic: string; description: string; visible?: boolean; headingVisible?: boolean; descriptionVisible?: boolean; button1Visible?: boolean; button2Visible?: boolean; button1Label?: string; button1Href?: string; button2Label?: string; button2Href?: string };
}
interface SiteSettings { saharaPage?: SaharaPage; }
interface HealthProgram { id?: string; _id?: string; title: string; description?: string; pillar: "physical" | "mental" | string; status?: string; image?: string; published?: boolean; order?: number; }

const DEFAULT_SAHARA: SaharaPage = {
  hero: { visible:true, badgeVisible:true, titleVisible:true, descriptionVisible:true, button1Visible:true, button2Visible:true, badge: "Together with Hope", title: "Sahara", titleItalic: "Community Center", description: "A welcoming community space where people can find support, dignity, opportunity and connection.", button1: "Explore Programs", button2: "Visit Us", button1Href: "#core-pillars", button2Href: "#visit" },
  about: { badge: "Our Story", heading: "More than a building —", headingItalic: "a second home.", para1: "Sahara is envisioned as a welcoming, practical community space where Spandana Care Aid Foundation can bring awareness, knowledge and advice closer to people.", para2: "The center is designed to reduce barriers: connecting families to health and wellbeing support, children and youth to learning opportunities, and individuals to skills, guidance and community networks.", image: "/images/hero.png", imageAlt: "Sahara Community Center", storyLabel: "At the heart of", storyValue: "Every program we run", establishedLabel: "Established", establishedValue: "1999", readMoreLabel: "Read more", readLessLabel: "Show less" },
  statsVisible: true,
  stats: [
    { number: "25+", label: "Years of service", visible: true, order: 1 },
    { number: "2", label: "Core care pillars", visible: true, order: 2 },
    { number: "11", label: "Core programs", visible: true, order: 3 },
    { number: "Open", label: "To the community", visible: true, order: 4 },
  ],
  pillars: {
    sectionBadge: "Two Core Pillars", heading: "Where we focus our energy", subtext: "Explore the two core care areas of Sahara. Each pillar has its own explanation and draws its live program list from the canonical Core Programs manager.",
    physical: { enabled: true, badge: "Physical Care", title: "Physical", titleItalic: "Care", heroDescription: "Building healthier, stronger and more capable communities through health, education, recreation, skills, environmental responsibility and resilience.", introHeading: "What Physical Care means", intro: "Physical Care addresses the practical foundations of wellbeing. It brings together programs that help people stay healthy, learn, build useful skills, participate in community life and become more resilient.", whyHeading: "Why this matters", whyBody: "Good health and opportunity are closely connected. When people can access information, preventative care, education, skills and supportive community networks, they are better positioned to make confident choices and build stable futures.", focusHeading: "Our approach", focusBody: "Spandana works through awareness, knowledge and advice — creating pathways rather than dependency and connecting people with appropriate programs, professionals, institutions and opportunities.", programSectionHeading: "Our Physical Care Programs", programSectionSubtext: "The programs below are managed centrally under Core Programs. Their names, descriptions, status, order and media can be changed by the administrator without editing this page.", programCardCta: "Explore Program", pillarCardCtaVisible: true, pillarCardCtaLabel: "Explore Physical Care", backToProgramsLabel: "Back to Programs", backToProgramsHref: "/sahara#core-pillars", ctaHeading: "Help strengthen Physical Care", ctaDescription: "Volunteer, partner, provide expertise or support a program that helps communities become healthier and more capable.", ctaButton1: "Get Involved", ctaButton1Href: "/get-involved", ctaButton2: "Back to Programs", ctaButton2Href: "/sahara#core-pillars", highlights: [{label:"Care area",value:"Health, learning, skills & resilience",visible:true,order:1},{label:"Programs",value:"Live from Core Programs",visible:true,order:2},{label:"Approach",value:"Awareness · Knowledge · Advice",visible:true,order:3}] },
    mental: { enabled: true, badge: "Mental Care", title: "Mental", titleItalic: "Care", heroDescription: "Creating spaces where people can talk, connect, grow, navigate life challenges and find appropriate support without shame.", introHeading: "What Mental Care means", intro: "Mental Care focuses on emotional wellbeing, healthy relationships, personal growth, resilience and practical support. It recognises that people often need a safe conversation and trusted guidance before they are ready for formal services.", whyHeading: "Why this matters", whyBody: "Mental wellbeing affects families, education, work, relationships and community participation. Accessible awareness and supportive conversations can help people recognise challenges earlier and connect to appropriate care.", focusHeading: "Our approach", focusBody: "Spandana creates safe, respectful pathways for awareness, knowledge and advice while recognising when professional, emergency or specialist support is needed.", programSectionHeading: "Our Mental Care Programs", programSectionSubtext: "The programs below are managed centrally under Core Programs. Their names, descriptions, status, order and media can be changed by the administrator without editing this page.", programCardCta: "Explore Program", pillarCardCtaVisible: true, pillarCardCtaLabel: "Explore Mental Care", backToProgramsLabel: "Back to Programs", backToProgramsHref: "/sahara#core-pillars", ctaHeading: "Help strengthen Mental Care", ctaDescription: "Help create safe spaces, awareness and pathways to support for people and families facing life's challenges.", ctaButton1: "Get Involved", ctaButton1Href: "/get-involved", ctaButton2: "Back to Programs", ctaButton2Href: "/sahara#core-pillars", highlights: [{label:"Care area",value:"Connection, growth & wellbeing",visible:true,order:1},{label:"Programs",value:"Live from Core Programs",visible:true,order:2},{label:"Approach",value:"Awareness · Knowledge · Advice",visible:true,order:3}] },
  },
  visitSection: { heading: "We're here", headingItalic: "for you.", inclusiveNote: "Everyone is welcome. Sahara is intended to be a respectful, inclusive community space. Please confirm program-specific timings before visiting.", directionsLabel: "Get Directions", directionsUrl: "" },
  hours: [{day:"Monday – Friday",time:"8:00 AM – 8:00 PM",visible:true},{day:"Saturday",time:"9:00 AM – 6:00 PM",visible:true},{day:"Sunday",time:"10:00 AM – 4:00 PM",visible:true}],
  contact: { address: "Sahara Community Center, Spandana Care Aid Foundation — update this address in Admin", email: "spandanacareaidfoundation@gmail.com" },
  cta: { title: "Be part of", titleItalic: "the Sahara family.", description: "Volunteer your skills, join a program, partner with us, or simply help someone discover the right pathway.", visible: true, button1Label: "Get Involved", button1Href: "/get-involved", button2Label: "Find Us", button2Href: "#visit" },
};

const merge = (base: SaharaPage, incoming?: Partial<SaharaPage>): SaharaPage => ({ ...base, ...incoming, hero: { ...base.hero, ...(incoming?.hero ?? {}) }, about: { ...base.about, ...(incoming?.about ?? {}) }, stats: Array.isArray(incoming?.stats) ? incoming!.stats! : base.stats, pillars: { ...base.pillars, ...(incoming?.pillars ?? {}), physical: { ...base.pillars.physical, ...(incoming?.pillars?.physical ?? {}) }, mental: { ...base.pillars.mental, ...(incoming?.pillars?.mental ?? {}) } }, visitSection: { ...base.visitSection, ...(incoming?.visitSection ?? {}) }, hours: Array.isArray(incoming?.hours) ? incoming!.hours! : base.hours, contact: { ...base.contact, ...(incoming?.contact ?? {}) }, cta: { ...base.cta, ...(incoming?.cta ?? {}) } });

export default function Sahara() {
  const [p, setP] = useState<SaharaPage>(DEFAULT_SAHARA);
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then((d: SiteSettings) => { if (d.saharaPage) setP(merge(DEFAULT_SAHARA, d.saharaPage)); }).catch(() => {});
    fetch("/api/programs").then(r => r.json()).then((d: HealthProgram[]) => setPrograms(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const physicalPrograms = useMemo(() => programs.filter(x => x.pillar === "physical" && x.published !== false && x.status === "active").sort((a,b)=>(a.order??0)-(b.order??0)), [programs]);
  const mentalPrograms = useMemo(() => programs.filter(x => x.pillar === "mental" && x.published !== false && x.status === "active").sort((a,b)=>(a.order??0)-(b.order??0)), [programs]);
  const stats = [...p.stats].filter(s => s.visible !== false).sort((a,b)=>(a.order??0)-(b.order??0));
  const physical = p.pillars.physical;
  const mental = p.pillars.mental;

  const pillarCard = (kind: "physical" | "mental", cfg: PillarPageConfig, list: HealthProgram[]) => {
    const isMental = kind === "mental";
    const Icon = isMental ? Brain : Shield;
    return (
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .65 }} className="group relative rounded-[2rem] overflow-hidden border border-primary/15 bg-card hover:border-primary/40 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-7 md:p-9 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10 text-primary"><Icon size={27} /></div>
            <div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{cfg.badge}</div><h3 className="font-serif font-bold text-2xl">{cfg.title} <span className="italic text-muted-foreground">{cfg.titleItalic}</span></h3></div>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">{cfg.heroDescription}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {list.map((program) => <span key={program.id ?? program._id ?? program.title} className="px-3 py-2 rounded-xl text-xs font-semibold border bg-primary/[0.06] text-primary border-primary/10">{program.title}</span>)}
            {list.length === 0 && <span className="text-xs text-muted-foreground">Programs are being prepared.</span>}
          </div>
          {cfg.pillarCardCtaVisible === true && <Link href={kind === "physical" ? "/programs/physical-care" : "/programs/mental-care"} className="inline-flex items-center justify-between gap-4 bg-primary hover:bg-primary/90 text-white font-bold px-5 py-3.5 rounded-xl transition-colors text-sm self-start">
            {cfg.pillarCardCtaLabel ?? (isMental ? "Explore Mental Care" : "Explore Physical Care")}<ChevronRight size={16} />
          </Link>}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background overflow-x-hidden">
      <Nav />
      <main className="pt-16">
        {p.hero.visible !== false && <section className="relative min-h-[76vh] flex flex-col items-center justify-center text-center overflow-hidden px-6 py-24">
          <div className="absolute inset-0 bg-[url('/images/hero.png')] bg-cover bg-center scale-105" />
          <div className="absolute inset-0 bg-[#0033A0] opacity-85" />
          <div className="relative z-10 max-w-4xl">
            {p.hero.badgeVisible !== false && <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest mb-6"><Sparkles size={12} />{p.hero.badge}</div>}
            {p.hero.titleVisible !== false && <h1 className="text-5xl md:text-7xl font-serif font-medium text-white leading-tight">{p.hero.title} <span className="italic text-white/80">{p.hero.titleItalic}</span></h1>}
            {p.hero.descriptionVisible !== false && <div className="text-white/75 text-base md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: p.hero.description }} />}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              {p.hero.button1Visible !== false && <Button asChild size="lg" className="rounded-full h-14 px-10 bg-white text-[#0033A0] hover:bg-white/90"><a href={p.hero.button1Href ?? "#core-pillars"}>{p.hero.button1}</a></Button>}
              {p.hero.button2Visible !== false && <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-10 border-white/40 text-white hover:bg-white/10 hover:text-white"><a href={p.hero.button2Href ?? "#visit"}>{p.hero.button2}</a></Button>}
            </div>
          </div>
        </section>}

        {p.statsVisible !== false && stats.length > 0 && stats.some(stat=>stat.visible!==false) && <section className="py-10 md:py-14 px-6 md:px-12 bg-primary"><div className={`max-w-5xl mx-auto grid grid-cols-2 ${stats.length > 2 ? "md:grid-cols-4" : "md:grid-cols-2"} gap-6`}>{stats.filter(stat=>stat.visible!==false).sort((a,b)=>(a.order??0)-(b.order??0)).map((stat,i)=>{const Icon=[Users,HeartHandshake,Star,Building2][i]??Star;return <motion.div key={`${stat.label}-${i}`} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}} className="flex flex-col items-center text-center gap-2"><div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"><Icon size={18} className="text-white"/></div><span className="text-2xl md:text-3xl font-serif font-bold text-white">{stat.number}</span><span className="text-white/70 text-sm font-medium">{stat.label}</span></motion.div>})}</div></section>}

        {p.about.visible !== false && <section className="py-16 md:py-24 px-6 md:px-12 bg-background"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center"><motion.div initial={{opacity:0,x:-25}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.7}}>{p.about.badgeVisible !== false && <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5"><Sparkles size={13}/>{p.about.badge}</div>}{p.about.headingVisible !== false && <h2 className="text-2xl md:text-4xl font-serif font-medium mb-6 leading-snug">{p.about.heading}<br/><span className="italic text-muted-foreground">{p.about.headingItalic}</span></h2>}{p.about.para1Visible !== false && <div className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5" dangerouslySetInnerHTML={{__html:p.about.para1}}/>}{p.about.para2Visible !== false && <div className="hidden md:block text-muted-foreground text-base md:text-lg leading-relaxed" dangerouslySetInnerHTML={{__html:p.about.para2}}/>}{p.about.para2Visible !== false && <div className="md:hidden"><motion.div initial={false} animate={{height:aboutExpanded?"auto":0,opacity:aboutExpanded?1:0}} className="overflow-hidden"><div className="text-muted-foreground text-base leading-relaxed pb-3" dangerouslySetInnerHTML={{__html:p.about.para2}}/></motion.div>{p.about.readMoreVisible !== false && <button onClick={()=>setAboutExpanded(v=>!v)} className="text-sm font-semibold text-primary mt-1">{aboutExpanded?p.about.readLessLabel:p.about.readMoreLabel}</button>}</div>}</motion.div><motion.div initial={{opacity:0,x:25}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.7}} className="relative">{p.about.imageVisible !== false && <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-primary/8 relative"><img src={p.about.image} alt={p.about.imageAlt} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-[#0033A0]/40 to-transparent"/>{p.about.storyVisible !== false && <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border border-border/30"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><Heart size={16} className="text-primary"/></div><div><div className="text-xs text-muted-foreground font-medium">{p.about.storyLabel}</div><div className="text-sm font-bold text-foreground">{p.about.storyValue}</div></div></div></div>}</div>}{p.about.establishedVisible !== false && <div className="absolute -top-4 -right-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">{p.about.establishedLabel} {p.about.establishedValue}</div>}</motion.div></div></section>}

        {p.pillars.sectionVisible !== false && <section id="core-pillars" className="py-16 md:py-20 px-6 md:px-12 bg-foreground/[0.02] border-t border-border scroll-mt-20"><div className="max-w-6xl mx-auto">{(p.pillars.sectionBadgeVisible!==false||p.pillars.headingVisible!==false||p.pillars.subtextVisible!==false) && <div className="text-center max-w-3xl mx-auto mb-12">{p.pillars.sectionBadgeVisible!==false && <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-bold uppercase tracking-widest mb-4"><HeartHandshake size={13}/>{p.pillars.sectionBadge}</div>}{p.pillars.headingVisible!==false && <h2 className="text-2xl md:text-4xl font-serif font-medium">{p.pillars.heading}</h2>}{p.pillars.subtextVisible!==false && <div className="text-muted-foreground mt-3 text-base md:text-lg" dangerouslySetInnerHTML={{__html:p.pillars.subtext ?? ""}}/>}</div>}<div className="grid md:grid-cols-2 gap-6 lg:gap-8">{physical.enabled !== false && pillarCard("physical",physical,physicalPrograms)}{mental.enabled !== false && pillarCard("mental",mental,mentalPrograms)}</div></div></section>}

        {p.visitSection.visible !== false && <section id="visit" className="py-16 md:py-24 px-6 md:px-12 bg-card scroll-mt-20"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start"><div>{p.visitSection.headingVisible!==false && <><div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5"><MapPin size={13}/>Visit Us</div><h2 className="text-2xl md:text-3xl font-serif font-medium mb-6">{p.visitSection.heading} <span className="italic text-muted-foreground">{p.visitSection.headingItalic}</span></h2></>}{p.visitSection.contactVisible!==false && <div className="space-y-5"><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><MapPin size={18}/></div><div><div className="font-semibold mb-1">Address</div><div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{__html:p.contact.address}}/></div></div><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Mail size={18}/></div><div><div className="font-semibold mb-1">Email</div><a href={`mailto:${p.contact.email}`} className="text-primary text-sm hover:underline">{p.contact.email}</a></div></div>{p.visitSection.directionsVisible!==false && p.visitSection.directionsUrl && <a href={p.visitSection.directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-2 bg-primary text-white px-5 py-3 rounded-full text-sm font-bold">{p.visitSection.directionsLabel}<ArrowRight size={15}/></a>}</div>}</div><div>{p.visitSection.hoursVisible!==false && <><div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-5"><Clock size={13}/>Opening Hours</div><div className="rounded-2xl border border-border bg-background overflow-hidden">{p.hours.filter(h=>h.visible!==false).map((h,i)=><div key={`${h.day}-${i}`} className="flex items-center justify-between px-5 py-4 border-b last:border-b-0 border-border"><span className="font-medium text-sm">{h.day}</span><span className="text-sm text-muted-foreground">{h.time}</span></div>)}</div></>}{p.visitSection.inclusiveNoteVisible!==false && <div className="mt-5 text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{__html:p.visitSection.inclusiveNote}}/>}</div></div></section>}

        {p.cta.visible !== false && <section className="py-20 px-6 md:px-12 bg-primary text-center"><div className="max-w-2xl mx-auto">{p.cta.headingVisible!==false && <h2 className="text-2xl md:text-4xl font-serif font-medium text-white mb-4">{p.cta.title} <span className="italic text-white/75">{p.cta.titleItalic}</span></h2>}{p.cta.descriptionVisible!==false && <div className="text-white/70 text-base md:text-lg mb-8" dangerouslySetInnerHTML={{__html:p.cta.description}}/>}<div className="flex flex-wrap gap-4 justify-center">{p.cta.button1Visible!==false && <button onClick={()=>setVolunteerModalOpen(true)} className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3 rounded-full hover:bg-white/90 text-sm">{p.cta.button1Label}<ArrowRight size={15}/></button>}{p.cta.button2Visible!==false && <a href={p.cta.button2Href ?? "#visit"} className="inline-flex items-center gap-2 bg-transparent text-white font-bold px-7 py-3 rounded-full border-2 border-white/40 hover:border-white text-sm">{p.cta.button2Label}<MapPin size={15}/></a>}</div></div></section>}
      </main>
      <Footer />
      <VolunteerModal open={volunteerModalOpen} onClose={()=>setVolunteerModalOpen(false)} whatsappGroupLink={undefined} />
    </div>
  );
}
