import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Save, Trash2, CheckCircle2, XCircle, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard, Field } from "./shared";
import type { SiteSettings } from "../types";

interface Props { settings: SiteSettings; updateSettings:(path:(string|number)[],val:unknown)=>void; saving:boolean; onSave:()=>Promise<boolean>|boolean|void; publishNow:()=>Promise<void>|void; token:string; }

function HeaderImageUploader({label, value, onChange, token, recommended, description}:{label:string; value:string; onChange:(url:string)=>void; token:string; recommended:string; description:string}){
 const [uploading,setUploading]=useState(false);
 const [error,setError]=useState("");
 const choose=async(file?:File)=>{
  if(!file)return; setError("");
  if(!file.type.startsWith("image/")){setError("Please choose an image file.");return;}
  if(file.size>10*1024*1024){setError("Image must be 10 MB or smaller.");return;}
  try {
   const dimensions = await new Promise<{width:number;height:number}>((resolve,reject)=>{
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve({width:img.naturalWidth,height:img.naturalHeight}); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read image dimensions.")); };
    img.src = url;
   });
   const ratio = dimensions.width / dimensions.height;
   const target = recommended === "3:1" ? 3 : 16/9;
   if (Math.abs(ratio-target) > 0.18) {
    setError(`Image ratio is ${ratio.toFixed(2)}:1. Recommended ${recommended}. You can still upload it, but it may crop on the website.`);
   }
  } catch {}
  setUploading(true);
  try{
   const form=new FormData(); form.append("file",file);
   const res=await fetch("/api/upload",{method:"POST",headers:{Authorization:`Bearer ${token}`},body:form,credentials:"include"});
   const data=await res.json().catch(()=>({}));
   if(!res.ok||!data.url) throw new Error(data.error||"Upload failed");
   onChange(data.url);
  }catch(e:any){setError(e?.message||"Upload failed");}
  finally{setUploading(false);}
 };
 return <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
  <div className="flex items-start justify-between gap-3">
   <div><p className="text-sm font-semibold text-slate-800">{label}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div>
   <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500 border">{recommended}</span>
  </div>
  {value?<div className="mt-3 overflow-hidden rounded-xl border bg-white">
   <img src={value} alt={label} className="block h-36 w-full object-contain bg-white" />
   <div className="flex items-center justify-between gap-2 border-t p-2">
    <p className="min-w-0 truncate text-[11px] text-slate-500">{value}</p>
    <Button type="button" size="sm" variant="outline" className="shrink-0 rounded-lg" onClick={()=>onChange("")}>Remove</Button>
   </div>
  </div>:<div className="mt-3 flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white text-slate-400"><div className="text-center"><ImageIcon size={24} className="mx-auto mb-2"/><p className="text-xs">No {label.toLowerCase()} uploaded</p></div></div>}
  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0750b5] transition hover:border-[#0750b5] hover:bg-blue-50">
   <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" className="hidden" disabled={uploading} onChange={e=>{const f=e.target.files?.[0]; e.currentTarget.value=""; void choose(f)}}/>
   {uploading?<><Loader2 size={15} className="animate-spin"/>Uploading…</>:<><Upload size={15}/>{value?"Replace image":"Upload image"}</>}
  </label>
  {error&&<p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
 </div>
}
const split=(v:any)=>Array.isArray(v)?v:[];
const unique=(a:string[])=>[...new Set(a.map(x=>x.trim()).filter(Boolean))];
const DEFAULT_KEYS=[
  ["mainProfessionOptions","Main Professions"],["additionalProfessionOptions","Additional Professions / Backgrounds"],["skillsOptions","Skills & Expertise"],["interestOptions","Areas of Interest"],["contributionOptions","Ways to Connect / Contribute"],["connectionOptions","How did you connect"],["helpOptions","Help / Support options"]
] as const;
export default function PeopleParticipationTab({settings,updateSettings,saving,onSave,publishNow,token}:Props){
 const vp:any=settings.volunteerPage||{}; const form=vp.form||{}; const banner=vp.banner||{}; const labels=vp.labels||{}; const [suggestions,setSuggestions]=useState<Record<string,string[]>>({}); const [active,setActive]=useState("mainProfessionOptions");
 const set=(path:(string|number)[],value:unknown)=>updateSettings(["volunteerPage",...path],value);
 const list=split(vp[active]);
 const loadSuggestions=()=>fetch("/api/v1/admin/volunteers/suggestions",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.ok?r.json():{}).then(setSuggestions).catch(()=>{});
 useEffect(()=>{loadSuggestions()},[token]);
 const addOption=(key:string,value:string)=>{set([key],unique([...(vp[key]||[]),value]));setSuggestions(s=>({...s,[suggestionKey(key)]: (s[suggestionKey(key)]||[]).filter(x=>x!==value)}));};
 const removeSuggestion=(key:string,value:string)=>setSuggestions(s=>({...s,[suggestionKey(key)]: (s[suggestionKey(key)]||[]).filter(x=>x!==value)}));
 const suggestionKey=(key:string)=>({additionalProfessionOptions:"additionalProfessions",skillsOptions:"skills",interestOptions:"interests",contributionOptions:"contributions",connectionOptions:"connections",helpOptions:"help",mainProfessionOptions:""}[key]||"");
 const preview=()=>window.open("/volunteer","_blank","noopener,noreferrer");
 return <div className="max-w-6xl mx-auto space-y-5">
  <div className="rounded-3xl bg-primary text-primary-foreground p-7 md:p-9"><div className="flex flex-wrap justify-between gap-4 items-start"><div><p className="text-xs uppercase tracking-[.2em] text-white/70">People & Participation</p><h2 className="mt-2 text-3xl font-serif">Join Us — Control Center</h2><p className="mt-2 max-w-2xl text-sm text-white/80">Manage what visitors see. Keep the visitor experience simple; let the system build richer information over time.</p></div><div className="flex gap-2"><Button variant="secondary" className="rounded-full gap-2" onClick={preview}><Eye size={15}/> Preview Join Us</Button><Button className="rounded-full gap-2 bg-white text-primary hover:bg-white/90" onClick={async()=>{const saved=await onSave(); if(saved) await publishNow();}} disabled={saving}><Save size={15}/>{saving?"Saving…":"Save & Publish"}</Button></div></div></div>
  <SectionCard title="Opening Experience" description="Manage the visitor-facing opening and the separate desktop/mobile header artwork."><div className="grid md:grid-cols-2 gap-4"><Field label="Heading"><Input value={banner.heading||""} onChange={e=>set(["banner","heading"],e.target.value)}/></Field><Field label="Eyebrow"><Input value={banner.eyebrow||""} onChange={e=>set(["banner","eyebrow"],e.target.value)}/></Field><Field label="Subheading"><Textarea value={banner.subheading||""} onChange={e=>set(["banner","subheading"],e.target.value)}/></Field><Field label="Supporting text"><Textarea value={banner.supportingText||""} onChange={e=>set(["banner","supportingText"],e.target.value)}/></Field><Field label="Start button text"><Input value={banner.buttonLabel||""} onChange={e=>set(["banner","buttonLabel"],e.target.value)}/></Field><Field label="Fallback image path"><Input value={banner.image||""} onChange={e=>set(["banner","image"],e.target.value)} /><p className="mt-1 text-[11px] text-muted-foreground">Used only when a device-specific header image is not uploaded.</p></Field></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><HeaderImageUploader label="Desktop Header Image" value={banner.desktopImage||""} onChange={v=>set(["banner","desktopImage"],v)} token={token} recommended="3:1" description="Use the 2048 × 768 px desktop artwork. It is displayed at its natural 3:1 ratio without cropping."/><HeaderImageUploader label="Mobile Header Image" value={banner.mobileImage||""} onChange={v=>set(["banner","mobileImage"],v)} token={token} recommended="16:9" description="Use the 1024 × 576 px mobile artwork. It is displayed at its natural 16:9 ratio without cropping."/></div></SectionCard>
  <SectionCard title="Form Sections & Visitor Wording" description="Edit the visitor-facing section titles without dealing with developer keys."><div className="grid md:grid-cols-2 gap-4"><Field label="Intro heading"><Input value={form.introHeading||""} onChange={e=>set(["form","introHeading"],e.target.value)}/></Field><Field label="Intro description"><Textarea value={form.introDescription||""} onChange={e=>set(["form","introDescription"],e.target.value)}/></Field><Field label="Professional section"><Input value={form.sectionProfessional||""} onChange={e=>set(["form","sectionProfessional"],e.target.value)}/></Field><Field label="Professional description"><Textarea value={form.sectionProfessionalDescription||""} onChange={e=>set(["form","sectionProfessionalDescription"],e.target.value)}/></Field><Field label="Skills section"><Input value={form.sectionSkills||""} onChange={e=>set(["form","sectionSkills"],e.target.value)}/></Field><Field label="Skills description"><Textarea value={form.sectionSkillsDescription||""} onChange={e=>set(["form","sectionSkillsDescription"],e.target.value)}/></Field><Field label="Connect / contribute section"><Input value={form.sectionContribution||""} onChange={e=>set(["form","sectionContribution"],e.target.value)}/></Field><Field label="Reference section"><Input value={form.sectionReference||""} onChange={e=>set(["form","sectionReference"],e.target.value)}/></Field><Field label="Help section"><Input value={form.sectionHelp||""} onChange={e=>set(["form","sectionHelp"],e.target.value)}/></Field><Field label="Connect button"><Input value={form.submitLabel||""} onChange={e=>set(["form","submitLabel"],e.target.value)}/></Field></div></SectionCard>
  <SectionCard title="Dropdown Lists" description="Choose a list, then add, edit, hide or remove its options. Visitors can always choose Other."><div className="flex flex-wrap gap-2 mb-4">{DEFAULT_KEYS.map(([key,title])=><Button key={key} type="button" variant={active===key?"default":"outline"} className="rounded-full" onClick={()=>setActive(key)}>{title}</Button>)}</div><div className="rounded-2xl border p-4"><div className="flex gap-2"><Input id="new-option" placeholder="Add a new option" onKeyDown={e=>{if(e.key==="Enter"){const v=(e.currentTarget as HTMLInputElement).value.trim();if(v){set(active,unique([...list,v]));e.currentTarget.value=""}}}}/><Button type="button" className="rounded-full" onClick={()=>{const el=document.getElementById("new-option") as HTMLInputElement;const v=el.value.trim();if(v){set(active,unique([...list,v]));el.value=""}}}><Plus size={15}/> Add</Button></div><div className="mt-4 space-y-2">{list.map((o:string,i:number)=><div key={`${o}-${i}`} className="flex gap-2 items-center rounded-xl border px-3 py-2"><Input value={o} onChange={e=>{const a=[...list];a[i]=e.target.value;set(active,unique(a))}}/><Button type="button" size="icon" variant="ghost" onClick={()=>set(active,list.filter((_:string,j:number)=>j!==i))}><Trash2 size={15}/></Button></div>)}{!list.length&&<p className="text-sm text-muted-foreground">No options yet. Add the first one above.</p>}</div></div></SectionCard>
  <SectionCard title="Professional Pathways" description="Select a profession and manage its relevant questions and specialisations."><PathwayEditor vp={vp} professions={vp.mainProfessionOptions||vp.professionOptions||[]} set={set} form={form}/></SectionCard>
  <SectionCard title="Suggested New Options" description="Custom answers visitors entered through Other. Approve useful ones to add them to the master dropdown lists."><SuggestionList title="Additional Professions" items={suggestions.additionalProfessions||[]} onAdd={v=>addOption("additionalProfessionOptions",v)} onIgnore={v=>removeSuggestion("additionalProfessionOptions",v)} /><SuggestionList title="Specialisations" items={suggestions.specializations||[]} onAdd={v=>{const current=vp.specializations||{};const key=Object.keys(current)[0]||"General";set(["specializations",key],unique([...(current[key]||[]),v]));removeSuggestion("specializations",v)}} onIgnore={v=>removeSuggestion("specializations",v)} /><SuggestionList title="Skills" items={suggestions.skills||[]} onAdd={v=>addOption("skillsOptions",v)} onIgnore={v=>removeSuggestion("skillsOptions",v)} /><SuggestionList title="Interests" items={suggestions.interests||[]} onAdd={v=>addOption("interestOptions",v)} onIgnore={v=>removeSuggestion("interestOptions",v)} /><SuggestionList title="Ways to Connect / Contribute" items={suggestions.contributions||[]} onAdd={v=>addOption("contributionOptions",v)} onIgnore={v=>removeSuggestion("contributionOptions",v)} /><SuggestionList title="Connection sources" items={suggestions.connections||[]} onAdd={v=>addOption("connectionOptions",v)} onIgnore={v=>removeSuggestion("connectionOptions",v)} /><SuggestionList title="Help options" items={suggestions.help||[]} onAdd={v=>addOption("helpOptions",v)} onIgnore={v=>removeSuggestion("helpOptions",v)} /><p className="text-xs text-muted-foreground mt-3">Suggestions remain the visitor’s own answers until you approve them. Approving a suggestion adds it to the corresponding master list.</p></SectionCard>
  <div className="flex justify-end"><Button onClick={onSave} disabled={saving} className="rounded-full gap-2"><Save size={15}/>{saving?"Saving…":"Save Changes"}</Button></div>
 </div>;
}
function SuggestionList({title,items,onAdd,onIgnore}:{title:string;items:string[];onAdd:(v:string)=>void;onIgnore:(v:string)=>void}){return <div className="rounded-2xl border p-4 mb-3"><div className="font-medium mb-2">{title}</div>{items.length?<div className="space-y-2">{items.map(v=><div key={v} className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2"><span className="text-sm">{v}</span><div className="flex gap-2"><Button type="button" size="sm" className="rounded-full" onClick={()=>onAdd(v)}><CheckCircle2 size={14} className="mr-1"/> Add</Button><Button type="button" size="sm" variant="ghost" className="rounded-full" onClick={()=>onIgnore(v)}><XCircle size={14} className="mr-1"/> Ignore</Button></div></div>)}</div>:<p className="text-xs text-muted-foreground">No new suggestions.</p>}</div>}
function PathwayEditor({vp,professions,set,form}:{vp:any;professions:string[];set:(p:(string|number)[],v:unknown)=>void;form:any}){const [p,setP]=useState(professions[0]||"");const fields=vp.professionalPathways?.[p]?.fields||[];const specs=vp.specializations?.[p]||[];const update=(key:string,val:any)=>{const a=[...fields];a[key as any]=val;set(["professionalPathways",p,"fields"],a)};return <div><select value={p} onChange={e=>setP(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3">{professions.map(x=><option key={x}>{x}</option>)}</select>{p&&<><div className="mt-4"><Field label="Specialisations (one per line)"><Textarea value={specs.join("\n")} onChange={e=>set(["specializations",p],e.target.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean))} rows={6}/></Field></div><div className="mt-5 space-y-3">{fields.map((f:any,i:number)=><div key={i} className="rounded-2xl border p-4"><div className="grid md:grid-cols-[1fr_1fr_auto] gap-3"><Field label="Question"><Input value={f.label||""} onChange={e=>{const a=[...fields];a[i]={...a[i],label:e.target.value};set(["professionalPathways",p,"fields"],a)}}/></Field><Field label="Type"><select value={f.type||"text"} onChange={e=>{const a=[...fields];a[i]={...a[i],type:e.target.value};set(["professionalPathways",p,"fields"],a)}} className="h-10 w-full rounded-lg border bg-background px-3"><option value="text">Text</option><option value="number">Number</option><option value="select">Dropdown</option><option value="multi">Multiple + Other</option></select></Field><div className="flex items-end"><Button type="button" variant="ghost" onClick={()=>set(["professionalPathways",p,"fields"],fields.filter((_:any,j:number)=>j!==i))}><Trash2 size={15}/></Button></div></div>{(f.type==="select"||f.type==="multi")&&<Field label="Answer options (one per line)"><Textarea value={(f.options||[]).join("\n")} onChange={e=>{const a=[...fields];a[i]={...a[i],options:e.target.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean)};set(["professionalPathways",p,"fields"],a)}} rows={4}/></Field>}</div>)}<Button type="button" variant="outline" className="rounded-full mt-2" onClick={()=>set(["professionalPathways",p,"fields"],[...fields,{key:`custom_${Date.now()}`,label:"New question",type:"select",options:["Other"],visible:true}])}><Plus size={15} className="mr-1"/> Add question</Button></div></>}</div>}
