import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Phone, Mail, MapPin, LogOut, Edit2, Award, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/collector/profile")({
  head: () => ({ meta: [{ title: "حسابي - المجمع" }] }),
  component: CollectorProfile,
});

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";
const INK = "#0D2A66";

function CollectorProfile() {
  const { profile, signOut } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await signOut();
    nav({ to: "/auth" });
  };

  const stats = [
    { label: "إجمالي النقاط", value: "2,450", color: "#10B981" },
    { label: "عدد المواد", value: "45", color: "#F59E0B" },
    { label: "العملاء", value: "12", color: "#8B5CF6" },
    { label: "المعدل", value: "⭐ 4.8", color: "#FBBF24" },
  ];

  return (
    <main dir="rtl" className="pt-6 pb-6">
      {/* Profile Header */}
      <section className="mb-8 rounded-3xl p-6 text-center" style={{ background: SOFT, border: `2px solid ${BLUE}14` }}>
        <div className="mb-4 flex justify-center">
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center text-4xl font-bold"
            style={{ background: BLUE, color: "#fff" }}
          >
            {profile?.full_name?.charAt(0) || "👤"}
          </div>
        </div>
        <h1 className="text-[22px] font-black" style={{ color: INK }}>
          {profile?.full_name || "المستخدم"}
        </h1>
        <p className="mt-1 text-[12px]" style={{ color: `${INK}80` }}>
          مجمع مواد معتمد
        </p>
      </section>

      {/* Stats Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-3xl p-3 text-center"
              style={{ background: SOFT, border: `2px solid ${BLUE}14` }}
            >
              <p className="text-[11px]" style={{ color: `${INK}80` }}>
                {stat.label}
              </p>
              <p className="mt-1 text-[16px] font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section className="mb-8">
        <h2 className="mb-3 text-[16px] font-bold" style={{ color: INK }}>
          معلومات التواصل
        </h2>
        <div className="space-y-2">
          <InfoItem
            icon={<Mail size={18} />}
            label="البريد الإلكتروني"
            value={profile?.email || ""}
          />
          <InfoItem
            icon={<Phone size={18} />}
            label="رقم الهاتف"
            value={profile?.phone || "لم يتم تحديده"}
          />
          <InfoItem
            icon={<MapPin size={18} />}
            label="المدينة"
            value={profile?.city || "لم يتم تحديده"}
          />
        </div>
      </section>

      {/* Edit Profile Button */}
      <section className="mb-8">
        <button
          className="w-full flex items-center justify-center gap-2 rounded-3xl py-3 text-[14px] font-bold transition active:scale-95"
          style={{
            background: BLUE,
            color: "#fff",
            boxShadow: "0 10px 25px rgba(30,99,255,0.3)",
          }}
        >
          <Edit2 size={18} />
          تعديل الحساب
        </button>
      </section>

      {/* Account Settings */}
      <section className="mb-8">
        <h2 className="mb-3 text-[16px] font-bold" style={{ color: INK }}>
          إعدادات الحساب
        </h2>
        <div className="space-y-2">
          <SettingItem label="التنبيهات" description="تفعيل إخطارات الفرص الجديدة" />
          <SettingItem label="الخصوصية" description="التحكم في مشاركة البيانات" />
          <SettingItem label="الدعم والمساعدة" description="التواصل مع فريق الدعم" />
        </div>
      </section>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 rounded-3xl py-3 text-[14px] font-bold transition active:scale-95"
        style={{
          background: "#FEE2E2",
          color: "#DC2626",
          border: `2px solid #FCA5A5`,
        }}
      >
        <LogOut size={18} />
        تسجيل الخروج
      </button>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-3"
      style={{ background: SOFT, border: `1px solid ${BLUE}14` }}
    >
      <span style={{ color: BLUE }}>{icon}</span>
      <div className="flex-1">
        <p className="text-[11px]" style={{ color: `${INK}80` }}>
          {label}
        </p>
        <p className="mt-0.5 text-[13px] font-bold" style={{ color: INK }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function SettingItem({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <button
      className="w-full flex items-center justify-between rounded-2xl p-3 transition active:scale-95"
      style={{ background: SOFT, border: `1px solid ${BLUE}14` }}
    >
      <div className="text-right flex-1">
        <p className="text-[13px] font-bold" style={{ color: INK }}>
          {label}
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: `${INK}80` }}>
          {description}
        </p>
      </div>
      <div
        className="h-5 w-5 rounded-full flex items-center justify-center"
        style={{ background: BLUE, color: "#fff" }}
      >
        →
      </div>
    </button>
  );
}
