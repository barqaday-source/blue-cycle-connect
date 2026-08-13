import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronLeft, FileText, LogOut, MapPin, MessageCircle, ShieldCheck, User } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/citizen/profile")({
  head: () => ({ meta: [{ title: "حسابي — تدوير بلو" }] }),
  component: Profile,
});

const SUPPORT_WA = "https://wa.me/9647700000000?text=" + encodeURIComponent("مرحباً، أحتاج دعماً في تطبيق تدوير بلو");

function Profile() {
  const { profile, user, signOut } = useAuth();
  const nav = useNavigate();
  const items: Array<{ Icon: typeof User; t: string; to?: string; href?: string }> = [
    { Icon: User, t: "تعديل المعلومات الشخصية", to: "/account/edit" },
    { Icon: MapPin, t: "عنواني الافتراضي", to: "/account/address" },
    { Icon: Bell, t: "إعدادات الإشعارات", to: "/account/notifications" },
    { Icon: MessageCircle, t: "الدعم الفني (واتساب)", href: SUPPORT_WA },
    { Icon: FileText, t: "سياسة الخصوصية", to: "/account/privacy" },
  ];
  return (
    <>
      <AppHeader title="حسابي" subtitle="تدوير بلو" />
      <div className="glass-card flex items-center gap-4 rounded-3xl p-5">
        <AvatarUpload size={64} fallback={(profile?.full_name?.trim()?.[0] ?? "ت").toUpperCase()} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold">{profile?.full_name || "مستخدم تدوير بلو"}</p>
          <p className="truncate text-[12px] text-muted-foreground">{profile?.phone ?? user?.email}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary"><ShieldCheck size={12} /> موثّق</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {items.map((it) =>
          it.href ? (
            <a key={it.t} href={it.href} target="_blank" rel="noreferrer" className="glass-card flex items-center gap-3 rounded-2xl p-4 text-right transition active:scale-[0.98]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><it.Icon size={18} /></span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{it.t}</span>
              <ChevronLeft size={16} className="text-muted-foreground" />
            </a>
          ) : (
            <Link key={it.t} to={it.to!} className="glass-card flex items-center gap-3 rounded-2xl p-4 text-right transition active:scale-[0.98]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><it.Icon size={18} /></span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{it.t}</span>
              <ChevronLeft size={16} className="text-muted-foreground" />
            </Link>
          ),
        )}
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
