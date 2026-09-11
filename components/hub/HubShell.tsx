"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, CalendarRange, ChevronRight, Inbox, LayoutDashboard, Menu, MoreHorizontal, Plus, Scissors, Settings, TrendingUp, UserRound, UsersRound, Wallet, X, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";
import { InquiryAlertListener } from "@/components/hub/InquiryAlertListener";

type HubUser={role:"owner"|"admin"|"manager"|"staff";staff_id:string|null};
type Identity={name:string;photo_url:string|null};
type NavItem={label:string;href:string;icon:any};

const ownerNav:NavItem[]=[
  {label:"Inicio",href:"/hub",icon:LayoutDashboard},{label:"Calendario",href:"/hub/calendar",icon:CalendarRange},{label:"Citas",href:"/hub/appointments",icon:CalendarDays},{label:"Solicitudes",href:"/hub/inquiries",icon:Inbox},{label:"Clientas",href:"/hub/clients",icon:UsersRound},{label:"Servicios",href:"/hub/services",icon:Scissors},{label:"Progress",href:"/hub/progress",icon:TrendingUp},{label:"Corte Semanal",href:"/hub/corte-semanal",icon:Wallet},{label:"Equipo",href:"/hub/team",icon:UserRound}
];
const teamNav:NavItem[]=[
  {label:"Inicio",href:"/hub/my-agenda",icon:LayoutDashboard},{label:"Calendario",href:"/hub/calendar",icon:CalendarRange},{label:"Citas",href:"/hub/appointments",icon:CalendarDays},{label:"Solicitudes",href:"/hub/inquiries",icon:Inbox},{label:"Clientas",href:"/hub/clients",icon:UsersRound},{label:"Servicios",href:"/hub/services",icon:Scissors},{label:"Progress",href:"/hub/progress",icon:TrendingUp}
];
function staffRouteAllowed(pathname:string){if(pathname.startsWith("/hub/calendar")||pathname.startsWith("/hub/my-agenda")||pathname.startsWith("/hub/appointments")||pathname.startsWith("/hub/inquiries")||pathname.startsWith("/hub/clients")||pathname.startsWith("/hub/services")||pathname.startsWith("/hub/progress")||pathname.startsWith("/hub/profile"))return true;return /^\/hub\/appointments\/[^/]+\/complete$/.test(pathname)}

export function HubShell({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<HubUser|null>(null);
  const [loading,setLoading]=useState(true);
  const [identity,setIdentity]=useState<Identity>({name:"Gloria",photo_url:null});
  const [moreOpen,setMoreOpen]=useState(false);
  const pathname=usePathname();
  const router=useRouter();

  useEffect(()=>{(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){setLoading(false);router.replace("/hub-login");return;}
    const {data}=await supabase.from("user_profiles").select("role,staff_id").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle();
    if(!data||!["owner","admin","manager","staff"].includes(data.role)){await supabase.auth.signOut();setLoading(false);router.replace("/hub-login");return;}
    if(data.role!=="owner"){
      if(!data.staff_id){await supabase.auth.signOut();setLoading(false);router.replace("/hub-login");return;}
      const {data:st}=await supabase.from("staff").select("name,photo_url,active").eq("id",data.staff_id).eq("active",true).maybeSingle();
      if(!st){await supabase.auth.signOut();setLoading(false);router.replace("/hub-login");return;}
      setIdentity({name:st.name||"Team",photo_url:st.photo_url||null});
      if(pathname==="/hub"){setUser(data as HubUser);setLoading(false);router.replace("/hub/my-agenda");return;}
      if(!staffRouteAllowed(pathname)){setUser(data as HubUser);setLoading(false);router.replace("/hub/my-agenda");return;}
    }else{
      if(data.staff_id){const {data:st}=await supabase.from("staff").select("name,photo_url").eq("id",data.staff_id).maybeSingle();if(st)setIdentity({name:st.name||"Gloria",photo_url:st.photo_url||null});else setIdentity({name:"Gloria",photo_url:null});}
      else setIdentity({name:"Gloria",photo_url:null});
    }
    setUser(data as HubUser);
    setLoading(false);
  })()},[pathname,router]);

  async function logout(){await supabase.auth.signOut();router.replace("/hub-login");router.refresh();}
  const hour=new Date().getHours();const greeting=hour<12?"Buenos días":hour<19?"Buenas tardes":"Buenas noches";
  const isOwner=user?.role==="owner";
  const isTeam=Boolean(user&&!isOwner);
  const isStaff=user?.role==="staff";
  const nav=useMemo(()=>isOwner?ownerNav:teamNav,[isOwner]);
  if(loading)return <div className="min-h-screen bg-ivory flex items-center justify-center"><div className="text-center"><Logo className="h-20 w-auto mx-auto"/><p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-taupe">Abriendo {isTeam?"Hub · Team":"Gloria Hub"}</p></div></div>;
  if(!user)return null;

  return <div className="min-h-screen w-full overflow-x-hidden bg-[#F7F3ED] text-espresso lg:grid lg:grid-cols-[190px_minmax(0,1fr)] pb-[82px] lg:pb-0">
    <InquiryAlertListener/>
    <aside className="hidden lg:flex bg-[#34261F] px-3 py-3 flex-col sticky top-0 h-screen text-ivory overflow-y-auto">
      <div className="px-2"><Logo className="h-9 w-auto brightness-[4] grayscale"/><p className="mt-2.5 text-[7px] uppercase tracking-[0.28em] text-champagne/70">{isTeam?"Hub · Team":"Gloria Hub"}</p><p className="mt-1 font-serif text-[14px] leading-tight text-ivory/90">{isTeam?"Tu día, más simple.":"Beauty lives here."}</p></div>
      <Link href="/hub/calendar?new=1" className="mt-3 flex items-center rounded-[12px] bg-ivory px-3.5 py-2 text-espresso"><span className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.16em]"><Plus size={13}/> Nueva cita</span></Link>
      <nav className="mt-3 space-y-0.5">{nav.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[8.5px] font-medium uppercase tracking-[0.1em] transition-all ${active?"bg-white/12 text-white":"text-ivory/65 hover:bg-white/7 hover:text-white"}`}><Icon size={14} strokeWidth={1.55}/><span>{item.label}</span>{active&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-champagne"/>}</Link>})}</nav>
      <div className="mt-auto border-t border-white/10 pt-2.5">
        <Link href="/hub/profile" className="mb-1.5 flex items-center gap-3 rounded-[13px] bg-white/[.06] px-3 py-2.5">
          <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10">{identity.photo_url?<img src={identity.photo_url} alt={identity.name} className="h-full w-full object-cover"/>:<span className="grid h-full place-items-center font-serif text-[13px] text-champagne">{identity.name[0]}</span>}</span>
          <span className="min-w-0"><span className="block text-[7px] uppercase tracking-[.15em] text-ivory/45">{greeting}</span><span className="mt-0.5 block truncate font-serif text-[14px] text-ivory">{identity.name}</span></span>
        </Link>
        <Link href="/hub/profile" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[8.5px] font-medium uppercase tracking-[0.1em] text-ivory/58 hover:bg-white/7 hover:text-white"><UserRound size={14}/> Mi Perfil</Link>{isOwner&&<Link href="/hub/settings/appointments" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[8.5px] font-medium uppercase tracking-[0.1em] text-ivory/58 hover:bg-white/7 hover:text-white"><Settings size={14}/> Configuración</Link>}<button onClick={logout} className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[8.5px] font-medium uppercase tracking-[0.1em] text-ivory/48 hover:bg-white/7 hover:text-white"><LogOut size={14}/> Cerrar sesión</button></div>
    </aside>

    <div className="min-w-0 overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-champagne/20 bg-[#F7F3ED]/94 backdrop-blur-xl"><div className="h-[58px] w-full px-4 md:px-6 lg:px-8 flex items-center justify-between gap-3 max-w-[1440px] mx-auto"><div className="lg:hidden min-w-0"><Logo className="h-10 w-auto max-w-[170px]"/></div><div className="hidden lg:flex items-center gap-3"><span className="h-8 w-8 overflow-hidden rounded-full border border-champagne/40 bg-[#EADDD4]">{identity.photo_url?<img src={identity.photo_url} alt={identity.name} className="h-full w-full object-cover"/>:<span className="grid h-full place-items-center font-serif text-[14px] text-mocha">{identity.name[0]}</span>}</span><div><p className="text-[7px] font-medium uppercase tracking-[0.22em] text-taupe">{greeting}</p><p className="mt-0.5 font-serif text-[15px] leading-none text-mocha">{identity.name}</p></div></div><div className="flex shrink-0 items-center gap-2"><Link href="/hub/calendar?new=1" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#6F3642] px-4 py-2.5 text-[8px] font-medium uppercase tracking-[0.16em] text-white"><Plus size={14}/> Nueva cita</Link><button className="lg:hidden grid h-10 w-10 shrink-0 place-items-center rounded-full border border-champagne/35 bg-white/60" onClick={()=>setMoreOpen(true)} aria-label="Más opciones"><Menu size={21}/></button></div></div></header>
      <main className="mx-auto w-full max-w-[1440px] overflow-x-hidden px-4 py-5 md:px-6 md:py-7 lg:px-8">{children}</main>
    </div>

    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-champagne/30 bg-[#FBF8F3]/96 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(52,38,31,.06)]"><div className="grid grid-cols-5 h-[68px]">{(isTeam?staffMobile():adminMobile()).map(item=>{if(item.action==="more")return <button key="more" onClick={()=>setMoreOpen(true)} className="flex flex-col items-center justify-center gap-1 text-taupe"><MoreHorizontal size={20}/><span className="text-[7px] font-medium uppercase tracking-[0.12em]">Más</span></button>;if(item.action==="new")return <Link key="new" href="/hub/calendar?new=1" className="flex flex-col items-center justify-center gap-1"><span className="grid h-10 w-10 place-items-center -mt-4 rounded-full bg-[#6F3642] text-white shadow-[0_8px_20px_rgba(111,54,66,.25)]"><Plus size={21}/></span><span className="text-[7px] font-medium uppercase tracking-[0.12em] text-mocha">Nueva</span></Link>;const Icon=item.icon!;const active=pathname===item.href||pathname.startsWith((item.href||"")+"/");return <Link key={item.href} href={item.href!} className={`flex flex-col items-center justify-center gap-1 ${active?"text-mocha":"text-taupe"}`}><Icon size={19}/><span className="text-[7px] font-medium uppercase tracking-[0.12em]">{item.label}</span></Link>})}</div></nav>

    {moreOpen&&<div className="lg:hidden fixed inset-0 z-[80] bg-espresso/45 backdrop-blur-[2px]" onClick={()=>setMoreOpen(false)}>
      <aside className="relative h-full w-[86%] max-w-[360px] overflow-y-auto bg-[#FBF8F3] shadow-[24px_0_60px_rgba(52,38,31,.16)]" onClick={e=>e.stopPropagation()}>
        <div className="relative overflow-hidden border-b border-champagne/25 bg-[linear-gradient(145deg,#F5E9E0,#E6D2C4)] px-5 pb-6 pt-[calc(20px+env(safe-area-inset-top))]">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border-[20px] border-white/25"/>
          <div className="relative flex items-start justify-between gap-4">
            <div><Logo className="h-11 w-auto"/><p className="mt-5 text-[8px] uppercase tracking-[.24em] text-mocha">{isTeam?"Hub · Team":"Gloria Hub"}</p><h2 className="mt-1 font-serif text-[26px] leading-none">{isStaff?"Tu día, más simple.":"Beauty lives here."}</h2></div>
            <button onClick={()=>setMoreOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#8B6F60]/25 bg-white/55"><X size={19}/></button>
          </div>
        </div>

        <div className="p-4"><Link href="/hub/profile" onClick={()=>setMoreOpen(false)} className="mb-4 flex items-center gap-3 rounded-[17px] border border-champagne/25 bg-white/55 p-3"><span className="h-11 w-11 overflow-hidden rounded-full bg-[#EADDD4]">{identity.photo_url?<img src={identity.photo_url} alt={identity.name} className="h-full w-full object-cover"/>:<span className="grid h-full place-items-center font-serif text-[18px] text-mocha">{identity.name[0]}</span>}</span><span><span className="block text-[7px] uppercase tracking-[.16em] text-taupe">{greeting}</span><span className="mt-1 block font-serif text-[19px] text-mocha">{identity.name}</span></span></Link>
          <Link href="/hub/calendar?new=1" onClick={()=>setMoreOpen(false)} className="mb-4 flex items-center justify-between rounded-[16px] bg-[#6F3642] px-4 py-3.5 text-white shadow-[0_8px_22px_rgba(111,54,66,.18)]"><span className="flex items-center gap-3 text-[9px] uppercase tracking-[.14em]"><Plus size={16}/> Nueva cita</span><ChevronRight size={16}/></Link>

          <nav className="space-y-1">
            {nav.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link key={item.href} href={item.href} onClick={()=>setMoreOpen(false)} className={`flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-[9px] font-medium uppercase tracking-[0.13em] transition ${active?"bg-[#EEE2D8] text-[#4A352B]":"text-taupe hover:bg-white/70 hover:text-espresso"}`}><span className={`grid h-9 w-9 place-items-center rounded-full ${active?"bg-[#6F3642] text-white":"bg-[#F1E6DD] text-mocha"}`}><Icon size={16}/></span><span className="flex-1">{item.label}</span><ChevronRight size={14} className="opacity-45"/></Link>})}
          </nav>

          <div className="mt-4 border-t border-champagne/30 pt-4 space-y-1">
            <Link href="/hub/profile" onClick={()=>setMoreOpen(false)} className="flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-[11px] text-taupe hover:bg-white/70"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#F1E6DD] text-mocha"><UserRound size={16}/></span><span className="flex-1">Mi Perfil</span><ChevronRight size={14} className="opacity-45"/></Link>
            {isOwner&&<Link href="/hub/settings/appointments" onClick={()=>setMoreOpen(false)} className="flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-[11px] text-taupe hover:bg-white/70"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#F1E6DD] text-mocha"><Settings size={16}/></span><span className="flex-1">Configuración</span><ChevronRight size={14} className="opacity-45"/></Link>}
          </div>

          <button onClick={logout} className="mt-6 flex w-full items-center gap-3 rounded-[14px] border border-[#DCCFC5] px-4 py-3 text-[10px] text-taupe"><LogOut size={15}/> Cerrar sesión</button><p className="mt-6 px-3 font-serif text-[16px] italic text-mocha">Realza tu esencia, define tu estilo.</p>
        </div>
      </aside>
    </div>}
  </div>
}

function adminMobile(){return [{label:"Inicio",href:"/hub",icon:LayoutDashboard},{label:"Calendario",href:"/hub/calendar",icon:CalendarRange},{label:"Nueva",action:"new"},{label:"Clientas",href:"/hub/clients",icon:UsersRound},{label:"Más",action:"more"}]}
function staffMobile(){return [{label:"Inicio",href:"/hub/my-agenda",icon:LayoutDashboard},{label:"Calendario",href:"/hub/calendar",icon:CalendarRange},{label:"Nueva",action:"new"},{label:"Clientas",href:"/hub/clients",icon:UsersRound},{label:"Más",action:"more"}]}
function adminMore(){return [{label:"Solicitudes",href:"/hub/inquiries",icon:Inbox},{label:"Servicios",href:"/hub/services",icon:Scissors},{label:"Equipo",href:"/hub/team",icon:UserRound},{label:"Configuración",href:"/hub/settings/appointments",icon:Settings},{label:"Mi Perfil",href:"/hub/profile",icon:UserRound}]}
function staffMore(){return [{label:"Dashboard",href:"/hub/my-agenda",icon:LayoutDashboard},{label:"Solicitudes",href:"/hub/inquiries",icon:Inbox},{label:"Nueva cita",href:"/hub/calendar?new=1",icon:Plus},{label:"Mi Progreso",href:"/hub/progress",icon:TrendingUp},{label:"Mi Perfil",href:"/hub/profile",icon:UserRound}]}
