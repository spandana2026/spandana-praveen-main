import { useEffect, useState } from "react";
import { ArrowRight, Globe, Sparkles } from "lucide-react";
import { Link } from "wouter";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

interface Initiative { id?: string; _id?: string; title: string; description?: string; icon?: string; image?: string; careArea?: string; }

export default function Initiatives() {
  const [items, setItems] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/v1/initiatives").then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
  return <><Nav/><main className="pt-20">
    <section className="relative overflow-hidden bg-primary px-6 md:px-12 py-20 md:py-28"><div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)",backgroundSize:"32px 32px"}}/><div className="relative max-w-6xl mx-auto text-center"><div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest"><Sparkles size={12}/> Community Initiatives</div><h1 className="text-4xl md:text-6xl font-serif font-medium text-white mt-5">Community action, built together.</h1><p className="text-white/70 max-w-2xl mx-auto mt-5 text-base md:text-lg leading-relaxed">Independent initiatives that help communities learn, participate, connect and grow.</p></div></section>
    <section className="px-6 md:px-12 py-16 md:py-20"><div className="max-w-6xl mx-auto">{loading ? <div className="py-16 text-center text-muted-foreground">Loading initiatives…</div> : items.length === 0 ? <div className="py-16 text-center text-muted-foreground"><Globe size={40} className="mx-auto mb-3 opacity-25"/><p>No published initiatives are available right now.</p></div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{items.map(item => { const id = item.id || item._id || ""; return <article key={id} className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-md transition-shadow">{item.image ? <img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover"/> : <div className="w-full aspect-[4/3] bg-muted/30 flex items-center justify-center text-5xl">{item.icon || "🤝"}</div>}<div className="p-6"><p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">{item.careArea === "physical" ? "Physical Care" : item.careArea === "mental" ? "Mental Care" : "Community Initiative"}</p><h2 className="text-xl font-serif font-semibold">{item.title}</h2>{item.description && <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3">{item.description}</p>}<Link href={`/initiatives/${id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Explore Initiative <ArrowRight size={14}/></Link></div></article>})}</div>}</div></section>
  </main><Footer/></>;
}
