import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, MessageCircle, Phone, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, statusMeta, timeAgo, type ShipmentRow } from "@/lib/tadweer-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen/shipments")({
  head: () => ({ meta: [{ title: "شحناتي — تدوير بلو" }] }),
  component: MyShipments,
});

function MyShipments() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["all-my-shipments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("shipments").select("*").eq("citizen_id", user!.id).order("created_at", { ascending: false });
      return (data ?? []) as ShipmentRow[];
    },
  });

  async function remove(id: string) {
    if (!confirm("حذف هذه الشحنة؟")) return;
    const { error } = await supabase.from("shipments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    qc.invalidateQueries({ queryKey: ["all-my-shipments"] });
  }

  return (
    <>
      <AppHeader title="شحناتي" subtitle="تتبع وجباتك" />
      <div className="flex flex-col gap-3">
        {(q.data ?? []).length === 0 && (
          <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">لم تنشر أي شحنة بعد.</div>
        )}
        {(q.data ?? []).map((s) => {
          const m = MATERIALS[s.material];
          const meta = statusMeta(s.status);
          return (
            <div key={s.id} className="glass-card rounded-2xl p-4">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: `color-mix(in oklab, ${m.color} 18%, white)` }}>
                  <m.Icon size={24} style={{ color: m.color }} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{m.label} — {s.weight_kg} كغ</p>
                  <p className="truncate text-[11px] text-muted-foreground inline-flex items-center gap-1"><MapPin size={11} /> {s.area}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(s.created_at)}</p>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-extrabold ${meta.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
                {s.company_id ? (
                  <>
                    <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-success/15 py-2 text-xs font-bold text-success active:scale-95"><MessageCircle size={14} /> واتساب</button>
                    <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-bold text-primary active:scale-95"><Phone size={14} /> اتصال</button>
                  </>
                ) : (
                  <div className="col-span-2 text-center text-[11px] font-bold text-muted-foreground self-center">بانتظار شركة</div>
                )}
                <button onClick={() => remove(s.id)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive/10 py-2 text-xs font-bold text-destructive active:scale-95">
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

