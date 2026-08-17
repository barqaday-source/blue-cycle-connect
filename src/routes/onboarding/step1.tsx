import React from "react";
import OnboardingLayout from "@/components/OnboardingLayout";
import CurvedStatsCard from "@/components/CurvedStatsCard";

export default function Step1({ onNext, onBack }: { onNext?: () => void; onBack?: () => void }) {
  return (
    <OnboardingLayout onBack={onBack} onNext={onNext}>
      <section className="relative z-0 flex h-full flex-col items-stretch gap-6">
        <div className="z-10 mt-2">
          <h2 className="text-sm font-medium text-[#0D2A66]">Monstera Leaf</h2>
          <h1 className="mt-2 text-3xl font-black leading-tight" style={{ color: "#092244" }}>
            أعد التدوير. أنقذ الكوكب.
          </h1>
          <p className="mt-2 max-w-[360px] text-[13px] text-[#0D2A6688]">
            منصتك لبيع وإعادة تدوير النفايات الذكية.
          </p>
        </div>

        {/* Large graphic placeholder */}
        <div className="relative mt-4 flex-1">
          <div className="h-[320px] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-green-50 to-white shadow-inner">
            {/* Image placeholder centered */}
            <div className="mx-auto mt-6 h-[220px] w-[220px] rounded-[26px] border border-transparent bg-[url('/assets/recycle-placeholder.jpg')] bg-cover bg-center" />
          </div>

          {/* dramatic curved green bottom -- SVG */}
          <svg className="absolute bottom-0 left-0 right-0 z-0 h-[180px]" viewBox="0 0 1440 180" preserveAspectRatio="none">
            <path d="M0,120 C240,160 480,0 720,40 C960,80 1200,60 1440,100 L1440,180 L0,180 Z" fill="#1E6A2E" opacity="0.95" />
          </svg>

          {/* floating stats card */}
          <CurvedStatsCard />
        </div>
      </section>
    </OnboardingLayout>
  );
}
