import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, TrendingUp, TrendingDown, Info } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, MATERIAL_KEYS, formatIQD } from "@/lib/tadweer-data";

export const Route = createFileRoute("/prices")({
  head: () => ({ meta: [{ title: "أسعار اليوم — تدوير بلو" }] }),
  component: PricesPage,
});

// Deterministic pseudo-random daily delta so prices "shift" every day without a backend yet.
function todaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function dailyDelta(key: string) {
  const seed = todaySeed();
  let h = seed;
  for (let i = 0; i < key.length; i++) h = (h * 33 + key.charCodeAt(i)) | 0;
  // between -6% and +6%
  const pct = ((Math.abs(h) % 1200) - 600) / 10000;
  return pct;
}

function PricesPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[460px] px-4 pb-16">
      <AppHeader
        subtitle="السوق اليوم"
        title="أسعار الكيلو"
        right={
          <Link
            to="/"
            className="glass grid h-10 w-10 place-items-center rounded-2xl press"
            aria-label="رجوع"
          >
            <ChevronRight size={18} />
          </Link>
        }
      />

      <div className="glass-card mt-2 flex items-start gap-3 rounded-2xl p-3 text-[12px] text-muted-foreground">
        <Info size={16} className="mt-0.5 shrink-0 text-primary" />
        <p>
          الأسعار إرشادية بالدينار العراقي وتتحدّث يومياً. يمكن للشركات نشر عروضها الخاصة عبر
          «إعلاناتي» ليظهر سعرها للمواطنين مباشرة.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {MATERIAL_KEYS.map((k) => {
          const m = MATERIALS[k];
          const delta = dailyDelta(k);
          const price = Math.round(m.pricePerKg * (1 + delta));
          const up = delta >= 0;
          return (
            <div key={k} className="glass-card flex items-center gap-3 rounded-2xl p-3">
              <div
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                style={{ background: `color-mix(in oklab, ${m.color} 18%, white)` }}
              >
                <m.Icon size={26} style={{ color: m.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold">{m.label}</p>
                <p className="text-[11px] text-muted-foreground">سعر الكيلوغرام الواحد</p>
              </div>
              <div className="text-left">
                <p className="text-[15px] font-black">{formatIQD(price)}</p>
                <p
                  className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                    up ? "text-success" : "text-destructive"
                  }`}
                  dir="ltr"
                >
                  {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {(delta * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        المصدر: متوسط أسعار شركات التدوير المسجّلة في المنصة
      </p>
    </div>
  );
}
