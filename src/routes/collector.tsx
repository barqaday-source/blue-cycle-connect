import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Home, Map, Zap, User, Building2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/collector")({
  component: CollectorLayout,
});

function CollectorLayout() {
  const { pathname } = useLocation();
  const { user, loading, isCollector } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isCollector)) {
      nav({ to: "/auth" });
    }
  }, [loading, user, isCollector, nav]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[460px] px-4 pb-32" style={{ fontFamily: "Cairo, system-ui" }}>
      <Outlet />
      <BottomNav
        activePath={pathname}
        centerAction={{ to: "/map", icon: <Map size={26} />, label: "الخريطة" }}
        items={[
          { to: "/collector", label: "الرئيسية", icon: <Home size={20} /> },
          { to: "/collector/opportunities", label: "الفرص", icon: <Zap size={20} /> },
          { to: "/collector/join", label: "شركتي", icon: <Building2 size={20} /> },
          { to: "/collector/profile", label: "حسابي", icon: <User size={20} /> },
        ]}
      />
    </div>
  );
}
