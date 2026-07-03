import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { MapPin, MessageCircle, PackageCheck, Phone } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { MATERIALS, type ShipmentRow, timeAgo } from "@/lib/tadweer-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/company/feed")({
  head: () => ({ meta: [{ title: "الشحنات المتاحة — تدوير بلو" }] }),
  component: Feed,
});

type FeedRow = ShipmentRow & { citizen_phone: string | null; citizen_name: string | null };

function waLink(phone: string, msg: string) {
  const p = phone.replace(/[^\d]/g, "").replace(/^0/, "964");
  return `https://wa.me/${p}?text=${encodeURIComponent(msg)}`;
}

function Feed() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const q = useQuery({
    queryKey: ["feed-shipments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("shipments")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      const rows = (data ?? []) as ShipmentRow[];
      const ids = Array.from(new Set(rows.map((r) => r.citizen_id)));
      let map = new Map<string, { phone: string | null; full_name: string | null }>();
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, phone, full_name")
          .in("id", ids);
        (profs ?? []).forEach((p) => map.set(p.id, { phone: p.phone, full_name: p.full_name }));
      }
      return rows.map((r) => ({
        ...r,
        citizen_phone: map.get(r.citizen_id)?.phone ?? null,
        citizen_name: map.get(r.citizen_id)?.full_name ?? null,
      })) as FeedRow[];
    },
  });

  async function accept(id: string) {
    if (!user) return;
    const { error } = await supabase
      .from("shipments")
      .update({ status: "accepted", company_id: user.id })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم قبول الشحنة وإضافتها لطلباتك");
    qc.invalidateQueries({ queryKey: ["feed-shipments"] });
    qc.invalidateQueries({ queryKey: ["available-shipments"] });
    qc.invalidateQueries({ queryKey: ["my-orders"] });
  }

  return (
    <>
      <AppHeader title="الشحنات المتاحة" subtitle="مرتبة حسب الأحدث" />
      <div className="flex flex-col gap-3">
        {(q.data ?? []).length === 0 && (
          <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
            لا توجد شحنات الآن.
          </div>
        )}
        {(q.data ?? []).map((s) => {
          const m = MATERIALS[s.material];
          const msg = `السلام عليكم، بخصوص وجبة ${m.label} (${s.weight_kg} كغ) في ${s.area ?? ""} — تطبيق تدوير بلو`;
          return (
            <div key={s.id} className="glass-card overflow-hidden rounded-3xl">
              <div
                className="relative flex h-32 items-end justify-between p-3 text-white"
                style={{
                  background: `linear-gradient(135deg, color-mix(in oklab, ${m.color} 80%, black) 0%, color-mix(in oklab, ${m.color} 55%, white) 100%)`,
                }}
              >
                {s.photo_url ? (
                  <img src={s.photo_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                ) : null}
                <div className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[11px] font-extrabold backdrop-blur">
                  <m.Icon size={14} /> {m.label}
                </div>
                <div className="relative z-10 text-left">
                  <p className="text-2xl font-black leading-none">
                    {s.weight_kg}
                    <span className="text-sm">كغ</span>
                  </p>
                  <p className="text-[10px] opacity-90">الوزن التقريبي</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate inline-flex items-center gap-1 text-sm font-extrabold">
                      <MapPin size={14} className="text-primary" /> {s.area}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.city} {s.citizen_name ? `• ${s.citizen_name}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-extrabold text-primary">
                    {timeAgo(s.created_at)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {s.citizen_phone ? (
                    <a
                      href={waLink(s.citizen_phone, msg)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-success/15 py-2.5 text-xs font-extrabold text-success active:scale-95"
                    >
                      <MessageCircle size={14} /> واتساب المواطن
                    </a>
                  ) : (
                    <div className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-muted py-2.5 text-xs font-bold text-muted-foreground">
                      <Phone size={14} /> بدون رقم
                    </div>
                  )}
                  <button
                    onClick={() => accept(s.id)}
                    className="btn-primary-gradient inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition active:scale-[0.98]"
                  >
                    <PackageCheck size={14} /> قبول الشحنة
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
