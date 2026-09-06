export function Eyebrow({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-6">
      <div className="w-10 h-px bg-champagne" />
      <span className="text-xs tracking-[0.22em] text-taupe font-semibold">
        {children}
      </span>
    </div>
  );
}
