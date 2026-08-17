import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Star, Phone, MapPin, Users } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/company/profile")({
  head: () => ({ meta: [{ title: "حساب الشركة — تدوير بلو" }] }),
  component: CompanyProfile,
});

const SUPPORT_WA = "https://wa.me/9647700000000?text=" + encodeURIComponent("مرحباً، حساب شركة على تدوير بلو");

function CompanyProfile() {
  const { profile, user, signOut } = useAuth();
  const nav = useNavigate();

  // sample collectors fallback
  const collectors = profile?.collectors ?? [
    { id: 1, name: "جمعية الخير", distance: "1.2 كم", phone: "+9647700000001" },
    { id: 2, name: "مجمّع بغداد", distance: "3.4 كم", phone: "+9647700000002" },
    { id: 3, name: "نقطة الحارة", distance: "5.6 كم", phone: "+9647700000003" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6">
      <AppHeader title="الملف التجاري" />

      <div className="mx-auto max-w-[920px] space-y-6">
        {/* Hero */}
        <section className="rounded-2xl bg-white p-4" style={{ padding: 24 }}>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-[#064e3b]">{profile?.company_name ?? "شركة تدوير"}</h2>
              <p className="mt-1 text-sm text-slate-600">{profile?.short_description ?? "شركة متخصصة في جمع وتدوير المخلفات"}</p>

              <div className="mt-3 flex items-center gap-3">
                <div className="inline-flex items-center gap-1 rounded-full bg-[#064e3b] px-3 py-1 text-sm font-semibold text-white">4.5 <Star size={14} /></div>
                <div className="text-sm text-slate-500">تقييم العملاء</div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button className="rounded-full bg-transparent p-2 text-[#064e3b]">تحرير</button>
              <button
                onClick={async () => {
                  await signOut();
                  nav({ to: "/auth" });
                }}
                className="rounded-full bg-transparent p-2 text-[#ef4444]"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </section>

        {/* Information list */}
        <section className="rounded-2xl bg-white p-4" style={{ padding: 24 }}>
          <h3 className="text-sm font-semibold text-slate-700">معلومات</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#064e3b]" />
              <div>
                <div className="font-medium text-slate-800">العنوان</div>
                <div className="mt-1">{profile?.address ?? "لا يوجد عنوان محدد"}</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Phone size={18} className="text-[#064e3b]" />
              <div>
                <div className="font-medium text-slate-800">جهة الاتصال</div>
                <div className="mt-1">{profile?.phone ?? user?.email}</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Users size={18} className="text-[#064e3b]" />
              <div>
                <div className="font-medium text-slate-800">سعة التدوير</div>
                <div className="mt-1">{profile?.capacity ?? "غير محددة"}</div>
              </div>
            </li>
          </ul>
        </section>

        {/* Collectors list */}
        <section className="rounded-2xl bg-white p-4" style={{ padding: 24 }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">شركاء التجميع</h3>
            <Link to="/company/collectors" className="text-sm text-[#064e3b]">عرض الكل</Link>
          </div>

          <div className="mt-3 space-y-3 max-h-[240px] overflow-auto pr-2">
            {collectors.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100" />
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-800">{c.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{c.distance}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`tel:${c.phone}`} className="inline-flex items-center justify-center rounded-md bg-[#064e3b] px-3 py-2 text-sm font-medium text-white">اتصال</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
