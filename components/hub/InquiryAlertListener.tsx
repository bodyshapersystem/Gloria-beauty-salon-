"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type NewInquiry = {
  id: string;
  client_name: string;
  service_id: string | null;
};

// Plays a short two-tone chime using the Web Audio API — no audio file
// needed, and it works the first time without waiting on an asset to load.
function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [880, 1175].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.16);
      gain.gain.linearRampToValueAtTime(0.35, now + i * 0.16 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.16 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.16);
      osc.stop(now + i * 0.16 + 0.55);
    });
  } catch {
    // Web Audio unsupported/blocked — fail silently, the visual toast still shows.
  }
}

export function InquiryAlertListener() {
  const [toast, setToast] = useState<NewInquiry | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("hub-booking-inquiries")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "booking_inquiries" },
        (payload) => {
          const row = payload.new as NewInquiry;
          playChime();
          setToast(row);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setToast(null), 12000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] w-[320px] animate-bounce rounded-[20px] border border-champagne/40 bg-espresso p-4 text-ivory shadow-[0_16px_40px_rgba(46,39,36,.35)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-champagne/20 text-champagne">
          <Bell size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[8px] uppercase tracking-[0.16em] text-champagne">Nueva solicitud</p>
          <p className="mt-1 font-serif text-[19px] leading-tight truncate">{toast.client_name}</p>
          <Link
            href="/hub/inquiries"
            onClick={() => setToast(null)}
            className="mt-2 inline-block text-[9px] uppercase tracking-[0.12em] text-champagne underline underline-offset-4"
          >
            Ver solicitud
          </Link>
        </div>
        <button onClick={() => setToast(null)} aria-label="Cerrar" className="text-ivory/60">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
