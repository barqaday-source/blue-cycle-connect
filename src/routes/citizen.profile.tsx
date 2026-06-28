import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/citizen/profile")({
  head: () => ({ meta: [{ title: "حسابي — تدوير بلو" }] }),
  component: Profile,
});

function Profile() {
  const items = [
    { i: "👤", t: "تعديل المعلومات الشخصية" },
    { i: "📍", t: "عنواني الافتراضي" },
    { i: "🔔", t: "إعدادات الإشعارات" },
    { i: "💬", t: "الدعم الفني (واتساب)" },
    { i: "📄", t: "سياسة الخصوصية" },
  ];
  return (
    <>
      <AppHeader title="حسابي" subtitle="تدوير بلو" />
      <div className="glass-card flex items-center gap-4 rounded-3xl p-5">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-2xl font-extrabold text-primary">
          أ
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold">أحمد علي حسين</p>
          <p className="truncate text-[12px] text-muted-foreground">+964 770 123 4567</p>
          <p className="mt-1 text-[11px] text-primary">✓ موثّق</p>
        </div>
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
