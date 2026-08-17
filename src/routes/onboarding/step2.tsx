import React from "react";
import OnboardingLayout from "@/components/OnboardingLayout";
import { User, Truck, BuildingFactory } from "lucide-react";

function RolePill({ icon, title, subtitle, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-full bg-[#1E6A2E] px-4 py-4 text-white shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-green-700/20">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-base font-extrabold">{title}</p>
          <p className="mt-0.5 text-xs font-medium text-white/80">{subtitle}</p>
        </div>
      </div>
      <div className="text-green-200">›</div>
    </button>
  );
}

export default function Step2({ onNext, onBack }: { onNext?: () => void; onBack?: () => void }) {
  return (
    <OnboardingLayout onBack={onBack} onNext={onNext}>
      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#092244]">اختر دورك في المنظومة</h1>
          <p className="mt-2 text-sm text-[#0D2A6688]">لنقم بتخصيص تجربتك.</p>
        </div>

        <div className="flex flex-col gap-4">
          <RolePill
            icon={<User size={20} />}
            title="مواطن"
            subtitle="بيع موادك المنزلية القابلة للتدوير."
            onClick={() => console.log("chosen citizen")}
          />
          <RolePill
            icon={<Truck size={20} />}
            title="مُجمع مواد"
            subtitle="اجمع المواد من المواطنين واكسب النقاط."
            onClick={() => console.log("chosen collector")}
          />
          <RolePill
            icon={<BuildingFactory size={20} />}
            title="شركة تدوير"
            subtitle="ادخل إلى سوق المواد الخام والمخلفات."
            onClick={() => console.log("chosen company")}
          />
        </div>
      </section>
    </OnboardingLayout>
  );
}
