import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { UnderlineLink } from "@/components/ui/Button";
import { team, teamGroupPhoto } from "@/lib/data/team";

export function Team() {
  const featured = team.find((m) => m.featured)!;
  const rest = team.filter((m) => !m.featured);

  return (
    <section
      id="equipo"
      className="px-6 md:px-8 pb-24 md:pb-[130px] max-w-[1220px] mx-auto"
    >
      <div className="flex flex-wrap justify-between items-end gap-12">
        <div>
          <Eyebrow>EQUIPO</Eyebrow>
          <h2 className="font-serif font-medium text-[clamp(42px,5.6vw,72px)] leading-[0.98]">
            Conoce al
            <br />
            <em className="italic font-normal text-mocha">equipo</em>
          </h2>
          <p className="mt-5 text-[15px] text-mocha max-w-[340px]">
            Talento. Pasión. Belleza real.
          </p>
        </div>

        <div className="w-[180px] md:w-[250px] shrink-0">
          <div className="relative aspect-[4/5]">
            <Image
              src={teamGroupPhoto}
              alt="Equipo Gloria Beauty Salon"
              fill
              className="object-cover object-top"
            />
          </div>
          <p className="mt-3 font-serif italic text-sm text-taupe">
            Gloria, Nudis, Diana &amp; Caro
          </p>
        </div>
      </div>

      <div className="mt-16 md:mt-24 grid md:grid-cols-[1.15fr_1fr] gap-14 md:gap-[72px]">
        {/* Featured — founder */}
        <div className="group">
          <div className="relative aspect-[4/5] overflow-hidden bg-blush">
            <Image
              src={featured.photo}
              alt={featured.name}
              fill
              className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="mt-6 flex justify-between items-end gap-5">
            <div>
              <div className="text-[11px] tracking-[0.16em] text-taupe font-semibold mb-2">
                {featured.role.toUpperCase()}
              </div>
              <h3 className="font-serif italic font-medium text-[clamp(30px,3.2vw,40px)]">
                {featured.name}
              </h3>
              <div className="mt-2.5 text-[13px] text-mocha leading-relaxed max-w-[280px]">
                {featured.services}
              </div>
            </div>
            <UnderlineLink href={`/equipo/${featured.slug}`}>
              Reservar con {featured.name}
            </UnderlineLink>
          </div>
        </div>

        {/* Supporting list */}
        <div className="flex flex-col">
          {rest.map((member, i) => (
            <div
              key={member.slug}
              className={`flex gap-5 items-center py-6 border-t border-taupe/35 last:border-b ${
                i % 2 === 1 ? "md:pl-9" : ""
              }`}
            >
              <div className="relative w-20 h-20 md:w-[98px] md:h-[98px] shrink-0 overflow-hidden bg-blush">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] tracking-[0.16em] text-taupe font-semibold mb-2">
                  {member.role.toUpperCase()}
                </div>
                <h4 className="font-serif italic font-medium text-[22px]">
                  {member.name}
                </h4>
                <div className="text-[12.5px] text-mocha mt-1 leading-relaxed">
                  {member.services}
                </div>
                <UnderlineLink href={`/equipo/${member.slug}`} className="mt-2">
                  Reservar con {member.name}
                </UnderlineLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
