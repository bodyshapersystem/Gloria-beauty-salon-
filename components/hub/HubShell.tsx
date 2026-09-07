"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, CalendarRange, LayoutDashboard, Menu, MessageCircle, PackageCheck, Scissors, Settings, ShoppingBag, TrendingUp, UserCircle, UserRound, UsersRound, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

type HubUser={role:"owner"|"admin"|"staff";staff_id:string|null};
type NavItem={label:string;href:string;icon:any;audience:"all"|"admin"|"staff"};
const nav:NavItem[]=[
  {label:"Panel",href:"/hub",icon:LayoutDashboard,audience:"admin"},
  {label:"Mi Agenda",href:"/hub/my-agenda",icon:CalendarDays,audience:"staff"},
  {label:"Citas",href:"/hub/appointments",icon:CalendarDays,audience:"admin"},
  {label:"Calendario",href:"/hub/calendar",icon:CalendarRange,audience:"admin"},
  {label:"Clientas",href:"/hub/clients",icon:UsersRound,audience:"all"},
  {label:"Mi Progreso",href:"/hub/progress",icon:TrendingUp,audience:"staff"},
  {label:"Mensajes",href:"/hub/messages",icon:MessageCircle,audience:"all"},
  {label:"Equipo",href:"/hub/team",icon:UserRound,audience:"admin"},
  {label:"Servicios",href:"/hub/services",icon:Scissors,audience:"admin"},
  {label:"Productos",href:"/hub/products",icon:ShoppingBag,audience:"admin"},
  {label:"Pedidos",href:"/hub/orders",icon:PackageCheck,audience:"admin"},
  {label:"Configuración",href:"/hub/settings/appointments",icon:Settings,audience:"admin"},
  {label:"Mi Perfil",href:"/hub/profile",icon:UserCircle,audience:"all"},
];

const roleLabels:Record<string,string>={owner:"Dueña",admin:"Administradora",staff:"Staff"};

function staffRouteAllowed(pathname:string){
  if(pathname.startsWith("/hub/my-agenda")||pathname.startsWith("/hub/clients")||pathname.startsWith("/hub/progress")||pathname.startsWith("/hub/messages")||pathname.startsWith("/hub/profile"))return true;
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

  if(loading)return <div className="min-h-screen bg-ivory flex items-center justify-center"><div className="text-center"><Logo className="h-20 w-auto mx-auto"/><p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-taupe">Abriendo Gloria Hub</p></div></div>;
  if(!user)return null;
  const isStaff=user.role==="staff";
  const visibleNav=nav.filter(item=>item.audience==="all"||(isStaff?item.audience==="staff":item.audience==="admin"));

  return <div className="min-h-screen bg-ivory text-espresso md:grid md:grid-cols-[250px_1fr]">
    <aside className="hidden md:flex min-h-screen border-r border-champagne/25 bg-white/35 px-5 py-6 flex-col sticky top-0 h-screen">
      <Logo className="h-16 w-auto self-start"/>
      <div className="mt-6"><p className="text-[9px] uppercase tracking-[0.28em] text-mocha">{isStaff?"Gloria Team":"Gloria Hub"}</p><p className="mt-2 font-serif text-[23px] leading-none">{isStaff?"Tu día, bien organizado.":"Tu negocio, bien organizado."}</p></div>
      <nav className="mt-6 space-y-0.5 overflow-y-auto pr-1">{visibleNav.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] ${active?"bg-espresso text-ivory":"text-taupe hover:bg-white/55 hover:text-espresso"}`}><Icon size={17} strokeWidth={1.5}/>{item.label}</Link>})}</nav>
      <div className="mt-auto border-t border-champagne/25 pt-4"><p className="text-[9px] uppercase tracking-[0.2em] text-taupe">Sesión iniciada como</p><p className="mt-1 text-[12px]">{roleLabels[user.role]}</p></div>
    </aside>

    <div className="min-w-0">
      <div className="md:hidden flex items-center justify-between border-b border-champagne/25 bg-white/60 px-5 py-4 sticky top-0 z-40">
        <Logo className="h-10 w-auto"/>
        <button onClick={()=>setOpen(true)} aria-label="Abrir menú" className="text-espresso"><Menu size={24}/></button>
      </div>
      {open&&<div className="md:hidden fixed inset-0 z-50 bg-espresso/40" onClick={()=>setOpen(false)}>
        <div className="h-full w-[280px] bg-ivory p-5 overflow-y-auto" onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-between"><Logo className="h-12 w-auto"/><button onClick={()=>setOpen(false)} aria-label="Cerrar menú"><X size={22}/></button></div>
          <div className="mt-5"><p className="text-[9px] uppercase tracking-[0.28em] text-mocha">{isStaff?"Gloria Team":"Gloria Hub"}</p></div>
          <nav className="mt-4 space-y-0.5">{visibleNav.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] ${active?"bg-espresso text-ivory":"text-taupe"}`}><Icon size={17} strokeWidth={1.5}/>{item.label}</Link>})}</nav>
          <div className="mt-6 border-t border-champagne/25 pt-4"><p className="text-[9px] uppercase tracking-[0.2em] text-taupe">Sesión iniciada como</p><p className="mt-1 text-[12px]">{roleLabels[user.role]}</p></div>
        </div>
      </div>}
      <main className="px-5 py-7 md:px-9 md:py-10 max-w-[1500px] mx-auto w-full">{children}</main>
    </div>
  </div>
}
