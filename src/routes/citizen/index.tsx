import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Trash2, TrendingUp, Users, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/citizen/")({
  head: () => ({ meta: [{ title: "الرئيسية - المواطن" }] }),
  component: CitizenHome,
});

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";
const INK = "#0D2A66";

function CitizenHome() {
  const { profile } = useAuth();

  const stats = [
    { icon: "♻️", label: "موادي", value: "8", color: "#10B981", desc: "انتظار الاستلام" },
    { icon: "💰", label: "النقاط", value: "1,250", color: "#F59E0B", desc: "نقطة متراكمة" },
    { icon: "🏆", label: "المستوى", value: "ذهبي", color: "#FBBF24", desc: "عضو نشط" },
    { icon: "📊", label: "المجموع", value: "45 كغ", color: "#8B5CF6", desc: "تم تدويره" },
  ];

  const recentActivities = [
    { emoji: "📸", text: "أضفت صورة مادة جديدة", time: "منذ ساعة", points: "+150" },
    { emoji: "✅", text: "تم استلام موادك", time: "منذ 3 ساعات", points: "+300" },
    { emoji: "⭐", text: "حصلت على تقييم 5 نجوم", time: "أمس", points: "+50" },
  ];

  const quickActions = [
    {
      title: "أضف مادة جديدة",
      desc: "صور المواد وابدأ الكسب",
      icon: "📷",
      color: "#10B981",
      to: "/citizen/new",
    },
    {
      title: "شحناتك",
      desc: "تتبع حالة موادك",
      icon: "📦",
      color: "#F59E0B",
      to: "/citizen/shipments",
    },
    {
      title: "الشركات والمجمعين",
      desc: "تواصل مباشر للتسليم",
      icon: "🏢",
      color: "#8B5CF6",
      to: "/citizen/directory",
    },
    {
      title: "استبدل النقاط",
      desc: "حول نقاطك لمكافآت",
      icon: "🎁",
      color: "#EF4444",
      to: "/citizen/rewards",
    },
  ];

  return (
    <main dir="rtl" className="pt-6 pb-6">
      {/* Greeting Header */}
      <section className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-black" style={{ color: INK }}>
              مرحباً، {profile?.full_name?.split(" ")[0]}! 👋
            </h1>
            <p className="mt-1 text-[12px]" style={{ color: `${INK}80` }}>
              ماذا تريد تدويره اليوم؟
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid - 2x2 */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-3xl p-4 text-center transition hover:shadow-md"
              style={{
                background: SOFT,
                border: `2px solid ${BLUE}14`,
              }}
            >
              <div className="mb-2 text-3xl">{stat.icon}</div>
              <p className="text-[11px]" style={{ color: `${INK}80` }}>
                {stat.label}
              </p>
              <p className="mt-1 text-[18px] font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="mt-0.5 text-[10px]" style={{ color: `${INK}80` }}>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions Banner */}
      <section className="mb-8">
        <h2 className="mb-3 text-[16px] font-bold" style={{ color: INK }}>
          الإجراءات السريعة
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.to}
              className="rounded-3xl p-4 text-center transition active:scale-[0.98] hover:shadow-md block"
              style={{
                background: SOFT,
                border: `2px solid ${BLUE}14`,
                textDecoration: "none",
              }}
            >
              <div className="mb-2 text-3xl">{action.icon}</div>
              <p className="text-[12px] font-bold" style={{ color: INK }}>
                {action.title}
              </p>
              <p className="mt-1 text-[10px]" style={{ color: `${INK}80` }}>
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activities */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold" style={{ color: INK }}>
            النشاطات الأخيرة
          </h2>
          <button
            className="text-[12px] font-bold flex items-center gap-1 transition hover:opacity-70"
            style={{ color: BLUE }}
          >
            عرض الكل
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {recentActivities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl p-3"
              style={{
                background: SOFT,
                border: `1px solid ${BLUE}14`,
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{activity.emoji}</span>
                <div className="flex-1">
                  <p className="text-[13px] font-bold" style={{ color: INK }}>
                    {activity.text}
                  </p>
                  <p className="text-[10px]" style={{ color: `${INK}80` }}>
                    {activity.time}
                  </p>
                </div>
              </div>
              <span
                className="text-[12px] font-bold px-2 py-1 rounded-full"
                style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}
              >
                {activity.points}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section>
        <h2 className="mb-3 text-[16px] font-bold" style={{ color: INK }}>
          💡 نصائح للزيادة
        </h2>
        <div className="rounded-3xl p-4" style={{ background: SOFT, border: `2px solid ${BLUE}14` }}>
          <ul className="space-y-2 text-[12px]" style={{ color: INK }}>
            <li>✓ صور مواد نظيفة وواضحة للحصول على نقاط إضافية</li>
            <li>✓ اجمع 3+ مواد مختلفة لتحصل على بونص 50 نقطة</li>
            <li>✓ اجمع 50 كغ من المواد لتصعد مستواك</li>
            <li>✓ شارك مع أصدقائك واحصل على مكافآت</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
