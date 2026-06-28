import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Megaphone, Plus, Tag, Trash2, X } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PhotoCapture } from "@/components/PhotoCapture";
import { MATERIALS, MATERIAL_KEYS, type MaterialKey } from "@/lib/tadweer-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/company/ads")({
  head: () => ({ meta: [{ title: "إعلاناتي — تدوير بلو" }] }),
  component: AdsPage,
});

interface Ad {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price_per_kg: number | null;
  material: MaterialKey | null;
  city: string | null;
  active: boolean;
}

function AdsPage() {
  const { user, isCompany } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const q = useQuery({
    queryKey: ["my-ads", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("company_ads").select("*").eq("company_id", user!.id).order("created_at", { ascending: false });
      return (data ?? []) as Ad[];
    },
  });

  async function toggle(id: string, active: boolean) {
    await supabase.from("company_ads").update({ active: !active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["my-ads"] });
  }
  async function remove(id: string) {
    await supabase.from("company_ads").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["my-ads"] });
  }

  return (
    <>
      <AppHeader title="إعلاناتي" subtitle="عروض الشراء العامة" />
      {!isCompany && (
        <div className="glass-card rounded-2xl p-4 text-center text-sm text-muted-foreground">
          نشر الإعلانات متاح لحسابات الشركات فقط.
        </div>
      )}
      {isCompany && (
        <>
          <button onClick={() => setOpen(true)} className="btn-primary-gradient mb-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold active:scale-[0.98]">
            <Plus size={18} /> إعلان جديد
          </button>

          <div className="flex flex-col gap-3">
            {(q.data ?? []).length === 0 && <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">لم تنشر أي إعلان بعد.</div>}
            {(q.data ?? []).map((a) => (
              <div key={a.id} className="glass-card overflow-hidden rounded-3xl">
                {a.image_url && <img src={a.image_url} alt="" className="h-32 w-full object-cover" />}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold">{a.title}</p>
                      {a.description && <p className="mt-1 text-[12px] text-muted-foreground">{a.description}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                        {a.material && <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 font-bold text-primary">{MATERIALS[a.material].label}</span>}
                        {a.price_per_kg != null && <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 font-bold text-success"><Tag size={10} /> {a.price_per_kg} د.ع/كغ</span>}
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${a.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                      {a.active ? "نشط" : "موقوف"}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => toggle(a.id, a.active)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-extrabold text-primary active:scale-95">
                      <CheckCircle2 size={14} /> {a.active ? "إيقاف" : "تفعيل"}
                    </button>
                    <button onClick={() => remove(a.id)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive/10 py-2 text-xs font-extrabold text-destructive active:scale-95">
                      <Trash2 size={14} /> حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {open && <NewAdSheet onClose={() => setOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ["my-ads"] })} />}
    </>
  );
}

function NewAdSheet({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [mat, setMat] = useState<MaterialKey>("plastic");
  const [img, setImg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!user) return;
    if (!title.trim()) return toast.error("ادخل عنوان الإعلان");
    setBusy(true);
    const { error } = await supabase.from("company_ads").insert({
      company_id: user.id,
      title: title.trim(),
      description: desc.trim() || null,
      price_per_kg: price ? Number(price) : null,
      material: mat,
      image_url: img,
      active: true,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("تم نشر الإعلان");
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3" onClick={onClose}>
      <div className="w-full max-w-[460px] rounded-3xl bg-background p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-base font-extrabold"><Megaphone size={18} /> إعلان جديد</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-muted active:scale-90"><X size={16} /></button>
        </div>
        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pb-2">
          <PhotoCapture bucket="ad-images" onUploaded={(_p, u) => setImg(u)} initialUrl={img} />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="العنوان (مثلاً: نشتري الكارتون)" className="glass-card rounded-2xl px-4 py-3 text-sm font-bold outline-none" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف العرض" className="glass-card rounded-2xl px-4 py-3 text-sm font-bold outline-none" rows={3} />
          <div className="grid grid-cols-5 gap-2">
            {MATERIAL_KEYS.map((k) => {
              const m = MATERIALS[k];
              const a = mat === k;
              return (
                <button key={k} onClick={() => setMat(k)} className={`flex flex-col items-center gap-1 rounded-2xl py-2 transition active:scale-90 ${a ? "btn-primary-gradient text-white" : "glass-card"}`}>
                  <m.Icon size={18} style={!a ? { color: m.color } : undefined} />
                  <span className="text-[10px] font-bold">{m.label}</span>
                </button>
              );
            })}
          </div>
          <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" placeholder="السعر بالدينار / كغ" className="glass-card rounded-2xl px-4 py-3 text-sm font-bold outline-none" />
          <button onClick={save} disabled={busy} className="btn-primary-gradient inline-flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold active:scale-[0.98] disabled:opacity-60">
            {busy ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} نشر الإعلان
          </button>
        </div>
      </div>
    </div>
  );
}
