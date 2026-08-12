import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Bell } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/account/notifications")({
  head: () => ({ meta: [{ title: "الإشعارات — تدوير بلو" }] }),
  component: NotifPage,
});

const KEY = "tadweer_notif_prefs_v1";
type Prefs = { newShipments: boolean; priceUpdates: boolean; whatsapp: boolean };

function NotifPage() {
  const { isCompany } = useAuth();
  const [p, setP] = useState<Prefs>({ newShipments: true, priceUpdates: true, whatsapp: true });
  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setP(JSON.parse(s));
    } catch {}
  }, []);
  function update(k: keyof Prefs, v: boolean) {
    const n = { ...p, [k]: v };
    setP(n);
    localStorage.setItem(KEY, JSON.stringify(n));
    toast.success("تم الحفظ");
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
        title="إعدادات الإشعارات"
        subtitle="اختر ما يصلك من تنبيهات"
        right={<div className="h-11 w-11" />}
      />
      <div className="flex flex-col gap-3">
        <Row label="شحنات جديدة في منطقتك" val={p.newShipments} on={(v) => update("newShipments", v)} />
        <Row label="تحديثات أسعار المواد" val={p.priceUpdates} on={(v) => update("priceUpdates", v)} />
        <Row label="إشعارات واتساب" val={p.whatsapp} on={(v) => update("whatsapp", v)} />
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        <Bell size={12} className="inline" /> يتم حفظ التفضيلات على جهازك.
      </p>
    </>
  );
}

function Row({ label, val, on }: { label: string; val: boolean; on: (v: boolean) => void }) {
  return (
    <div className="glass-card flex items-center justify-between rounded-2xl p-4">
      <span className="text-sm font-bold">{label}</span>
      <button
        onClick={() => on(!val)}
        className={`relative h-6 w-11 rounded-full transition ${val ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${val ? "right-0.5" : "right-5"}`} />
      </button>
    </div>
  );
}
