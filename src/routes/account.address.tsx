import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Loader2, MapPin, Save } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/account/address")({
  head: () => ({ meta: [{ title: "عنواني — تدوير بلو" }] }),
  component: AddressPage,
});

function AddressPage() {
  const { user, profile, isCompany, refresh } = useAuth();
  const nav = useNavigate();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    profile?.lat && profile?.lng ? { lat: profile.lat, lng: profile.lng } : null,
  );
  const [city, setCity] = useState(profile?.city ?? "بغداد");
  const [busy, setBusy] = useState(false);

  function locate() {
    if (!navigator.geolocation) return toast.error("خدمة الموقع غير متاحة");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        toast.success("تم التقاط الإحداثيات");
      },
      () => toast.error("تعذر الوصول للموقع"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  async function save() {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ city, lat: coords?.lat ?? null, lng: coords?.lng ?? null })
      .eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    await refresh();
    toast.success("تم حفظ العنوان");
    nav({ to: isCompany ? "/company/profile" : "/citizen/profile" });
  }

  const backTo = isCompany ? "/company/profile" : "/citizen/profile";
  return (
    <>
      <AppHeader
        back={
          <Link to={backTo} className="glass press grid h-11 w-11 place-items-center rounded-2xl press text-foreground">
            <ArrowRight size={18} />
          </Link>
        }
        title="عنواني الافتراضي"
        subtitle="سيظهر تلقائياً في الوجبات الجديدة"
        right={<div className="h-11 w-11" />}
      />
      <label className="glass-card block rounded-2xl p-3">
        <span className="mb-1 block text-[11px] font-bold text-muted-foreground">المحافظة / المدينة</span>
        <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none" />
      </label>
      <button
        onClick={locate}
        className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-extrabold ${
          coords ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
        }`}
      >
        <MapPin size={14} />
        {coords ? `الإحداثيات: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "تحديد موقعي الآن على الخريطة"}
      </button>
      <button
        onClick={save}
        disabled={busy}
        className="btn-primary-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold disabled:opacity-60"
      >
        {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} حفظ العنوان
      </button>
    </>
  );
}
