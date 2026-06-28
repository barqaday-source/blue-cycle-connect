import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, SAMPLE_SHIPMENTS } from "@/lib/tadweer-data";

export const Route = createFileRoute("/company/orders")({
  head: () => ({ meta: [{ title: "الطلبات الجارية — تدوير بلو" }] }),
  component: Orders,
});

function Orders() {
  const active = SAMPLE_SHIPMENTS.filter((s) => s.status === "accepted");
  return (
    <>
      <AppHeader title="الطلبات الجارية" subtitle="قيد التنفيذ والاستلام" />
      <div className="flex flex-col gap-3">
        {[...active, ...active, ...active].slice(0, 4).map((s, idx) => {
          const m = MATERIALS[s.material];
          return (
            <div key={s.id + idx} className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl"
                  style={{ background: `color-mix(in oklab, ${m.color} 22%, white)` }}
                >
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{s.citizenName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">📍 {s.area}</p>
                </div>
                <div className="shrink-0 text-left">
                  <p className="text-sm font-extrabold text-primary">{s.weightKg} كغ</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded-xl bg-primary/10 py-2 text-xs font-extrabold text-primary">
                  📞 اتصال بالزبون
                </button>
                <button className="rounded-xl bg-success/15 py-2 text-xs font-extrabold text-success">
                  🗺️ فتح اللوكيشن
                </button>
              </div>
              <button className="btn-primary-gradient mt-2 w-full rounded-xl py-2.5 text-xs font-extrabold">
                ✅ تم الاستلام والتسليم المالي
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
