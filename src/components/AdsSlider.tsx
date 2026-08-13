import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MATERIALS, type MaterialKey } from "@/lib/tadweer-data";

interface Ad {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price_per_kg: number | null;
  material: MaterialKey | null;
  city: string | null;
}

/** Modern auto-playing ads slider for the home screens. */
export function AdsSlider() {
  const scroller = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const q = useQuery({
    queryKey: ["ads-slider"],
    queryFn: async () => {
      const { data } = await supabase
        .from("company_ads")
        .select("id,title,description,image_url,price_per_kg,material,city")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(8);
      return (data ?? []) as Ad[];
    },
  });

  const ads = q.data ?? [];

  useEffect(() => {
    if (ads.length < 2) return;
    const t = setInterval(() => {
      const el = scroller.current;
      if (!el) return;
      const next = (idx + 1) % ads.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
      setIdx(next);
    }, 4500);
    return () => clearInterval(t);
  }, [idx, ads.length]);

  if (ads.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center gap-2">
        <Megaphone size={16} className="text-primary" />
        <h3 className="text-sm font-extrabold">إعلانات الشركات</h3>
      </div>
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIdx(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        }}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ads.map((a) => (
          <article key={a.id} className="glass-card w-full shrink-0 snap-center overflow-hidden rounded-3xl">
            {a.image_url ? (
              <img src={a.image_url} alt={a.title} loading="lazy" className="h-36 w-full object-cover" />
            ) : (
              <div className="grid h-36 w-full place-items-center bg-primary-soft text-primary">
                <Megaphone size={34} />
              </div>
            )}
            <div className="p-4">
              <p className="truncate text-sm font-extrabold">{a.title}</p>
              {a.description && (
                <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">{a.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                {a.material && (
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 font-bold text-primary">
                    {MATERIALS[a.material]?.label ?? a.material}
                  </span>
                )}
                {a.price_per_kg != null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 font-bold text-success">
                    <Tag size={10} /> {a.price_per_kg} د.ع/كغ
                  </span>
                )}
                {a.city && <span className="text-muted-foreground">{a.city}</span>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {ads.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {ads.map((a, i) => (
            <span
              key={a.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-primary" : "w-1.5 bg-primary/25"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
