"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, HelpCircle, LockKeyhole, MapPin, Package, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";

type Staff={id:string;name:string};
type Address={id:string;full_name:string;address_line1:string;address_line2:string|null;city:string;state:string;postal_code:string;country:string;is_default:boolean};
type ProfileForm={first_name:string;last_name:string;phone:string;whatsapp:string;birthday:string;preferred_language:string;preferred_professional_id:string;preferred_appointment_time:string;preferred_contact_method:string;beauty_intelligence_enabled:boolean;partner_recommendations_enabled:boolean;rebooking_emails_enabled:boolean;product_recommendations_enabled:boolean;birthday_emails_enabled:boolean;salon_updates_enabled:boolean};
type AddressForm={full_name:string;address_line1:string;address_line2:string;city:string;state:string;postal_code:string;country:string};

const blankAddress:AddressForm={full_name:"",address_line1:"",address_line2:"",city:"",state:"",postal_code:"",country:"US"};
const blankForm:ProfileForm={first_name:"",last_name:"",phone:"",whatsapp:"",birthday:"",preferred_language:"es",preferred_professional_id:"",preferred_appointment_time:"no_preference",preferred_contact_method:"email",beauty_intelligence_enabled:true,partner_recommendations_enabled:false,rebooking_emails_enabled:true,product_recommendations_enabled:true,birthday_emails_enabled:true,salon_updates_enabled:false};

export default function AccessProfilePage(){
  const {profile,refreshProfile}=useAccess();
  const router=useRouter();
  const [staff,setStaff]=useState<Staff[]>([]);
  const [addresses,setAddresses]=useState<Address[]>([]);
  const [ordersCount,setOrdersCount]=useState(0);
  const [favoritesCount,setFavoritesCount]=useState(0);
  const [nextAppointment,setNextAppointment]=useState<string|null>(null);
  const [form,setForm]=useState<ProfileForm>(blankForm);
  const [addressForm,setAddressForm]=useState<AddressForm>(blankAddress);
  const [addressOpen,setAddressOpen]=useState(false);
  const [editingAddressId,setEditingAddressId]=useState<string|null>(null);
  const [emailChange,setEmailChange]=useState("");
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState<string|null>(null);
  const [securityMessage,setSecurityMessage]=useState<string|null>(null);

  useEffect(()=>{
    if(!profile)return;
    setForm({first_name:profile.first_name||"",last_name:profile.last_name||"",phone:profile.phone||"",whatsapp:profile.whatsapp||profile.phone||"",birthday:profile.birthday||"",preferred_language:profile.preferred_language||"es",preferred_professional_id:profile.preferred_professional_id||"",preferred_appointment_time:profile.preferred_appointment_time||"no_preference",preferred_contact_method:profile.preferred_contact_method||"email",beauty_intelligence_enabled:profile.beauty_intelligence_enabled,partner_recommendations_enabled:profile.partner_recommendations_enabled,rebooking_emails_enabled:profile.rebooking_emails_enabled,product_recommendations_enabled:profile.product_recommendations_enabled,birthday_emails_enabled:profile.birthday_emails_enabled,salon_updates_enabled:profile.salon_updates_enabled});
    setEmailChange(profile.email||"");
    const clientId=profile.id;
    (async()=>{
      const [{data:staffData},{data:addressData},{count:orders},{count:favorites},{data:appt}]=await Promise.all([
        supabase.from("staff").select("id,name").eq("active",true).order("name"),
        supabase.from("client_addresses").select("id,full_name,address_line1,address_line2,city,state,postal_code,country,is_default").eq("client_id",clientId).order("is_default",{ascending:false}),
        supabase.from("orders").select("id",{count:"exact",head:true}).eq("client_id",clientId),
        supabase.from("client_favorites").select("id",{count:"exact",head:true}).eq("client_id",clientId),
        supabase.from("appointments").select("start_at").eq("client_id",clientId).in("status",["confirmed","pending"]).gte("start_at",new Date().toISOString()).order("start_at").limit(1).maybeSingle(),
      ]);
      setStaff(((staffData as unknown) as Staff[])||[]);
      setAddresses(((addressData as unknown) as Address[])||[]);
      setOrdersCount(orders||0);setFavoritesCount(favorites||0);setNextAppointment(appt?.start_at||null);
    })();
  },[profile?.id]);

  const memberSince=useMemo(()=>profile?new Date(profile.created_at).toLocaleDateString("en-US",{month:"long",year:"numeric"}):"",[profile?.created_at]);
  if(!profile)return null;
  const currentProfile=profile;
  const setField=<K extends keyof ProfileForm>(key:K,value:ProfileForm[K])=>setForm(v=>({...v,[key]:value}));

  async function save(e:FormEvent){e.preventDefault();setSaving(true);setMessage(null);const {error}=await supabase.from("client_profiles").update({first_name:form.first_name,last_name:form.last_name,phone:form.phone||null,whatsapp:form.whatsapp||null,birthday:form.birthday||null,preferred_language:form.preferred_language,preferred_professional_id:form.preferred_professional_id||null,preferred_appointment_time:form.preferred_appointment_time,preferred_contact_method:form.preferred_contact_method,beauty_intelligence_enabled:form.beauty_intelligence_enabled,partner_recommendations_enabled:form.partner_recommendations_enabled,rebooking_emails_enabled:form.rebooking_emails_enabled,product_recommendations_enabled:form.product_recommendations_enabled,birthday_emails_enabled:form.birthday_emails_enabled,salon_updates_enabled:form.salon_updates_enabled}).eq("id",currentProfile.id);setSaving(false);setMessage(error?"No pudimos guardar los cambios.":"Tus cambios fueron guardados.");if(!error)await refreshProfile()}
  async function requestEmailChange(){if(!emailChange||emailChange===currentProfile.email)return;const {error}=await supabase.auth.updateUser({email:emailChange});setSecurityMessage(error?"No pudimos iniciar el cambio de email.":"Revisa tu email para confirmar el cambio.")}
  async function sendPasswordReset(){if(!currentProfile.email)return;const {error}=await supabase.auth.resetPasswordForEmail(currentProfile.email,{redirectTo:`${window.location.origin}/access/login`});setSecurityMessage(error?"No pudimos enviar el enlace.":"Te enviamos un enlace seguro para cambiar tu contraseña.")}
  async function saveAddress(e:FormEvent){e.preventDefault();if(editingAddressId){const {data,error}=await supabase.from("client_addresses").update(addressForm).eq("id",editingAddressId).select("id,full_name,address_line1,address_line2,city,state,postal_code,country,is_default").single();if(!error&&data)setAddresses(v=>v.map(a=>a.id===editingAddressId?data as Address:a))}else{const {data,error}=await supabase.from("client_addresses").insert({client_id:currentProfile.id,...addressForm,is_default:addresses.length===0}).select("id,full_name,address_line1,address_line2,city,state,postal_code,country,is_default").single();if(!error&&data)setAddresses(v=>[...v,data as Address])}setAddressOpen(false);setEditingAddressId(null);setAddressForm(blankAddress)}
  async function setDefaultAddress(id:string){const {error}=await supabase.rpc("set_default_client_address",{p_address_id:id});if(!error)setAddresses(v=>v.map(a=>({...a,is_default:a.id===id})).sort((a,b)=>Number(b.is_default)-Number(a.is_default)))}
  async function deleteAddress(id:string){const {error}=await supabase.from("client_addresses").delete().eq("id",id);if(!error)setAddresses(v=>v.filter(a=>a.id!==id))}
  async function requestDeletion(){const {error}=await supabase.from("client_deletion_requests").insert({client_id:currentProfile.id,status:"requested"});setSecurityMessage(error?"Ya existe una solicitud activa o no pudimos crearla.":"Recibimos tu solicitud para revisión.")}
  async function logout(){await supabase.auth.signOut();router.replace("/")}

  return <div className="pb-10">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"><div><p className="text-[10px] uppercase tracking-[0.3em] text-mocha">Gloria Access</p><h1 className="mt-2 font-serif text-[44px] md:text-[60px] leading-none">Your Profile</h1><p className="mt-3 text-[14px] text-taupe">Tu información, tus preferencias y tu experiencia Gloria.</p></div><div className="flex items-center gap-3 rounded-full border border-champagne/35 bg-white/40 px-4 py-3"><div className="h-10 w-10 rounded-full bg-blush flex items-center justify-center font-serif text-[20px] text-mocha">{currentProfile.first_name?.[0]||"G"}</div><div><p className="text-[13px]">{currentProfile.first_name} {currentProfile.last_name}</p><p className="text-[10px] text-taupe">Member since {memberSince}</p></div></div></div>

    <div className="mt-8 grid gap-3 md:grid-cols-3"><Quick href="/access/appointments" icon={<CalendarDays size={19}/>} title="Next Appointment" value={nextAppointment?new Date(nextAppointment).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"No upcoming appointments"}/><Quick href="/access/beauty-profile" icon={<Sparkles size={19}/>} title="My Beauty Profile" value="Your looks, preferences and beauty history"/><Quick href="/access/shop" icon={<Package size={19}/>} title="My Beauty Shelf" value={`${ordersCount} orders · ${favoritesCount} favorites`}/></div>

    <form onSubmit={save} className="mt-8 space-y-6">
      <Section title="Personal Information" icon={<UserRound size={18}/>}><div className="grid sm:grid-cols-2 gap-4"><Field label="First name" value={form.first_name} onChange={v=>setField("first_name",v)}/><Field label="Last name" value={form.last_name} onChange={v=>setField("last_name",v)}/><Field label="Birthday" type="date" value={form.birthday} onChange={v=>setField("birthday",v)}/><Select label="Preferred language" value={form.preferred_language} onChange={v=>setField("preferred_language",v)} options={[["es","Español"],["en","English"]]}/></div></Section>
      <Section title="Contact & Communication" icon={<HelpCircle size={18}/>}><div className="grid sm:grid-cols-2 gap-4"><Field label="Email" value={currentProfile.email||""} disabled/><Field label="Mobile phone" value={form.phone} onChange={v=>setField("phone",v)}/><Field label="WhatsApp" value={form.whatsapp} onChange={v=>setField("whatsapp",v)}/><Select label="Preferred contact" value={form.preferred_contact_method} onChange={v=>setField("preferred_contact_method",v)} options={[["email","Email"],["phone","Phone"],["whatsapp","WhatsApp"]]}/></div><div className="mt-5 grid md:grid-cols-2 gap-x-8"><Toggle label="Rebooking reminders" value={form.rebooking_emails_enabled} onChange={v=>setField("rebooking_emails_enabled",v)}/><Toggle label="Product recommendations" value={form.product_recommendations_enabled} onChange={v=>setField("product_recommendations_enabled",v)}/><Toggle label="Birthday emails" value={form.birthday_emails_enabled} onChange={v=>setField("birthday_emails_enabled",v)}/><Toggle label="Salon updates" value={form.salon_updates_enabled} onChange={v=>setField("salon_updates_enabled",v)}/></div></Section>
      <Section title="My Preferences" icon={<Sparkles size={18}/>}><div className="grid sm:grid-cols-2 gap-4"><Select label="Preferred professional" value={form.preferred_professional_id} onChange={v=>setField("preferred_professional_id",v)} options={[["","No preference"],...staff.map(s=>[s.id,s.name])]}/><Select label="Preferred appointment time" value={form.preferred_appointment_time} onChange={v=>setField("preferred_appointment_time",v)} options={[["morning","Morning"],["afternoon","Afternoon"],["no_preference","No preference"]]}/></div><div className="mt-5 grid md:grid-cols-2 gap-x-8"><Toggle label="Personalized recommendations" value={form.beauty_intelligence_enabled} onChange={v=>setField("beauty_intelligence_enabled",v)}/><Toggle label="Partner recommendations" value={form.partner_recommendations_enabled} onChange={v=>setField("partner_recommendations_enabled",v)}/></div></Section>
      <div className="flex items-center gap-4"><button disabled={saving} className="rounded-full bg-espresso px-7 py-3.5 text-[10px] uppercase tracking-[0.18em] text-ivory disabled:opacity-50">{saving?"Saving...":"Save changes"}</button>{message&&<p className="text-[12px] text-mocha">{message}</p>}</div>
    </form>

    <Section title="Saved Addresses" icon={<MapPin size={18}/>} className="mt-8">{addresses.length===0?<p className="text-[12px] text-taupe">Add an address for faster checkout.</p>:<div className="space-y-4">{addresses.map(a=><div key={a.id} className="flex justify-between gap-4 border-b border-champagne/20 pb-4"><div><p className="text-[13px] font-medium">{a.full_name}{a.is_default?" · Default":""}</p><p className="mt-1 text-[11px] text-taupe">{a.address_line1}{a.address_line2?`, ${a.address_line2}`:""}<br/>{a.city}, {a.state} {a.postal_code}</p></div><div className="flex flex-wrap justify-end gap-3 text-[9px] uppercase text-mocha"><button onClick={()=>{setEditingAddressId(a.id);setAddressForm({full_name:a.full_name,address_line1:a.address_line1,address_line2:a.address_line2||"",city:a.city,state:a.state,postal_code:a.postal_code,country:a.country});setAddressOpen(true)}}>Edit</button>{!a.is_default&&<button onClick={()=>setDefaultAddress(a.id)}>Default</button>}<button onClick={()=>deleteAddress(a.id)}>Delete</button></div></div>)}</div>}<button onClick={()=>{setEditingAddressId(null);setAddressForm(blankAddress);setAddressOpen(v=>!v)}} className="mt-5 text-[10px] uppercase tracking-[0.15em] text-mocha">{addressOpen?"Cancel":"+ Add address"}</button>{addressOpen&&<form onSubmit={saveAddress} className="mt-5 grid sm:grid-cols-2 gap-4"><Field label="Full name" value={addressForm.full_name} onChange={v=>setAddressForm(f=>({...f,full_name:v}))}/><Field label="Address line 1" value={addressForm.address_line1} onChange={v=>setAddressForm(f=>({...f,address_line1:v}))}/><Field label="Address line 2" value={addressForm.address_line2} onChange={v=>setAddressForm(f=>({...f,address_line2:v}))}/><Field label="City" value={addressForm.city} onChange={v=>setAddressForm(f=>({...f,city:v}))}/><Field label="State" value={addressForm.state} onChange={v=>setAddressForm(f=>({...f,state:v}))}/><Field label="ZIP" value={addressForm.postal_code} onChange={v=>setAddressForm(f=>({...f,postal_code:v}))}/><button className="sm:col-span-2 rounded-full bg-espresso px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-ivory">Save address</button></form>}</Section>

    <Section title="Login & Security" icon={<LockKeyhole size={18}/>} className="mt-6"><div className="grid md:grid-cols-2 gap-4"><div><Field label="Change email" value={emailChange} onChange={setEmailChange}/><button onClick={requestEmailChange} className="mt-3 text-[10px] uppercase tracking-[0.14em] text-mocha">Verify new email</button></div><div><p className="text-[11px] text-taupe">Password values are never displayed.</p><button onClick={sendPasswordReset} className="mt-3 text-[10px] uppercase tracking-[0.14em] text-mocha">Send password reset</button></div></div>{securityMessage&&<p className="mt-4 text-[12px] text-mocha">{securityMessage}</p>}</Section>

    <Section title="Privacy" icon={<ShieldCheck size={18}/>} className="mt-6"><p className="text-[12px] leading-relaxed text-taupe">Operational appointment history remains part of salon records. Turning off personalized recommendations stops client-facing personalization; it does not automatically delete historical records or send data to partners.</p><button onClick={requestDeletion} className="mt-4 text-[10px] uppercase tracking-[0.14em] text-mocha">Request account deletion</button></Section>

    <Section title="Need Help?" icon={<HelpCircle size={18}/>} className="mt-6"><div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.12em] text-mocha"><a href="https://wa.me/13057815456" target="_blank" rel="noreferrer">WhatsApp</a><a href="tel:+13057815456">Call Salon</a><a href="https://maps.google.com/?q=1130+SW+8th+St+Miami+FL+33130" target="_blank" rel="noreferrer">View Location</a><a href="https://www.instagram.com/gloriabeautysalon_/" target="_blank" rel="noreferrer">Instagram</a></div><p className="mt-4 text-[11px] text-taupe">1130 SW 8th St, Miami, FL 33130 · Tuesday–Saturday · 9:00 AM–5:00 PM</p></Section>

    <button onClick={logout} className="mt-8 text-[10px] uppercase tracking-[0.16em] text-mocha">Log out</button>
  </div>
}

function Section({title,icon,children,className=""}:{title:string;icon:React.ReactNode;children:React.ReactNode;className?:string}){return <section className={`${className} rounded-[24px] border border-champagne/30 bg-white/40 p-6 md:p-7`}><div className="flex items-center gap-3 text-mocha">{icon}<h2 className="font-serif text-[28px] leading-none">{title}</h2></div><div className="mt-5">{children}</div></section>}
function Field({label,value,onChange,type="text",disabled=false}:{label:string;value:string;onChange?:(v:string)=>void;type?:string;disabled?:boolean}){return <label><span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-taupe">{label}</span><input type={type} value={value} disabled={disabled} onChange={e=>onChange?.(e.target.value)} className="w-full rounded-xl border border-champagne/35 bg-ivory px-4 py-3 text-[13px] disabled:opacity-60"/></label>}
function Select({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[][]}){return <label><span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-taupe">{label}</span><select value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-champagne/35 bg-ivory px-4 py-3 text-[13px]">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>}
function Toggle({label,value,onChange}:{label:string;value:boolean;onChange:(v:boolean)=>void}){return <label className="flex items-center justify-between gap-4 border-b border-champagne/20 py-3"><span className="text-[12px]">{label}</span><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)} className="h-5 w-5"/></label>}
function Quick({href,icon,title,value}:{href:string;icon:React.ReactNode;title:string;value:string}){return <Link href={href} className="rounded-[20px] border border-champagne/30 bg-white/40 p-5"><div className="text-mocha">{icon}</div><p className="mt-4 text-[9px] uppercase tracking-[0.17em] text-taupe">{title}</p><p className="mt-2 font-serif text-[23px] leading-tight">{value}</p></Link>}
