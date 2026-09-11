import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Brain, ArrowRight, Sparkles, ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const STATS = [
  { number: "25+", label: "Years of service" },
  { number: "10,000+", label: "Families reached" },
  { number: "11", label: "Current programs" },
  { number: "2", label: "Care areas" },
];

interface Settings {
  programsSection?: { title?: string; subtitle?: string; };
}

interface HealthProgram {
  id?: string; _id?: string; title: string; description: string;
  pillar: "physical" | "mental" | "community"; status: string;
  image: string; published: boolean; order: number;
}

export default function Programs() {
  const [s, setS] = useState<Settings>({});
  const [programs, setPrograms] = useState<HealthProgram[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d: Settings) => setS(d))
      .catch(() => {});
    fetch("/api/programs")
      .then((r) => r.json())
      .then((d: HealthProgram[]) => setPrograms(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const title = s.programsSection?.title ?? "Our Programs";
  const subtitle =
    s.programsSection?.subtitle ??
    "A multi-dimensional approach to community upliftment — caring for the body, the mind, and the whole person.";

  return (
    <>
      <Nav />
      <main className="pt-20">
        {/* ── HERO ── */}
        <section className="relative min-h-[56vh] flex flex-col items-center justify-center text-center overflow-hidden bg-primary px-6 py-24">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} /> 25+ Years of Impact
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-white mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-white/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {/* Two pill links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative z-10 flex flex-wrap gap-3 mt-10 justify-center"
          >
            <Link
              href="/programs#physical-care"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-bold text-sm hover:bg-white/90 transition-colors"
            >
              <Shield size={14} /> Physical Care <ChevronRight size={13} />
            </Link>
            <Link
              href="/programs#mental-care"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 border border-white/30 text-white font-bold text-sm hover:bg-white/20 transition-colors"
            >
              <Brain size={14} /> Mental Care <ChevronRight size={13} />
            </Link>
          </motion.div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="py-10 bg-foreground/[0.03] border-y border-border">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {STATS.map((st, i) => (
              <motion.div key={i} variants={fadeUp}>
                <p className="text-2xl md:text-3xl font-serif font-bold text-primary">{st.number}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-medium">{st.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── PROGRAM CATALOGUE ── */}
        <section className="py-20 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                Community Development Programs
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-medium">Where we focus our energy</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Explore our current programs across Physical Care and Mental Care. Each program has its own dedicated page and can grow with related projects, initiatives, events and impact.</p>
            </motion.div>

            {[{ key: "physical", label: "Physical Care", Icon: Shield }, { key: "mental", label: "Mental Care", Icon: Brain }].map((group) => {
              const groupPrograms = programs.filter((p) => p.pillar === group.key).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (groupPrograms.length === 0) return null;
              const Icon = group.Icon;
              return (
                <div key={group.key} id={group.key === "physical" ? "physical-care" : "mental-care"} className="mb-14 last:mb-0 scroll-mt-28">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-11 h-11 rounded-xl ${group.key === "mental" ? "bg-purple-100" : "bg-primary/10"} flex items-center justify-center`}><Icon size={21} className={group.key === "mental" ? "text-purple-700" : "text-primary"} /></div>
                    <div><p className={`text-xs font-bold uppercase tracking-widest ${group.key === "mental" ? "text-purple-700" : "text-primary"}`}>{group.label}</p><h3 className="text-xl font-serif font-semibold">Current programs</h3></div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {groupPrograms.map((p, i) => {
                      const id = p.id ?? p._id;
                      return (
                        <motion.div key={id ?? p.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.45 }} className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 transition-all">
                          {p.image && <div className="h-40 overflow-hidden"><img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" /></div>}
                          <div className="p-5">
                            <h4 className="font-serif font-semibold text-base leading-snug text-foreground">{p.title}</h4>
                            {p.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">{p.description}</p>}
                            {id && <Link href={`/programs/${id}`} className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-primary">Explore Program <ArrowRight size={13} /></Link>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {programs.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl text-sm text-muted-foreground">Programs are being prepared. Please check back soon.</div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6 md:px-12 bg-primary relative overflow-hidden text-center">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-white mb-4">
              Want to support these programs?
            </h2>
            <p className="text-white/65 mb-8 text-base md:text-lg">
              Volunteer your time, donate resources, or spread the word. Every action creates ripples of change.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3 rounded-full hover:bg-white/90 transition-colors text-sm"
              >
                Get Involved <ArrowRight size={15} />
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-transparent text-white font-bold px-7 py-3 rounded-full border-2 border-white/40 hover:border-white transition-colors text-sm"
              >
                Donate Now
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
