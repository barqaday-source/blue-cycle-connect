export type MaterialKey = "plastic" | "carton" | "metal" | "glass" | "fabric";

export const MATERIALS: Record<MaterialKey, { label: string; icon: string; color: string }> = {
  plastic: { label: "بلاستيك", icon: "🍼", color: "oklch(0.7 0.15 200)" },
  carton: { label: "كارتون", icon: "📦", color: "oklch(0.65 0.13 60)" },
  metal: { label: "حديد وقواطي", icon: "🥫", color: "oklch(0.55 0.04 260)" },
  glass: { label: "زجاج", icon: "🫙", color: "oklch(0.72 0.12 175)" },
  fabric: { label: "قماش ونعول", icon: "👟", color: "oklch(0.6 0.15 320)" },
};

export type ShipmentStatus = "pending" | "accepted" | "completed";

export interface Shipment {
  id: string;
  material: MaterialKey;
  weightKg: number;
  area: string;
  city: string;
  distanceKm: number;
  status: ShipmentStatus;
  imageHue: number;
  citizenName: string;
  postedAt: string;
  company?: string;
}

export const SAMPLE_SHIPMENTS: Shipment[] = [
  { id: "s1", material: "plastic", weightKg: 12, area: "الكرادة - شارع 62", city: "بغداد", distanceKm: 1.4, status: "pending", imageHue: 200, citizenName: "أحمد علي", postedAt: "قبل ٥ دقائق" },
  { id: "s2", material: "carton", weightKg: 28, area: "المنصور - حي الجامعة", city: "بغداد", distanceKm: 3.2, status: "accepted", imageHue: 60, citizenName: "ليلى حسن", postedAt: "قبل ساعة", company: "معمل النور للتدوير" },
  { id: "s3", material: "metal", weightKg: 45, area: "العامرية", city: "بغداد", distanceKm: 5.7, status: "pending", imageHue: 260, citizenName: "محمد كريم", postedAt: "قبل ١٥ دقيقة" },
  { id: "s4", material: "glass", weightKg: 9, area: "الجادرية", city: "بغداد", distanceKm: 2.1, status: "completed", imageHue: 175, citizenName: "زينب فاضل", postedAt: "أمس", company: "شركة الأمل الخضراء" },
  { id: "s5", material: "carton", weightKg: 18, area: "الزعفرانية", city: "بغداد", distanceKm: 7.8, status: "pending", imageHue: 50, citizenName: "حسن جواد", postedAt: "قبل ٣٠ دقيقة" },
  { id: "s6", material: "plastic", weightKg: 22, area: "الدورة", city: "بغداد", distanceKm: 9.1, status: "pending", imageHue: 210, citizenName: "نور سعد", postedAt: "قبل ساعتين" },
];
