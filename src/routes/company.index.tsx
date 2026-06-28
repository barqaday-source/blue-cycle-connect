import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronLeft, MapPin, Sparkles, Satellite } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { IconBtn } from "@/components/IconBtn";
import { MATERIALS, type MaterialKey, type ShipmentRow, timeAgo } from "@/lib/tadweer-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "لوحة الشركة — تدوير بلو" }] }),
  component: CompanyDashboard,
});

function CompanyDashboard() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState<MaterialKey | "all">("all");
  const q = useQuery({
    queryKey: ["available-shipments"],
    queryFn: async () => {
      const { data } = await supabase.from("shipments").select("*").eq("status", "pending").order("created_at", { ascending: false });
      return (data ?? []) as ShipmentRow[];
    },
  });
  const available = q.data ?? [];
  const filtered = filter === "all" ? available : available.filter((s) => s.material === filter);

  return (
    <>
      <AppHeader
        avatar={<div className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-base font-extrabold text-primary">{(profile?.company_name?.[0] ?? profile?.full_name?.[0] ?? "ش").toUpperCase()}</div>}
        subtitle={profile?.company_name ?? "شركة تدوير"}
        title={<span className="inline-flex items-center gap-1"><MapPin size={14} className="text-primary" /> {profile?.city ?? "بغداد"}</span>}
        right={<IconBtn aria-label="إشعارات"><Bell size={18} /></IconBtn>}
      />

      <div className="glass-card relative overflow-hidden rounded-3xl">
        <div className="relative h-56 bg-[radial-gradient(circle_at_30%_30%,oklch(0.88_0.06_230),oklch(0.96_0.02_230))]">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(oklch(0.6_0.1_240/.25) 1px,transparent 1px),linear-gradient(90deg,oklch(0.6_0.1_240/.25) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
          {available.slice(0, 10).map((s, i) => {
            const m = MATERIALS[s.material];
            return (
              <div key={s.id} className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-lg ring-2 ring-white"
                style={{ top: `${20 + (i * 13) % 70}%`, left: `${15 + (i * 17) % 75}%`, background: m.color }}>
                <m.Icon size={16} />
              </div>
            );
          })}
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-foreground">
            <Satellite size={12} /> خريطة مجانية — OpenStreetMap
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} Icon={Sparkles} label="الكل" color="oklch(0.62 0.19 252)" />
        {Object.entries(MATERIALS).map(([k, m]) => (
          <FilterChip key={k} active={filter === (k as MaterialKey)} onClick={() => setFilter(k as MaterialKey)} Icon={m.Icon} label={m.label} color={m.color} />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-sm font-extrabold">الأقرب إليك ({filtered.length})</h3>
        <Link to="/company/feed" className="text-xs font-bold text-primary">عرض الكل ←</Link>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {filtered.length === 0 && <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">لا توجد شحنات متاحة الآن.</div>}
        {filtered.map((s) => {
          const m = MATERIALS[s.material];
          return (
            <Link key={s.id} to="/company/feed" className="glass-card flex items-center gap-3 rounded-2xl p-3 transition active:scale-[0.98]">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl" style={{ background: `color-mix(in oklab, ${m.color} 22%, white)` }}>
                <m.Icon size={28} style={{ color: m.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">{m.label} — {s.weight_kg} كغ</p>
                <p className="truncate text-[11px] text-muted-foreground inline-flex items-center gap-1"><MapPin size={11} /> {s.area}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(s.created_at)}</p>
              </div>
              <ChevronLeft size={18} className="shrink-0 text-primary" />
            </Link>
          );
        })}
      </div>
    </>
  );
}

import type { LucideIcon } from "lucide-react";
function FilterChip({ active, onClick, Icon, label, color }: { active: boolean; onClick: () => void; Icon: LucideIcon; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition active:scale-90 ${
        active ? "btn-primary-gradient text-white" : "glass-card"
      }`}
    >
      <Icon size={14} className={active ? "text-white" : ""} style={!active ? { color } : undefined} />
      <span>{label}</span>
    </button>
  );
}
