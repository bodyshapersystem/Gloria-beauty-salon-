export function BeautyDnaExperience({
  title = "Gloria Beauty DNA",
}: {
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[#D9CBC1] bg-[#211715] shadow-[0_18px_45px_rgba(52,38,31,.12)]">
      <iframe
        src="/beauty-dna-package/index.html"
        title={title}
        className="h-[820px] w-full border-0 md:h-[920px]"
        allow="fullscreen"
      />
    </div>
  );
}
