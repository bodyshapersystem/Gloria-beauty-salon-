import Image from "next/image";

/**
 * The approved combined lockup (G monogram + GLORIA + BEAUTY SALON).
 * Source: approved branding board, champagne-on-transparent PNG.
 * A monogram-only crop isn't available yet — the G's tail interlocks
 * with the "L" in GLORIA with no clean gap to crop at. Ask for a
 * dedicated monogram file if a favicon/small-icon mark is needed.
 */
export function Logo({ className = "h-14 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/images/gloria/logo/gloria-logo.png"
      alt="Gloria Beauty Salon"
      width={954}
      height={860}
      className={className}
      priority
    />
  );
}
