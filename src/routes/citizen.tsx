import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/citizen")({
  component: CitizenLayout,
});

function CitizenLayout() {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto min-h-screen w-full max-w-[460px] px-4 pb-32">
      <Outlet />
      <BottomNav
        activePath={pathname}
        centerAction={{ to: "/citizen/new", icon: <span className="text-2xl">📸</span>, label: "وجبة جديدة" }}
        items={[
          { to: "/citizen", label: "الرئيسية", icon: "🏠" },
          { to: "/citizen/wallet", label: "محفظتي", icon: "💚" },
          { to: "/citizen/shipments", label: "شحناتي", icon: "📦" },
          { to: "/citizen/profile", label: "حسابي", icon: "👤" },
        ]}
      />
    </div>
  );
}
