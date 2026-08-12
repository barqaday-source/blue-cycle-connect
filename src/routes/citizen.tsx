import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Camera, Home, Building2, User, Globe } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/citizen")({
  component: CitizenLayout,
});

function CitizenLayout() {
  const { pathname } = useLocation();
  const { user, loading, isCitizen } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isCitizen)) {
      nav({ to: "/auth" });
    }
  }, [loading, user, isCitizen, nav]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[460px] px-4 pb-32" style={{ fontFamily: "Cairo, system-ui" }}>
      <Outlet />
      <BottomNav
        activePath={pathname}
        centerAction={{ to: "/citizen/new", icon: <Camera size={26} />, label: "وجبة جديدة" }}
        items={[
          { to: "/citizen", label: "الرئيسية", icon: <Home size={20} /> },
          { to: "/citizen/directory", label: "الشركات", icon: <Building2 size={20} /> },
          { to: "/citizen/shipments", label: "شحناتي", icon: <Globe size={20} /> },
          { to: "/citizen/profile", label: "حسابي", icon: <User size={20} /> },
        ]}
      />
    </div>
  );
}
