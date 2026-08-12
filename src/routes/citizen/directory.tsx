import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MapPin, MessageCircle, Globe, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/citizen/directory")({
  head: () => ({ meta: [{ title: "دليل الشركات والمجمعين" }] }),
  component: DirectoryPage,
});

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";
const INK = "#0D2A66";

type TabType = "companies" | "collectors";

function DirectoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("companies");
  const [searchQuery, setSearchQuery] = useState("");

  const companies = [
    {
      id: 1,
      name: "شركة الدوران الأخضر",
      phone: "+964770123456",
      whatsapp: "+964770123456",
      website: "www.alddoran.iq",
      address: "بغداد - منطقة الزيونة",
      materials: "بلاستيك، ورق، معادن",
      rating: 4.8,
      reviews: 245,
      hours: "08:00 - 18:00",
      pickup: true,
    },
    {
      id: 2,
      name: "مصنع إعادة التدوير الحديث",
      phone: "+964771234567",
      whatsapp: "+964771234567",
      website: "www.modern-recycling.iq",
      address: "بغداد - منطقة الجادرية",
      materials: "زجاج، بلاستيك، ألمنيوم",
      rating: 4.6,
      reviews: 189,
      hours: "07:00 - 20:00",
      pickup: true,
    },
    {
      id: 3,
      name: "مركز التدوير المتطور",
      phone: "+964772345678",
      whatsapp: "+964772345678",
      website: "www.advanced-recycling.iq",
      address: "بغداد - منطقة الكرادة",
      materials: "جميع المواد",
      rating: 4.9,
      reviews: 312,
      hours: "09:00 - 19:00",
      pickup: false,
    },
  ];

  const collectors = [
    {
      id: 1,
      name: "أحمد محمد",
      phone: "+964770555555",
      whatsapp: "+964770555555",
      area: "منطقة الزيونة",
      distance: "0.5 كم",
      materials: "بلاستيك، ورق، معادن",
      rating: 4.7,
      available: true,
    },
    {
      id: 2,
      name: "فاطمة علي",
      phone: "+964771666666",
      whatsapp: "+964771666666",
      area: "منطقة الجادرية",
      distance: "1.2 كم",
      materials: "زجاج، بلاستيك",
      rating: 4.5,
      available: true,
    },
    {
      id: 3,
      name: "علي حسن",
      phone: "+964772777777",
      whatsapp: "+964772777777",
      area: "منطقة الكرادة",
      distance: "0.8 كم",
      materials: "معادن، بلاستيك، ورق",
      rating: 4.9,
      available: true,
    },
    {
      id: 4,
      name: "نور محمود",
      phone: "+964773888888",
      whatsapp: "+964773888888",
      area: "منطقة الفرات",
      distance: "2.1 كم",
      materials: "جميع المواد",
      rating: 4.4,
      available: false,
    },
  ];

  const filteredCompanies = companies.filter((c) =>
    c.name.includes(searchQuery) ||
    c.address.includes(searchQuery) ||
    c.materials.includes(searchQuery)
  );

  const filteredCollectors = collectors.filter((c) =>
    c.name.includes(searchQuery) ||
    c.area.includes(searchQuery) ||
    c.materials.includes(searchQuery)
  );

  return (
    <main dir="rtl" className="pt-6 pb-6">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-[28px] font-black" style={{ color: INK }}>
          الشركات والمجمعين
        </h1>
        <p className="mt-1 text-[12px]" style={{ color: `${INK}80` }}>
          تواصل مباشر لتسليم موادك
        </p>
      </section>

      {/* Search Bar */}
      <section className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-3xl px-4" style={{ background: SOFT, border: `1px solid ${BLUE}14` }}>
            <input
              type="text"
              placeholder="ابحث عن الاسم أو المنطقة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[13px] font-bold outline-none py-3"
              style={{ color: INK }}
            />
            <Search size={18} style={{ color: `${BLUE}B3` }} />
          </div>
          <button
            className="rounded-3xl p-3 transition active:scale-95"
            style={{ background: SOFT, border: `1px solid ${BLUE}14`, color: BLUE }}
          >
            <Filter size={18} />
          </button>
        </div>
      </section>

      {/* Tabs */}
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-2 rounded-3xl p-1.5" style={{ background: SOFT }}>
          {(["companies", "collectors"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="rounded-2xl py-2.5 text-[13px] font-bold transition active:scale-95"
              style={
                activeTab === tab
                  ? { background: BLUE, color: "#fff", boxShadow: `0 8px 16px rgba(30,99,255,0.3)` }
                  : { color: `${BLUE}B3` }
              }
            >
              {tab === "companies" ? "🏢 الشركات" : "👤 المجمعين"}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="space-y-3">
        {activeTab === "companies" ? (
          filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))
          ) : (
            <EmptyState />
          )
        ) : filteredCollectors.length > 0 ? (
          filteredCollectors.map((collector) => (
            <CollectorCard key={collector.id} collector={collector} />
          ))
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}

function CompanyCard({ company }: { company: any }) {
  return (
    <div
      className="rounded-3xl p-4 transition active:scale-[0.98]"
      style={{ background: SOFT, border: `2px solid ${BLUE}14` }}
    >
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-[14px] font-bold" style={{ color: "#0D2A66" }}>
              {company.name}
            </h3>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[11px] font-bold" style={{ color: "#F59E0B" }}>
                ⭐ {company.rating}
              </span>
              <span className="text-[11px]" style={{ color: "#0D2A6680" }}>
                ({company.reviews} تقييم)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mb-3 space-y-2">
        <DetailRow icon={<MapPin size={14} />} label="العنوان" value={company.address} />
        <DetailRow icon={<Phone size={14} />} label="المواد المقبولة" value={company.materials} />
        <DetailRow icon={<Globe size={14} />} label="الموقع الإلكتروني" value={company.website} />
        <div className="flex items-center gap-2 text-[11px]" style={{ color: `#0D2A6680` }}>
          <span>⏰ {company.hours}</span>
          {company.pickup && <span className="rounded-full px-2 py-1" style={{ background: "#10B98133", color: "#10B981" }}>📍 استلام من البيت</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          className="flex items-center justify-center gap-2 rounded-2xl py-2.5 text-[12px] font-bold transition active:scale-95"
          style={{ background: BLUE, color: "#fff" }}
        >
          <Phone size={14} />
          اتصل
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-2xl py-2.5 text-[12px] font-bold transition active:scale-95"
          style={{ background: "#25D366", color: "#fff" }}
        >
          <MessageCircle size={14} />
          واتس
        </button>
      </div>
    </div>
  );
}

function CollectorCard({ collector }: { collector: any }) {
  return (
    <div
      className="rounded-3xl p-4 transition active:scale-[0.98]"
      style={{ background: SOFT, border: `2px solid ${BLUE}14` }}
    >
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-bold" style={{ color: "#0D2A66" }}>
                {collector.name}
              </h3>
              {collector.available ? (
                <span className="text-[9px] rounded-full px-2 py-0.5" style={{ background: "#10B98133", color: "#10B981" }}>
                  متاح
                </span>
              ) : (
                <span className="text-[9px] rounded-full px-2 py-0.5" style={{ background: "#EF444433", color: "#EF4444" }}>
                  مشغول
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[11px] font-bold" style={{ color: "#F59E0B" }}>
                ⭐ {collector.rating}
              </span>
              <span className="text-[11px]" style={{ color: `#0D2A6680` }}>
                • {collector.distance}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mb-3 space-y-2">
        <DetailRow icon={<MapPin size={14} />} label="المنطقة" value={collector.area} />
        <DetailRow icon={<Phone size={14} />} label="المواد" value={collector.materials} />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          className="flex items-center justify-center gap-2 rounded-2xl py-2.5 text-[12px] font-bold transition active:scale-95"
          style={{ background: BLUE, color: "#fff" }}
        >
          <Phone size={14} />
          اتصل
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-2xl py-2.5 text-[12px] font-bold transition active:scale-95"
          style={{ background: "#25D366", color: "#fff" }}
        >
          <MessageCircle size={14} />
          واتس
        </button>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span style={{ color: BLUE, marginTop: "2px" }}>{icon}</span>
      <div className="flex-1">
        <p className="text-[10px]" style={{ color: `#0D2A6680` }}>
          {label}
        </p>
        <p className="text-[12px] font-bold" style={{ color: "#0D2A66" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-4xl">🔍</div>
      <p className="text-[14px] font-bold" style={{ color: INK }}>
        لم يتم العثور على نتائج
      </p>
      <p className="mt-1 text-[12px]" style={{ color: `${INK}80` }}>
        حاول البحث عن اسم أو منطقة أخرى
      </p>
    </div>
  );
}
