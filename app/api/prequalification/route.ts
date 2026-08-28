import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createPrequalificationPdf } from "@/lib/prequalification-pdf";
import { isPrequalificationAnswers } from "@/lib/prequalification";

export const runtime="nodejs";

export async function POST(request:Request) {
  try {
    const answers:unknown=await request.json();
    if(!isPrequalificationAnswers(answers)) return NextResponse.json({error:"Datos incompletos"},{status:400});
    const {bytes,result}=await createPrequalificationPdf(answers);
    const isPreview=process.env.NODE_ENV!=="production"&&new URL(request.url).searchParams.get("preview")==="1";
    if(isPreview) return new Response(Buffer.from(bytes),{headers:{"Content-Type":"application/pdf","Content-Disposition":`inline; filename="orca-${slug(answers.company)}.pdf"`}});
    const apiKey=process.env.RESEND_API_KEY;
    if(!apiKey) return NextResponse.json({error:"El servicio de correo aún no está configurado"},{status:503});
    const resend=new Resend(apiKey);
    const recipient=process.env.ORCA_LEADS_EMAIL??"or-kk@outlook.com";
    const sendingDomain=process.env.RESEND_EMAIL_DOMAIN??"or-k.co";
    const from=process.env.RESEND_FROM_EMAIL??`ORCA <formularios@${sendingDomain}>`;
    const {data,error}=await resend.emails.send({
      from,
      to:[recipient],
      replyTo:answers.email,
      subject:`Preclasificación ORCA: ${answers.company} - ${result.compatibility}`,
      html:`<div style="font-family:Arial,sans-serif;color:#111;max-width:620px"><p style="color:#ec007c;font-size:12px;letter-spacing:.12em">NUEVA PRECLASIFICACIÓN ORCA</p><h1>${escapeHtml(answers.company)}</h1><p><strong>Compatibilidad:</strong> ${result.compatibility} (${result.total}/100)</p><p><strong>Clasificación:</strong> ${result.companyClass}</p><p><strong>Contacto:</strong> ${escapeHtml(answers.contact)} · ${escapeHtml(answers.email)}</p><p><strong>WhatsApp:</strong> ${escapeHtml(answers.whatsapp)}</p><p>El reporte completo está adjunto en PDF.</p></div>`,
      attachments:[{filename:`orca-preclasificacion-${slug(answers.company)}.pdf`,content:Buffer.from(bytes)}],
    });
    if(error) return NextResponse.json({error:"No fue posible enviar el reporte"},{status:502});
    return NextResponse.json({ok:true,id:data?.id});
  } catch {
    return NextResponse.json({error:"No fue posible procesar el formulario"},{status:500});
  }
}

function slug(value:string){return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"empresa";}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]??char));}
