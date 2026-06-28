import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/company/stats")({
  head: () => ({ meta: [{ title: "تقاريري — تدوير بلو" }] }),
  component: Stats,
});

function Stats() {
  const cards = [
    { l: "شحنات هذا الشهر", v: "84", i: "📦", c: "oklch(0.62 0.19 252)" },
    { l: "إجمالي الكيلوات", v: "3,420", i: "⚖️", c: "oklch(0.68 0.16 155)" },
    { l: "السائقين النشطين", v: "6", i: "🚚", c: "oklch(0.78 0.15 75)" },
    { l: "متوسط التقييم", v: "4.8", i: "⭐", c: "oklch(0.65 0.15 230)" },
  ];
  const days = [40, 65, 45, 80, 55, 90, 70];
  const labels = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];
  return (
    <>
      <AppHeader title="تقارير الأداء" subtitle="آخر ٧ أيام" />
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.l} className="glass-card rounded-2xl p-4">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl text-lg"
              style={{ background: `color-mix(in oklab, ${c.c} 18%, white)` }}
            >
              {c.i}
            </div>
            <p className="mt-3 text-2xl font-black">{c.v}</p>
            <p className="text-[11px] text-muted-foreground">{c.l}</p>
          </div>
        ))}
      </div>

      <div className="glass-card mt-5 rounded-3xl p-5">
        <p className="text-sm font-extrabold">الشحنات اليومية</p>
        <div className="mt-4 flex h-36 items-end justify-between gap-2">
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg"
                style={{
                  height: `${d}%`,
                  background: "linear-gradient(180deg, oklch(0.65 0.18 250), oklch(0.55 0.2 255))",
                }}
              />
              <span className="text-[10px] font-bold text-muted-foreground">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
