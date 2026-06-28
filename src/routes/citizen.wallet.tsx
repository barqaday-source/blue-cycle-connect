import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/citizen/wallet")({
  head: () => ({ meta: [{ title: "محفظتي — تدوير بلو" }] }),
  component: Wallet,
});

function Wallet() {
  const stats = [
    { label: "إجمالي الكيلوات", value: "248", icon: "⚖️" },
    { label: "عدد الشحنات", value: "17", icon: "📦" },
    { label: "حماية بيئية", value: "120كغ", icon: "🌍" },
  ];
  return (
    <>
      <AppHeader title="محفظتي" subtitle="أثرك البيئي" />

      <div className="btn-primary-gradient relative overflow-hidden rounded-3xl p-6 text-white">
        <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-4 h-40 w-40 rounded-full bg-white/10" />
        <p className="relative text-xs/4 opacity-90">رصيدك الحالي</p>
        <p className="relative mt-1 text-4xl font-black">١٢٤,٥٠٠ <span className="text-lg font-bold opacity-90">د.ع</span></p>
        <p className="relative mt-3 text-[12px] opacity-90">بفضلك حميت البيئة من ١٢٠ كيلو من النفايات 🌱</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-base font-extrabold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-3 mt-7 text-sm font-extrabold">إنجازات حصلت عليها</h3>
      <div className="flex flex-col gap-3">
        {[
          { t: "بطل البيئة", d: "وصلت إلى ١٠٠ كيلو معاد تدويرها", i: "🏆", c: "oklch(0.78 0.15 75)" },
          { t: "صديق الكوكب", d: "أتممت أول ١٠ شحنات بنجاح", i: "🌍", c: "oklch(0.68 0.16 155)" },
          { t: "بداية رائعة", d: "أول شحنة منشورة على تدوير بلو", i: "✨", c: "oklch(0.62 0.19 252)" },
        ].map((a) => (
          <div key={a.t} className="glass-card flex items-center gap-3 rounded-2xl p-3">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
              style={{ background: `color-mix(in oklab, ${a.c} 18%, white)` }}
            >
              {a.i}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">{a.t}</p>
              <p className="text-[11px] text-muted-foreground">{a.d}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
