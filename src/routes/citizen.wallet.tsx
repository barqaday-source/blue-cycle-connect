import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Globe2, Package, Scale, Sparkles, Trophy } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/citizen/wallet")({
  head: () => ({ meta: [{ title: "محفظتي — تدوير بلو" }] }),
  component: Wallet,
});

function Wallet() {
  const { user } = useAuth();
  const q = useQuery({
    queryKey: ["wallet-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("shipments").select("weight_kg,status").eq("citizen_id", user!.id);
      const rows = data ?? [];
      const total = rows.length;
      const kgs = rows.reduce((s, r) => s + Number(r.weight_kg || 0), 0);
      const done = rows.filter((r) => r.status === "completed").reduce((s, r) => s + Number(r.weight_kg || 0), 0);
      return { total, kgs, done };
    },
  });
  const earnings = Math.round((q.data?.done ?? 0) * 500); // 500 د.ع/كغ تقديري

  return (
    <>
      <AppHeader title="محفظتي" subtitle="أثرك البيئي" />
      <div className="btn-primary-gradient relative overflow-hidden rounded-3xl p-6 text-white">
        <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-4 h-40 w-40 rounded-full bg-white/10" />
        <p className="relative text-xs/4 opacity-90">رصيدك التقديري</p>
        <p className="relative mt-1 text-4xl font-black">{earnings.toLocaleString("ar-EG")} <span className="text-lg font-bold opacity-90">د.ع</span></p>
        <p className="relative mt-3 text-[12px] opacity-90">حميت البيئة من {Math.round(q.data?.kgs ?? 0)} كيلو من النفايات 🌱</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { l: "إجمالي الكيلوات", v: Math.round(q.data?.kgs ?? 0), Icon: Scale },
          { l: "عدد الشحنات", v: q.data?.total ?? 0, Icon: Package },
          { l: "حماية بيئية", v: `${Math.round(q.data?.done ?? 0)}كغ`, Icon: Globe2 },
        ].map((s) => (
          <div key={s.l} className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4">
            <s.Icon size={22} className="text-primary" />
            <p className="text-base font-extrabold">{s.v}</p>
            <p className="text-[10px] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-3 mt-7 text-sm font-extrabold">إنجازات</h3>
      <div className="flex flex-col gap-3">
        {[
          { t: "بطل البيئة", d: "وصلت إلى ١٠٠ كيلو معاد تدويرها", Icon: Trophy, c: "oklch(0.78 0.15 75)" },
          { t: "صديق الكوكب", d: "أتممت أول ١٠ شحنات بنجاح", Icon: Globe2, c: "oklch(0.68 0.16 155)" },
          { t: "بداية رائعة", d: "أول شحنة منشورة على تدوير بلو", Icon: Sparkles, c: "oklch(0.62 0.19 252)" },
        ].map((a) => (
          <div key={a.t} className="glass-card flex items-center gap-3 rounded-2xl p-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${a.c} 18%, white)` }}>
              <a.Icon size={22} style={{ color: a.c }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">{a.t}</p>
              <p className="text-[11px] text-muted-foreground">{a.d}</p>
            </div>
            <Award size={18} className="text-warning" />
          </div>
        ))}
      </div>
    </>
  );
}
