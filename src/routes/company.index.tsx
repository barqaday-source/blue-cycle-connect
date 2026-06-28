import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, SAMPLE_SHIPMENTS, type MaterialKey } from "@/lib/tadweer-data";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "لوحة الشركة — تدوير بلو" }] }),
  component: CompanyDashboard,
});

function CompanyDashboard() {
  const [filter, setFilter] = useState<MaterialKey | "all">("all");
  const available = SAMPLE_SHIPMENTS.filter((s) => s.status === "pending");
  const filtered = filter === "all" ? available : available.filter((s) => s.material === filter);

  return (
    <>
      <AppHeader
        avatar={
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-base font-extrabold text-primary">
            ن
          </div>
        }
        subtitle="معمل النور للتدوير"
        title={
          <span className="inline-flex items-center gap-1">
            <span className="text-primary">📍</span> بغداد
          </span>
        }
        right={
          <button className="grid h-11 w-11 place-items-center rounded-full bg-surface text-lg shadow-[0_4px_14px_-4px_oklch(0.6_0.15_250/0.25)]">
            🔔
          </button>
        }
      />

      {/* Map */}
      <div className="glass-card relative overflow-hidden rounded-3xl">
        <div className="relative h-56 bg-[radial-gradient(circle_at_30%_30%,oklch(0.88_0.06_230),oklch(0.96_0.02_230))]">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.6_0.1_240/.25) 1px,transparent 1px),linear-gradient(90deg,oklch(0.6_0.1_240/.25) 1px,transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          {available.map((s, i) => (
            <div
              key={s.id}
              className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-base shadow-lg ring-2 ring-white"
              style={{
                top: `${20 + (i * 13) % 70}%`,
                left: `${15 + (i * 17) % 75}%`,
                background: MATERIALS[s.material].color,
                color: "white",
              }}
            >
              {MATERIALS[s.material].icon}
            </div>
          ))}
          <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-foreground">
            🛰️ خريطة مجانية — OpenStreetMap
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} icon="✨" label="الكل" />
        {Object.entries(MATERIALS).map(([k, m]) => (
          <FilterChip
            key={k}
            active={filter === (k as MaterialKey)}
            onClick={() => setFilter(k as MaterialKey)}
            icon={m.icon}
            label={m.label}
          />
        ))}
      </div>

      {/* List */}
      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-sm font-extrabold">الأقرب إليك ({filtered.length})</h3>
        <Link to="/company/feed" className="text-xs font-bold text-primary">عرض الكل ←</Link>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {filtered.map((s) => {
          const m = MATERIALS[s.material];
          return (
            <Link key={s.id} to="/company/feed" className="glass-card flex items-center gap-3 rounded-2xl p-3 transition active:scale-[0.99]">
              <div
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl"
                style={{ background: `color-mix(in oklab, ${m.color} 22%, white)` }}
              >
                {m.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">{m.label} — {s.weightKg} كغ</p>
                <p className="truncate text-[11px] text-muted-foreground">📍 {s.area}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{s.postedAt}</p>
              </div>
              <div className="shrink-0 text-left">
                <p className="text-[11px] font-extrabold text-primary">{s.distanceKm} كم</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">تفاصيل ←</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function FilterChip({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition ${
        active ? "btn-primary-gradient" : "glass-card text-foreground"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
