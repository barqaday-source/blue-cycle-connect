import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, SAMPLE_SHIPMENTS } from "@/lib/tadweer-data";

export const Route = createFileRoute("/citizen/shipments")({
  head: () => ({ meta: [{ title: "شحناتي — تدوير بلو" }] }),
  component: MyShipments,
});

function MyShipments() {
  return (
    <>
      <AppHeader title="شحناتي" subtitle="تتبع وجباتك" />
      <div className="flex flex-col gap-3">
        {SAMPLE_SHIPMENTS.map((s) => {
          const m = MATERIALS[s.material];
          const meta =
            s.status === "pending"
              ? { dot: "🟡", label: "قيد الانتظار", color: "text-warning" }
              : s.status === "accepted"
              ? { dot: "🔵", label: "تم القبول", color: "text-info" }
              : { dot: "🟢", label: "مكتملة", color: "text-success" };
          return (
            <div key={s.id} className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl"
                  style={{ background: `color-mix(in oklab, ${m.color} 18%, white)` }}
                >
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{m.label} — {s.weightKg} كغ</p>
                  <p className="truncate text-[11px] text-muted-foreground">📍 {s.area}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{s.postedAt}</p>
                </div>
                <div className="shrink-0 text-left">
                  <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-extrabold text-primary">
                    {meta.dot} {meta.label}
                  </span>
                </div>
              </div>
              {s.company && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  <button className="rounded-xl bg-success/15 py-2 text-xs font-bold text-success">
                    💬 واتساب
                  </button>
                  <button className="rounded-xl bg-primary/10 py-2 text-xs font-bold text-primary">
                    📞 اتصال
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
