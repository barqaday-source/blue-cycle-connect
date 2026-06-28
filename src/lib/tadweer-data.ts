import { Bottle, Box, Package2, Recycle, Shirt, Wine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MaterialKey = "plastic" | "carton" | "metal" | "glass" | "fabric";

export const MATERIALS: Record<
  MaterialKey,
  { label: string; Icon: LucideIcon; color: string }
> = {
  plastic: { label: "بلاستيك", Icon: Bottle, color: "oklch(0.7 0.15 200)" },
  carton: { label: "كارتون", Icon: Box, color: "oklch(0.65 0.13 60)" },
  metal: { label: "حديد وقواطي", Icon: Package2, color: "oklch(0.55 0.04 260)" },
  glass: { label: "زجاج", Icon: Wine, color: "oklch(0.72 0.12 175)" },
  fabric: { label: "قماش ونعول", Icon: Shirt, color: "oklch(0.6 0.15 320)" },
};

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
