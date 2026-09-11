import { useEffect, useRef, useState } from "react";
import { Check, Image as ImageIcon, Loader2, Search, Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type MediaKind = "image" | "video" | "all";

interface MediaAsset {
  id: string;
  title?: string;
  caption?: string;
  imageUrl?: string;
  url?: string;
  mediaType?: "image" | "video";
  mimeType?: string;
  category?: string;
  published?: boolean;
}

interface Props {
  token: string;
  value?: string;
  onSelect: (url: string, asset?: MediaAsset) => void;
  accept?: MediaKind;
  label?: string;
  description?: string;
  className?: string;
}

export default function MediaLibraryPicker({ token, value, onSelect, accept = "image", label = "Choose from Media Library", description, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery?limit=200", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("load failed");
      const data = await res.json() as MediaAsset[];
      setItems(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }

  useEffect(() => { if (open) load(); }, [open]);

  async function upload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/gallery/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json() as MediaAsset & { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      await load();
      const selected = data.url ?? data.imageUrl;
      if (selected) onSelect(selected, data);
    } finally { setUploading(false); }
  }

  const filtered = items.filter((item) => {
    const kindOk = accept === "all" || (item.mediaType ?? "image") === accept;
    const text = `${item.title ?? ""} ${item.caption ?? ""} ${item.category ?? ""}`.toLowerCase();
    return kindOk && text.includes(query.toLowerCase());
  });

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={() => setOpen(true)}>
          <Search size={14} />{label}
        </Button>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 sm:p-8 flex items-center justify-center" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="w-full max-w-5xl max-h-[90vh] rounded-2xl bg-background border border-border shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
              <div><h3 className="font-serif font-bold text-lg">Media Library</h3><p className="text-xs text-muted-foreground mt-0.5">Select an existing {accept === "all" ? "image or video" : accept} or upload a new asset.</p></div>
              <div className="flex items-center gap-2">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search media…" className="w-48" />
                <Button type="button" variant="outline" className="rounded-lg gap-1.5" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  Upload
                </Button>
                <button type="button" className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center" onClick={() => setOpen(false)}><X size={18} /></button>
              </div>
              <input ref={fileRef} type="file" accept={accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*"} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); e.currentTarget.value = ""; }} />
            </div>
            <div className="overflow-y-auto p-4">
              {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div> : filtered.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground"><p className="font-medium">No matching media found.</p><p className="text-xs mt-1">Upload an asset to add it to the shared library.</p></div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {filtered.map((item) => {
                    const url = item.url ?? item.imageUrl ?? "";
                    const selected = value === url;
                    const type = item.mediaType ?? "image";
                    return (
                      <button key={item.id} type="button" onClick={() => { onSelect(url, item); setOpen(false); }} className={`relative text-left rounded-xl border-2 overflow-hidden bg-muted group ${selected ? "border-primary" : "border-border hover:border-primary/40"}`}>
                        <div className="aspect-square flex items-center justify-center overflow-hidden bg-muted">
                          {type === "video" ? <video src={url} className="w-full h-full object-cover" muted preload="metadata" /> : <img src={url} alt={item.title ?? "Media asset"} className="w-full h-full object-cover" />}
                        </div>
                        <div className="p-2">
                          <div className="flex items-center gap-1.5"><span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{type === "video" ? <Video size={10} /> : <ImageIcon size={10} />}{type}</span></div>
                          <p className="text-xs font-medium truncate mt-1">{item.title || item.caption || "Untitled"}</p>
                        </div>
                        {selected && <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow"><Check size={14} /></span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
