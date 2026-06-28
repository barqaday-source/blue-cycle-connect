import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, SAMPLE_SHIPMENTS } from "@/lib/tadweer-data";

export const Route = createFileRoute("/company/feed")({
  head: () => ({ meta: [{ title: "الشحنات المتاحة — تدوير بلو" }] }),
  component: Feed,
});

function Feed() {
  const list = SAMPLE_SHIPMENTS.filter((s) => s.status === "pending");
  return (
    <>
      <AppHeader title="الشحنات المتاحة" subtitle="مرتبة حسب القرب" />
      <div className="flex flex-col gap-3">
        {list.map((s) => {
          const m = MATERIALS[s.material];
          return (
            <div key={s.id} className="glass-card overflow-hidden rounded-3xl">
              <div
                className="flex h-32 items-end justify-between p-3 text-white"
                style={{
                  background: `linear-gradient(135deg, color-mix(in oklab, ${m.color} 80%, black) 0%, color-mix(in oklab, ${m.color} 55%, white) 100%)`,
                }}
              >
                <div className="rounded-full bg-white/25 px-3 py-1 text-[11px] font-extrabold backdrop-blur">
                  {m.icon} {m.label}
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black leading-none">{s.weightKg}<span className="text-sm">كغ</span></p>
                  <p className="text-[10px] opacity-90">الوزن التقريبي</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">📍 {s.area}</p>
                    <p className="text-[11px] text-muted-foreground">{s.city} — {s.distanceKm} كم</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-extrabold text-primary">
                    {s.postedAt}
                  </span>
                </div>
                <button className="btn-primary-gradient mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold">
                  📦 قبول الشحنة وإرسال السيارة
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
