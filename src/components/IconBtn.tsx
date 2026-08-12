import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "glass" | "ghost" | "solid";
  size?: "sm" | "md" | "lg";
}

/** Unified glass icon button with smooth press animation used across the app. */
export function IconBtn({ children, className, variant = "glass", size = "md", ...rest }: Props) {
  const sz = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-12 w-12" : "h-11 w-11";
  return (
    <button
      {...rest}
      className={cn(
        "press tap-ring grid place-items-center rounded-2xl",
        sz,
        variant === "glass" && "glass text-foreground hover:text-primary",
        variant === "ghost" && "text-muted-foreground hover:bg-primary-soft hover:text-primary transition-colors",
        variant === "solid" && "btn-primary-gradient text-primary-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
