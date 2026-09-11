import { useEffect, useState } from 'react';
import { ArrowRight, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import CommunityChat from '@/components/community-chat';

const titles:Record<string,string>={basic:'About this cause',goal:'Support Goal',needs:'What is needed',volunteers:'Volunteer Opportunities',skills:'Skills & Expertise Needed',sponsorship:'Sponsorship Opportunities',inkind:'In-Kind Support',beneficiaries:'Who We Help & Expected Impact',team:'Campaign Team & Contacts',logistics:'Location & Logistics',documents:'Documents & Attachments',partners:'Partners & Sponsors',updates:'Updates',communication:'Communication',giving:'Ways to Support'};
const labels=(s:string)=>s.replace(/([A-Z])/g,' $1').replace(/^./,x=>x.toUpperCase());

function Section({name,sec,items}:{name:string;sec:any;items?:any[]}){
  if(!sec||sec.enabled===false||sec.public===false)return null;
  const scalars=Object.entries(sec).filter(([k,v])=>!['enabled','public'].includes(k)&&v!==''&&v!==null&&v!==undefined&&typeof v!=='boolean');
  return <section className="border border-[#E6E0D5] rounded-3xl p-6 bg-white"><h2 className="text-xl font-semibold">{titles[name]||labels(name)}</h2>{scalars.length>0&&<div className="mt-4 grid md:grid-cols-2 gap-4">{scalars.map(([k,v])=><div key={k}><p className="text-xs uppercase tracking-widest text-muted-foreground">{labels(k)}</p><p className="text-sm whitespace-pre-wrap mt-1">{String(v)}</p></div>)}</div>}{items&&items.length>0&&<div className="mt-5 space-y-3">{items.map((it:any,i:number)=><div key={i} className="border border-[#E6E0D5] rounded-2xl p-4"><p className="font-semibold">{it.title||it.name||it.role||it.skill||`Opportunity ${i+1}`}</p><div className="mt-2 grid md:grid-cols-2 gap-3 text-sm">{Object.entries(it).filter(([k,v])=>!['title','name','role','skill','public','visibility','status'].includes(k)&&v!==''&&v!==null&&v!==undefined&&v!==false).map(([k,v])=><div key={k}><span className="text-xs text-muted-foreground">{labels(k)}: </span>{String(v)}</div>)}</div></div>)}</div>}</section>
}

export default function CampaignPage(){
  const [,params]=useRoute('/campaigns/:id');
  const [c,setC]=useState<any>(null);
  const [error,setError]=useState('');
  useEffect(()=>{
    if(!params?.id)return;
    fetch('/api/v1/support/catalog').then(r=>r.json()).then(d=>{
      const x=(d.campaigns||[]).find((a:any)=>a.id===params.id);
      if(!x)throw new Error('Campaign not found');
      setC(x);
    }).catch(e=>setError(e.message||'Campaign unavailable.'));
  },[params?.id]);

  if(error)return <div className="min-h-screen bg-[#FBF8F1]"><Nav/><main className="max-w-3xl mx-auto px-5 pt-28 pb-20"><Link href="/donate" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={16}/> Back to Donate</Link><h1 className="text-3xl font-serif font-bold mt-8">Campaign unavailable</h1><p className="mt-3 text-muted-foreground">{error}</p></main><Footer/></div>;
  if(!c)return <div className="min-h-screen bg-[#FBF8F1]"><Nav/><main className="max-w-3xl mx-auto px-5 pt-28 pb-20 text-muted-foreground">Loading campaign…</main><Footer/></div>;

  const d=c.campaignDetails||{};
  const share=window.location.href;
  const money=(n:number)=>`${c.currency==='USD'?'$':'₹'}${Number(n||0).toLocaleString(c.currency==='USD'?'en-US':'en-IN')}`;

  return <div className="min-h-screen bg-[#FBF8F1] text-[#10254A]">
    <Nav/>
    <main className="max-w-5xl mx-auto px-5 pt-24 md:pt-28 pb-12 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/donate" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#0B3FA8]"><ArrowLeft size={16}/> Back to Donate</Link>
      </div>

      <div className="rounded-[2rem] border border-[#E3DED4] overflow-hidden bg-white shadow-[0_10px_30px_rgba(15,23,42,.05)]">
        {c.image&&<img src={c.image} alt="" className="w-full max-h-[360px] object-cover"/>}
        <div className="p-7 md:p-9">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#0B3FA8] font-bold">A Spandana Cause</p>
          <h1 className="text-3xl md:text-5xl font-serif font-medium mt-2 tracking-tight">{c.title}</h1>
          {(c.description || d.sections?.basic?.shortDescription) && <p className="text-base md:text-lg text-[#667085] mt-4 max-w-3xl leading-relaxed whitespace-pre-wrap">{c.description || d.sections?.basic?.shortDescription}</p>}

          <div className="flex flex-wrap gap-3 mt-6">
            <a href={`/donate?campaignId=${encodeURIComponent(c.id)}&support=1`} className="inline-flex items-center gap-2 rounded-full bg-[#0B3FA8] text-white px-6 py-3 font-semibold">Support Campaign <ArrowRight size={16}/></a>
            <Link href="/donate" className="inline-flex items-center gap-2 rounded-full border border-[#D9D3C8] px-5 py-3 text-sm font-semibold"><ArrowLeft size={15}/> Back to Donate</Link>
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[#D9D3C8] px-5 py-3 text-sm font-semibold bg-white" onClick={()=>navigator.clipboard.writeText(share)}><Copy size={15}/> Copy Link</button>
          </div>

          {(c.targetAmount||c.targetQuantity) && <div className="mt-7 grid sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-[#F5F1E8] p-4"><p className="text-xs text-muted-foreground">Target</p><p className="text-xl font-semibold mt-1">{c.targetAmount?money(c.targetAmount):'—'}</p></div>
            <div className="rounded-2xl bg-[#F5F1E8] p-4"><p className="text-xs text-muted-foreground">Raised</p><p className="text-xl font-semibold mt-1">{c.metrics?.raised!=null?money(c.metrics.raised):'—'}</p></div>
            <div className="rounded-2xl bg-[#F5F1E8] p-4"><p className="text-xs text-muted-foreground">Supporters</p><p className="text-xl font-semibold mt-1">{c.metrics?.donorCount??0}</p></div>
            <div className="rounded-2xl bg-[#F5F1E8] p-4"><p className="text-xs text-muted-foreground">Dates</p><p className="text-sm font-semibold mt-1">{c.startDate?new Date(c.startDate).toLocaleDateString():''}{c.endDate?` – ${new Date(c.endDate).toLocaleDateString()}`:''}</p></div>
          </div>}
          {c.metrics?.progress!=null&&c.targetAmount&&<div className="mt-5"><div className="h-2 rounded-full bg-[#E8E8E8] overflow-hidden"><div className="h-full bg-[#4F7D4A]" style={{width:`${Math.min(100,Math.max(0,Number(c.metrics.progress)))}%`}}/></div><p className="mt-2 text-xs text-muted-foreground">{Number(c.metrics.progress).toFixed(0)}% of the campaign goal reached</p></div>}
        </div>
      </div>

      <Section name="basic" sec={d.sections?.basic}/>
      <Section name="goal" sec={d.sections?.goal}/>
      {['needs','volunteers','skills','sponsorship','inkind','team','documents','partners','updates'].map(k=><Section key={k} name={k} sec={d.sections?.[k]} items={Array.isArray(d[k])?d[k]:[]}/>)}
      <Section name="beneficiaries" sec={d.sections?.beneficiaries}/>
      <Section name="logistics" sec={d.sections?.logistics}/>
      <div className="text-center text-xs text-muted-foreground py-6">Share this cause: <a className="underline inline-flex items-center gap-1" href={share}>{share}<ExternalLink size={11}/></a></div>
    </main>
    <Footer/>
    <CommunityChat/>
  </div>
}
