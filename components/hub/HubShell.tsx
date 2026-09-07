"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, CalendarRange, LayoutDashboard, Menu, MoreHorizontal, Plus, Scissors, Settings, TrendingUp, UserRound, UsersRound, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

type HubUser={role:"owner"|"admin"|"staff";staff_id:string|null};
type NavItem={label:string;href:string;icon:any};

const adminNav:NavItem[]=[
  {label:"Inicio",href:"/hub",icon:LayoutDashboard},{label:"Calendario",href:"/hub/calendar",icon:CalendarRange},{label:"Citas",href:"/hub/appointments",icon:CalendarDays},{label:"Clientas",href:"/hub/clients",icon:UsersRound},{label:"Equipo",href:"/hub/team",icon:UserRound},{label:"Servicios",href:"/hub/services",icon:Scissors}
];
const staffNav:NavItem[]=[
  {label:"Inicio",href:"/hub/my-agenda",icon:LayoutDashboard},{label:"Calendario",href:"/hub/calendar",icon:CalendarRange},{label:"Clientas",href:"/hub/clients",icon:UsersRound},{label:"Mi Progreso",href:"/hub/progress",icon:TrendingUp}
];
function staffRouteAllowed(pathname:string){if(pathname.startsWith("/hub/calendar")||pathname.startsWith("/hub/my-agenda")||pathname.startsWith("/hub/clients")||pathname.startsWith("/hub/progress")||pathname.startsWith("/hub/profile"))return true;return /^\/hub\/appointments\/[^/]+\/complete$/.test(pathname)}

export function HubShell({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<HubUser|null>(null);
  const [loading,setLoading]=useState(true);
  const [moreOpen,setMoreOpen]=useState(false);
  const pathname=usePathname();
  const router=useRouter();

  useEffect(()=>{(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){setLoading(false);router.replace("/hub/login");return;}
    const {data}=await supabase.from("user_profiles").select("role,staff_id").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle();
    if(!data||!["owner","admin","staff"].includes(data.role)){setLoading(false);router.replace("/access");return;}
    if(data.role==="staff"&&!staffRouteAllowed(pathname)){setUser(data as HubUser);setLoading(false);router.replace("/hub/my-agenda");return;}
    setUser(data as HubUser);setLoading(false);
  })()},[pathname,router]);

  const isStaff=user?.role==="staff";
  const nav=useMemo(()=>isStaff?staffNav:adminNav,[isStaff]);
  if(loading)return <div className="min-h-screen bg-ivory flex items-center justify-center"><div className="text-center"><Logo className="h-20 w-auto mx-auto"/><p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-taupe">Abriendo Gloria {isStaff?"Team":"Hub"}</p></div></div>;
  if(!user)return null;

  return <div className="min-h-screen bg-[#F7F3ED] text-espresso md:grid md:grid-cols-[214px_1fr] pb-[82px] md:pb-0">
    <aside className="hidden md:flex bg-[#34261F] px-3.5 py-4 flex-col sticky top-0 h-screen text-ivory overflow-hidden">
      <div className="px-2"><Logo className="h-11 w-auto brightness-[4] grayscale"/><p className="mt-4 text-[7px] uppercase tracking-[0.28em] text-champagne/70">{isStaff?"Gloria Team":"Gloria Hub"}</p><p className="mt-1.5 font-serif text-[18px] leading-tight text-ivory/95">{isStaff?"Tu día, más simple.":"Beauty lives here."}</p></div>
      <Link href="/hub/calendar?new=1" className="mt-4 flex items-center rounded-[13px] bg-ivory px-3.5 py-3 text-espresso"><span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.13em]"><Plus size={15}/> Nueva cita</span></Link>
      <nav className="mt-4 space-y-1">{nav.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[10px] transition-all ${active?"bg-white/12 text-white":"text-ivory/65 hover:bg-white/7 hover:text-white"}`}><Icon size={16}/><span>{item.label}</span>{active&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-champagne"/>}</Link>})}</nav>
      <div className="mt-auto border-t border-white/10 pt-3"><Link href="/hub/profile" className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[10px] text-ivory/60 hover:bg-white/7 hover:text-white"><UserRound size={16}/> Mi Perfil</Link>{!isStaff&&<Link href="/hub/settings/appointments" className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[10px] text-ivory/60 hover:bg-white/7 hover:text-white"><Settings size={16}/> Configuración</Link>}</div>
    </aside>

    <div className="min-w-0">
      <header className="sticky top-0 z-40 border-b border-champagne/20 bg-[#F7F3ED]/94 backdrop-blur-xl"><div className="h-[66px] px-4 md:px-7 lg:px-9 flex items-center justify-between gap-4 max-w-[1580px] mx-auto"><div className="md:hidden"><Logo className="h-11 w-auto"/></div><div className="hidden md:block"><p className="text-[8px] uppercase tracking-[0.24em] text-taupe">{isStaff?"Gloria Team":"Gloria Hub"}</p><p className="mt-1 text-[11px] text-mocha">{isStaff?"Agenda + clientas + progreso":"Todo lo importante, sin ruido"}</p></div><div className="flex items-center gap-2"><Link href="/hub/calendar?new=1" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#6F3642] px-4 py-2.5 text-[9px] uppercase tracking-[0.13em] text-white"><Plus size={14}/> Nueva cita</Link><button className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-champagne/35 bg-white/60" onClick={()=>setMoreOpen(true)} aria-label="Más opciones"><Menu size={21}/></button></div></div></header>
      <main className="px-4 md:px-7 lg:px-9 py-5 md:py-8 max-w-[1580px] mx-auto">{children}</main>
    </div>

    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-champagne/30 bg-[#FBF8F3]/96 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(52,38,31,.06)]"><div className="grid grid-cols-5 h-[72px]">{(isStaff?staffMobile():adminMobile()).map(item=>{if(item.action==="more")return <button key="more" onClick={()=>setMoreOpen(true)} className="flex flex-col items-center justify-center gap-1 text-taupe"><MoreHorizontal size={21}/><span className="text-[8px]">Más</span></button>;if(item.action==="new")return <Link key="new" href="/hub/calendar?new=1" className="flex flex-col items-center justify-center gap-1"><span className="grid h-11 w-11 place-items-center -mt-5 rounded-full bg-[#6F3642] text-white shadow-[0_8px_20px_rgba(111,54,66,.25)]"><Plus size={22}/></span><span className="text-[8px] text-mocha">Nueva</span></Link>;const Icon=item.icon!;const active=pathname===item.href||pathname.startsWith((item.href||"")+"/");return <Link key={item.href} href={item.href!} className={`flex flex-col items-center justify-center gap-1 ${active?"text-mocha":"text-taupe"}`}><Icon size={20}/><span className="text-[8px]">{item.label}</span></Link>})}</div></nav>

    {moreOpen&&<div className="md:hidden fixed inset-0 z-[80] bg-espresso/40 backdrop-blur-[2px] flex items-end" onClick={()=>setMoreOpen(false)}><div className="w-full rounded-t-[30px] bg-[#FBF8F3] p-5 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-[0_-20px_50px_rgba(52,38,31,.12)]" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[0.22em] text-mocha">Gloria {isStaff?"Team":"Hub"}</p><h2 className="mt-1 font-serif text-[31px]">Más</h2></div><button onClick={()=>setMoreOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35 bg-white/60"><X size={20}/></button></div><div className="mt-5 grid grid-cols-2 gap-3">{(isStaff?staffMore():adminMore()).map((item,index)=>{const Icon=item.icon;return <Link key={item.href} href={item.href} onClick={()=>setMoreOpen(false)} className={`min-h-[130px] rounded-[22px] border p-4 shadow-[0_10px_24px_rgba(52,38,31,.06)] ${index%2===0?"border-[#7B3C48]/20 bg-[linear-gradient(135deg,#7B3C48,#4B2530)] text-white":"border-[#D5C0B1]/40 bg-[linear-gradient(135deg,#F8F0E8,#E7D2C3)] text-[#4A352B]"}`}><span className={`grid h-10 w-10 place-items-center rounded-full ${index%2===0?"bg-white/10":"bg-[#8B5E4B] text-white"}`}><Icon size={18}/></span><p className="mt-5 font-serif text-[23px] leading-none">{item.label}</p></Link>})}</div></div></div>}
  </div>
}

function adminMobile(){return [{label:"Inicio",href:"/hub",icon:LayoutDashboard},{label:"Calendario",href:"/hub/calendar",icon:CalendarRange},{label:"Nueva",action:"new"},{label:"Clientas",href:"/hub/clients",icon:UsersRound},{label:"Más",action:"more"}]}
function staffMobile(){return [{label:"Inicio",href:"/hub/my-agenda",icon:LayoutDashboard},{label:"Calendario",href:"/hub/calendar",icon:CalendarRange},{label:"Nueva",action:"new"},{label:"Clientas",href:"/hub/clients",icon:UsersRound},{label:"Más",action:"more"}]}
function adminMore(){return [{label:"Servicios",href:"/hub/services",icon:Scissors},{label:"Equipo",href:"/hub/team",icon:UserRound},{label:"Configuración",href:"/hub/settings/appointments",icon:Settings},{label:"Mi Perfil",href:"/hub/profile",icon:UserRound}]}
function staffMore(){return [{label:"Dashboard",href:"/hub/my-agenda",icon:LayoutDashboard},{label:"Nueva cita",href:"/hub/calendar?new=1",icon:Plus},{label:"Mi Progreso",href:"/hub/progress",icon:TrendingUp},{label:"Mi Perfil",href:"/hub/profile",icon:UserRound}]}
