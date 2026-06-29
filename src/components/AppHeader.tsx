import type { ReactNode } from "react";
import { SideMenu } from "@/components/SideMenu";

interface Props {
  title?: ReactNode;
  subtitle?: ReactNode;
  avatar?: ReactNode;
  right?: ReactNode;
  back?: ReactNode;
  hideMenu?: boolean;
}

export function AppHeader({ title, subtitle, avatar, right, back, hideMenu }: Props) {
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-2 bg-gradient-to-b from-[oklch(0.97_0.025_235)] via-[oklch(0.98_0.018_232)] to-transparent px-4 pb-4 pt-5 backdrop-blur-md">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <div className="shrink-0">
          {back ?? avatar ?? (!hideMenu ? <SideMenu /> : null)}
        </div>
        <div className="min-w-0 text-center">
          {subtitle && <p className="text-[11px] font-medium text-muted-foreground">{subtitle}</p>}
          {title && <h1 className="truncate text-base font-extrabold text-foreground">{title}</h1>}
        </div>
        <div className="shrink-0">{right}</div>
      </div>
    </header>
  );
}
