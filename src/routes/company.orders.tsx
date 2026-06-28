import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, type ShipmentRow } from "@/lib/tadweer-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/company/orders")({
  head: () => ({ meta: [{ title: "الطلبات الجارية — تدوير بلو" }] }),
  component: Orders,
});

function Orders() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const q = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("shipments").select("*").eq("company_id", user!.id).eq("status", "accepted").order("created_at", { ascending: false });
      return (data ?? []) as ShipmentRow[];
    },
  });
  async function complete(id: string) {
    const { error } = await supabase.from("shipments").update({ status: "completed" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم تأكيد الاستلام");
    qc.invalidateQueries({ queryKey: ["my-orders"] });
  }

  return (
    <>
      <AppHeader title="الطلبات الجارية" subtitle="قيد التنفيذ والاستلام" />
      <div className="flex flex-col gap-3">
        {(q.data ?? []).length === 0 && <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">لا توجد طلبات جارية.</div>}
        {(q.data ?? []).map((s) => {
          const m = MATERIALS[s.material];
          return (
            <div key={s.id} className="glass-card rounded-2xl p-4">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: `color-mix(in oklab, ${m.color} 22%, white)` }}>
                  <m.Icon size={24} style={{ color: m.color }} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{s.weight_kg} كغ — {m.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground inline-flex items-center gap-1"><MapPin size={11} /> {s.area}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-extrabold text-primary active:scale-95"><Phone size={14} /> اتصال بالزبون</button>
                <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-success/15 py-2 text-xs font-extrabold text-success active:scale-95"><MapPin size={14} /> فتح اللوكيشن</button>
              </div>
              <button onClick={() => complete(s.id)} className="btn-primary-gradient mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold active:scale-[0.98]">
                <CheckCircle2 size={14} /> تم الاستلام والتسليم المالي
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
