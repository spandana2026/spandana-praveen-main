import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, HeartHandshake, Sparkles } from "lucide-react";
import { Link, useParams } from "wouter";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

interface Initiative {
  id?: string; _id?: string; title: string; description?: string; icon?: string; image?: string;
  status?: string; published?: boolean; careArea?: string; programIds?: string[];
}

export default function InitiativeDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Initiative | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/initiatives/${encodeURIComponent(id)}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setItem).catch(() => setItem(null)).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <><Nav/><main className="min-h-[70vh] pt-32 flex items-center justify-center text-muted-foreground">Loading initiative…</main><Footer/></>;
  if (!item) return <><Nav/><main className="min-h-[70vh] pt-32 px-6 flex flex-col items-center justify-center text-center"><h1 className="text-3xl font-serif font-bold">Initiative not found</h1><p className="text-muted-foreground mt-3">This initiative may be unpublished or no longer available.</p><Link href="/initiatives" className="mt-6 inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full"><ArrowLeft size={15}/> Back to Initiatives</Link></main><Footer/></>;
  const area = item.careArea === 'mental' ? 'Mental Care' : item.careArea === 'physical' ? 'Physical Care' : 'Community Initiative';
  return <><Nav/><main className="pt-20">
    <section className="relative overflow-hidden bg-primary px-6 md:px-12 py-20 md:py-28">
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)",backgroundSize:"32px 32px"}}/>
      <div className="relative z-10 max-w-6xl mx-auto">
        <Link href="/initiatives" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-10"><ArrowLeft size={15}/> All Initiatives</Link>
        <div className="grid md:grid-cols-[1.1fr_.9fr] gap-10 items-center">
          <div><div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest mb-5"><Sparkles size={12}/> {area}</div>
            <h1 className="text-3xl md:text-5xl font-serif font-medium text-white leading-tight">{item.title}</h1>
            {item.description && <p className="text-white/70 text-base md:text-lg leading-relaxed mt-5 max-w-2xl">{item.description}</p>}
            <div className="flex flex-wrap gap-3 mt-8"><Link href="/get-involved" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full hover:bg-white/90">Get Involved <ArrowRight size={15}/></Link></div>
          </div>
          {item.image ? <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/10"><img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover"/></div> : <div className="hidden md:flex justify-center"><div className="w-40 h-40 rounded-[2rem] bg-white/10 flex items-center justify-center text-6xl">{item.icon || '🤝'}</div></div>}
        </div>
      </div>
    </section>
    <section className="py-16 md:py-20 px-6 md:px-12 bg-background"><div className="max-w-4xl mx-auto grid md:grid-cols-[auto_1fr] gap-6 items-start"><div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><HeartHandshake size={25} className="text-primary"/></div><div><p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">About this initiative</p><h2 className="text-2xl md:text-3xl font-serif font-medium">Community action connected to the people we serve</h2><p className="text-muted-foreground leading-relaxed mt-4">This initiative is an independent community-development record. It can be connected to Programs, Projects, Events, Locations, People and Media without duplicating those records.</p></div></div></section>
  </main><Footer/></>;
}
