"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, CalendarRange, LayoutDashboard, Menu, MessageCircle, PackageCheck, Scissors, Settings, ShoppingBag, Sparkles, TrendingUp, UserRound, UsersRound, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

type HubUser={role:"owner"|"admin"|"staff";staff_id:string|null};
type NavItem={label:string;href:string;icon:any;audience:"all"|"admin"|"staff"};
const nav:NavItem[]=[
  {label:"Dashboard",href:"/hub",icon:LayoutDashboard,audience:"admin"},
  {label:"My Agenda",href:"/hub/my-agenda",icon:CalendarDays,audience:"staff"},
  {label:"Appointments",href:"/hub/appointments",icon:CalendarDays,audience:"admin"},
  {label:"Calendar",href:"/hub/calendar",icon:CalendarRange,audience:"admin"},
  {label:"Clients",href:"/hub/clients",icon:UsersRound,audience:"all"},
  {label:"My Progress",href:"/hub/progress",icon:TrendingUp,audience:"staff"},
  {label:"Messages",href:"/hub/messages",icon:MessageCircle,audience:"all"},
  {label:"Beauty Intelligence",href:"/hub/intelligence",icon:Sparkles,audience:"admin"},
  {label:"Team",href:"/hub/team",icon:UserRound,audience:"admin"},
  {label:"Services",href:"/hub/services",icon:Scissors,audience:"admin"},
  {label:"Products",href:"/hub/products",icon:ShoppingBag,audience:"admin"},
  {label:"Orders",href:"/hub/orders",icon:PackageCheck,audience:"admin"},
  {label:"Settings",href:"/hub/settings/appointments",icon:Settings,audience:"admin"},
];

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
    setUser(data as HubUser);setLoading(false);
  })()},[]);

  if(loading)return <div className="min-h-screen bg-ivory flex items-center justify-center"><div className="text-center"><Logo className="h-20 w-auto mx-auto"/><p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-taupe">Opening Gloria Hub</p></div></div>;
  if(!user)return null;
  const isStaff=user.role==="staff";
  const visibleNav=nav.filter(item=>item.audience==="all"||(isStaff?item.audience==="staff":item.audience==="admin"));

  return <div className="min-h-screen bg-ivory text-espresso md:grid md:grid-cols-[250px_1fr]">
    <aside className="hidden md:flex min-h-screen border-r border-champagne/25 bg-white/35 px-5 py-6 flex-col sticky top-0 h-screen">
      <Logo className="h-16 w-auto self-start"/>
      <div className="mt-6"><p className="text-[9px] uppercase tracking-[0.28em] text-mocha">{isStaff?"Gloria Team":"Gloria Hub"}</p><p className="mt-2 font-serif text-[23px] leading-none">{isStaff?"Your day, beautifully organized.":"Business, beautifully organized."}</p></div>
      <nav className="mt-6 space-y-0.5 overflow-y-auto pr-1">{visibleNav.map(item=>{const Icon=item.icon;const active=pathname===item.href||pathname.startsWith(item.href+"/");return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] ${active?"bg-espresso text-ivory":"text-taupe hover:bg-white/55 hover:text-espresso"}`}><Icon size={17} strokeWidth={1.5}/>{item.label}</Link>})}</nav>
      <div className="mt-auto border-t border-champagne/25 pt-4"><p className="text-[9px] uppercase tracking-[0.2em] text-taupe">Signed in as</p><p className="mt-1 text-[12px] capitalize">{user.role}</p></div>
    </aside>

    <div className="min-w-0">
      <header className="md:hidden sticky top-0 z-40 h-[72px] border-b border-champagne/25 bg-ivory/95 px-5 flex items-center justify-between backdrop-blur-md"><Logo className="h-12 w-auto"/><div className="text-center"><p className="font-serif text-[18px] leading-none">{isStaff?"Team":"Hub"}</p></div><button onClick={()=>setOpen(v=>!v)} aria-label="Open menu">{open?<X size={25}/>:<Menu size={27}/>}</button></header>
      {open&&<div className="md:hidden fixed inset-0 top-[72px] z-50 bg-espresso/40" onClick={()=>setOpen(false)}><div className="w-[86%] max-w-[360px] h-full bg-ivory p-5 overflow-y-auto" onClick={e=>e.stopPropagation()}><p className="text-[9px] uppercase tracking-[0.25em] text-mocha">{isStaff?"Gloria Team":"Gloria Hub"}</p><nav className="mt-4">{visibleNav.map(item=>{const Icon=item.icon;return <Link onClick={()=>setOpen(false)} key={item.href} href={item.href} className="flex items-center gap-3 border-b border-champagne/20 py-3.5 text-[13px]"><Icon size={17}/>{item.label}</Link>})}</nav></div></div>}
      <main className="px-5 md:px-8 lg:px-10 py-8 md:py-10 max-w-[1500px] mx-auto">{children}</main>
    </div>
  </div>
}
