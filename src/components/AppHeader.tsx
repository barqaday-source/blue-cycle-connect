import type { ReactNode } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  title?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  onBack?: () => void;
}

/**
 * Minimal global header following the new design system:
 * - No borders, no shadows
 * - Left: back/menu
 * - Center: page title
 * - Right: contextual icon
 */
export function AppHeader({ title, left, right, onBack }: Props) {
  return (
    <header className="w-full px-4 py-4">
      <div className="mx-auto flex w-full max-w-[920px] items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Left area: prefer an explicit left node, else a back button */}
          {left ?? (
            <button
              aria-label="رجوع"
              onClick={onBack}
              className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-[#064e3b]"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>

        <div className="min-w-0 text-center">
          {title ? (
            <h1 className="truncate text-lg font-semibold text-[#064e3b]">{title}</h1>
          ) : (
            <div />
          )}
        </div>

        <div className="flex items-center gap-2">
          {right ?? (
            <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-full bg-transparent text-[#064e3b]">
              <Menu size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
