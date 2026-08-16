import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

interface Props {
  items: NavItem[];
  activePath: string;
  centerAction?: { to: string; icon: ReactNode; label: string };
}

export function BottomNav({ items, activePath, centerAction }: Props) {
  const left = items.slice(0, 2);
  const right = items.slice(2, 4);
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center pb-4 pt-2">
      <div className="glass-strong flex h-[70px] w-[min(440px,calc(100%-1.5rem))] items-center justify-between rounded-[28px] px-3 shadow-xl">
        <div className="flex flex-1 items-center justify-around">
          {left.map((it) => (
            <NavLink key={it.to} item={it} active={activePath === it.to} />
          ))}
        </div>
        {centerAction && (
          <Link
            to={centerAction.to}
            aria-label={centerAction.label}
            className="btn-primary-gradient press tap-ring -mt-8 grid h-16 w-16 shrink-0 place-items-center rounded-[24px] ring-4 ring-background transition hover:shadow-lg active:scale-95"
          >
            <span className="text-white text-xl">{centerAction.icon}</span>
          </Link>
        )}
        <div className="flex flex-1 items-center justify-around">
          {right.map((it) => (
            <NavLink key={it.to} item={it} active={activePath === it.to} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.to}
      className={`press tap-ring relative flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition-all ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-full transition-all duration-300 ${
          active ? "glass scale-110 text-primary" : "scale-100"
        }`}
      >
        {item.icon}
      </span>
      <span className="text-[10px] font-bold leading-tight">{item.label}</span>
      {active && (
        <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />
      )}
    </Link>
  );
}
