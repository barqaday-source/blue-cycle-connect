import React from "react";
import { Trash2, Tree } from "lucide-react";

export default function CurvedStatsCard() {
  return (
    <div className="absolute -translate-y-10 left-6 right-6 mx-auto flex max-w-[360px] items-center justify-between gap-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-50">
          <Trash2 className="text-[#1E6A2E]" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0D2A66]">طُن من النفايات</p>
          <p className="mt-0.5 text-xs text-[#0D2A6688]">1234</p>
        </div>
      </div>

      <div className="h-10 w-px bg-slate-200/60" />

      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-50">
          <Tree className="text-[#1E6A2E]" size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0D2A66]">أشجار تم حفظها</p>
          <p className="mt-0.5 text-xs text-[#0D2A6688]">78</p>
        </div>
      </div>
    </div>
  );
}
