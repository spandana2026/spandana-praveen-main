import MediaLibraryPicker from "@/components/admin/MediaLibraryPicker";
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, AlertTriangle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Campaign { id:string; title:string; location:string; description:string; image:string; status:'active'|'completed'; published:boolean; order:number; date?:string; }
type Form=Omit<Campaign,'id'>;
const EMPTY:Form={title:'',location:'',description:'',image:'',status:'active',published:true,order:0,date:''};
function Label({children}:{children:React.ReactNode}){return <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">{children}</label>}

export default function EmergencyAidTab({token}:{token:string}){
 const [items,setItems]=useState<Campaign[]>([]); const [loading,setLoading]=useState(true); const [show,setShow]=useState(false); const [editing,setEditing]=useState<Campaign|null>(null); const [form,setForm]=useState<Form>(EMPTY); const [saving,setSaving]=useState(false); const [uploading,setUploading]=useState(false); const [msg,setMsg]=useState('');
 const load=()=>{setLoading(true);fetch('/api/admin/emergency-campaigns',{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(d=>{setItems(Array.isArray(d)?d:[]);setLoading(false)}).catch(()=>setLoading(false));};
 useEffect(load,[]);
 const toast=(m:string)=>{setMsg(m);setTimeout(()=>setMsg(''),2800)};
 const edit=(x:Campaign)=>{setEditing(x);setForm({...x});setShow(true)};
 const cancel=()=>{setEditing(null);setForm(EMPTY);setShow(false)};
 async function upload(file:File){if(file.size>5*1024*1024){toast('Image must be 5 MB or smaller.');return}setUploading(true);const fd=new FormData();fd.append('file',file);try{const r=await fetch('/api/upload',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});const d=await r.json();if(d.url){setForm(f=>({...f,image:d.url}));toast('Image uploaded.')}else toast(d.error||'Upload failed.')}catch{toast('Upload failed.')}finally{setUploading(false)}}
 async function save(){if(!form.title.trim()){toast('Campaign title is required.');return}setSaving(true);const url=editing?`/api/admin/emergency-campaigns/${editing.id}`:'/api/admin/emergency-campaigns';const r=await fetch(url,{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(form)});const d=await r.json();setSaving(false);if(r.ok){toast(editing?'Campaign updated.':'Campaign created.');cancel();load()}else toast(d.error||'Save failed.')}
 async function del(id:string){if(!confirm('Delete this emergency campaign?'))return;await fetch(`/api/admin/emergency-campaigns/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});toast('Campaign deleted.');load()}
 return <div className="max-w-4xl mx-auto">
  <div className="flex items-center justify-between mb-8"><div><h2 className="text-2xl font-serif font-bold">Emergency Aid &amp; Relief</h2><p className="text-sm text-muted-foreground mt-1">Manage emergency responses and individual relief campaigns.</p></div>{!show&&<Button className="rounded-full gap-2" onClick={()=>{setForm(EMPTY);setEditing(null);setShow(true)}}><Plus size={16}/>Add Campaign</Button>}</div>
  {msg&&<div className="mb-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15 text-sm">{msg}</div>}
  {show&&<div className="bg-card border border-primary/30 rounded-2xl p-6 mb-6 shadow-sm"><div className="flex items-center justify-between mb-5"><h3 className="font-semibold">{editing?'Edit Campaign':'Add Emergency Campaign'}</h3><button onClick={cancel}><X size={18}/></button></div>
   <div className="grid gap-4"><div><Label>Campaign Title *</Label><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Nepal Emergency Relief"/></div>
   <div className="grid sm:grid-cols-2 gap-4"><div><Label>Location</Label><Input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="Nepal"/></div><div><Label>Date / Period</Label><Input value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))} placeholder="e.g. April 2026"/></div></div>
   <div><Label>Description</Label><Textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="min-h-[110px]" placeholder="What happened, what Spandana did, who was reached, and the current status..."/></div>
   <div><Label>Real Campaign Photograph</Label>{form.image&&<div className="flex gap-3 items-center mb-2"><img src={form.image} className="w-16 h-16 rounded-xl object-cover border"/><span className="text-xs text-muted-foreground truncate flex-1">{form.image}</span><Button variant="outline" size="sm" onClick={()=>setForm(f=>({...f,image:''}))}>Remove</Button></div>}<label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-3 cursor-pointer text-sm text-muted-foreground hover:text-primary"><input type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)upload(f)}}/>{uploading?<Loader2 size={15} className="animate-spin"/>:<Upload size={15}/>} {uploading?'Uploading...':'Upload real campaign image'}</label></div>
   <MediaLibraryPicker token={token} value={form.image} accept="image" onSelect={(url) => setForm(f=>({...f,image:url}))} description="or choose an existing image" />

   <div className="flex items-center gap-3"><input type="checkbox" checked={form.published} onChange={e=>setForm(f=>({...f,published:e.target.checked}))}/><span className="text-sm">Published on website</span></div></div>
   <div className="flex justify-end gap-3 mt-5 pt-4 border-t"><Button variant="outline" className="rounded-full" onClick={cancel}>Cancel</Button><Button className="rounded-full gap-2" onClick={save} disabled={saving}>{saving?<Loader2 size={14} className="animate-spin"/>:<Save size={14}/>} {editing?'Update Campaign':'Create Campaign'}</Button></div>
  </div>}
  {loading?<div className="py-16 flex justify-center"><Loader2 className="animate-spin text-primary"/></div>:<div className="space-y-3">{items.map(x=><div key={x.id} className="bg-card border rounded-2xl p-4 flex items-center gap-4"><div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">{x.image?<img src={x.image} className="w-full h-full object-cover"/>:<AlertTriangle className="text-primary" size={24}/>}</div><div className="flex-1 min-w-0"><div className="flex gap-2 flex-wrap mb-1"><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{x.location||'Emergency Relief'}</span>{!x.published&&<span className="text-xs px-2 py-0.5 rounded-full bg-muted">Draft</span>}</div><p className="font-semibold text-sm truncate">{x.title}</p><p className="text-xs text-muted-foreground line-clamp-2 mt-1">{x.description}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" className="rounded-xl" onClick={()=>edit(x)}><Pencil size={12}/></Button><Button variant="outline" size="sm" className="rounded-xl text-destructive" onClick={()=>del(x.id)}><Trash2 size={12}/></Button></div></div>)}</div>}
 </div>
}
