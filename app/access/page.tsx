"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, MapPin, ShoppingBag, Sparkles } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";

type Appointment = {
  id: string;
  start_at: string;
  end_at: string;
  status: string;
  service: { name: string; duration_minutes: number } | null;
  staff: { name: string } | null;
};

export default function AccessHomePage() {
  const { profile } = useAccess();
  const [next, setNext] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data } = await supabase
        .from("appointments")
        .select("id,start_at,end_at,status,service:service_id(name,duration_minutes),staff:staff_id(name)")
        .eq("client_id", profile.id)
        .in("status", ["confirmed", "pending", "pending_deposit"])
        .gte("start_at", new Date().toISOString())
        .order("start_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      setNext((data as Appointment | null) ?? null);
      setLoading(false);
    })();
  }, [profile?.id]);

  if (!profile) return null;

  const noHistory = profile.beauty_state === "no_appointment_history" && !next;

  return (
    <div>
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-mocha">Gloria Access</p>
          <h1 className="mt-2 font-serif text-[40px] md:text-[56px] leading-none">Hola, {profile.first_name || "Beauty"}</h1>
          <p className="mt-3 text-[14px] text-taupe">Tu belleza, siempre en agenda.</p>
        </div>
      </div>

      {noHistory && !loading ? (
        <section className="mt-9 overflow-hidden rounded-[30px] border border-champagne/30 bg-white/55 p-7 md:p-10 relative">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blush/50 blur-2xl" />
          <p className="relative text-[10px] uppercase tracking-[0.28em] text-mocha">Welcome to Gloria Access</p>
          <h2 className="relative mt-4 max-w-[620px] font-serif text-[38px] md:text-[52px] leading-[0.98]">Your personal beauty space starts with your first appointment.</h2>
          <p className="relative mt-5 max-w-[520px] text-[13px] leading-relaxed text-taupe">Aquí vivirán tus citas, tus looks, tus preferencias y recomendaciones reales a medida que construyes tu historia con Gloria Beauty Salon.</p>
          <div className="relative mt-7 flex flex-wrap gap-3">
            <Link href="/reservar" className="rounded-full bg-espresso px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">Book your first appointment</Link>
            <Link href="/servicios" className="rounded-full border border-mocha/35 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-mocha">Explore services</Link>
          </div>
        </section>
      ) : (
        <section className="mt-9 rounded-[30px] bg-espresso text-ivory p-7 md:p-9">
          <div className="flex items-center gap-2 text-champagne"><CalendarDays size={18} /><span className="text-[10px] uppercase tracking-[0.28em]">Próxima cita</span></div>
          {loading ? <p className="mt-6 text-sm text-ivory/65">Cargando tu agenda...</p> : next ? (
            <div className="mt-6 grid md:grid-cols-[1fr_auto] gap-7 items-end">
              <div>
                <h2 className="font-serif text-[36px] md:text-[46px] leading-none">{next.service?.name || "Appointment"}</h2>
                <p className="mt-3 text-[14px] text-ivory/75">con {next.staff?.name || "Gloria Beauty Salon"}</p>
                <p className="mt-5 text-[13px] text-champagne">{formatDate(next.start_at)} · {formatTime(next.start_at)} · {duration(next.start_at, next.end_at)}</p>
                <span className="mt-4 inline-flex rounded-full border border-champagne/35 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-champagne">{next.status.replaceAll("_", " ")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/access/appointments" className="rounded-full bg-ivory px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-espresso">View details</Link>
                <a href="https://www.google.com/maps/dir/?api=1&destination=1130%20SW%208th%20St%2C%20Miami%2C%20FL%2033130" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-5 py-3 text-[10px] uppercase tracking-[0.14em]"><MapPin size={14}/> Directions</a>
              </div>
            </div>
          ) : <div className="mt-6"><h2 className="font-serif text-[36px]">No upcoming appointment.</h2><Link href="/reservar" className="mt-5 inline-flex rounded-full bg-ivory px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-espresso">Book appointment</Link></div>}
        </section>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <QuickCard href="/access/beauty-profile" icon={<Sparkles size={21}/>} eyebrow="My Beauty Profile" title={profile.beauty_state === "beauty_profile_active" ? "Your beauty story" : profile.beauty_state === "appointment_confirmed" ? "Your journey has started" : "Starts after your first visit"} />
        <QuickCard href="/access/shop" icon={<ShoppingBag size={21}/>} eyebrow="Shop" title={profile.beauty_state === "beauty_profile_active" ? "Your routine & Gloria's edit" : "Professional care curated by Gloria"} />
        <QuickCard href="/access/appointments" icon={<CalendarDays size={21}/>} eyebrow="Appointments" title="Your beauty calendar" />
      </div>
    </div>
  );
}

function QuickCard({ href, icon, eyebrow, title }: { href: string; icon: React.ReactNode; eyebrow: string; title: string }) {
  return <Link href={href} className="group rounded-[24px] border border-champagne/30 bg-white/45 p-6 min-h-[170px] flex flex-col justify-between"><div className="text-mocha">{icon}</div><div><p className="text-[9px] uppercase tracking-[0.22em] text-taupe">{eyebrow}</p><div className="mt-2 flex items-end justify-between gap-3"><h3 className="font-serif text-[26px] leading-[1.02]">{title}</h3><ChevronRight className="shrink-0 text-mocha transition-transform group-hover:translate-x-1" size={18}/></div></div></Link>;
}

function formatDate(value: string) { return new Date(value).toLocaleDateString("es-US", { weekday: "long", month: "long", day: "numeric" }); }
function formatTime(value: string) { return new Date(value).toLocaleTimeString("es-US", { hour: "numeric", minute: "2-digit" }); }
function duration(start: string, end: string) { const min = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000); return min < 60 ? `${min} min` : `${Math.floor(min/60)}h${min%60 ? ` ${min%60}m` : ""}`; }
