import { Button } from "@/components/ui/Button";

const values = [
  "Atención personalizada",
  "Productos de alta calidad",
  "Resultados que te hacen sentir bien",
  "Un espacio íntimo y acogedor",
];

export function Experience() {
  return (
    <section className="bg-espresso text-ivory px-6 md:px-8 py-24 md:py-[110px] mb-20 md:mb-[120px]">
      <div className="max-w-[1220px] mx-auto">
        <h2 className="font-serif font-medium text-[clamp(34px,4.2vw,54px)] leading-[1.05] max-w-[640px]">
          MÁS QUE UN SALÓN,
          <br />
          <em className="italic text-champagne font-normal">
            una experiencia.
          </em>
        </h2>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-9">
          {values.map((v, i) => (
            <div key={v}>
              <span className="block font-serif italic text-champagne text-[34px] mb-3.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-blush">{v}</p>
            </div>
          ))}
        </div>

        <Button
          href="/#book"
          variant="pill-dark"
          className="mt-14 !border-champagne"
        >
          AGENDA TU CITA
        </Button>
      </div>
    </section>
  );
}
