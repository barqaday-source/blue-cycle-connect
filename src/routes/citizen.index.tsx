import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, SAMPLE_SHIPMENTS } from "@/lib/tadweer-data";

export const Route = createFileRoute("/citizen/")({
  head: () => ({ meta: [{ title: "الرئيسية — تدوير بلو" }] }),
  component: CitizenHome,
});

function CitizenHome() {
  const mine = SAMPLE_SHIPMENTS.slice(0, 3);
  return (
    <>
      <AppHeader
        avatar={
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-lg font-extrabold text-primary">
            أ
          </div>
        }
        subtitle="موقعك الحالي"
        title={
          <span className="inline-flex items-center gap-1">
            <span className="text-primary">📍</span> بغداد، الكرادة
          </span>
        }
        right={
          <button className="grid h-11 w-11 place-items-center rounded-full bg-surface text-lg shadow-[0_4px_14px_-4px_oklch(0.6_0.15_250/0.25)]">
            🔔
          </button>
        }
      />

      <section className="mt-2">
        <p className="text-sm text-muted-foreground">أهلاً أحمد 👋</p>
        <h2 className="mt-1 text-2xl font-black leading-tight">
          صوّر موادك،
          <br />
          واكسب من بيتك.
        </h2>
      </section>

      <Link
        to="/citizen/new"
        className="btn-primary-gradient mt-6 flex items-center justify-between gap-3 rounded-3xl p-5 transition active:scale-[0.98]"
      >
        <div className="text-right">
          <p className="text-xs/4 opacity-90">ابدأ الآن</p>
          <p className="text-xl font-extrabold">📸 صوّر واكسب الآن</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 text-2xl">←</div>
      </Link>

      <section className="mt-8">
        <p className="mb-3 text-xs font-bold text-muted-foreground">اختر نوع المادة بسرعة</p>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(MATERIALS).map(([key, m]) => (
            <Link
              key={key}
              to="/citizen/new"
              className="glass-card flex flex-col items-center gap-1 rounded-2xl py-3"
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="text-[10px] font-bold">{m.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold">شحناتي الحالية</h3>
          <Link to="/citizen/shipments" className="text-xs font-bold text-primary">
            عرض الكل ←
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {mine.map((s) => {
            const m = MATERIALS[s.material];
            const dot = s.status === "pending" ? "🟡" : s.status === "accepted" ? "🔵" : "🟢";
            const status =
              s.status === "pending" ? "قيد الانتظار" : s.status === "accepted" ? "تم القبول" : "تم الاستلام";
            return (
              <div key={s.id} className="glass-card flex items-center gap-3 rounded-2xl p-3">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl"
                  style={{ background: `color-mix(in oklab, ${m.color} 18%, white)` }}
                >
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{m.label} — {s.weightKg} كغ</p>
                  <p className="truncate text-[11px] text-muted-foreground">📍 {s.area}</p>
                </div>
                <div className="shrink-0 text-left">
                  <p className="text-[11px] font-bold">{dot} {status}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{s.postedAt}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary-soft/40 p-3 text-center text-[11px] text-muted-foreground">
        مساحة إعلانية — رعاة التطبيق
      </div>
    </>
  );
}
