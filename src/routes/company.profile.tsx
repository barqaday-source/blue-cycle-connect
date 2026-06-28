import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/company/profile")({
  head: () => ({ meta: [{ title: "حساب الشركة — تدوير بلو" }] }),
  component: CompanyProfile,
});

function CompanyProfile() {
  const items = [
    { i: "🏭", t: "بيانات المعمل" },
    { i: "♻️", t: "أنواع المواد التي نشتريها" },
    { i: "🗺️", t: "نطاق المحافظات المغطاة" },
    { i: "🚚", t: "السائقون والآليات" },
    { i: "💬", t: "الدعم الفني (واتساب)" },
  ];
  return (
    <>
      <AppHeader title="حساب الشركة" subtitle="تدوير بلو" />
      <div className="glass-card flex items-center gap-4 rounded-3xl p-5">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-2xl font-extrabold text-primary">
          ن
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold">معمل النور للتدوير</p>
          <p className="truncate text-[12px] text-muted-foreground">بغداد — العامرية</p>
          <p className="mt-1 text-[11px] text-primary">⭐ ٤.٨ · ٢١٥ تقييم</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { l: "شحنات", v: "84" },
          { l: "كيلوات", v: "3.4ك" },
          { l: "سائقون", v: "6" },
        ].map((s) => (
          <div key={s.l} className="glass-card rounded-2xl py-3 text-center">
            <p className="text-base font-extrabold">{s.v}</p>
            <p className="text-[10px] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {items.map((it) => (
          <button
            key={it.t}
            className="glass-card flex items-center gap-3 rounded-2xl p-4 text-right transition active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-lg">
              {it.i}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-bold">{it.t}</span>
            <span className="text-muted-foreground">←</span>
          </button>
        ))}
      </div>

      <Link
        to="/"
        className="mt-6 block rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-center text-sm font-extrabold text-destructive"
      >
        تسجيل الخروج
      </Link>
    </>
  );
}
