import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Brain, HeartHandshake, Shield, Sparkles } from "lucide-react";
import { Link, useParams } from "wouter";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

interface Program {
  _id?: string; id?: string; title: string; description?: string; pillar: "physical" | "mental" | string;
  status?: string; image?: string; imageAlt?: string; readMoreLabel?: string; heroTitle?: string; heroIntro?: string;
  about?: string; why?: string; whoItServes?: string; whatWeDo?: string; howItWorks?: string;
  objectives?: string; outcomes?: string; impact?: string; media?: Array<{url?:string;alt?:string;caption?:string}>;
  ctaHeading?: string; ctaDescription?: string; ctaButtonLabel?: string; ctaButtonHref?: string; sectionVisibility?: Record<string,boolean>;
  published?: boolean; order?: number;
}

const sections: Array<{key:keyof Program; label:string}> = [
  {key:"about",label:"About this program"},{key:"why",label:"Why this program"},{key:"whoItServes",label:"Who it serves"},
  {key:"whatWeDo",label:"What we do"},{key:"howItWorks",label:"How it works"},{key:"objectives",label:"Objectives"},
  {key:"outcomes",label:"Expected outcomes"},{key:"impact",label:"Impact"}
];

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!id) return; fetch(`/api/v1/programs/${encodeURIComponent(id)}`).then(r=>{if(!r.ok) throw new Error(); return r.json();}).then(setProgram).catch(()=>setProgram(null)).finally(()=>setLoading(false)); }, [id]);
  if (loading) return <><Nav/><main className="min-h-[70vh] pt-32 flex items-center justify-center text-muted-foreground">Loading program…</main><Footer/></>;
  if (!program || program.published === false || program.status !== "active") {
    return <><Nav/><main className="min-h-[70vh] pt-32 px-6 flex flex-col items-center justify-center text-center"><h1 className="text-3xl font-serif font-bold">Program not found</h1><p className="text-muted-foreground mt-3">This program may be unpublished or no longer available.</p><Link href="/sahara#core-pillars" className="mt-6 inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full"><ArrowLeft size={15}/> Back to Core Pillars</Link></main><Footer/></>;
  }
  const isMental=program.pillar==="mental"; const Icon=isMental?Brain:Shield; const accent=isMental?"text-purple-700":"text-primary"; const soft=isMental?"bg-purple-100":"bg-primary/10";
  const vis=(key:string)=>program.sectionVisibility?.[key]!==false;
  const parentHref=isMental?"/programs/mental-care":"/programs/physical-care"; const parentLabel=isMental?"Back to Mental Care":"Back to Physical Care";
  const contentSections=sections.filter(s=>vis(String(s.key))&&String(program[s.key]??"").trim());
  return <><Nav/><main className="pt-20">
    {vis("hero")&&<section className="relative overflow-hidden bg-primary px-6 md:px-12 py-20 md:py-28"><div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{backgroundImage:"radial-gradient(circle, #fff 1px, transparent 0)",backgroundSize:"32px 32px"}}/><div className="relative z-10 max-w-6xl mx-auto"><Link href={parentHref} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-10"><ArrowLeft size={15}/>{parentLabel}</Link><div className="grid md:grid-cols-[1.1fr_.9fr] gap-10 items-center"><motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.65}}><div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest mb-5"><Sparkles size={12}/>{isMental?"Mental Care":"Physical Care"}</div><h1 className="text-3xl md:text-5xl font-serif font-medium text-white leading-tight">{program.heroTitle||program.title}</h1><p className="text-white/75 text-base md:text-lg leading-relaxed mt-5 max-w-2xl">{program.heroIntro||program.description}</p>{(program.ctaButtonLabel||true)&&<div className="flex flex-wrap gap-3 mt-8"><Link href={program.ctaButtonHref||"/get-involved"} className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full">{program.ctaButtonLabel||"Get Involved"}<ArrowRight size={15}/></Link></div>}</motion.div>{vis("heroImage")&&program.image?<motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} transition={{duration:.7}} className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/10"><img src={program.image} alt={program.imageAlt||program.title} className="w-full aspect-[4/3] object-cover"/></motion.div>:<div className="hidden md:flex justify-center"><div className={`w-40 h-40 rounded-[2rem] ${soft} flex items-center justify-center`}><Icon size={72} className={accent}/></div></div>}</div></div></section>}
    <section className="py-16 md:py-20 px-6 md:px-12 bg-background"><div className="max-w-4xl mx-auto space-y-7">{contentSections.map((s,i)=><motion.article key={String(s.key)} initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.04}} className="rounded-3xl border border-border bg-card p-7 md:p-9"><div className="flex items-center gap-3 mb-4"><div className={`w-10 h-10 rounded-xl ${soft} flex items-center justify-center`}><HeartHandshake size={19} className={accent}/></div><h2 className="text-xl md:text-2xl font-serif font-semibold">{s.label}</h2></div><div className="text-muted-foreground leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{__html:String(program[s.key]||"")}}/></motion.article>)}{contentSections.length===0&&<div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">Detailed content is being prepared for this program.</div>}</div></section>
    {vis("media")&&program.media?.filter(m=>m?.url).length ? <section className="py-16 px-6 md:px-12 bg-foreground/[0.02] border-y border-border"><div className="max-w-5xl mx-auto"><h2 className="text-2xl md:text-3xl font-serif font-medium mb-8">Program Media</h2><div className="grid sm:grid-cols-2 gap-6">{program.media.filter(m=>m?.url).map((m,i)=><figure key={i} className="rounded-2xl overflow-hidden border border-border bg-card"><img src={m.url} alt={m.alt||program.title} className="w-full aspect-[4/3] object-cover"/>{m.caption&&<figcaption className="p-4 text-sm text-muted-foreground">{m.caption}</figcaption>}</figure>)}</div></div></section>:null}
    {vis("cta")&&<section className="py-20 px-6 md:px-12 bg-primary text-center"><div className="max-w-2xl mx-auto"><h2 className="text-2xl md:text-4xl font-serif font-medium text-white">{program.ctaHeading||"Be part of this work"}</h2><p className="text-white/70 mt-4 mb-8">{program.ctaDescription||"Help strengthen this program through your time, expertise, partnership or support."}</p><div className="flex flex-wrap justify-center gap-4"><Link href={program.ctaButtonHref||"/get-involved"} className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3 rounded-full">{program.ctaButtonLabel||"Get Involved"}<ArrowRight size={15}/></Link><Link href={parentHref} className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold px-7 py-3 rounded-full"><ArrowLeft size={15}/>{parentLabel}</Link></div></div></section>}
  </main><Footer/></>;
}
