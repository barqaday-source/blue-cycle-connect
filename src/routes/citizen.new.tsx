import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, type MaterialKey } from "@/lib/tadweer-data";

export const Route = createFileRoute("/citizen/new")({
  head: () => ({ meta: [{ title: "وجبة جديدة — تدوير بلو" }] }),
  component: NewShipment,
});

function NewShipment() {
  const nav = useNavigate();
  const [material, setMaterial] = useState<MaterialKey>("plastic");
  const [weight, setWeight] = useState("");
  const [address, setAddress] = useState("الكرادة - قرب جامع بنية");

  return (
    <>
      <AppHeader
        back={
          <Link to="/citizen" className="grid h-11 w-11 place-items-center rounded-full bg-surface text-lg shadow-[0_4px_14px_-4px_oklch(0.6_0.15_250/0.25)]">
            →
          </Link>
        }
        title="وجبة جديدة"
        subtitle="تدوير بلو"
        right={<div className="h-11 w-11" />}
      />

      <div className="glass-card relative mt-1 overflow-hidden rounded-3xl">
        <div
          className="flex h-48 items-center justify-center bg-gradient-to-br from-[oklch(0.85_0.05_220)] to-[oklch(0.7_0.12_245)] text-white"
        >
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/25 text-3xl backdrop-blur">
              📷
            </div>
            <p className="mt-2 text-sm font-bold">اضغط لالتقاط صورة المواد</p>
          </div>
        </div>
        <button className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-primary">
          إعادة الالتقاط
        </button>
      </div>

      <section className="mt-6">
        <p className="mb-3 text-xs font-bold text-muted-foreground">نوع المادة</p>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(MATERIALS).map(([key, m]) => {
            const active = material === (key as MaterialKey);
            return (
              <button
                key={key}
                onClick={() => setMaterial(key as MaterialKey)}
                className={`flex flex-col items-center gap-1 rounded-2xl py-3 transition ${
                  active ? "btn-primary-gradient text-white" : "glass-card"
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="text-[10px] font-bold">{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <label className="mb-2 block text-xs font-bold text-muted-foreground">الوزن التقريبي (كيلو)</label>
        <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3">
          <span className="text-xl">⚖️</span>
          <input
            inputMode="numeric"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="مثلاً: 10"
            className="flex-1 bg-transparent text-base font-bold outline-none placeholder:text-muted-foreground/60"
          />
          <span className="text-sm font-bold text-muted-foreground">كغ</span>
        </div>
      </section>

      <section className="mt-6">
        <label className="mb-2 block text-xs font-bold text-muted-foreground">الموقع</label>
        <div className="glass-card overflow-hidden rounded-3xl">
          <div className="relative h-32 bg-[radial-gradient(circle_at_30%_40%,oklch(0.85_0.08_230),oklch(0.95_0.02_230))]">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(oklch(0.6_0.1_240/.2) 1px,transparent 1px),linear-gradient(90deg,oklch(0.6_0.1_240/.2) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-3xl">📍</div>
            <button className="absolute bottom-2 right-2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-primary">
              تحديد على الخريطة
            </button>
          </div>
          <div className="flex items-center gap-2 p-3">
            <span className="text-lg">🏠</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-transparent text-sm font-bold outline-none"
            />
          </div>
        </div>
      </section>

      <button
        onClick={() => nav({ to: "/citizen/shipments" })}
        className="btn-primary-gradient mt-8 w-full rounded-2xl py-4 text-base font-extrabold"
      >
        انشر العرض في منطقتي
      </button>
    </>
  );
}
