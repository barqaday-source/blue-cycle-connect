import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, Megaphone, Package, ShieldCheck, Users } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { IconBtn } from "@/components/IconBtn";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة المدير — تدوير بلو" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (loading) return;
    const allowed = isAdmin || user?.email?.toLowerCase() === ADMIN_EMAIL;
    if (!user) nav({ to: "/auth" });
    else if (!allowed) nav({ to: "/" });
  }, [loading, user, isAdmin, nav]);

  const stats = useQuery({
    queryKey: ["admin-stats"],
    enabled: !!user,
    queryFn: async () => {
      const [u, s, a, c] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("shipments").select("id", { count: "exact", head: true }),
        supabase.from("company_ads").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "company"),
      ]);
      return { users: u.count ?? 0, shipments: s.count ?? 0, ads: a.count ?? 0, companies: c.count ?? 0 };
    },
  });

  const recentUsers = useQuery({
    queryKey: ["admin-users"],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id,email,full_name,company_name,created_at").order("created_at", { ascending: false }).limit(10);
      return data ?? [];
    },
  });

  const cards = [
    { l: "المستخدمون", v: stats.data?.users ?? 0, Icon: Users, c: "oklch(0.62 0.19 252)" },
    { l: "الشركات", v: stats.data?.companies ?? 0, Icon: Building2, c: "oklch(0.68 0.16 155)" },
    { l: "الشحنات", v: stats.data?.shipments ?? 0, Icon: Package, c: "oklch(0.78 0.15 75)" },
    { l: "الإعلانات", v: stats.data?.ads ?? 0, Icon: Megaphone, c: "oklch(0.65 0.15 230)" },
  ];

  return (
    <div className="mx-auto min-h-screen w-full max-w-[460px] px-4 pb-10">
      <AppHeader
        back={<Link to="/" aria-label="رجوع" className="grid h-11 w-11 place-items-center rounded-full bg-surface text-foreground shadow-[0_4px_14px_-4px_oklch(0.6_0.15_250/0.25)] transition active:scale-90"><ArrowRight size={18} /></Link>}
        title="لوحة المدير"
        subtitle="تدوير بلو"
        right={<div className="grid h-11 w-11 place-items-center rounded-full bg-warning/15"><ShieldCheck size={18} className="text-warning" /></div>}
      />

      <div className="btn-primary-gradient relative mt-2 overflow-hidden rounded-3xl p-6 text-white">
        <p className="text-xs opacity-90">حسابك</p>
        <p className="mt-1 text-lg font-extrabold">{user?.email}</p>
        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-extrabold">
          <ShieldCheck size={12} /> صلاحيات المدير الكاملة
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.l} className="glass-card rounded-2xl p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${c.c} 18%, white)` }}>
              <c.Icon size={18} style={{ color: c.c }} />
            </div>
            <p className="mt-3 text-2xl font-black">{c.v}</p>
            <p className="text-[11px] text-muted-foreground">{c.l}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-3 mt-7 text-sm font-extrabold">آخر المستخدمين</h3>
      <div className="flex flex-col gap-2">
        {(recentUsers.data ?? []).map((u) => (
          <div key={u.id} className="glass-card flex items-center gap-3 rounded-2xl p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-extrabold text-primary">
              {(u.full_name?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{u.full_name || u.email}</p>
              <p className="truncate text-[11px] text-muted-foreground">{u.email}</p>
            </div>
            {u.company_name && <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-extrabold text-primary">شركة</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
