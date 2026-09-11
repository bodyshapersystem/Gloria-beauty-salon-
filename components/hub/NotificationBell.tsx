"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: "daily_checklist" | "new_inquiry";
  staff_id: string | null;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export function NotificationBell({ staffId }: { staffId: string | null }) {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("notifications")
      .select("id,type,staff_id,title,body,link,is_read,created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    setItems((data as Notification[]) || []);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("hub-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = useMemo(() => items.filter((n) => !n.is_read).length, [items]);

  async function markRead(n: Notification) {
    if (!n.is_read) {
      await supabase.rpc("mark_notification_read", { p_id: n.id });
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
    }
  }

  async function markAllRead() {
    await supabase.rpc("mark_all_notifications_read", { p_staff_id: staffId });
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificaciones"
        className="relative grid h-9 w-9 place-items-center rounded-full border border-champagne/35 bg-white/55 text-mocha"
      >
        <Bell size={16} className={unreadCount > 0 ? "animate-pulse" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#B4443F] px-1 text-[8px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-[95] w-[320px] max-h-[420px] overflow-y-auto rounded-[20px] border border-champagne/30 bg-[#FBF8F3] p-3 shadow-[0_18px_45px_rgba(46,39,36,.18)]">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-[8px] uppercase tracking-[0.16em] text-mocha">Notificaciones</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="inline-flex items-center gap-1 text-[8px] uppercase tracking-[0.1em] text-mocha underline underline-offset-4">
                  <Check size={10} /> Marcar todo leído
                </button>
              )}
            </div>
            {items.length === 0 ? (
              <p className="px-2 py-6 text-center text-[11px] text-taupe">Sin notificaciones todavía.</p>
            ) : (
              <div className="mt-1 space-y-1">
                {items.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link || "#"}
                    onClick={() => {
                      markRead(n);
                      setOpen(false);
                    }}
                    className={`block rounded-[14px] px-3 py-2.5 ${n.is_read ? "bg-transparent" : "bg-blush/25"}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.is_read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B4443F]" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-[16px] leading-tight">{n.title}</p>
                        <p className="mt-0.5 text-[10px] text-taupe leading-snug">{n.body}</p>
                        <p className="mt-1 text-[8px] uppercase tracking-[0.08em] text-taupe/70">
                          {new Date(n.created_at).toLocaleString("es-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
