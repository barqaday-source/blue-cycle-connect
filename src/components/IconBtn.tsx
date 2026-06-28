import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "soft" | "ghost" | "solid";
}

/** Unified icon button with press animation used across the whole app. */
export function IconBtn({ children, className, variant = "soft", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full transition-all duration-150 active:scale-90 active:rotate-[-4deg]",
        variant === "soft" &&
          "bg-surface text-foreground shadow-[0_4px_14px_-4px_oklch(0.6_0.15_250/0.25)] hover:bg-primary-soft",
        variant === "ghost" && "text-muted-foreground hover:bg-primary-soft hover:text-primary",
        variant === "solid" && "btn-primary-gradient text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}
