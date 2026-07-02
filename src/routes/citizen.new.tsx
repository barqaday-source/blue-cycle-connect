import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Home as HomeIcon, Loader2, MapPin, Scale, Send } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { IconBtn } from "@/components/IconBtn";
import { PhotoCapture } from "@/components/PhotoCapture";
import { MATERIALS, type MaterialKey } from "@/lib/tadweer-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen/new")({
  head: () => ({ meta: [{ title: "وجبة جديدة — تدوير بلو" }] }),
  component: NewShipment,
});

function NewShipment() {
  const nav = useNavigate();
  const { user, profile } = useAuth();
  const [material, setMaterial] = useState<MaterialKey>("plastic");
  const [weight, setWeight] = useState("");
  const [area, setArea] = useState("الكرادة - قرب جامع بنية");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);

  function captureLocation() {
    if (!navigator.geolocation) return toast.error("خدمة الموقع غير متاحة");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        toast.success("تم تحديد موقعك");
      },
      () => toast.error("تعذّر الوصول للموقع"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  async function submit() {
    if (!user) return;
    const w = parseFloat(weight);
    if (!w || w <= 0) return toast.error("ادخل وزن صحيح");
    setBusy(true);
    const { error } = await supabase.from("shipments").insert({
      citizen_id: user.id,
      material,
      weight_kg: w,
      area,
      city: profile?.city ?? "بغداد",
      photo_url: photoUrl,
      status: "pending",
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("تم نشر وجبتك في منطقتك");
    nav({ to: "/citizen/shipments" });
  }

  return (
    <>
      <AppHeader
        back={
          <Link to="/citizen" aria-label="رجوع" className="grid h-11 w-11 place-items-center rounded-full bg-surface text-foreground shadow-[0_4px_14px_-4px_oklch(0.6_0.15_250/0.25)] transition active:scale-90">
            <ArrowRight size={18} />
          </Link>
        }
        title="وجبة جديدة"
        subtitle="تدوير بلو"
        right={<div className="h-11 w-11" />}
      />

      <PhotoCapture bucket="shipment-photos" onUploaded={(_p, url) => setPhotoUrl(url)} initialUrl={photoUrl} />

      <section className="mt-6">
        <p className="mb-3 text-xs font-bold text-muted-foreground">نوع المادة</p>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(MATERIALS).map(([key, m]) => {
            const active = material === (key as MaterialKey);
            return (
              <button
                key={key}
                onClick={() => setMaterial(key as MaterialKey)}
                className={`flex flex-col items-center gap-1 rounded-2xl py-3 transition active:scale-90 ${
                  active ? "btn-primary-gradient text-white" : "glass-card"
                }`}
              >
                <m.Icon size={22} className={active ? "text-white" : ""} style={!active ? { color: m.color } : undefined} />
                <span className="text-[10px] font-bold">{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <label className="mb-2 block text-xs font-bold text-muted-foreground">الوزن التقريبي (كيلو)</label>
        <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3">
          <Scale size={18} className="text-primary" />
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
            <MapPin size={28} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-primary" />
          </div>
          <div className="flex items-center gap-2 p-3">
            <HomeIcon size={18} className="text-muted-foreground" />
            <input value={area} onChange={(e) => setArea(e.target.value)} className="flex-1 bg-transparent text-sm font-bold outline-none" />
          </div>
        </div>
        <button
          onClick={captureLocation}
          className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-extrabold transition active:scale-[0.98] ${coords ? "bg-success/15 text-success" : "bg-primary/10 text-primary"}`}
        >
          <MapPin size={14} /> {coords ? `تم التقاط الإحداثيات (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : "تحديد موقعي الآن"}
        </button>
      </section>

      <button
        onClick={submit}
        disabled={busy}
        className="btn-primary-gradient mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold transition active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        انشر العرض في منطقتي
      </button>
    </>
  );
}
