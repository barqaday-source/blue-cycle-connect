import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Recycle, Building2, User2, ArrowLeft } from "lucide-react";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تدوير بلو" },
      { name: "description", content: "برنامج تدوير بلو لإعادة تدوير المواد في العراق." },
    ],
  }),
  component: Home,
});

const BLUE = "#1E63FF";
const INK = "#0D2A66";

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
    <main
      dir="rtl"
      className="relative mx-auto flex min-h-screen w-full max-w-[420px] flex-col overflow-hidden bg-white px-5 pb-8 pt-10"
      style={{ fontFamily: "Cairo, system-ui" }}
    >
      {/* Soft background halos */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${BLUE}55, transparent)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${BLUE}44, transparent)` }}
      />

      {/* Brand */}
      <header className="relative z-10 flex flex-col items-center gap-3 pt-6">
        <div
          className="relative grid h-24 w-24 place-items-center rounded-[28px]"
          style={{
            background: "rgba(30,99,255,0.06)",
            border: "1px solid rgba(30,99,255,0.18)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Recycle size={44} strokeWidth={2.2} style={{ color: BLUE }} />
        </div>
        <h1 className="text-[28px] font-black leading-none" style={{ color: INK }}>
          تدوير بلو
        </h1>
        <p className="text-[12px] font-medium" style={{ color: `${INK}99` }}>
          أعد التدوير واكسب
        </p>
      </header>

      {/* Choice cards */}
      <section className="relative z-10 mt-10 flex flex-col gap-4">
        <ChoiceCard
          to="/auth"
          icon={<User2 size={26} style={{ color: BLUE }} />}
          title="مواطن"
          subtitle="انشر موادك واكسب نقداً"
        />
        <ChoiceCard
          to="/auth"
          icon={<Building2 size={26} style={{ color: BLUE }} />}
          title="شركة تدوير"
          subtitle="اعرض الشحنات القريبة"
        />
      </section>

      {/* Primary action */}
      <div className="relative z-10 mt-auto pt-10">
        <Link
          to="/auth"
          className="inline-flex h-[58px] w-full items-center justify-center gap-2 rounded-3xl text-[15px] font-extrabold text-white transition active:scale-[0.98]"
          style={{
            background: BLUE,
            boxShadow: "0 18px 40px -14px rgba(30,99,255,0.55)",
          }}
        >
          ابدأ الآن
        </Link>
        <p className="mt-4 text-center text-[11px]" style={{ color: `${INK}80` }}>
          بالمتابعة توافق على الشروط وسياسة الخصوصية
        </p>
      </div>
    </main>
  );
}

function ChoiceCard({
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
      className="group flex items-center gap-4 rounded-3xl p-5 transition active:scale-[0.98]"
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(30,99,255,0.15)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 28px -18px rgba(13,42,102,0.35)",
      }}
    >
      <div
        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
        style={{ background: "rgba(30,99,255,0.08)" }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-extrabold" style={{ color: INK }}>
          {title}
        </p>
        <p className="mt-0.5 text-[12px]" style={{ color: `${INK}99` }}>
          {subtitle}
        </p>
      </div>
      <ArrowLeft
        size={20}
        className="transition group-hover:-translate-x-1"
        style={{ color: BLUE }}
      />
    </Link>
  );
}
