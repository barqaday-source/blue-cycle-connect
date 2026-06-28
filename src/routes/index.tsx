import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تدوير بلو — مرحباً بك" },
      { name: "description", content: "اختر هويتك للبدء: مواطن أو شركة إعادة تدوير." },
    ],
  }),
  component: RoleSelect,
});

function RoleSelect() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-6 pb-10 pt-14">
      <div className="flex flex-col items-center gap-3">
        <div className="btn-primary-gradient grid h-20 w-20 place-items-center rounded-3xl text-4xl">
          ♻️
        </div>
        <h1 className="text-3xl font-black tracking-tight">تدوير بلو</h1>
        <p className="max-w-[280px] text-center text-sm text-muted-foreground">
          نربط المواطن بشركات إعادة التدوير في العراق — ببساطة، سرعة، وكرامة.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <p className="text-center text-xs font-bold text-muted-foreground">من أنت؟</p>

        <Link
          to="/citizen"
          className="glass-card group flex items-center gap-4 rounded-3xl p-5 transition hover:-translate-y-0.5"
        >
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">
            🧑‍🤝‍🧑
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-extrabold">أنا مواطن / جامع مواد</p>
            <p className="mt-0.5 text-xs text-muted-foreground">صوّر موادك، انشرها، واكسب نقداً.</p>
          </div>
          <span className="text-primary transition group-hover:-translate-x-1">←</span>
        </Link>

        <Link
          to="/company"
          className="glass-card group flex items-center gap-4 rounded-3xl p-5 transition hover:-translate-y-0.5"
        >
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">
            🏭
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-extrabold">أنا شركة / معمل تدوير</p>
            <p className="mt-0.5 text-xs text-muted-foreground">اعرض الشحنات القريبة على الخريطة.</p>
          </div>
          <span className="text-primary transition group-hover:-translate-x-1">←</span>
        </Link>
      </div>

      <p className="mt-auto pt-10 text-center text-[11px] text-muted-foreground">
        بالمتابعة فأنت توافق على الشروط وسياسة الخصوصية
      </p>
    </main>
  );
}
