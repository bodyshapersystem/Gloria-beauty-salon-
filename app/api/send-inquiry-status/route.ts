import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { emailShell, heading, greeting, paragraph, detailsCard, button } from "@/lib/emails/base";
import { sendMail } from "@/lib/emails/send";

const SUPABASE_URL="https://ferznukzbfvzhjefcrye.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_iaAU9rgEtv0CaQCmOwuLgQ_rTNOY3-5";

export async function POST(req:NextRequest){
  try{
    const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
    if(!token)return NextResponse.json({ok:false,error:"unauthorized"},{status:401});
    const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{global:{headers:{Authorization:`Bearer ${token}`}}});
    const {inquiryId}=await req.json();
    const {data,error}=await supabase.from("booking_inquiries").select("id,client_name,client_email,preferred_date,preferred_time,status,service:service_id(name),staff:staff_id(name)").eq("id",inquiryId).single();
    if(error||!data?.client_email)return NextResponse.json({ok:true,skipped:"no_email"});
    const service=Array.isArray(data.service)?data.service[0]:data.service;
    const staff=Array.isArray(data.staff)?data.staff[0]:data.staff;
    const approved=data.status==="approved";
    const body=`${heading(approved?"Tu solicitud fue":"Sobre tu solicitud",approved?"aprobada ✨":"de cita")}${greeting(String(data.client_name))}${paragraph(approved?"Nuestro team revisó tu solicitud y podemos continuar con tu cita. Si necesitamos ajustar la hora exacta, te contactaremos directamente.":"Gracias por pensar en Gloria Beauty Salon. En esta ocasión no pudimos confirmar la disponibilidad solicitada. Puedes enviarnos una nueva solicitud con otra fecha o escribirnos para encontrar otra opción.")}${detailsCard([{label:"Servicio",value:String(service?.name||"Servicio")},{label:"Profesional",value:String(staff?.name||"Primera disponible")},{label:"Fecha preferida",value:String(data.preferred_date||"Por coordinar")},{label:"Hora",value:String(data.preferred_time||"Por coordinar")}])}${button("Ver reservas","https://www.gloriabeautysalonmiami.com/reservar")}`;
    const html=emailShell({preheaderLabel:approved?"SOLICITUD APROBADA":"ACTUALIZACIÓN DE SOLICITUD",bodyHtml:body});
    return NextResponse.json(await sendMail({to:String(data.client_email),subject:approved?"Tu solicitud en Gloria Beauty Salon fue aprobada ✨":"Actualización de tu solicitud en Gloria Beauty Salon",html}));
  }catch(e){console.error(e);return NextResponse.json({ok:false,error:"exception"},{status:500});}
}
