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
    <header className="sticky top-0 z-30 -mx-4 mb-2 px-4 pb-4 pt-5">
      <div className="glass grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-full px-2 py-2 float-in">
        <div className="shrink-0">
          {back ?? avatar ?? (!hideMenu ? <SideMenu /> : null)}
        </div>
        <div className="min-w-0 text-center">
          {subtitle && <p className="text-[10px] font-medium text-muted-foreground">{subtitle}</p>}
          {title && <h1 className="truncate text-[15px] font-extrabold text-foreground">{title}</h1>}
        </div>
        <div className="shrink-0">{right}</div>
      </div>
    </header>
  );
}
