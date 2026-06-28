import { Box, Droplets, Recycle, Shirt, Wine, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MaterialKey = "plastic" | "carton" | "metal" | "glass" | "fabric";

export const MATERIALS: Record<
  MaterialKey,
  { label: string; Icon: LucideIcon; color: string }
> = {
  plastic: { label: "بلاستيك", Icon: Droplets, color: "oklch(0.7 0.15 200)" },
  carton: { label: "كارتون", Icon: Box, color: "oklch(0.65 0.13 60)" },
  metal: { label: "حديد وقواطي", Icon: Wrench, color: "oklch(0.55 0.04 260)" },
  glass: { label: "زجاج", Icon: Wine, color: "oklch(0.72 0.12 175)" },
  fabric: { label: "قماش ونعول", Icon: Shirt, color: "oklch(0.6 0.15 320)" },
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
