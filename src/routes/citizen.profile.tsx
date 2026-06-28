import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronLeft, FileText, LogOut, MapPin, MessageCircle, ShieldCheck, User } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/citizen/profile")({
  head: () => ({ meta: [{ title: "حسابي — تدوير بلو" }] }),
  component: Profile,
});

function Profile() {
  const { profile, user, signOut, isAdmin } = useAuth();
  const nav = useNavigate();
  const items = [
    { Icon: User, t: "تعديل المعلومات الشخصية" },
    { Icon: MapPin, t: "عنواني الافتراضي" },
    { Icon: Bell, t: "إعدادات الإشعارات" },
    { Icon: MessageCircle, t: "الدعم الفني (واتساب)" },
    { Icon: FileText, t: "سياسة الخصوصية" },
  ];
  const showAdmin = isAdmin || user?.email?.toLowerCase() === ADMIN_EMAIL;
  return (
    <>
      <AppHeader title="حسابي" subtitle="تدوير بلو" />
      <div className="glass-card flex items-center gap-4 rounded-3xl p-5">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-2xl font-extrabold text-primary">
          {(profile?.full_name?.trim()?.[0] ?? "ت").toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold">{profile?.full_name || "مستخدم تدوير بلو"}</p>
          <p className="truncate text-[12px] text-muted-foreground">{user?.email}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary"><ShieldCheck size={12} /> موثّق</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {items.map((it) => (
          <button key={it.t} className="glass-card flex items-center gap-3 rounded-2xl p-4 text-right transition active:scale-[0.98]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <it.Icon size={18} />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-bold">{it.t}</span>
            <ChevronLeft size={16} className="text-muted-foreground" />
          </button>
        ))}
        {showAdmin && (
          <button
            onClick={() => nav({ to: "/admin" })}
            className="glass-card flex items-center gap-3 rounded-2xl p-4 text-right transition active:scale-[0.98]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warning/15 text-warning">
              <ShieldCheck size={18} />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-bold">لوحة المدير</span>
            <ChevronLeft size={16} className="text-muted-foreground" />
          </button>
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
