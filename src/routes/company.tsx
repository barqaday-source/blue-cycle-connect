import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ClipboardList, Map, Megaphone, BarChart3, User } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/company")({
  component: CompanyLayout,
});

function CompanyLayout() {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[460px] px-4 pb-32">
      <Outlet />
      <BottomNav
        activePath={pathname}
        centerAction={{ to: "/map", icon: <Map size={26} />, label: "الخريطة" }}
        items={[
          { to: "/company/feed", label: "الشحنات", icon: <ClipboardList size={20} /> },
          { to: "/company/ads", label: "إعلاناتي", icon: <Megaphone size={20} /> },
          { to: "/company/stats", label: "تقاريري", icon: <BarChart3 size={20} /> },
          { to: "/company/profile", label: "حسابي", icon: <User size={20} /> },
        ]}
      />
    </div>
  );
}
