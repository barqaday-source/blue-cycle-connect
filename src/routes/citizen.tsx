import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Camera, Home, Package, User, Wallet } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/citizen")({
  component: CitizenLayout,
});

function CitizenLayout() {
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
        centerAction={{ to: "/citizen/new", icon: <Camera size={26} />, label: "وجبة جديدة" }}
        items={[
          { to: "/citizen", label: "الرئيسية", icon: <Home size={20} /> },
          { to: "/citizen/wallet", label: "محفظتي", icon: <Wallet size={20} /> },
          { to: "/citizen/shipments", label: "شحناتي", icon: <Package size={20} /> },
          { to: "/citizen/profile", label: "حسابي", icon: <User size={20} /> },
        ]}
      />
    </div>
  );
}
