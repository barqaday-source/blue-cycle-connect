import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  Home,
  Wallet,
  Package,
  User,
  ShieldCheck,
  LogOut,
  Recycle,
  Building2,
  ClipboardList,
  Megaphone,
  BarChart3,
  Map,
  MessageCircle,
  FileText,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export function SideMenu() {
  const { user, profile, isCompany, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const isAdminEmail = user?.email?.toLowerCase() === ADMIN_EMAIL;

  const citizenLinks = [
    { to: "/citizen", label: "الرئيسية", Icon: Home },
    { to: "/citizen/wallet", label: "محفظتي", Icon: Wallet },
    { to: "/citizen/shipments", label: "شحناتي", Icon: Package },
    { to: "/citizen/profile", label: "حسابي", Icon: User },
  ];
  const companyLinks = [
    { to: "/company", label: "الخريطة", Icon: Map },
    { to: "/company/feed", label: "الشحنات", Icon: ClipboardList },
    { to: "/company/ads", label: "إعلاناتي", Icon: Megaphone },
    { to: "/company/stats", label: "تقاريري", Icon: BarChart3 },
    { to: "/company/profile", label: "حساب الشركة", Icon: Building2 },
  ];
  const links = isCompany ? companyLinks : citizenLinks;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="القائمة"
          className="press tap-ring glass grid h-11 w-11 place-items-center rounded-2xl text-foreground"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88%] max-w-[340px] border-primary/10 bg-background p-0">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">القائمة</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col">
          <div className="border-b border-primary/10 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Recycle size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-extrabold text-foreground">
                  {profile?.company_name || profile?.full_name || "تدوير بلو"}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <p className="px-2 pb-2 pt-1 text-[10px] font-extrabold text-muted-foreground">
              التنقل
            </p>
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl p-3 text-right transition hover:bg-primary-soft active:scale-[0.98]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                    <l.Icon size={16} />
                  </span>
                  <span className="text-sm font-bold">{l.label}</span>
                </Link>
              ))}
            </div>

            <p className="px-2 pb-2 pt-5 text-[10px] font-extrabold text-muted-foreground">
              المزيد
            </p>
            <div className="flex flex-col gap-1">
              <button className="flex items-center gap-3 rounded-2xl p-3 text-right transition hover:bg-primary-soft active:scale-[0.98]">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <MessageCircle size={16} />
                </span>
                <span className="text-sm font-bold">الدعم الفني</span>
              </button>
              <button className="flex items-center gap-3 rounded-2xl p-3 text-right transition hover:bg-primary-soft active:scale-[0.98]">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <FileText size={16} />
                </span>
                <span className="text-sm font-bold">سياسة الخصوصية</span>
              </button>

              {isAdminEmail && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-right transition active:scale-[0.98]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-warning/20 text-warning">
                    <ShieldCheck size={16} />
                  </span>
                  <span className="text-sm font-extrabold text-warning">
                    لوحة المدير
                  </span>
                </Link>
              )}
            </div>
          </div>

          <div className="border-t p-3">
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
                nav({ to: "/auth" });
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-extrabold text-destructive active:scale-[0.98]"
            >
              <LogOut size={16} /> تسجيل الخروج
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
