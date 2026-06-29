import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Recycle, Building2, User2, LogIn, ChevronLeft } from "lucide-react";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تدوير بلو — مرحباً بك" },
      { name: "description", content: "أعد تدوير موادك واكسب — تدوير بلو." },
    ],
  }),
  component: Home,
});

function Home() {
  const { user, isAdmin, isCompany, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    if (isAdmin || user.email?.toLowerCase() === ADMIN_EMAIL) nav({ to: "/admin" });
    else if (isCompany) nav({ to: "/company" });
    else nav({ to: "/citizen" });
  }, [loading, user, isAdmin, isCompany, nav]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-6 pb-10 pt-12">
      <div className="flex flex-col items-center gap-3">
        <div className="btn-primary-gradient grid h-20 w-20 place-items-center rounded-3xl">
          <Recycle size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">تدوير بلو</h1>
        <p className="max-w-[280px] text-center text-sm text-muted-foreground">
          نربط المواطن بشركات إعادة التدوير في العراق — ببساطة وسرعة وكرامة.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <RoleCard
          to="/auth"
          icon={<User2 size={28} className="text-primary" />}
          title="أنا مواطن / جامع مواد"
          subtitle="صوّر موادك، انشرها، واكسب نقداً."
        />
        <RoleCard
          to="/auth"
          icon={<Building2 size={28} className="text-primary" />}
          title="أنا شركة / معمل تدوير"
          subtitle="اعرض الشحنات القريبة على الخريطة."
        />
      </div>

      <Link
        to="/auth"
        className="btn-primary-gradient mt-8 inline-flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold active:scale-[0.98]"
      >
        <LogIn size={18} /> ابدأ — تسجيل الدخول
      </Link>

      <p className="mt-auto pt-10 text-center text-[11px] text-muted-foreground">
        بالمتابعة فأنت توافق على الشروط وسياسة الخصوصية
      </p>
    </main>
  );
}

function RoleCard({
  to,
  icon,
  title,
  subtitle,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="glass-card group flex items-center gap-4 rounded-3xl p-5 transition active:scale-[0.98] hover:-translate-y-0.5"
    >
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-extrabold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronLeft className="text-primary transition group-hover:-translate-x-1" size={20} />
    </Link>
  );
}
