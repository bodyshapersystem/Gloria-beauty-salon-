"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Service = {
  id: string;
  slug: string;
  category: string;
  name: string;
  duration_minutes: number;
  price_label: string;
};

type Staff = {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo_url: string | null;
};

type Slot = {
  slot_start: string;
  staff_id: string;
  staff_name: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  hair: "Hair",
  nails: "Nails",
  brows: "Brows",
  lashes: "Lashes",
  tanning: "Tanning",
  makeup: "Makeup",
};

function fmtDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function BookingWidget() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [eligibleStaff, setEligibleStaff] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [selectedStaffOption, setSelectedStaffOption] = useState<Staff | "any" | null>(null);

  const minDate = useMemo(() => toDateInputValue(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(minDate);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, slug, category, name, duration_minutes, price_label")
        .eq("active", true)
        .order("category")
        .order("name");
      if (!error && data) setServices(data as Service[]);
      setLoadingServices(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedService) return;
    setLoadingStaff(true);
    setEligibleStaff([]);
    setSelectedStaffOption(null);
    (async () => {
      const { data, error } = await supabase
        .from("staff_services")
        .select("staff:staff_id(id, slug, name, role, photo_url)")
        .eq("service_id", selectedService.id);
      if (!error && data) {
        const list = (data as any[]).map((r) => r.staff).filter(Boolean) as Staff[];
        setEligibleStaff(list);
      }
      setLoadingStaff(false);
    })();
  }, [selectedService]);

  useEffect(() => {
    if (!selectedService || !selectedStaffOption || !selectedDate) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    (async () => {
      const staffList: Staff[] = selectedStaffOption === "any" ? eligibleStaff : [selectedStaffOption];

      const results = await Promise.all(
        staffList.map(async (st) => {
          const { data, error } = await supabase.rpc("get_available_slots", {
            p_staff_id: st.id,
            p_service_id: selectedService.id,
            p_date: selectedDate,
          });
          if (error || !data) return [];
          return (data as { slot_start: string }[]).map((row) => ({
            slot_start: row.slot_start,
            staff_id: st.id,
            staff_name: st.name,
          }));
        })
      );

      const merged = results
        .flat()
        .sort((a, b) => new Date(a.slot_start).getTime() - new Date(b.slot_start).getTime());

      const deduped =
        selectedStaffOption === "any"
          ? Array.from(new Map(merged.map((s) => [s.slot_start, s])).values())
          : merged;

      setSlots(deduped);
      setLoadingSlots(false);
    })();
  }, [selectedService, selectedStaffOption, selectedDate, eligibleStaff]);

  async function handleConfirm() {
    if (!selectedService || !selectedSlot || !name || !phone) return;
    setSubmitting(true);
    setSubmitError(null);

    const startAt = new Date(selectedSlot.slot_start);
    const endAt = new Date(startAt.getTime() + selectedService.duration_minutes * 60000);

    const { error } = await supabase.from("appointments").insert({
      staff_id: selectedSlot.staff_id,
      service_id: selectedService.id,
      client_name: name,
      client_phone: phone,
      client_email: email || null,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      status: "confirmed",
    });

    setSubmitting(false);

    if (error) {
      setSubmitError("Ese horario ya no está disponible — por favor elige otro.");
      setSelectedSlot(null);
      setStep(3);
      return;
    }

    setConfirmed(true);
  }

  const servicesByCategory = useMemo(() => {
    const map = new Map<string, Service[]>();
    for (const s of services) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return map;
  }, [services]);

  if (confirmed && selectedService && selectedSlot) {
    return (
      <div className="max-w-[560px] mx-auto text-center py-10">
        <div className="w-14 h-14 rounded-full bg-espresso text-ivory flex items-center justify-center mx-auto mb-6">
          <Check size={26} />
        </div>
        <h2 className="font-serif font-medium text-[clamp(28px,4vw,40px)] leading-tight">
          ¡Tu cita está confirmada!
        </h2>
        <p className="mt-4 text-[14.5px] text-mocha leading-relaxed">
          {selectedService.name} con {selectedSlot.staff_name}
          <br />
          {new Date(selectedSlot.slot_start).toLocaleDateString("es-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          ·{" "}
          {new Date(selectedSlot.slot_start).toLocaleTimeString("es-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
          <br />
          Duración: {fmtDuration(selectedService.duration_minutes)}
        </p>
        <p className="mt-6 text-[13px] text-taupe">
          Te esperamos en Calle 8, Miami. Si necesitas reprogramar o cancelar, escríbenos por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="flex flex-wrap items-center gap-2 mb-10 text-[11px] tracking-[0.14em] text-taupe">
        {["SERVICIO", "PROFESIONAL", "FECHA Y HORA", "CONFIRMAR"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={
                step === i + 1
                  ? "text-espresso font-semibold"
                  : step > i + 1
                  ? "text-taupe"
                  : "text-taupe/50"
              }
            >
              {i + 1}. {label}
            </span>
            {i < 3 && <span className="text-taupe/30">—</span>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          {loadingServices ? (
            <div className="flex justify-center py-16 text-taupe">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            Array.from(servicesByCategory.entries()).map(([cat, list]) => (
              <div key={cat} className="mb-9">
                <h3 className="text-[11px] tracking-[0.16em] text-taupe font-semibold mb-3.5">
                  {CATEGORY_LABELS[cat] ?? cat.toUpperCase()}
                </h3>
                <div className="flex flex-col divide-y divide-taupe/20 border-t border-b border-taupe/20">
                  {list.map((sv) => (
                    <button
                      key={sv.id}
                      onClick={() => {
                        setSelectedService(sv);
                        setStep(2);
                      }}
                      className="flex items-center justify-between gap-4 py-4 text-left hover:bg-blush/40 transition-colors px-2 -mx-2"
                    >
                      <div>
                        <div className="text-[14.5px]">{sv.name}</div>
                        <div className="text-[12px] text-taupe mt-0.5">
                          {fmtDuration(sv.duration_minutes)}
                        </div>
                      </div>
                      <div className="font-serif italic text-[16px] text-mocha shrink-0">
                        {sv.price_label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {step === 2 && selectedService && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-[12.5px] text-taupe mb-6 hover:text-espresso"
          >
            <ChevronLeft size={15} /> Cambiar servicio
          </button>
          <p className="text-[13.5px] text-mocha mb-6">
            {selectedService.name} · {fmtDuration(selectedService.duration_minutes)} ·{" "}
            {selectedService.price_label}
          </p>

          {loadingStaff ? (
            <div className="flex justify-center py-12 text-taupe">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setSelectedStaffOption("any");
                  setStep(3);
                }}
                className="flex flex-col items-center gap-2.5 p-5 border border-taupe/30 hover:border-espresso transition-colors text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center text-taupe text-[11px] tracking-[0.08em]">
                  ANY
                </div>
                <div className="text-[13.5px] font-medium">Primera disponible</div>
              </button>
              {eligibleStaff.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedStaffOption(st);
                    setStep(3);
                  }}
                  className="flex flex-col items-center gap-2.5 p-5 border border-taupe/30 hover:border-espresso transition-colors text-center"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-blush">
                    {st.photo_url && (
                      <Image src={st.photo_url} alt={st.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="text-[13.5px] font-medium">{st.name}</div>
                  <div className="text-[11px] text-taupe leading-snug">{st.role}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 3 && selectedService && selectedStaffOption && (
        <div>
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-1.5 text-[12.5px] text-taupe mb-6 hover:text-espresso"
          >
            <ChevronLeft size={15} /> Cambiar profesional
          </button>

          {submitError && (
            <p className="mb-5 text-[13px] text-red-700 bg-red-50 border border-red-200 px-4 py-3">
              {submitError}
            </p>
          )}

          <label className="block mb-6">
            <span className="block text-[11px] tracking-[0.12em] text-taupe font-semibold mb-2">
              FECHA
            </span>
            <input
              type="date"
              min={minDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full max-w-[240px] border border-taupe/40 px-4 py-3 text-[14px] bg-ivory"
            />
          </label>

          {loadingSlots ? (
            <div className="flex justify-center py-10 text-taupe">
              <Loader2 className="animate-spin" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-[13.5px] text-taupe py-6">
              No hay horarios disponibles ese día — prueba otra fecha.
            </p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
              {slots.map((slot) => (
                <button
                  key={`${slot.staff_id}-${slot.slot_start}`}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep(4);
                  }}
                  className="border border-taupe/30 hover:border-espresso hover:bg-blush/40 transition-colors py-2.5 text-[13px]"
                >
                  {new Date(slot.slot_start).toLocaleTimeString("es-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 4 && selectedService && selectedSlot && (
        <div>
          <button
            onClick={() => setStep(3)}
            className="flex items-center gap-1.5 text-[12.5px] text-taupe mb-6 hover:text-espresso"
          >
            <ChevronLeft size={15} /> Cambiar horario
          </button>

          <div className="bg-blush/40 px-6 py-5 mb-8">
            <div className="text-[14.5px] font-medium">{selectedService.name}</div>
            <div className="text-[13px] text-mocha mt-1">
              con {selectedSlot.staff_name} ·{" "}
              {new Date(selectedSlot.slot_start).toLocaleDateString("es-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              ·{" "}
              {new Date(selectedSlot.slot_start).toLocaleTimeString("es-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
            <div className="text-[13px] text-taupe mt-1">
              {fmtDuration(selectedService.duration_minutes)} · {selectedService.price_label}
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-[420px]">
            <label className="block">
              <span className="block text-[11px] tracking-[0.12em] text-taupe font-semibold mb-2">
                NOMBRE
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-taupe/40 px-4 py-3 text-[14px] bg-ivory"
                placeholder="Tu nombre completo"
              />
            </label>
            <label className="block">
              <span className="block text-[11px] tracking-[0.12em] text-taupe font-semibold mb-2">
                TELÉFONO
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-taupe/40 px-4 py-3 text-[14px] bg-ivory"
                placeholder="(305) 000-0000"
              />
            </label>
            <label className="block">
              <span className="block text-[11px] tracking-[0.12em] text-taupe font-semibold mb-2">
                EMAIL (opcional)
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-taupe/40 px-4 py-3 text-[14px] bg-ivory"
                placeholder="tu@email.com"
              />
            </label>

            <button
              onClick={handleConfirm}
              disabled={!name || !phone || submitting}
              className="mt-3 inline-flex items-center justify-center gap-3 rounded-full bg-taupe text-ivory px-8 py-[15px] text-[12.5px] font-semibold tracking-[0.1em] hover:bg-mocha transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : "CONFIRMAR CITA"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
