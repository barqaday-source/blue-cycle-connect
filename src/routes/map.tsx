import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, Locate, MapPin } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { MATERIALS, type MaterialKey } from "@/lib/tadweer-data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "الخريطة — تدوير بلو" }] }),
  component: MapPage,
});

const BAGHDAD: [number, number] = [33.3152, 44.3661];

function pinIcon(color: string, letter: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <defs>
        <filter id="s" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path filter="url(#s)" d="M18 1c9.4 0 17 7.4 17 16.4 0 12.3-17 27.6-17 27.6S1 29.7 1 17.4C1 8.4 8.6 1 18 1z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="18" cy="17" r="8" fill="white"/>
      <text x="18" y="21" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="800" fill="${color}">${letter}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [36, 46],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
  });
}

const CITIZEN_ICON = pinIcon("#0ea5e9", "م");
const COMPANY_ICON = pinIcon("#16a34a", "ش");
const ME_ICON = pinIcon("#a855f7", "أ");

interface ShipmentPin {
  id: string;
  material: MaterialKey;
  weight_kg: number;
  area: string | null;
  lat: number;
  lng: number;
  created_at: string;
  status: string;
}
interface AdPin {
  id: string;
  title: string;
  material: MaterialKey | null;
  price_per_kg: number | null;
  city: string | null;
  lat: number;
  lng: number;
}

function Recenter({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 0.8 });
  }, [center, map]);
  return null;
}

function MapPage() {
  const { user } = useAuth();
  const [me, setMe] = useState<[number, number] | null>(null);
  const [center, setCenter] = useState<[number, number] | null>(null);

  const shipments = useQuery({
    queryKey: ["map-shipments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("shipments")
        .select("id,material,weight_kg,area,lat,lng,created_at,status")
        .not("lat", "is", null)
        .not("lng", "is", null)
        .order("created_at", { ascending: false })
        .limit(200);
      return (data ?? []) as ShipmentPin[];
    },
  });

  const ads = useQuery({
    queryKey: ["map-ads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("company_ads")
        .select("id,title,material,price_per_kg,city,lat,lng")
        .eq("active", true)
        .not("lat", "is", null)
        .not("lng", "is", null)
        .limit(200);
      return (data ?? []) as AdPin[];
    },
  });

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const c: [number, number] = [p.coords.latitude, p.coords.longitude];
        setMe(c);
        setCenter(c);
        if (user) supabase.from("profiles").update({ lat: c[0], lng: c[1] }).eq("id", user.id);
      },
      undefined,
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  useEffect(() => {
    locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initial = useMemo<[number, number]>(() => me ?? BAGHDAD, [me]);

  return (
    <>
      <AppHeader
        back={
          <Link to="/" aria-label="رجوع" className="grid h-11 w-11 place-items-center rounded-full bg-surface text-foreground shadow-[0_4px_14px_-4px_oklch(0.6_0.15_250/0.25)] transition active:scale-90">
            <ArrowRight size={18} />
          </Link>
        }
        title="الخريطة"
        subtitle="مواطنون وشركات قريبة"
        right={
          <button onClick={locate} aria-label="موقعي" className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary active:scale-90">
            <Locate size={18} />
          </button>
        }
      />

      <div className="glass-card relative overflow-hidden rounded-3xl" style={{ height: "calc(100dvh - 210px)" }}>
        <MapContainer center={initial} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter center={center} />

          {me && (
            <Marker position={me} icon={ME_ICON}>
              <Popup>أنت هنا</Popup>
            </Marker>
          )}

          {(shipments.data ?? []).map((s) => {
            const m = MATERIALS[s.material];
            return (
              <Marker key={`s-${s.id}`} position={[s.lat, s.lng]} icon={CITIZEN_ICON}>
                <Popup>
                  <div className="text-right" dir="rtl">
                    <p className="font-extrabold">{m?.label ?? s.material} — {s.weight_kg} كغ</p>
                    {s.area && <p className="text-xs text-muted-foreground">{s.area}</p>}
                    <p className="mt-1 text-[11px] text-muted-foreground">حالة: {s.status}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {(ads.data ?? []).map((a) => (
            <Marker key={`a-${a.id}`} position={[a.lat, a.lng]} icon={COMPANY_ICON}>
              <Popup>
                <div className="text-right" dir="rtl">
                  <p className="font-extrabold">{a.title}</p>
                  {a.material && <p className="text-xs">{MATERIALS[a.material]?.label}</p>}
                  {a.price_per_kg != null && <p className="text-xs text-green-700">{a.price_per_kg} د.ع/كغ</p>}
                  {a.city && <p className="text-[11px] text-muted-foreground">{a.city}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-center gap-2">
          <Legend color="#0ea5e9" label="مواطن" />
          <Legend color="#16a34a" label="شركة" />
          <Legend color="#a855f7" label="أنت" />
        </div>
      </div>

      {!me && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
          <MapPin size={14} /> فعّل خدمة الموقع لعرض المواقع القريبة منك
        </div>
      )}
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="glass-strong inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
