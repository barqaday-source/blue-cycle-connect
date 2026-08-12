import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { MapPin, TrendingUp, Users, Award } from "lucide-react";

export const Route = createFileRoute("/collector/")({
  head: () => ({ meta: [{ title: "لوحة التحكم - المجمع" }] }),
  component: CollectorHome,
});

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";
const INK = "#0D2A66";

function CollectorHome() {
  const { profile } = useAuth();

  const stats = [
    { icon: <Award size={24} />, label: "النقاط", value: "2,450", color: "#10B981" },
    { icon: <TrendingUp size={24} />, label: "المجموع", value: "45 كغ", color: "#F59E0B" },
    { icon: <Users size={24} />, label: "العملاء", value: "12", color: "#8B5CF6" },
    { icon: <MapPin size={24} />, label: "المسافة", value: "2.5 كم", color: "#EF4444" },
  ];

  return (
    <main dir="rtl" className="pt-8 pb-6">
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-black" style={{ color: INK }}>
              أهلاً، {profile?.full_name?.split(" ")[0]}
            </h1>
            <p className="mt-1 text-[12px]" style={{ color: `${INK}80` }}>
              لنبدأ جمع المواد اليوم! 🌱
            </p>
          </div>
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center"
            style={{ background: SOFT, border: `2px solid ${BLUE}` }}
          >
            <span className="text-[18px]">👋</span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-3xl p-4 flex flex-col items-center text-center"
              style={{
                background: SOFT,
                border: `2px solid ${BLUE}14`,
              }}
            >
              <div
                className="mb-2 rounded-full p-2.5 text-white"
                style={{ background: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="text-[11px]" style={{ color: `${INK}80` }}>
                {stat.label}
              </p>
              <p className="mt-1 text-[16px] font-bold" style={{ color: INK }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="mb-3 text-[16px] font-bold" style={{ color: INK }}>
          الإجراءات السريعة
        </h2>
        <div className="space-y-3">
          <ActionButton
            title="البحث عن مواد قريبة"
            desc="اعثر على طلبات المواطنين بالقرب منك"
            color="#10B981"
          />
          <ActionButton
            title="إضافة مادة جديدة"
            desc="سجل المواد التي جمعتها اليوم"
            color="#F59E0B"
          />
          <ActionButton
            title="الاتصال بالشركات"
            desc="أرسل شحنتك للتدوير"
            color="#8B5CF6"
          />
        </div>
      </section>

      {/* Recent Activities */}
      <section>
        <h2 className="mb-3 text-[16px] font-bold" style={{ color: INK }}>
          النشاطات الأخيرة
        </h2>
        <div className="space-y-3">
          {[
            { type: "collection", text: "جمعت 15 كغ من البلاستيك", time: "منذ ساعة" },
            { type: "contact", text: "اتصلت بشركة الدوران", time: "منذ 3 ساعات" },
            { type: "earn", text: "حصلت على 350 نقطة", time: "أمس" },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl p-3"
              style={{ background: SOFT, border: `1px solid ${BLUE}14` }}
            >
              <div className="flex-1">
                <p className="text-[13px] font-bold" style={{ color: INK }}>
                  {activity.text}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: `${INK}80` }}>
                  {activity.time}
                </p>
              </div>
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: BLUE }}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function ActionButton({
  title,
  desc,
  color,
}: {
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <button
      className="w-full rounded-3xl p-4 text-right transition active:scale-[0.98] hover:shadow-md flex items-center gap-3"
      style={{
        background: SOFT,
        border: `2px solid ${BLUE}29`,
        color: INK,
      }}
    >
      <div className="rounded-full p-2.5 text-white" style={{ background: color }}>
        <Award size={16} />
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-bold">{title}</p>
        <p className="mt-0.5 text-[11px]" style={{ color: `${INK}80` }}>
          {desc}
        </p>
      </div>
    </button>
  );
}
