import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import CommunityChat from "@/components/community-chat";
import { supportService } from "@/services/supportService";

function money(n:number,c:string){
  return `${c==='USD'?'$':'₹'}${Number(n||0).toLocaleString(c==='USD'?'en-US':'en-IN',{maximumFractionDigits:2})}`;
}

export default function RequirementPage(){
  const [,params]=useRoute('/requirements/:id');
  const [item,setItem]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    supportService.catalog()
      .then(c=>{
        const r=(c?.requirements||[]).find((x:any)=>String(x.id)===String(params?.id));
        if(!r) setError('This specific need is no longer available.');
        else setItem(r);
      })
      .catch(()=>setError('Specific need details are temporarily unavailable.'))
      .finally(()=>setLoading(false));
  },[params?.id]);

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-[#10254A]">
      <Nav/>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-12">
        <Link href="/donate" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#0B3FA8]">
          <ArrowLeft size={16}/> Back to Donate
        </Link>
        {loading ? (
          <div className="py-24 text-center text-muted-foreground"><Loader2 className="inline animate-spin mr-2" size={18}/> Loading specific need…</div>
        ) : error ? (
          <div className="py-20 text-center text-destructive">{error}</div>
        ) : (
          <section className="mt-6 rounded-[2rem] border border-[#E3DED4] bg-white overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,.05)]">
            <div className="h-1.5 bg-[#4F7D4A]"/>
            <div className="p-6 md:p-9">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#4F7D4A] font-bold">Specific Need</p>
              <h1 className="font-serif text-3xl md:text-5xl mt-2 tracking-tight">{item.title}</h1>
              {item.description && <p className="mt-4 text-base md:text-lg text-[#667085] leading-relaxed max-w-3xl">{item.description}</p>}

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {item.targetAmount && <div className="rounded-2xl border border-[#E6E0D5] bg-[#FBF8F1] p-4"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Target</p><p className="text-xl font-semibold mt-1">{money(item.targetAmount,item.currency||'INR')}</p></div>}
                {item.unitCost && <div className="rounded-2xl border border-[#E6E0D5] bg-[#FBF8F1] p-4"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Cost / unit</p><p className="text-xl font-semibold mt-1">{money(item.unitCost,item.currency||'INR')}</p></div>}
                {item.targetQuantity && <div className="rounded-2xl border border-[#E6E0D5] bg-[#FBF8F1] p-4"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Quantity needed</p><p className="text-xl font-semibold mt-1">{item.targetQuantity} {item.unitName||'units'}</p></div>}
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href={`/donate?requirementId=${encodeURIComponent(item.id)}&support=1`} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B3FA8] text-white px-6 py-3 font-semibold">
                  Support This Need <ArrowRight size={16}/>
                </a>
                <Link href="/donate" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9D3C8] px-6 py-3 font-semibold bg-white">
                  <ArrowLeft size={16}/> Back to Donate
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer/>
      <CommunityChat/>
    </div>
  );
}
