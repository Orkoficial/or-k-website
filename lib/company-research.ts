import "server-only";

import type { PrequalificationAnswers } from "@/lib/prequalification";

export type CompanyResearch = {
  summary: string;
  industry: string;
  digitalPresence: string;
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  sources: {title:string;url:string}[];
};

type OpenAIResponse = {
  output?: Array<{
    type?: string;
    action?: {sources?: Array<{title?:string;url?:string}>};
    content?: Array<{type?:string;text?:string}>;
  }>;
};

export async function researchCompany(answers:PrequalificationAnswers):Promise<CompanyResearch|null> {
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey) return null;
  const response=await fetch("https://api.openai.com/v1/responses",{
    method:"POST",
    headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json"},
    body:JSON.stringify({
      model:process.env.OPENAI_RESEARCH_MODEL??"gpt-5.4-mini",
      store:false,
      tools:[{type:"web_search",search_context_size:"medium"}],
      include:["web_search_call.action.sources"],
      input:`Investiga únicamente información pública y verificable sobre esta empresa. Distingue claramente hechos encontrados de inferencias. Confirma la identidad comparando razón social, ubicación, dominio, NIT y LinkedIn. Si no puedes identificarla con seguridad, dilo y evita atribuirle datos de organizaciones homónimas.\n\nNombre comercial: ${answers.company}\nRazón social: ${answers.legalName}\nNIT: ${answers.taxId||"No informado"}\nPaís y ciudad: ${answers.location}\nSitio web declarado: ${answers.website||"No informado"}\nLinkedIn declarado: ${answers.linkedin||"No informado"}\nAños operando: ${answers.years}\nCanales declarados: ${answers.channels.join(", ")}\nHerramientas declaradas: ${answers.tools.join(", ")}\nRetos declarados: ${answers.challenge.join(", ")}\nEscala declarada: ${answers.employees} personas; facturación ${answers.revenue}.\n\nEntrega un análisis ejecutivo breve en español para una consultora de transformación empresarial.`,
      text:{format:{
        type:"json_schema",
        name:"company_research",
        strict:true,
        schema:{
          type:"object",
          additionalProperties:false,
          properties:{
            summary:{type:"string"},
            industry:{type:"string"},
            digitalPresence:{type:"string"},
            opportunities:{type:"array",items:{type:"string"},maxItems:4},
            risks:{type:"array",items:{type:"string"},maxItems:4},
            recommendations:{type:"array",items:{type:"string"},maxItems:4},
          },
          required:["summary","industry","digitalPresence","opportunities","risks","recommendations"],
        },
      }},
    }),
    signal:AbortSignal.timeout(45000),
  });
  if(!response.ok) throw new Error(`OpenAI research failed: ${response.status}`);
  const body=await response.json() as OpenAIResponse;
  const outputText=body.output?.flatMap(item=>item.content??[]).find(item=>item.type==="output_text")?.text;
  if(!outputText) throw new Error("OpenAI research returned no structured output");
  const parsed=JSON.parse(outputText) as Omit<CompanyResearch,"sources">;
  const sources=body.output?.flatMap(item=>item.action?.sources??[])
    .filter((source):source is {title:string;url:string}=>Boolean(source.title&&source.url))??[];
  const uniqueSources=Array.from(new Map(sources.map(source=>[source.url,source])).values()).slice(0,8);
  return {...parsed,sources:uniqueSources};
}
