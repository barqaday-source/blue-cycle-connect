import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CheckCircle2, Clock, MapPin, Phone, Trash2, XCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/collector/join")({
  head: () => ({
    meta: [
      { title: "شركتي — تدوير بلو" },
      { name: "description", content: "انضم إلى أقرب شركة تدوير في منطقتك وتابع حالة طلبك." },
      { property: "og:title", content: "شركتي — تدوير بلو" },
      { property: "og:description", content: "انضم إلى أقرب شركة تدوير في منطقتك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JoinCompany,
});

interface CompanyProfile {
  id: string;
  full_name: string;
  company_name: string | null;
  city: string | null;
  phone: string | null;
  avatar_url: string | null;
  lat: number | null;
  lng: number | null;
}

interface LinkRow {
  id: string;
  company_id: string;
  status: string;
  created_at: string;
}

function km(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function JoinCompany() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();

  const companiesQ = useQuery({
    queryKey: ["companies-directory"],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id,full_name,company_name,city,phone,avatar_url,lat,lng")
        .not("company_name", "is", null);
      return (data ?? []) as CompanyProfile[];
    },
  });

  const linksQ = useQuery({
    queryKey: ["my-links", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("collector_links")
        .select("id,company_id,status,created_at")
        .eq("collector_id", user!.id);
      return (data ?? []) as LinkRow[];
    },
  });

  const links = linksQ.data ?? [];
  const byCompany = new Map(links.map((l) => [l.company_id, l]));

  const list = [...(companiesQ.data ?? [])]
    .filter((c) => c.id !== user?.id)
    .map((c) => ({
      ...c,
      dist:
        profile?.lat != null && profile?.lng != null && c.lat != null && c.lng != null
          ? km(profile.lat, profile.lng, c.lat, c.lng)
          : null,
    }))
    .sort((a, b) => (a.dist ?? 9999) - (b.dist ?? 9999));

  async function join(companyId: string) {
    if (!user) return;
    const { error } = await supabase
      .from("collector_links")
      .insert({ collector_id: user.id, company_id: companyId });
    if (error) return toast.error("تعذّر إرسال الطلب");
    toast.success("تم إرسال طلب الانضمام");
    qc.invalidateQueries({ queryKey: ["my-links"] });
  }

  async function cancel(id: string) {
    await supabase.from("collector_links").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["my-links"] });
  }

  return (
    <>
      <AppHeader title="شركتي" subtitle="انضم لأقرب شركة تدوير" />

      {profile?.lat == null && (
        <div className="glass-card mb-4 rounded-2xl p-4 text-[12px] text-muted-foreground">
          حدّث موقعك من إعدادات الحساب لتظهر لك الشركات الأقرب إليك أولاً.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {list.length === 0 && (
          <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
            لا توجد شركات مسجلة في منطقتك بعد.
          </div>
        )}

        {list.map((c) => {
          const link = byCompany.get(c.id);
          const name = c.company_name ?? c.full_name;
          return (
            <article key={c.id} className="glass-card rounded-3xl p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary-soft text-primary">
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <Building2 size={20} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{name}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                    <MapPin size={11} /> {c.city ?? "غير محدد"}
                    {c.dist != null && <span className="text-primary">• {c.dist.toFixed(1)} كم</span>}
                  </p>
                </div>
                {link && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      link.status === "approved"
                        ? "bg-success/15 text-success"
                        : link.status === "rejected"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/15 text-warning"
                    }`}
                  >
                    {link.status === "approved" ? "عضو" : link.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {!link ? (
                  <button
                    onClick={() => join(c.id)}
                    className="btn-primary-gradient col-span-2 inline-flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-extrabold active:scale-95"
                  >
                    <CheckCircle2 size={14} /> طلب انضمام
                  </button>
                ) : (
                  <button
                    onClick={() => cancel(link.id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-destructive/10 py-2.5 text-xs font-extrabold text-destructive active:scale-95"
                  >
                    {link.status === "approved" ? <XCircle size={14} /> : <Trash2 size={14} />}
                    {link.status === "approved" ? "إلغاء العضوية" : "سحب الطلب"}
                  </button>
                )}
                {c.phone && (
                  <a
                    href={`https://wa.me/${c.phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="glass inline-flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-extrabold text-primary active:scale-95"
                  >
                    <Phone size={14} /> تواصل
                  </a>
                )}
              </div>

              {link?.status === "pending" && (
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock size={11} /> بانتظار موافقة الشركة
                </p>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
