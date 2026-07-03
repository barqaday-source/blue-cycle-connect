import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, ChevronLeft, LogOut, MapPin, MessageCircle, Recycle, Truck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/company/profile")({
  head: () => ({ meta: [{ title: "حساب الشركة — تدوير بلو" }] }),
  component: CompanyProfile,
});

const SUPPORT_WA = "https://wa.me/9647700000000?text=" + encodeURIComponent("مرحباً، حساب شركة على تدوير بلو");

function CompanyProfile() {
  const { profile, user, signOut } = useAuth();
  const nav = useNavigate();
  type Item = { Icon: typeof Building2; t: string; to?: string; href?: string; action?: () => void };
  const items: Item[] = [
    { Icon: Building2, t: "بيانات المعمل", to: "/account/edit" },
    { Icon: Recycle, t: "أنواع المواد التي نشتريها", to: "/company/ads" },
    { Icon: MapPin, t: "نطاق المحافظات المغطاة", to: "/account/address" },
    { Icon: Truck, t: "السائقون والآليات", action: () => toast.message("قريباً — إدارة السائقين") },
    { Icon: MessageCircle, t: "الدعم الفني (واتساب)", href: SUPPORT_WA },
  ];
  return (
    <>
      <AppHeader title="حساب الشركة" subtitle="تدوير بلو" />
      <div className="glass-card flex items-center gap-4 rounded-3xl p-5">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-2xl font-extrabold text-primary">
          {(profile?.company_name?.[0] ?? profile?.full_name?.[0] ?? "ش").toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold">{profile?.company_name ?? profile?.full_name ?? "شركة تدوير"}</p>
          <p className="truncate text-[12px] text-muted-foreground">{profile?.phone ?? user?.email}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {items.map((it) => {
          const inner = (
            <>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><it.Icon size={18} /></span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{it.t}</span>
              <ChevronLeft size={16} className="text-muted-foreground" />
            </>
          );
          if (it.href)
            return <a key={it.t} href={it.href} target="_blank" rel="noreferrer" className="glass-card flex items-center gap-3 rounded-2xl p-4 text-right transition active:scale-[0.98]">{inner}</a>;
          if (it.to)
            return <Link key={it.t} to={it.to} className="glass-card flex items-center gap-3 rounded-2xl p-4 text-right transition active:scale-[0.98]">{inner}</Link>;
          return <button key={it.t} onClick={it.action} className="glass-card flex items-center gap-3 rounded-2xl p-4 text-right transition active:scale-[0.98]">{inner}</button>;
        })}
      </div>

      <button
        onClick={async () => { await signOut(); nav({ to: "/auth" }); }}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-extrabold text-destructive active:scale-[0.98]"
      >
        <LogOut size={16} /> تسجيل الخروج
      </button>
    </>
  );
}
