import { Battery, Box, Cpu, Droplets, Recycle, Shirt, Wine, Wrench, Coins, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MaterialKey =
  | "plastic"
  | "carton"
  | "metal"
  | "glass"
  | "fabric"
  | "aluminum"
  | "copper"
  | "battery"
  | "ewaste";

export const MATERIALS: Record<
  MaterialKey,
  { label: string; Icon: LucideIcon; color: string; pricePerKg: number }
> = {
  aluminum: { label: "ألمنيوم", Icon: Coins, color: "oklch(0.82 0.14 90)", pricePerKg: 1600 },
  copper: { label: "نحاس", Icon: Zap, color: "oklch(0.65 0.18 45)", pricePerKg: 8500 },
  metal: { label: "حديد", Icon: Wrench, color: "oklch(0.55 0.04 260)", pricePerKg: 350 },
  plastic: { label: "بلاستيك", Icon: Droplets, color: "oklch(0.7 0.15 200)", pricePerKg: 400 },
  carton: { label: "كارتون", Icon: Box, color: "oklch(0.65 0.13 60)", pricePerKg: 220 },
  glass: { label: "زجاج", Icon: Wine, color: "oklch(0.72 0.12 175)", pricePerKg: 120 },
  ewaste: { label: "أجهزة تالفة", Icon: Cpu, color: "oklch(0.55 0.15 15)", pricePerKg: 1200 },
  battery: { label: "بطاريات", Icon: Battery, color: "oklch(0.5 0.12 300)", pricePerKg: 950 },
  fabric: { label: "قماش", Icon: Shirt, color: "oklch(0.6 0.15 320)", pricePerKg: 180 },
};

export const MATERIAL_KEYS = Object.keys(MATERIALS) as MaterialKey[];
export const RecycleIcon = Recycle;

export type ShipmentStatus = "pending" | "accepted" | "completed";

export interface ShipmentRow {
  id: string;
  citizen_id: string;
  material: MaterialKey;
  weight_kg: number;
  area: string | null;
  city: string | null;
  photo_url: string | null;
  status: ShipmentStatus;
  company_id: string | null;
  created_at: string;
}

export function statusMeta(s: ShipmentStatus) {
  if (s === "pending") return { label: "قيد الانتظار", color: "text-warning", dot: "bg-warning" };
  if (s === "accepted") return { label: "تم القبول", color: "text-info", dot: "bg-info" };
  return { label: "مكتملة", color: "text-success", dot: "bg-success" };
}

export function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "قبل لحظات";
  if (d < 3600) return `قبل ${Math.floor(d / 60)} دقيقة`;
  if (d < 86400) return `قبل ${Math.floor(d / 3600)} ساعة`;
  return `قبل ${Math.floor(d / 86400)} يوم`;
}

export function formatIQD(n: number) {
  return new Intl.NumberFormat("ar-IQ").format(n) + " د.ع";
}
