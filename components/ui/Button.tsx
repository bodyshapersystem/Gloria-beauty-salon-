import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost" | "pill" | "pill-dark";
  withArrow?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.08em] transition-colors duration-300";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  solid:
    "px-8 py-4 border border-espresso bg-espresso text-ivory hover:bg-transparent hover:text-espresso",
  ghost:
    "px-8 py-4 border border-espresso bg-transparent text-espresso hover:bg-espresso hover:text-ivory",
  pill: "px-8 py-[17px] rounded-full bg-taupe text-ivory hover:bg-mocha",
  "pill-dark":
    "px-8 py-4 rounded-full border border-champagne text-ivory hover:bg-champagne hover:text-espresso",
};

export function Button({
  href,
  children,
  variant = "solid",
  withArrow = false,
  className = "",
}: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {withArrow && <ArrowRight size={15} />}
    </Link>
  );
}

/** Small underline-reveal text link, used for "Reservar con X" / "Ver disponibilidad". */
export function UnderlineLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-block text-[12px] font-semibold tracking-[0.06em] text-espresso pb-1 bg-gradient-to-r from-champagne to-champagne bg-no-repeat bg-left-bottom bg-[length:0%_1px] hover:bg-[length:100%_1px] transition-[background-size] duration-500 ${className}`}
    >
      {children}
    </Link>
  );
}
