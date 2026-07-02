import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Camera, ChevronLeft, Map as MapIcon, MapPin, Megaphone, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { IconBtn } from "@/components/IconBtn";
import { MATERIALS, statusMeta, timeAgo, type ShipmentRow } from "@/lib/tadweer-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/citizen/")({
  head: () => ({ meta: [{ title: "الرئيسية — تدوير بلو" }] }),
  component: CitizenHome,
});

function CitizenHome() {
  const { profile, user } = useAuth();
  const myQ = useQuery({
    queryKey: ["my-shipments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("shipments")
        .select("*")
        .eq("citizen_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(3);
      return (data ?? []) as ShipmentRow[];
    },
  });
  const adQ = useQuery({
    queryKey: ["home-ads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("company_ads")
        .select("id,title,description,image_url,price_per_kg,material")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const firstChar = (profile?.full_name?.trim()?.[0] ?? "ت").toUpperCase();
  return (
    <>
      <AppHeader
        avatar={
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-lg font-extrabold text-primary">
            {firstChar}
          </div>
        }
        subtitle="موقعك"
        title={
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} className="text-primary" /> {profile?.city ?? "بغداد"}
          </span>
        }
        right={<IconBtn aria-label="الإشعارات"><Bell size={18} /></IconBtn>}
      />

      <section className="mt-2">
        <p className="text-sm text-muted-foreground">أهلاً {profile?.full_name?.split(" ")[0] ?? "بك"} 👋</p>
        <h2 className="mt-1 text-2xl font-black leading-tight">صوّر موادك،<br />واكسب من بيتك.</h2>
      </section>

      <Link
        to="/citizen/new"
        className="btn-primary-gradient mt-6 flex items-center justify-between gap-3 rounded-3xl p-5 transition active:scale-[0.98]"
      >
        <div className="text-right">
          <p className="text-xs/4 opacity-90">ابدأ الآن</p>
          <p className="inline-flex items-center gap-2 text-xl font-extrabold"><Camera size={22} /> صوّر واكسب</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20"><ChevronLeft size={26} /></div>
      </Link>
      <Link
        to="/prices"
        className="glass-card mt-3 flex items-center gap-3 rounded-2xl p-3 press"
      >
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-success/15 text-success">
          <TrendingUp size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">أسعار اليوم</p>
          <p className="text-[11px] text-muted-foreground">شوف سعر الكيلو لكل مادة قبل ما تبيع</p>
        </div>
        <ChevronLeft size={18} className="text-primary" />
      </Link>
      <Link to="/map" className="glass-card mt-3 flex items-center gap-3 rounded-2xl p-3 press">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MapIcon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">الخريطة</p>
          <p className="text-[11px] text-muted-foreground">شوف المواطنين والشركات القريبة منك</p>
        </div>
        <ChevronLeft size={18} className="text-primary" />
      </Link>



      <section className="mt-8">
        <p className="mb-3 text-xs font-bold text-muted-foreground">اختر نوع المادة بسرعة</p>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(MATERIALS).map(([key, m]) => (
            <Link
              key={key}
              to="/citizen/new"
              className="glass-card flex flex-col items-center gap-1 rounded-2xl py-3 transition active:scale-90"
            >
              <m.Icon size={22} style={{ color: m.color }} />
              <span className="text-[10px] font-bold">{m.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold">شحناتي الحالية</h3>
          <Link to="/citizen/shipments" className="text-xs font-bold text-primary">عرض الكل ←</Link>
        </div>
        <div className="flex flex-col gap-3">
          {(myQ.data ?? []).length === 0 && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
              لا توجد شحنات بعد — ابدأ بنشر أول وجبة الآن!
            </div>
          )}
          {(myQ.data ?? []).map((s) => {
            const m = MATERIALS[s.material];
            const meta = statusMeta(s.status);
            return (
              <div key={s.id} className="glass-card flex items-center gap-3 rounded-2xl p-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${m.color} 18%, white)` }}>
                  <m.Icon size={24} style={{ color: m.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{m.label} — {s.weight_kg} كغ</p>
                  <p className="truncate text-[11px] text-muted-foreground inline-flex items-center gap-1"><MapPin size={11} /> {s.area}</p>
                </div>
                <div className="shrink-0 text-left">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${meta.color}`}>
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} /> {meta.label}
                  </span>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(s.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {(adQ.data ?? []).length > 0 && (
        <section className="mt-8">
          <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold"><Megaphone size={16} /> عروض الشركات</h3>
          <div className="flex flex-col gap-3">
            {(adQ.data ?? []).map((a) => (
              <div key={a.id} className="glass-card flex items-center gap-3 rounded-2xl p-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary-soft">
                  {a.image_url ? <img src={a.image_url} className="h-full w-full object-cover" alt="" /> : <Megaphone size={20} className="text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{a.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{a.description}</p>
                </div>
                {a.price_per_kg != null && (
                  <span className="shrink-0 rounded-full bg-success/15 px-2 py-1 text-[10px] font-extrabold text-success">
                    {a.price_per_kg} د.ع/كغ
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
