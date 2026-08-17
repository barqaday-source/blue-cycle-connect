import React from "react";
import OnboardingLayout from "@/components/OnboardingLayout";

export default function Step3({ onNext, onBack }: { onNext?: () => void; onBack?: () => void }) {
  return (
    <OnboardingLayout onBack={onBack} onNext={onNext} showNext={false}>
      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#092244]">حول مبادرة تدوير</h1>
          <p className="mt-3 text-sm text-[#0D2A6688]">
            مبادرة تدوير تهدف لبناء نظام متكامل لإعادة تدوير المخلفات، ربط المواطنين بمُجمعي المواد والشركات، وتحويل المخلفات إلى قيمة مستدامة.
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-bold text-[#0D2A66]">تفاصيل المبادرة</h2>
          <p className="mt-2 text-sm text-[#475569]">
            نص توضيحي مؤقت يصف كيفية عمل النظام، الفوائد البيئية، وكيف يمكن للمستخدمين المشاركة بسهولة. هذا المحتوى قابل للاستبدال بنص نهائي.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <div className="flex-1 rounded-2xl bg-gradient-to-b from-slate-50 to-white p-4 text-center shadow">
            <div className="h-20 w-full rounded-xl bg-[url('/assets/material1.jpg')] bg-cover bg-center" />
          </div>
          <div className="flex-1 rounded-2xl bg-gradient-to-b from-slate-50 to-white p-4 text-center shadow">
            <div className="h-20 w-full rounded-xl bg-[url('/assets/material2.jpg')] bg-cover bg-center" />
          </div>
          <div className="flex-1 rounded-2xl bg-gradient-to-b from-slate-50 to-white p-4 text-center shadow">
            <div className="h-20 w-full rounded-xl bg-[url('/assets/material3.jpg')] bg-cover bg-center" />
          </div>
        </div>
      </section>
    </OnboardingLayout>
  );
}
