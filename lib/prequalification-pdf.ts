import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PrequalificationAnswers, scorePrequalification } from "@/lib/prequalification";
import type { CompanyResearch } from "@/lib/company-research";

const ink=rgb(0.07,0.06,0.06);
const pink=rgb(0.93,0,0.45);
const muted=rgb(0.42,0.4,0.4);
const paper=rgb(0.96,0.95,0.92);

export async function createPrequalificationPdf(answers:PrequalificationAnswers,research:CompanyResearch|null=null) {
  const result=scorePrequalification(answers);
  const pdf=await PDFDocument.create();
  pdf.setTitle(`Preclasificación ORCA - ${answers.company}`);
  pdf.setAuthor("ORCA");
  pdf.setSubject("Reporte de preclasificación y compatibilidad empresarial");
  const regular=await pdf.embedFont(StandardFonts.Helvetica);
  const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
  const width=595.28;
  const height=841.89;
  const margin=52;
  let page=pdf.addPage([width,height]);
  let y=height-margin;

  const addPage=()=>{page=pdf.addPage([width,height]);page.drawRectangle({x:0,y:0,width,height,color:paper});y=height-margin;header();};
  const header=()=>{
    page.drawText("ORCA",{x:margin,y,font:bold,size:22,color:pink});
    page.drawText("BUSINESS TRANSFORMATION",{x:width-margin-132,y:y+4,font:bold,size:7,color:muted});
    y-=38;
    page.drawLine({start:{x:margin,y},end:{x:width-margin,y},thickness:1,color:ink});
    y-=28;
  };
  const safe=(text:string)=>text.replace(/[→↗]/g,"-").replace(/\u2011/g,"-");
  const lines=(text:string,maxWidth:number,size:number,fontRef=regular)=>{
    const words=safe(text).split(/\s+/);const out:string[]=[];let line="";
    for(const word of words){const candidate=line?`${line} ${word}`:word;if(fontRef.widthOfTextAtSize(candidate,size)<=maxWidth)line=candidate;else{if(line)out.push(line);line=word;}}if(line)out.push(line);return out;
  };
  const text=(value:string,size=10,color=ink,fontRef=regular,indent=0,maxWidth=width-margin*2-indent)=>{
    const wrapped=lines(value,maxWidth,size,fontRef);for(const line of wrapped){if(y<70)addPage();page.drawText(line,{x:margin+indent,y,font:fontRef,size,color});y-=size*1.45;}return wrapped.length;
  };
  const label=(value:string)=>{if(y<95)addPage();page.drawText(safe(value.toUpperCase()),{x:margin,y,font:bold,size:7,color:pink});y-=17;};
  const row=(name:string,value:string|string[])=>{if(y<85)addPage();page.drawText(safe(name),{x:margin,y,font:bold,size:8.5,color:muted});const joined=Array.isArray(value)?value.join(", "):value;text(joined||"No informado",10,ink,regular,165,width-margin-165);y-=9;page.drawLine({start:{x:margin,y},end:{x:width-margin,y},thickness:.4,color:rgb(.75,.73,.7)});y-=16;};

  page.drawRectangle({x:0,y:0,width,height,color:paper});
  header();
  page.drawText("REPORTE DE PRECLASIFICACION",{x:margin,y,font:bold,size:30,color:ink});y-=36;
  page.drawText("Y COMPATIBILIDAD EMPRESARIAL",{x:margin,y,font:bold,size:30,color:ink});y-=54;
  label("Empresa");text(answers.company,24,ink,bold);y-=10;
  page.drawRectangle({x:margin,y:y-64,width:width-margin*2,height:64,color:ink});
  page.drawText("COMPATIBILIDAD ORCA",{x:margin+18,y:y-20,font:bold,size:7,color:paper});
  page.drawText(safe(result.compatibility.toUpperCase()),{x:margin+18,y:y-48,font:bold,size:23,color:pink});
  page.drawText(`${result.total}/100`,{x:width-margin-72,y:y-43,font:bold,size:15,color:paper});y-=94;
  label("Clasificación preliminar");text(result.companyClass,18,ink,bold);y-=20;
  label("Lectura inicial");
  text(result.compatibility==="Alta"?"La empresa presenta condiciones favorables para iniciar un proceso de transformación: escala, compromiso y capacidad de implementación.":result.compatibility==="Potencial"?"La empresa presenta características interesantes, aunque es necesario comprender mejor algunas condiciones antes de avanzar.":"La empresa está construyendo las condiciones necesarias para una futura etapa de transformación.",12,ink,regular);y-=22;
  label("Señales positivas");for(const item of (result.positives.length?result.positives:["Existe intención de comprender la siguiente etapa de la empresa."]))text(`- ${item}`,10,ink,regular,8);y-=18;
  label("Áreas por comprender");for(const item of (result.gaps.length?result.gaps:["Profundizar en la operación y sus prioridades estratégicas."]))text(`- ${item}`,10,ink,regular,8);

  addPage();
  label("Datos de contacto");row("Empresa",answers.company);row("Contacto",answers.contact);row("Correo",answers.email);row("WhatsApp",answers.whatsapp);row("Website",answers.website||"No informado");row("Cómo conoció ORCA",answers.source);row("Años operando",answers.years);row("Canales",answers.channels);
  label("Escala empresarial");row("Facturación mensual",answers.revenue);row("Personas",answers.employees);row("Costo mensual de personal",answers.payroll);
  label("Madurez y necesidad");row("Herramientas actuales",answers.tools);row("Reto principal",answers.challenge);
  label("Preparación");row("Decisión y urgencia",answers.urgency);row("Participación directiva",answers.leadership);row("Capacidad de inversión",answers.investment);
  if(research){
    addPage();
    label("Investigación pública asistida por IA");text("Este análisis combina fuentes públicas con inferencias de IA. Debe validarse antes de tomar decisiones.",9,muted);y-=16;
    label("Resumen ejecutivo");text(research.summary,11);y-=14;
    label("Industria y actividad");text(research.industry,10);y-=14;
    label("Presencia digital observada");text(research.digitalPresence,10);y-=14;
    label("Oportunidades detectadas");for(const item of research.opportunities)text(`- ${item}`,9.5,ink,regular,8);y-=12;
    label("Riesgos y puntos por validar");for(const item of research.risks)text(`- ${item}`,9.5,ink,regular,8);y-=12;
    label("Recomendaciones ORCA");for(const item of research.recommendations)text(`- ${item}`,9.5,ink,regular,8);y-=12;
    if(research.sources.length){label("Fuentes públicas consultadas");for(const [index,source] of research.sources.entries())text(`${index+1}. ${source.title} - ${source.url}`,7.5,muted,regular,6);}
  }
  page.drawText("Lectura preliminar. No constituye un diagnóstico definitivo ni sustituye la fase Understand del método UTS.",{x:margin,y:50,font:regular,size:6.5,color:muted});
  const pages=pdf.getPages();pages.forEach((current,index)=>{current.drawText(`ORCA / CONFIDENCIAL / ${index+1} DE ${pages.length}`,{x:margin,y:28,font:bold,size:6.5,color:muted});});
  return {bytes:await pdf.save(),result};
}
