"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Home, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

type ClientProfile = {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  access_status: "invited" | "active" | "inactive" | "disabled";
  beauty_state: "no_appointment_history" | "appointment_confirmed" | "beauty_profile_active";
  preferred_professional_id: string | null;
  communication_email: boolean;
  communication_sms: boolean;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
};

type AccessContextValue = {
  profile: ClientProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AccessContext = createContext<AccessContextValue>({ profile: null, loading: true, refreshProfile: async () => {} });

export function useAccess() {
  return useContext(AccessContext);
}

const nav = [
  { label: "Home", href: "/access", icon: Home },
  { label: "Appointments", href: "/access/appointments", icon: CalendarDays },
  { label: "My Beauty Profile", href: "/access/beauty-profile", icon: Sparkles },
  { label: "Shop", href: "/access/shop", icon: ShoppingBag },
  { label: "Profile", href: "/access/profile", icon: UserRound },
];

const publicAccessRoutes = ["/access/login", "/access/create-account", "/access/activate"];

export function AccessShell({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = publicAccessRoutes.some((route) => pathname.startsWith(route));

  async function refreshProfile() {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setProfile(null);
      setLoading(false);
      if (!isPublicRoute) router.replace("/access/login");
      return;
    }

    await supabase.rpc("link_my_existing_appointments");
    const { data } = await supabase
      .from("client_profiles")
      .select("id, auth_user_id, first_name, last_name, email, phone, birthday, access_status, beauty_state, preferred_professional_id, communication_email, communication_sms, address_line1, address_line2, city, state, postal_code")
      .eq("auth_user_id", user.id)
      .single();

    if (!data || data.access_status === "disabled") {
      setProfile(null);
      setLoading(false);
      if (data?.access_status === "disabled") await supabase.auth.signOut();
      if (!isPublicRoute) router.replace("/access/login");
      return;
    }

    setProfile(data as ClientProfile);
    setLoading(false);
    if (isPublicRoute) router.replace("/access");
  }

  useEffect(() => {
    refreshProfile();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isPublicRoute) router.replace("/access/login");
    });
    return () => listener.subscription.unsubscribe();
  }, [pathname]);

  const value = useMemo(() => ({ profile, loading, refreshProfile }), [profile, loading]);

  if (isPublicRoute) {
    return <div className="min-h-screen bg-ivory text-espresso">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <Logo className="h-20 w-auto mx-auto opacity-80" />
          <p className="mt-5 text-[10px] uppercase tracking-[0.32em] text-taupe">Preparing your beauty space</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <AccessContext.Provider value={value}>
      <div className="min-h-screen bg-ivory text-espresso pb-24 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-champagne/25 bg-ivory/95 backdrop-blur-md">
          <div className="max-w-[1180px] mx-auto px-5 md:px-8 h-[82px] flex items-center justify-between gap-6">
            <Link href="/access" aria-label="Gloria Access home"><Logo className="h-[62px] w-auto" /></Link>
            <nav className="hidden md:flex items-center gap-7">
              {nav.map((item) => {
                const active = pathname === item.href;
                return <Link key={item.href} href={item.href} className={`text-[12px] transition-colors ${active ? "text-mocha font-semibold" : "text-taupe hover:text-espresso"}`}>{item.label}</Link>;
              })}
            </nav>
            <div className="text-right hidden sm:block">
              <p className="font-serif text-[20px] leading-none">Gloria Access</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-taupe">Beauty. Anytime. Your Way.</p>
            </div>
          </div>
        </header>

        <main className="max-w-[1180px] mx-auto px-5 md:px-8 py-8 md:py-12">{children}</main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-champagne/30 bg-ivory/97 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5 h-[72px]">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1 ${active ? "text-mocha" : "text-taupe"}`}>
                  <Icon size={20} strokeWidth={active ? 1.8 : 1.35} />
                  <span className="text-[8px] leading-tight text-center px-1">{item.label === "My Beauty Profile" ? "Beauty" : item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </AccessContext.Provider>
  );
}
