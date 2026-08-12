import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Zap, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/collector/opportunities")({
  head: () => ({ meta: [{ title: "فرص الجمع" }] }),
  component: CollectorOpportunities,
});

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";
const INK = "#0D2A66";

function CollectorOpportunities() {
  const opportunities = [
    {
      id: 1,
      citizen: "محمد أحمد",
      material: "بلاستيك وألمنيوم",
      quantity: "25 كغ",
      distance: "1.2 كم",
      time: "منذ 10 دقائق",
      points: "450",
      status: "جديد",
      phone: "+964770123456",
    },
    {
      id: 2,
      citizen: "فاطمة علي",
      material: "ورق وكرتون",
      quantity: "15 كغ",
      distance: "2.5 كم",
      time: "منذ 45 دقيقة",
      points: "280",
      status: "متاح",
      phone: "+964771234567",
    },
    {
      id: 3,
      citizen: "علي حسن",
      material: "معادن مختلطة",
      quantity: "30 كغ",
      distance: "0.8 كم",
      time: "منذ ساعة",
      points: "550",
      status: "جديد",
      phone: "+964772345678",
    },
    {
      id: 4,
      citizen: "نور محمود",
      material: "زجاج وبلاستيك",
      quantity: "12 كغ",
      distance: "3.1 كم",
      time: "منذ ساعتين",
      points: "220",
      status: "متاح",
      phone: "+964773456789",
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "جديد" ? "#10B981" : "#F59E0B";
  };

  return (
    <main dir="rtl" className="pt-6 pb-6">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-[28px] font-black" style={{ color: INK }}>
          فرص الجمع
        </h1>
        <p className="mt-1 text-[12px]" style={{ color: `${INK}80` }}>
          {opportunities.length} فرصة متاحة الآن
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["جميع", "جديد", "قريب", "عالي الربح"].map((filter) => (
            <button
              key={filter}
              className="whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold transition active:scale-95"
              style={
                filter === "جميع"
                  ? { background: BLUE, color: "#fff" }
                  : { background: SOFT, color: BLUE, border: `1px solid ${BLUE}29` }
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Opportunities List */}
      <section className="space-y-3">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="rounded-3xl p-4 transition active:scale-[0.98] hover:shadow-md"
            style={{
              background: SOFT,
              border: `2px solid ${BLUE}14`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold" style={{ color: INK }}>
                    {opp.citizen}
                  </h3>
                  <span
                    className="rounded-full px-2 py-1 text-[10px] font-bold text-white"
                    style={{ background: getStatusColor(opp.status) }}
                  >
                    {opp.status}
                  </span>
                </div>
                <p className="mt-1 text-[12px]" style={{ color: `${INK}80` }}>
                  {opp.material}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[16px] font-black" style={{ color: BLUE }}>
                  +{opp.points}
                </p>
                <p className="text-[10px]" style={{ color: `${INK}80` }}>
                  نقطة
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mb-3 grid grid-cols-3 gap-2">
              <DetailItem
                icon={<Zap size={14} />}
                label="الكمية"
                value={opp.quantity}
              />
              <DetailItem
                icon={<MapPin size={14} />}
                label="المسافة"
                value={opp.distance}
              />
              <DetailItem
                icon={<Clock size={14} />}
                label="الوقت"
                value={opp.time}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-2.5 text-[12px] font-bold transition active:scale-95"
                style={{ background: BLUE, color: "#fff" }}
              >
                <MessageCircle size={14} />
                اتصل
              </button>
              <button
                className="flex-1 rounded-2xl py-2.5 text-[12px] font-bold transition active:scale-95"
                style={{ background: "#fff", border: `2px solid ${BLUE}`, color: BLUE }}
              >
                اعرض على الخريطة
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Empty State Message */}
      {opportunities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="mb-4 rounded-full p-4"
            style={{ background: SOFT }}
          >
            <Zap size={32} style={{ color: BLUE }} />
          </div>
          <p className="text-[14px] font-bold" style={{ color: INK }}>
            لا توجد فرص حالياً
          </p>
          <p className="mt-1 text-[12px]" style={{ color: `${INK}80` }}>
            تابع هذه الصفحة للحصول على أحدث الفرص
          </p>
        </div>
      )}
    </main>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl p-2 text-center" style={{ background: "rgba(30,99,255,0.05)" }}>
      <div className="flex justify-center mb-1" style={{ color: BLUE }}>
        {icon}
      </div>
      <p className="text-[10px]" style={{ color: `#0D2A66B3` }}>
        {label}
      </p>
      <p className="mt-0.5 text-[12px] font-bold" style={{ color: "#0D2A66" }}>
        {value}
      </p>
    </div>
  );
}
