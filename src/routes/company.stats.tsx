import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Package, Scale, Star, Truck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/company/stats")({
  head: () => ({ meta: [{ title: "تقاريري — تدوير بلو" }] }),
  component: Stats,
});

function Stats() {
  const { user } = useAuth();
  const q = useQuery({
    queryKey: ["company-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("shipments").select("weight_kg,status,created_at").eq("company_id", user!.id);
      const rows = data ?? [];
      const total = rows.length;
      const kg = rows.reduce((s, r) => s + Number(r.weight_kg || 0), 0);
      const done = rows.filter((r) => r.status === "completed").length;
      return { total, kg, done };
    },
  });
  const cards = [
    { l: "إجمالي الشحنات", v: q.data?.total ?? 0, Icon: Package, c: "oklch(0.62 0.19 252)" },
    { l: "إجمالي الكيلوات", v: Math.round(q.data?.kg ?? 0), Icon: Scale, c: "oklch(0.68 0.16 155)" },
    { l: "المكتملة", v: q.data?.done ?? 0, Icon: Truck, c: "oklch(0.78 0.15 75)" },
    { l: "متوسط التقييم", v: "4.8", Icon: Star, c: "oklch(0.65 0.15 230)" },
  ];
  const days = [40, 65, 45, 80, 55, 90, 70];
  const labels = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];
  return (
    <>
      <AppHeader title="تقارير الأداء" subtitle="آخر ٧ أيام" />
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.l} className="glass-card rounded-2xl p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${c.c} 18%, white)` }}>
              <c.Icon size={18} style={{ color: c.c }} />
            </div>
            <p className="mt-3 text-2xl font-black">{c.v}</p>
            <p className="text-[11px] text-muted-foreground">{c.l}</p>
          </div>
        ))}
      </div>
      <div className="glass-card mt-5 rounded-3xl p-5">
        <p className="inline-flex items-center gap-2 text-sm font-extrabold"><BarChart3 size={16} /> الشحنات اليومية</p>
        <div className="mt-4 flex h-36 items-end justify-between gap-2">
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-lg" style={{ height: `${d}%`, background: "linear-gradient(180deg, oklch(0.65 0.18 250), oklch(0.55 0.2 255))" }} />
              <span className="text-[10px] font-bold text-muted-foreground">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
