import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, MapPin, Phone, Trash2, UserRound, Users, XCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/company/collectors")({
  head: () => ({
    meta: [
      { title: "المجمعون التابعون — تدوير بلو" },
      { name: "description", content: "إدارة المجمعين التابعين لشركتك وقبول طلبات الانضمام." },
      { property: "og:title", content: "المجمعون التابعون — تدوير بلو" },
      { property: "og:description", content: "إدارة المجمعين التابعين لشركتك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CompanyCollectors,
});

interface LinkRow {
  id: string;
  collector_id: string;
  status: string;
  created_at: string;
}

interface P {
  id: string;
  full_name: string;
  city: string | null;
  phone: string | null;
  avatar_url: string | null;
}

function CompanyCollectors() {
  const { user, isCompany } = useAuth();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["company-collectors", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: links } = await supabase
        .from("collector_links")
        .select("id,collector_id,status,created_at")
        .eq("company_id", user!.id)
        .order("created_at", { ascending: false });
      const rows = (links ?? []) as LinkRow[];
      if (rows.length === 0) return { rows, people: new Map<string, P>() };
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,full_name,city,phone,avatar_url")
        .in("id", rows.map((r) => r.collector_id));
      return { rows, people: new Map(((profs ?? []) as P[]).map((p) => [p.id, p])) };
    },
  });

  async function setStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("collector_links").update({ status }).eq("id", id);
    if (error) return toast.error("تعذّر تحديث الطلب");
    toast.success(status === "approved" ? "تم قبول المجمع" : "تم رفض الطلب");
    qc.invalidateQueries({ queryKey: ["company-collectors"] });
  }
  async function remove(id: string) {
    await supabase.from("collector_links").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["company-collectors"] });
  }

  const rows = q.data?.rows ?? [];
  const people = q.data?.people ?? new Map<string, P>();
  const pending = rows.filter((r) => r.status === "pending");
  const team = rows.filter((r) => r.status === "approved");

  if (!isCompany) {
    return (
      <>
        <AppHeader title="المجمعون" subtitle="تدوير بلو" />
        <div className="glass-card rounded-2xl p-4 text-center text-sm text-muted-foreground">
          هذه الصفحة متاحة لحسابات الشركات فقط.
        </div>
      </>
    );
  }

  const Card = ({ link, actions }: { link: LinkRow; actions: "review" | "member" }) => {
    const p = people.get(link.collector_id);
    return (
      <article className="glass-card rounded-3xl p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary-soft text-primary">
            {p?.avatar_url ? (
              <img src={p.avatar_url} alt={p.full_name} className="h-full w-full object-cover" />
            ) : (
              <UserRound size={20} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold">{p?.full_name ?? "مجمع"}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[11px] text-muted-foreground">
              <MapPin size={11} /> {p?.city ?? "غير محدد"}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {actions === "review" ? (
            <>
              <button
                onClick={() => setStatus(link.id, "approved")}
                className="btn-primary-gradient inline-flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-extrabold active:scale-95"
              >
                <CheckCircle2 size={14} /> قبول
              </button>
              <button
                onClick={() => setStatus(link.id, "rejected")}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-destructive/10 py-2.5 text-xs font-extrabold text-destructive active:scale-95"
              >
                <XCircle size={14} /> رفض
              </button>
            </>
          ) : (
            <>
              <a
                href={p?.phone ? `https://wa.me/${p.phone.replace(/[^\d]/g, "")}` : "#"}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-extrabold text-primary active:scale-95"
              >
                <Phone size={14} /> تواصل
              </a>
              <button
                onClick={() => remove(link.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-destructive/10 py-2.5 text-xs font-extrabold text-destructive active:scale-95"
              >
                <Trash2 size={14} /> إزالة
              </button>
            </>
          )}
        </div>
      </article>
    );
  };

  return (
    <>
      <AppHeader title="المجمعون التابعون" subtitle="فريق شركتك الميداني" />

      <div className="glass-card mb-4 flex items-center gap-3 rounded-3xl p-4">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Users size={20} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-extrabold">{team.length} مجمع معتمد</p>
          <p className="text-[11px] text-muted-foreground">{pending.length} طلب بانتظار المراجعة</p>
        </div>
      </div>

      {pending.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-3 text-sm font-extrabold">طلبات الانضمام</h3>
          <div className="flex flex-col gap-3">
            {pending.map((l) => (
              <Card key={l.id} link={l} actions="review" />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-sm font-extrabold">فريق المجمعين</h3>
        <div className="flex flex-col gap-3">
          {team.length === 0 && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
              لا يوجد مجمعون تابعون بعد — سيظهرون هنا بعد قبول طلباتهم.
            </div>
          )}
          {team.map((l) => (
            <Card key={l.id} link={l} actions="member" />
          ))}
        </div>
      </section>
    </>
  );
}
