"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export type PanelAppointment = {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  notes_internal?: string | null;
  start_at: string;
  end_at: string;
  status: string;
  source: string;
  price_cents: number | null;
  deposit_cents?: number | null;
  cancellation_fee_cents: number | null;
  cancellation_fee_reason: string | null;
  reschedule_count: number;
  service_id: string;
  staff_id: string;
  service: { name: string; price_label?: string; category?: string } | null;
  staff: { name: string } | null;
};

type Service = { id: string; name: string; category?: string };

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  in_progress: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No se presentó",
};
const sourceLabels: Record<string, string> = {
  public_booking: "Reserva pública",
  gloria_access: "Gloria Access",
  gloria_hub: "Gloria Hub",
  staff_created: "Creada por staff",
  manual_admin: "Manual (admin)",
};

export function AppointmentDetailPanel({
  appointment,
  role,
  onClose,
  onChanged,
}: {
  appointment: PanelAppointment;
  role: string | null;
  onClose: () => void;
  onChanged: (message?: string) => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "reschedule">("view");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  async function resendConfirmation() {
    setActionMessage(null);
    if (!appointment.client_email) {
      setActionMessage("Esta clienta no tiene email guardado.");
      return;
    }
    try {
      const response = await fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: appointment.client_name,
          clientEmail: appointment.client_email,
          serviceId: appointment.service_id,
          staffId: appointment.staff_id,
          startAt: appointment.start_at,
        }),
      });
      const result = await response.json();
      setActionMessage(result?.ok ? "Confirmación reenviada." : "No se pudo reenviar la confirmación.");
    } catch {
      setActionMessage("No se pudo reenviar la confirmación.");
    }
  }

  async function changeStatus(next: string) {
    setActionMessage(null);
    const reason = next === "cancelled" ? window.prompt("Motivo de la cancelación (opcional)") || null : null;
    if (["cancelled", "no_show"].includes(next) && !window.confirm(`¿Marcar esta cita como ${(statusLabels[next] || next).toLowerCase()}?`)) return;
    const { error } = await supabase.rpc("hub_update_appointment_status", { p_appointment_id: appointment.id, p_status: next, p_reason: reason });
    if (error) { setActionMessage(error.message); return; }
    onChanged();
  }

  async function deleteAppointment() {
    if (!window.confirm("¿Eliminar esta cita para siempre? Esto no se puede deshacer — no queda ningún registro.")) return;
    setActionMessage(null);
    const { error } = await supabase.rpc("hub_delete_appointment", { p_appointment_id: appointment.id });
    if (error) { setActionMessage(error.message); return; }
    onChanged();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] bg-espresso/35 backdrop-blur-[2px] flex justify-end" onClick={onClose}>
      <aside className="h-full w-full max-w-[540px] bg-ivory p-5 md:p-7 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.22em] text-mocha">Cita</p>
            <h2 className="mt-2 font-serif text-[38px] leading-none">{appointment.client_name}</h2>
            <p className="mt-2 text-[11px] text-taupe">{appointment.service?.name || "Cita"} · {appointment.staff?.name || "Equipo"}</p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35 bg-white/50 text-taupe"><X size={18} /></button>
        </div>

        <div className="mt-6 rounded-[22px] bg-espresso p-5 text-ivory">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.16em] text-champagne">{formatDate(appointment.start_at)}</p>
              <p className="mt-2 font-serif text-[30px] leading-none">{formatTime(appointment.start_at)} – {formatTime(appointment.end_at)}</p>
            </div>
            <Status value={appointment.status} />
          </div>
          <p className="mt-3 text-[10px] text-ivory/65">
            {minutesBetween(appointment.start_at, appointment.end_at)} min · {sourceLabels[appointment.source] || appointment.source}
            {appointment.reschedule_count > 0 ? ` · Reprogramada ${appointment.reschedule_count}×` : ""}
          </p>
        </div>

        {!!appointment.cancellation_fee_cents && (
          <div className="mt-4 rounded-[16px] bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-[11.5px] text-red-800">
              {appointment.cancellation_fee_reason === "reschedule_limit_reached"
                ? `Se canceló sola al intentar reprogramar por segunda vez. Cargo pendiente: ${money(appointment.cancellation_fee_cents)}.`
                : `Cancelación tardía (menos de 24h) — cargo pendiente: ${money(appointment.cancellation_fee_cents)}.`}
            </p>
          </div>
        )}

        {actionMessage && <p className="mt-4 rounded-[15px] bg-red-50 px-4 py-3 text-[11px] text-red-700">{actionMessage}</p>}

        {mode === "view" && (
          <div className="mt-6 space-y-5">
            <Detail title="Clienta">
              <Line label="Teléfono" value={appointment.client_phone} />
              <Line label="Email" value={appointment.client_email || "—"} />
              {appointment.notes_internal && <Line label="Notas" value={appointment.notes_internal} />}
            </Detail>
            <Detail title="Reserva">
              <Line label="Servicio" value={appointment.service?.name || "—"} />
              <Line label="Profesional" value={appointment.staff?.name || "—"} />
              {appointment.price_cents != null && <Line label="Precio registrado" value={money(appointment.price_cents)} />}
              <Line label="Depósito" value={appointment.deposit_cents != null ? `Pagado — ${money(appointment.deposit_cents)}` : "No pagó depósito"} />
            </Detail>
            <Detail title="¿Qué quieres hacer?">
              <div className="grid grid-cols-2 gap-2">
                <Action soft onClick={() => setMode("edit")}><span className="inline-flex items-center gap-1.5"><Pencil size={12} />Editar</span></Action>
                {["pending", "confirmed"].includes(appointment.status) && <Action soft onClick={() => setMode("reschedule")}>Reprogramar</Action>}
                {appointment.status === "pending" && <Action onClick={() => changeStatus("confirmed")}>Confirmar</Action>}
                {appointment.status === "confirmed" && <Action onClick={() => changeStatus("in_progress")}>Iniciar visita</Action>}
                {["confirmed", "in_progress"].includes(appointment.status) && (
                  <Link href={`/hub/appointments/${appointment.id}/complete`} className="rounded-[14px] bg-espresso px-4 py-3 text-center text-[9px] uppercase tracking-[0.11em] text-ivory">Completar + Memoria</Link>
                )}
                <Action soft onClick={resendConfirmation}>Reenviar confirmación</Action>
                {["pending", "confirmed"].includes(appointment.status) && <Action soft onClick={() => changeStatus("cancelled")}>Cancelar</Action>}
                {["pending", "confirmed"].includes(appointment.status) && <Action soft onClick={() => changeStatus("no_show")}>No se presentó</Action>}
                {(role === "owner" || role === "admin") && (
                  <button onClick={deleteAppointment} className="rounded-[14px] border border-red-300 bg-red-50 px-4 py-3 text-center text-[9px] uppercase tracking-[0.11em] text-red-700">Eliminar cita</button>
                )}
              </div>
            </Detail>
          </div>
        )}

        {mode === "edit" && (
          <EditAppointmentForm
            appt={appointment}
            onCancel={() => setMode("view")}
            onSaved={() => { setMode("view"); onChanged("Cita actualizada."); }}
          />
        )}

        {mode === "reschedule" && (
          <RescheduleForm
            appt={appointment}
            onCancel={() => setMode("view")}
            onDone={(outcome) => {
              setMode("view");
              onChanged(
                outcome === "cancelled_reschedule_limit"
                  ? "Ya se había usado la única reprogramación permitida — esta cita se canceló y aplica el cargo de la política."
                  : "Cita reprogramada."
              );
              onClose();
            }}
          />
        )}
      </aside>
    </div>
  );
}

function EditAppointmentForm({ appt, onCancel, onSaved }: { appt: PanelAppointment; onCancel: () => void; onSaved: () => void }) {
  const [name, setName] = useState(appt.client_name);
  const [phone, setPhone] = useState(appt.client_phone);
  const [email, setEmail] = useState(appt.client_email || "");
  const [notes, setNotes] = useState(appt.notes_internal || "");
  const [price, setPrice] = useState(appt.price_cents != null ? String(appt.price_cents / 100) : "");
  const [depositPaid, setDepositPaid] = useState(appt.deposit_cents != null);
  const [deposit, setDeposit] = useState(appt.deposit_cents != null ? String(appt.deposit_cents / 100) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    setError(null);
    const priceCents = price.trim() === "" ? null : Math.round(Number(price) * 100);
    const depositCents = depositPaid ? (deposit.trim() === "" ? null : Math.round(Number(deposit) * 100)) : null;
    const { error: e } = await supabase.rpc("hub_update_appointment_details", {
      p_appointment_id: appt.id,
      p_client_name: name.trim(),
      p_client_phone: phone.trim(),
      p_client_email: email.trim() || null,
      p_notes_internal: notes.trim() || null,
      p_price_cents: priceCents,
      p_deposit_cents: depositCents,
    });
    setSaving(false);
    if (e) { setError(e.message); return; }
    onSaved();
  }

  return (
    <div className="mt-6 space-y-4">
      <Detail title="Editar datos de la cita">
        <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Nombre</span><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]" /></label>
        <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Teléfono</span><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]" /></label>
        <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]" /></label>
        <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Notas internas</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]" /></label>
      </Detail>
      <Detail title="Precio y depósito">
        <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Precio total ($)</span><input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]" /></label>
        <label className="flex items-center gap-2.5 text-[12px]"><input type="checkbox" checked={depositPaid} onChange={(e) => setDepositPaid(e.target.checked)} className="h-4 w-4" /> ¿Pagó depósito?</label>
        {depositPaid && <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Monto del depósito ($)</span><input type="number" min={0} step="0.01" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]" /></label>}
        <p className="text-[10px] text-taupe leading-relaxed">Si cancela con menos de 24h de aviso, se pierde este depósito. Si no pagó depósito, se cobra el % de la política sobre el precio total.</p>
      </Detail>
      {error && <p className="text-[11px] text-red-700">{error}</p>}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={onCancel} className="rounded-[14px] border border-champagne/35 bg-white/50 px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-mocha">Cancelar edición</button>
        <button disabled={saving || !name.trim() || !phone.trim()} onClick={save} className="rounded-[14px] bg-espresso px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-ivory disabled:opacity-50">{saving ? "Guardando..." : "Guardar cambios"}</button>
      </div>
    </div>
  );
}

function RescheduleForm({ appt, onCancel, onDone }: { appt: PanelAppointment; onCancel: () => void; onDone: (outcome: string) => void }) {
  const [eligibleStaff, setEligibleStaff] = useState<{ id: string; name: string }[]>([]);
  const [staffId, setStaffId] = useState(appt.staff_id);
  const [date, setDate] = useState(() => new Date(appt.start_at).toLocaleDateString("en-CA", { timeZone: "America/New_York" }));
  const [slots, setSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("staff_services").select("staff:staff_id(id,name)").eq("service_id", appt.service_id);
      setEligibleStaff(((data as any[]) || []).map((x) => x.staff).filter(Boolean));
    })();
  }, [appt.service_id]);

  useEffect(() => {
    if (!staffId || !date) return;
    setLoadingSlots(true);
    setSlots([]);
    setSlot("");
    (async () => {
      const { data } = await supabase.rpc("get_available_slots", { p_staff_id: staffId, p_service_id: appt.service_id, p_date: date });
      setSlots(((data || []) as { slot_start: string }[]).map((x) => x.slot_start));
      setLoadingSlots(false);
    })();
  }, [staffId, date, appt.service_id]);

  async function confirm() {
    if (!slot) return;
    setSaving(true);
    setError(null);
    const { data, error: e } = await supabase.rpc("hub_reschedule_appointment", { p_appointment_id: appt.id, p_staff_id: staffId, p_start_at: slot });
    setSaving(false);
    if (e) { setError(e.message); return; }
    onDone(String(data));
  }

  return (
    <div className="mt-6 space-y-4">
      <Detail title="Nuevo horario">
        <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Profesional</span>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]">
            {eligibleStaff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Fecha</span>
          <input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]" />
        </label>
        <div>
          <span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-2">Horarios disponibles</span>
          {loadingSlots ? <p className="text-[12px] text-taupe">Cargando...</p> : slots.length === 0 ? <p className="text-[12px] text-taupe">Sin horarios ese día.</p> : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <button key={s} onClick={() => setSlot(s)} className={`rounded-xl border py-2.5 text-[12px] ${slot === s ? "border-espresso bg-espresso text-ivory" : "border-champagne/30 bg-white/50"}`}>
                  {new Date(s).toLocaleTimeString("es-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })}
                </button>
              ))}
            </div>
          )}
        </div>
      </Detail>
      {error && <p className="text-[11px] text-red-700">{error}</p>}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={onCancel} className="rounded-[14px] border border-champagne/35 bg-white/50 px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-mocha">Volver</button>
        <button disabled={!slot || saving} onClick={confirm} className="rounded-[14px] bg-espresso px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-ivory disabled:opacity-50">{saving ? "Guardando..." : "Confirmar reprogramación"}</button>
      </div>
    </div>
  );
}

function Status({ value }: { value: string }) { return <span className="inline-flex w-fit rounded-full border border-champagne/35 bg-ivory/15 px-2.5 py-1 text-[8px] uppercase tracking-[0.08em] text-current">{statusLabels[value] || value}</span>; }
function Detail({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[20px] border border-champagne/25 bg-white/45 p-4"><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">{title}</p><div className="mt-3 space-y-2.5">{children}</div></section>; }
function Line({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 text-[11px]"><span className="text-taupe">{label}</span><span className="text-right">{value}</span></div>; }
function Action({ children, onClick, soft = false }: { children: React.ReactNode; onClick: () => void; soft?: boolean }) { return <button onClick={onClick} className={`rounded-[14px] px-4 py-3 text-[9px] uppercase tracking-[0.11em] ${soft ? "border border-champagne/35 bg-white/50 text-mocha" : "bg-espresso text-ivory"}`}>{children}</button>; }
function formatDate(v: string) { return new Date(v).toLocaleDateString("es-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }); }
function formatTime(v: string) { return new Date(v).toLocaleTimeString("es-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }); }
function minutesBetween(a: string, b: string) { return Math.round((+new Date(b) - +new Date(a)) / 60000); }
function money(c: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format((c || 0) / 100); }
