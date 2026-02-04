import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]";
  const variants = {
    default: "bg-black text-white hover:opacity-90",
    outline: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
  }[variant];

  return <button className={cn(base, variants, className)} {...props} />;
}
