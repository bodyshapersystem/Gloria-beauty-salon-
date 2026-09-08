import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { teamWelcomeEmail } from "@/lib/emails/templates/team-welcome";
import { sendMail } from "@/lib/emails/send";

const SUPABASE_URL = "https://ferznukzbfvzhjefcrye.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_iaAU9rgEtv0CaQCmOwuLgQ_rTNOY3-5";

function escapeHtml(input:string){return input.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}

export async function POST(req:NextRequest){
  try{
    const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
    if(!token)return NextResponse.json({ok:false,error:"unauthorized"},{status:401});

    const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{global:{headers:{Authorization:`Bearer ${token}`}}});
    const body=await req.json();
    const staffId=String(body?.staffId||"");
    if(!staffId)return NextResponse.json({ok:false,error:"missing_staff"},{status:400});

    const {data,error}=await supabase.rpc("hub_create_team_invitation",{p_staff_id:staffId});
    if(error)return NextResponse.json({ok:false,error:error.message},{status:403});
    const invite=Array.isArray(data)?data[0]:data;
    if(!invite?.token||!invite?.email)return NextResponse.json({ok:false,error:"invite_failed"},{status:400});

    const activateUrl=`https://www.gloriabeautysalonmiami.com/team/activate?token=${encodeURIComponent(invite.token)}`;
    const html=teamWelcomeEmail({staffName:escapeHtml(String(invite.staff_name||"Team")).slice(0,100),activateUrl});
    const sent=await sendMail({to:String(invite.email),subject:"Bienvenida al Gloria Team ✨",html});
    return NextResponse.json(sent);
  }catch(err){
    console.error("send-team-invite error",err);
    return NextResponse.json({ok:false,error:"exception"},{status:500});
  }
}
