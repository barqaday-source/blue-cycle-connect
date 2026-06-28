import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/company")({
  component: CompanyLayout,
});

function CompanyLayout() {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto min-h-screen w-full max-w-[460px] px-4 pb-32">
      <Outlet />
      <BottomNav
        activePath={pathname}
        centerAction={{ to: "/company", icon: <span className="text-2xl">🗺️</span>, label: "الخريطة" }}
        items={[
          { to: "/company/feed", label: "الشحنات", icon: "📋" },
          { to: "/company/orders", label: "الجارية", icon: "🚚" },
          { to: "/company/stats", label: "تقاريري", icon: "📊" },
          { to: "/company/profile", label: "حسابي", icon: "👤" },
        ]}
      />
    </div>
  );
}
