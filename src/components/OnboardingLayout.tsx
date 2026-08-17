import React from "react";
import { ArrowLeft, Menu } from "lucide-react";

export default function OnboardingLayout({
  children,
  onBack,
  onNext,
  showNext = true,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  showNext?: boolean;
}) {
  return (
    <div
      dir="rtl"
      className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col bg-white px-5 pb-8 pt-6 font-[Cairo,system-ui]"
    >
      <header className="flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="عودة"
          className="h-9 w-9 rounded-full bg-green-50 grid place-items-center text-green-700 shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <button aria-label="القائمة" className="h-9 w-9 rounded-full bg-transparent grid place-items-center text-green-700">
          <Menu size={20} />
        </button>
      </header>

      <main className="relative z-10 mt-4 flex-1">{children}</main>

      <footer className="mt-6 z-10">
        <div className="flex w-full gap-3">
          <button
            onClick={onBack}
            className="flex-1 rounded-3xl border border-green-100 bg-white py-3 text-[15px] font-semibold text-green-800"
          >
            رجوع
          </button>
          {showNext && (
            <button
              onClick={onNext}
              className="flex-1 rounded-3xl bg-[#1E6A2E] py-3 text-[15px] font-extrabold text-white shadow-[0_12px_30px_-14px_rgba(30,106,46,0.45)]"
            >
              التالي
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
