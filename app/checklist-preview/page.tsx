"use client";

import { useState } from "react";

const sampleNeedsReview = [
  { id: "1", client_name: "Katia Nails", time: "2:00 PM", service: "Gel Manicure" },
  { id: "2", client_name: "Sra. Blanca", time: "3:30 PM", service: "Pedicure Regular" },
  { id: "3", client_name: "Beatrix Castro", time: "4:15 PM", service: "Root Color" },
];

export default function ChecklistPreviewPage() {
  const [items, setItems] = useState(sampleNeedsReview);
  const [busyId, setBusyId] = useState<string | null>(null);

  function mark(id: string) {
    setBusyId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
      setBusyId(null);
    }, 300);
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED] px-5 py-10">
      <div className="mx-auto max-w-[640px]">
        <p className="text-[9px] uppercase tracking-[.22em] text-mocha">Vista previa — no es real</p>
        <h1 className="mt-2 font-serif text-[34px] leading-none">Así se ve el checklist de fin de día</h1>
        <p className="mt-3 text-[12px] text-taupe leading-relaxed">
          Esto es lo que Diana, Gloria, etc. verían arriba de "Mi Agenda" cuando quedan citas de hoy sin
          confirmar. Los datos de abajo son de ejemplo — prueba los botones, se van quitando de la lista.
        </p>

        {items.length > 0 ? (
          <section className="mt-8 rounded-[24px] border border-[#B4443F]/30 bg-[#FBEFED] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[.18em] text-[#B4443F]">Confirma tu día</p>
                <h2 className="mt-1 font-serif text-[26px]">
                  {items.length} cita{items.length > 1 ? "s" : ""} por confirmar
                </h2>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {items.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-[16px] bg-white/70 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[18px] leading-none truncate">{a.client_name}</p>
                    <p className="mt-1 text-[9px] text-taupe truncate">
                      {a.time} · {a.service}
                    </p>
                  </div>
                  <button
                    disabled={busyId === a.id}
                    onClick={() => mark(a.id)}
                    className="rounded-full bg-[#4A352B] px-3.5 py-2 text-[8px] uppercase tracking-[.1em] text-ivory disabled:opacity-50"
                  >
                    Asistió
                  </button>
                  <button
                    disabled={busyId === a.id}
                    onClick={() => mark(a.id)}
                    className="rounded-full border border-[#BDAA9D] px-3.5 py-2 text-[8px] uppercase tracking-[.1em] text-mocha disabled:opacity-50"
                  >
                    No vino
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[9px] leading-relaxed text-[#8A5A50]">
              Si no las confirmas, el sistema las marca como completadas automáticamente al día siguiente.
            </p>
          </section>
        ) : (
          <section className="mt-8 rounded-[24px] border border-champagne/30 bg-white/60 p-8 text-center">
            <p className="font-serif text-[26px]">Todo confirmado ✓</p>
            <p className="mt-2 text-[11px] text-taupe">
              Así se ve cuando ya no queda nada pendiente — la sección desaparece sola.
            </p>
            <button
              onClick={() => setItems(sampleNeedsReview)}
              className="mt-5 rounded-full bg-[#4A352B] px-5 py-2.5 text-[9px] uppercase tracking-[.12em] text-ivory"
            >
              Reiniciar ejemplo
            </button>
          </section>
        )}

        <div className="mt-8 rounded-[20px] border border-champagne/30 bg-white/50 p-5">
          <p className="text-[9px] uppercase tracking-[.16em] text-mocha">También verán</p>
          <ul className="mt-3 space-y-2 text-[11px] text-taupe leading-relaxed">
            <li>• Un correo a las 7pm si les quedó algo sin confirmar</li>
            <li>• Una campanita con punto rojo en la parte de arriba del Hub</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
