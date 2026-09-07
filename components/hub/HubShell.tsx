"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, CalendarRange, ChevronRight, LayoutDashboard, Menu, MessageCircle, PackageCheck, Plus, Scissors, Settings, ShoppingBag, Sparkles, TrendingUp, UserRound, UsersRound, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

type HubUser={role:"owner"|"admin"|"staff";staff_id:string|null};
type NavItem={label:string;href:string;icon:any;audience:"all"|"admin"|"staff";group:"today"|"clients"|"business"|"settings"};

const nav:NavItem[]=[
  {label:"Today",href:"/hub",icon:LayoutDashboard,audience:"admin",group:"today"},
  {label:"My Agenda",href:"/hub/my-agenda",icon:CalendarDays,audience:"staff",group:"today"},
  {label:"Appointments",href:"/hub/appointments",icon:CalendarDays,audience:"admin",group:"today"},
  {label:"Calendar",href:"/hub/calendar",icon:CalendarRange,audience:"admin",group:"today"},
  {label:"Clients",href:"/hub/clients",icon:UsersRound,audience:"all",group:"clients"},
  {label:"Messages",href:"/hub/messages",icon:MessageCircle,audience:"all",group:"clients"},
  {label:"My Progress",href:"/hub/progress",icon:TrendingUp,audience:"staff",group:"clients"},
  {label:"Beauty Intelligence",href:"/hub/intelligence",icon:Sparkles,audience:"admin",group:"business"},
  {label:"Team",href:"/hub/team",icon:UserRound,audience:"admin",group:"business"},
  {label:"Services",href:"/hub/services",icon:Scissors,audience:"admin",group:"business"},
  {label:"Products",href:"/hub/products",icon:ShoppingBag,audience:"admin",group:"business"},
  {label:"Orders",href:"/hub/orders",icon:PackageCheck,audience:"admin",group:"business"},
  {label:"Settings",href:"/hub/settings/appointments",icon:Settings,audience:"admin",group:"settings"},
];

function staffRouteAllowed(pathname:string){
  if(pathname.startsWith("/hub/my-agenda")||pathname.startsWith("/hub/clients")||pathname.startsWith("/hub/progress")||pathname.startsWith("/hub/messages"))return true;
  return /^\/hub\/appointments\/[^/]+\/complete$/.test(pathname);
}

export function HubShell({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<HubUser|null>(null);
  const [loading,setLoading]=useState(true);
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  const router=useRouter();

  useEffect(()=>{(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){setLoading(false);router.replace("/access/login");return;}
    const {data}=await supabase.from("user_profiles").select("role,staff_id").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle();
    if(!data||!["owner","admin","staff"].includes(data.role)){setLoading(false);router.replace("/access");return;}
    if(data.role==="staff"&&!staffRouteAllowed(pathname)){setUser(data as HubUser);setLoading(false);router.replace("/hub/my-agenda");return;}
    setUser(data as HubUser);setLoading(false);
  })()},[pathname,router]);

  const isStaff=user?.role==="staff";
  const visibleNav=useMemo(()=>nav.filter(item=>item.audience==="all"||(isStaff?item.audience==="staff":item.audience==="admin")),[isStaff]);

  if(loading)return <div className="min-h-screen bg-ivory flex items-center justify-center"><div className="text-center"><Logo className="h-20 w-auto mx-auto"/><p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-taupe">Opening Gloria Hub</p></div></div>;
  if(!user)return null;

  return <div className="min-h-screen bg-[#F8F5EF] text-espresso md:grid md:grid-cols-[228px_1fr]">
    <aside className="hidden md:flex min-h-screen border-r border-champagne/25 bg-[#F3EEE7]/90 px-4 py-5 flex-col sticky top-0 h-screen backdrop-blur-xl">
      <div className="px-2"><Logo className="h-14 w-auto"/><div className="mt-5 rounded-[18px] border border-champagne/30 bg-white/55 p-4"><p className="text-[8px] uppercase tracking-[0.26em] text-mocha">{isStaff?"Gloria Team":"Gloria Hub"}</p><p className="mt-2 font-serif text-[20px] leading-[1.02]">{isStaff?"Your day, at a glance.":"Your salon, at a glance."}</p></div></div>

      {!isStaff&&<Link href="/hub/calendar?new=1" className="mx-2 mt-4 flex items-center justify-between rounded-[16px] bg-espresso px-4 py-3.5 text-ivory shadow-[0_10px_26px_rgba(46,39,36,.12)]"><span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]"><Plus size={16}/> New appointment</span><ChevronRight size={15}/></Link>}

      <nav className="mt-5 overflow-y-auto pr-1">
        {(["today","clients","business","settings"] as const).map(group=>{
          const items=visibleNav.filter(x=>x.group===group);if(!items.length)return null;
          const title=group==="today"?"Daily":group==="clients"?"Relationships":group==="business"?"Business":"System";
          return <div key={group} className="mb-5"><p className="px-3 mb-1.5 text-[8px] uppercase tracking-[0.24em] text-taupe/80">{title}</p><div className="space-y-1">{items.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link key={item.href} href={item.href} className={`group flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[11px] transition-all ${active?"bg-white text-espresso shadow-[0_4px_16px_rgba(46,39,36,.06)]":"text-taupe hover:bg-white/60 hover:text-espresso"}`}><span className={`grid h-8 w-8 place-items-center rounded-[10px] ${active?"bg-blush/55 text-mocha":"bg-transparent text-taupe group-hover:bg-blush/35 group-hover:text-mocha"}`}><Icon size={16} strokeWidth={1.55}/></span><span className="flex-1">{item.label}</span>{active&&<span className="h-1.5 w-1.5 rounded-full bg-mocha"/>}</Link>})}</div></div>
        })}
      </nav>

      <div className="mt-auto px-2"><div className="rounded-[16px] border border-champagne/25 bg-white/45 px-3 py-3"><p className="text-[8px] uppercase tracking-[0.18em] text-taupe">Signed in</p><div className="mt-2 flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-blush/50 text-mocha"><UserRound size={15}/></div><div><p className="text-[11px] capitalize">{user.role}</p><p className="text-[9px] text-taupe">Gloria Beauty Salon</p></div></div></div></div>
    </aside>

    <div className="min-w-0">
      <header className="sticky top-0 z-40 border-b border-champagne/20 bg-ivory/92 backdrop-blur-xl">
        <div className="h-[70px] px-4 md:px-7 lg:px-9 flex items-center justify-between gap-4 max-w-[1580px] mx-auto">
          <div className="md:hidden"><Logo className="h-11 w-auto"/></div>
          <div className="hidden md:block"><p className="text-[8px] uppercase tracking-[0.22em] text-taupe">{isStaff?"Gloria Team":"Gloria Hub"}</p><p className="mt-1 text-[11px] text-mocha">{isStaff?"Everything you need for today":"Beauty business, without the clutter"}</p></div>
          <div className="flex items-center gap-2">{!isStaff&&<><Link href="/hub/appointments" className="hidden sm:inline-flex rounded-full border border-champagne/40 bg-white/50 px-4 py-2.5 text-[9px] uppercase tracking-[0.12em] text-mocha">Appointments</Link><Link href="/hub/calendar?new=1" className="inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.12em] text-ivory"><Plus size={14}/> New</Link></>}<button className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-champagne/30 bg-white/50" onClick={()=>setOpen(v=>!v)} aria-label="Open menu">{open?<X size={21}/>:<Menu size={22}/>}</button></div>
        </div>
      </header>

      {open&&<div className="md:hidden fixed inset-0 top-[70px] z-50 bg-espresso/35" onClick={()=>setOpen(false)}><div className="w-[88%] max-w-[370px] h-full bg-ivory p-5 overflow-y-auto" onClick={e=>e.stopPropagation()}><p className="font-serif text-[28px]">{isStaff?"My workspace":"Gloria Hub"}</p><p className="mt-1 text-[10px] text-taupe">Choose what you want to do.</p><nav className="mt-5 space-y-2">{visibleNav.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link onClick={()=>setOpen(false)} key={item.href} href={item.href} className={`flex items-center gap-3 rounded-[16px] border px-4 py-3 ${active?"border-mocha/25 bg-blush/30":"border-champagne/25 bg-white/45"}`}><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-blush/35 text-mocha"><Icon size={17}/></span><span className="flex-1 text-[13px]">{item.label}</span><ChevronRight size={15} className="text-taupe"/></Link>})}</nav></div></div>}

      <main className="px-4 md:px-7 lg:px-9 py-6 md:py-8 max-w-[1580px] mx-auto">{children}</main>
    </div>
  </div>
}
