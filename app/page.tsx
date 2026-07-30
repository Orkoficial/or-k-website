"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  {title:"Estrategia de negocio",desc:"Diagnóstico, modelos y decisiones que convierten oportunidades en ventajas competitivas.",media:"/assets/ork-service-strategy-v1.png"},
  {title:"Identidad de marca",desc:"Sistemas visuales vivos para marcas que no quieren quedarse quietas.",media:"/assets/ork-service-identity-v2.png",motion:"/assets/ork-service-identity-motion.mp4"},
  {title:"Diseño de plataformas",desc:"Productos y experiencias digitales donde estrategia, interfaz y tecnología hablan el mismo idioma.",media:"/assets/ork-service-platform-v3.png",motion:"/assets/ork-service-platform-motion.mp4"},
  {title:"IA y automatización",desc:"Sistemas inteligentes que simplifican operaciones, conectan procesos y amplifican las capacidades del equipo.",media:"/assets/ork-service-ai-v1.png",motion:"/assets/zceo-ai-automation.mp4"},
  {title:"Inteligencia de negocio",desc:"Convertimos datos, señales y comportamientos en claridad para tomar mejores decisiones.",media:"/assets/ork-service-intelligence-v1.png",motion:"/assets/zceo-performance-marketing.mp4"},
  {title:"Campañas digitales",desc:"Ideas culturales construidas para viajar entre pantallas, formatos y comunidades.",media:"/assets/ork-service-campaign-v2.png",motion:"/assets/ork-service-campaign-motion.mp4"},
  {title:"Contenido y motion",desc:"Dirección visual, producción y movimiento para sostener la atención.",media:"/assets/ork-service-motion-v2.png",motion:"/assets/ork-service-motion-motion.mp4"},
];
const heroClips = [
  "/assets/ork-home-whale.mp4",
];
const sectors = [
  "TECNOLOGÍA",
  "MODA",
  "CULTURA",
  "RETAIL",
  "ENTRETENIMIENTO",
  "FINTECH",
  "EDUCACIÓN",
  "SALUD",
  "HOSPITALIDAD",
  "MOVILIDAD",
  "CONSUMO",
  "STARTUPS",
];
const projects = [
  {title:"Nueva energía",meta:"Identidad de marca / Dirección creativa",year:"2026",kind:"symbol"},
  {title:"Un mundo conectado",meta:"Plataforma / Experiencia digital",year:"2026",kind:"image",media:"/assets/zceo-project-monolith.png",stamp:"IMAGINAR|LO IMPOSIBLE"},
  {title:"Movimiento cultural",meta:"Campaña / Contenido",year:"2026",kind:"video",media:"/assets/project-workshop-new.mp4",stamp:"AHORA|ES EL MOMENTO"},
  {title:"Sistemas que avanzan",meta:"Producto digital / Analítica",year:"2026",kind:"video",media:"/assets/project-performance-new.mp4",stamp:"MEDIR|PARA CRECER"},
  {title:"Atención en acción",meta:"Pauta / Comercio digital",year:"2026",kind:"video",media:"/assets/project-mobile-commerce-new.mp4",stamp:"MOVER|AUDIENCIAS"},
  {title:"Marca en movimiento",meta:"Identidad / Motion",year:"2026",kind:"video",media:"/assets/project-brand-editorial.m4v",stamp:"CREAR|CON PROPÓSITO"},
];

export default function Home() {
  const [heroClip, setHeroClip] = useState(0);
  const [heroTransition, setHeroTransition] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [filmMode, setFilmMode] = useState(false);
  const [manifestoOrganized, setManifestoOrganized] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const projectRail = useRef<HTMLDivElement>(null);
  const projectDrag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const heroTransitionTimers = useRef<number[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const audioGain = useRef<GainNode | null>(null);
  const audioOscillators = useRef<OscillatorNode[]>([]);
  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  useEffect(() => {
    setFilmMode(new URLSearchParams(window.location.search).has("film"));
  }, []);
  useEffect(() => {
    if (window.sessionStorage.getItem("ork-intro-seen")) {
      setShowLoader(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setShowLoader(false);
      window.sessionStorage.setItem("ork-intro-seen", "1");
    }, 3100);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const sources = heroClips.slice(1);
    const preloaders = sources.map((source) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.src = source;
      video.load();
      return video;
    });
    return () => preloaders.forEach((video) => {
      video.removeAttribute("src");
      video.load();
    });
  }, []);
  useEffect(() => () => heroTransitionTimers.current.forEach(window.clearTimeout), []);
  useEffect(() => () => {
    audioOscillators.current.forEach((oscillator)=>{try{oscillator.stop();}catch{}});
    if (audioContext.current) void audioContext.current.close();
  }, []);
  useEffect(() => {
    const update = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(distance > 0 ? window.scrollY / distance : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    const section = document.querySelector(".services");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("isVisible");
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const section = document.querySelector(".intro");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("isVisible");
        observer.disconnect();
      }
    }, { threshold: 0.22 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const section = document.querySelector(".contact");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("isVisible");
        observer.disconnect();
      }
    }, { threshold: 0.28 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video[data-lazy-motion]"));
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        const video=entry.target as HTMLVideoElement;
        if(entry.isIntersecting) void video.play().catch(()=>{});
        else video.pause();
      });
    },{rootMargin:"120px 0px",threshold:.18});
    videos.forEach((video)=>observer.observe(video));
    return ()=>observer.disconnect();
  }, []);
  useEffect(() => {
    const touchMode=window.matchMedia("(hover: none)").matches;
    if(!touchMode) return;
    const cards=Array.from(document.querySelectorAll<HTMLElement>(".serviceCard"));
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        const card=entry.target as HTMLElement;
        const video=card.querySelector("video");
        if(entry.isIntersecting){
          cards.forEach((other)=>{
            if(other!==card){
              other.classList.remove("isTouchPlaying");
              const otherVideo=other.querySelector("video");
              if(otherVideo){otherVideo.pause();otherVideo.currentTime=0;}
            }
          });
          card.classList.add("isTouchPlaying");
          if(video) void video.play().catch(()=>{});
        }else{
          card.classList.remove("isTouchPlaying");
          if(video){video.pause();video.currentTime=0;}
        }
      });
    },{rootMargin:"-25% 0px -25%",threshold:.55});
    cards.forEach((card)=>observer.observe(card));
    return ()=>observer.disconnect();
  }, []);
  const toggleSound = async () => {
    if(!audioContext.current){
      const context=new AudioContext();
      const gain=context.createGain();
      gain.gain.value=0;
      gain.connect(context.destination);
      const filter=context.createBiquadFilter();
      filter.type="lowpass";
      filter.frequency.value=180;
      filter.Q.value=.7;
      filter.connect(gain);
      const oscillators=[55,82.5].map((frequency,index)=>{
        const oscillator=context.createOscillator();
        const voiceGain=context.createGain();
        oscillator.type=index===0?"sine":"triangle";
        oscillator.frequency.value=frequency;
        voiceGain.gain.value=index===0?.72:.18;
        oscillator.connect(voiceGain);
        voiceGain.connect(filter);
        oscillator.start();
        return oscillator;
      });
      audioContext.current=context;
      audioGain.current=gain;
      audioOscillators.current=oscillators;
    }
    const context=audioContext.current;
    const gain=audioGain.current;
    if(!context||!gain) return;
    await context.resume();
    const next=!soundEnabled;
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setValueAtTime(gain.gain.value,context.currentTime);
    gain.gain.linearRampToValueAtTime(next ? .018 : 0,context.currentTime+.7);
    setSoundEnabled(next);
  };
  const startProjectDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = projectRail.current;
    if (!rail) return;
    projectDrag.current = { active: true, startX: e.clientX, scrollLeft: rail.scrollLeft };
    rail.setPointerCapture(e.pointerId);
    rail.classList.add("isDragging");
  };
  const moveProjectDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = projectRail.current;
    if (!rail || !projectDrag.current.active) return;
    rail.scrollLeft = projectDrag.current.scrollLeft - (e.clientX - projectDrag.current.startX) * 1.35;
  };
  const stopProjectDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = projectRail.current;
    if (!rail) return;
    projectDrag.current.active = false;
    if (rail.hasPointerCapture(e.pointerId)) rail.releasePointerCapture(e.pointerId);
    rail.classList.remove("isDragging");
  };
  const advanceHero = () => {
    if (heroTransition || filmMode) return;
    setHeroTransition(true);
    heroTransitionTimers.current.forEach(window.clearTimeout);
    heroTransitionTimers.current = [
      window.setTimeout(() => setHeroClip((current) => (current + 1) % heroClips.length), 430),
      window.setTimeout(() => setHeroTransition(false), 950),
    ];
  };
  return <main className={`editorialIdentity${filmMode ? " isFilmMode" : ""}`}>
    {showLoader&&<div className="orkLoader" role="status" aria-label="Cargando O R-K"><div className="loaderMark"><img src="/assets/ork-logo-white.png" alt=""/><span>Business innovation & technology</span></div><div className="loaderTrack"><i/></div><p>Ideas tomando forma</p></div>}
    <div className="cursor" style={{ transform: `translate(${cursor.x}px,${cursor.y}px)` }} />
    <div className="scrollProgress" style={{transform:`scaleX(${scrollProgress})`}} aria-hidden="true" />
    <div className="siteGrain" aria-hidden="true" />
    <button className={`soundToggle${soundEnabled?" isOn":""}`} type="button" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled?"Desactivar ambiente sonoro":"Activar ambiente sonoro"}><span>{soundEnabled?"Sonido activo":"Sonido inactivo"}</span><i>{Array.from({length:4}).map((_,index)=><b key={index}/>)}</i></button>
    <nav>
      <a className="logo brandLogo" href="#inicio" aria-label="O R-K inicio"><img src="/assets/ork-logo-white.png" alt="O R-K"/></a>
      <div className="navlinks"><a href="#trabajo">Trabajo</a><a href="#servicios">Capacidades</a><a href="#nosotros">Nosotros</a><a href="#contacto">Hablemos</a></div>
    </nav>

    <section className="hero" id="inicio" onPointerMove={(event)=>{
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--hero-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 2}`);
      event.currentTarget.style.setProperty("--hero-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 2}`);
    }} onPointerLeave={(event)=>{
      event.currentTarget.style.setProperty("--hero-x", "0");
      event.currentTarget.style.setProperty("--hero-y", "0");
    }}>
      <div className={`heroMedia tone-${heroClip}`}>
        <video className="orkHomeFilm" autoPlay muted loop playsInline preload="auto" poster="/assets/ork-home-whale-poster.png"><source src={heroClips[0]} type="video/mp4"/></video>
      </div>
      <div className="heroShade" />
      <div className={`heroTransition ${heroTransition ? "isActive" : ""}`} aria-hidden="true"><i/><span>O R-K</span></div>
      <div className="marquee"><div>ESTRATEGIA · DISEÑO · TECNOLOGÍA · CULTURA · ESTRATEGIA · DISEÑO · TECNOLOGÍA · CULTURA ·</div></div>
    </section>

    <section className={`intro${manifestoOrganized?" isOrganized":""}`} id="nosotros" tabIndex={0} aria-label="Manifiesto de O R-K. Haz clic o continúa desplazándote para ordenar las palabras." onClick={()=>setManifestoOrganized(true)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setManifestoOrganized(true);}}} onWheel={()=>{if(!manifestoOrganized) window.setTimeout(()=>setManifestoOrganized(true),520);}} onPointerMove={(event)=>{
      const bounds=event.currentTarget.getBoundingClientRect();
      const x=(event.clientX-bounds.left)/bounds.width-.5;
      const y=(event.clientY-bounds.top)/bounds.height-.5;
      const factors=[-18,24,-12,19,-23,14];
      factors.forEach((factor,index)=>{
        event.currentTarget.style.setProperty(`--intro-${index+1}x`,`${x*factor}px`);
        event.currentTarget.style.setProperty(`--intro-${index+1}y`,`${y*Math.abs(factor)*.35}px`);
      });
      event.currentTarget.style.setProperty("--intro-bg-x",`${x*28}px`);
    }} onPointerLeave={(event)=>{
      for(let index=1;index<=6;index++){
        event.currentTarget.style.setProperty(`--intro-${index}x`,"0px");
        event.currentTarget.style.setProperty(`--intro-${index}y`,"0px");
      }
      event.currentTarget.style.setProperty("--intro-bg-x","0px");
    }}>
      <span className="sectionNo">01 / O R-K</span>
      <span className="manifestoHint" aria-hidden="true">{manifestoOrganized?"Composición activa":"Haz clic o desplázate para ordenar"} <i>↘</i></span>
      <p className="manifesto"><span>Menos ruido.</span><span>Más movimiento.</span><span>Ideas que impactan.</span><span><em>Negocios que avanzan.</em></span></p>
      <aside className="manifestoAside"><span>Creativity<br/>with direction</span><b>↘</b><p>Convertimos atención en acción y estrategia en una presencia cultural propia.</p><small>Bogotá · Colombia<br/>04°36&apos;N / 74°05&apos;W</small></aside>
      <div className="introFoot"><span>Desde Colombia<br/>para cualquier pantalla.</span><span className="asterisk">✳</span></div>
    </section>

    <section className="sectorRail" aria-label="Sectores en los que trabajamos">
      <span>Trabajamos con</span>
      <div className="sectorViewport">
        <div className="sectorTrack">
          {[0,1].map((group)=><div className="sectorGroup" aria-hidden={group===1} key={group}>
            {sectors.map((sector)=><span className="sectorItem" key={`${group}-${sector}`}><b>{sector}</b><i>✳</i></span>)}
          </div>)}
        </div>
      </div>
    </section>

    <section className="meetZceo" aria-label="Conoce O R-K">
      <span className="ghostLetter ghostLeft">z</span><span className="ghostLetter ghostRight">o</span>
      <div className="meetWord"><strong className="wordLeft">{"CREA".split("").map((letter, i)=><span data-char={letter} key={letter+i} style={{"--letter-delay":`${i * -.34}s`} as React.CSSProperties}>{letter}</span>)}</strong><div className="meetPortrait"><video data-lazy-motion muted loop playsInline preload="none" poster="/assets/ork-creative-studio-poster.png"><source src="/assets/ork-creative-studio.mp4" type="video/mp4"/></video><span>▶</span></div><strong className="wordRight">{"MOS".split("").map((letter, i)=><span data-char={letter} key={letter+i} style={{"--letter-delay":`${(i + 4) * -.34}s`} as React.CSSProperties}>{letter}</span>)}</strong></div>
      <div className="meetNote"><b>Conoce</b><p>O R-K<br/>Estrategia, innovación y tecnología<br/>en un mismo equipo.</p></div>
      <p className="meetManifesto">No somos espectadores del cambio.<br/><i>Lo diseñamos.</i></p>
    </section>

    <section className="work" id="trabajo">
      <header><span className="sectionNo">02 / Trabajo seleccionado</span><h2>Ideas en<br/><i>acción.</i></h2></header>
      <div className="projects" ref={projectRail} onPointerDown={startProjectDrag} onPointerMove={moveProjectDrag} onPointerUp={stopProjectDrag} onPointerCancel={stopProjectDrag} onPointerLeave={(e)=>projectDrag.current.active&&stopProjectDrag(e)}>
        {projects.map((project, index)=><article className={`project p${index+1}`} key={project.title}>
          {project.kind === "symbol" && <div className="visual"><span className="giant">O</span><span className="pill">Identidad</span></div>}
          {project.kind === "waves" && <div className="visual"><div className="waves"/><b>AHORA<br/>ES EL<br/>MOMENTO.</b></div>}
          {project.kind === "image" && <div className="visual projectImage"><img src={project.media} alt="" draggable="false" loading="lazy" decoding="async"/><div className="projectStamp">{project.stamp?.split("|").map((line)=><span key={line}>{line}</span>)}</div></div>}
          {project.kind === "video" && <div className="visual projectVideo"><video data-lazy-motion muted loop playsInline preload="none"><source src={project.media}/></video><div className="projectStamp">{project.stamp?.split("|").map((line)=><span key={line}>{line}</span>)}</div><span className="motionBadge">EN MOVIMIENTO</span></div>}
          <div className="caption"><h3>{project.title}</h3><p>{project.meta}</p><span>{project.year}</span></div>
        </article>)}
      </div>
      <div className="caseMethod"><p>Un caso no termina en una imagen bonita.</p><div><span>01</span><b>Contexto</b><p>Entendemos el negocio, la audiencia y la oportunidad.</p></div><div><span>02</span><b>Idea</b><p>Construimos un concepto capaz de vivir en cualquier formato.</p></div><div><span>03</span><b>Sistema</b><p>Lo convertimos en identidad, contenido y experiencia digital.</p></div></div>
    </section>

    <section className="services" id="servicios">
      <span className="sectionNo">03 / Lo que hacemos</span><h2 className="serviceHeading"><span className="serviceTitleLine">De la idea</span><span className="serviceTitleLine serviceTitleLineTwo">al <i>impacto.</i></span></h2>
      <div className="serviceBrief"><p>Marca. Pauta. Plataformas. IA. Todo con dirección.</p><div><span>Marca</span><span>Rendimiento</span><span>Producto</span><span>IA</span></div></div>
      <div className="serviceCards">{services.map((service,i)=><article className="serviceCard" style={{"--card-delay":`${i * .13}s`} as React.CSSProperties} key={service.title} onPointerEnter={(event)=>{if(window.matchMedia("(hover:hover)").matches){const video=event.currentTarget.querySelector("video");if(video) void video.play().catch(()=>{});}}} onPointerLeave={(event)=>{if(window.matchMedia("(hover:hover)").matches){const video=event.currentTarget.querySelector("video");if(video){video.pause();video.currentTime=0;}}}}><span className="serviceNumber">0{i+1}</span><div className="serviceMedia"><img src={service.media} alt="" loading="lazy" decoding="async"/>{service.motion&&<video className="serviceHoverVideo" muted loop playsInline preload="none" poster={service.media}><source src={service.motion} type="video/mp4"/></video>}</div><span className="serviceLabel">Servicio</span><h3>{service.title}<b>↗</b></h3><p>{service.desc}</p></article>)}</div>
    </section>

    <section className="contact" id="contacto" onPointerMove={(event)=>{
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
      event.currentTarget.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
    }}><p>¿Tienes algo en mente?</p><h2 aria-label="Hagámoslo inevitable."><span className="contactWord contactWordTop" aria-hidden="true">{Array.from("HAGÁMOSLO").map((char,index)=><span data-char={char} style={{"--char-index":index} as React.CSSProperties} key={`${char}-${index}`}>{char}</span>)}</span><span className="contactWord contactWordImpact" aria-hidden="true">{Array.from("INEVITABLE.").map((char,index)=><span data-char={char} style={{"--char-index":index} as React.CSSProperties} key={`${char}-${index}`}>{char}</span>)}</span></h2><div className="contactMeta"><span>Un proyecto nuevo<br/>Una colaboración<br/>Una idea sin resolver</span><button className="contactLaunch" type="button" onClick={()=>setContactOpen(true)}>Cuéntanos qué quieres transformar <span>↗</span></button></div>{contactOpen&&<div className="contactPanel" role="dialog" aria-modal="true" aria-label="Cuéntanos tu proyecto"><button className="contactClose" type="button" onClick={()=>setContactOpen(false)} aria-label="Cerrar formulario">×</button><span>Nuevo proyecto / O R-K</span><h3>Empecemos por<br/>lo esencial.</h3><form onSubmit={(event)=>{event.preventDefault();const data=new FormData(event.currentTarget);const subject=encodeURIComponent(`Proyecto O R-K · ${data.get("project")}`);const body=encodeURIComponent(`Hola, O R-K:\n\nQuiero transformar:\n${data.get("brief")}\n\nTipo de proyecto: ${data.get("project")}\nInversión estimada: ${data.get("budget")}\nMi correo: ${data.get("email")}`);window.location.href=`mailto:hola@or-k.co?subject=${subject}&body=${body}`;}}><label>¿Qué necesitas?<select name="project" required defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Estrategia e identidad</option><option>Campaña y pauta digital</option><option>Plataforma o producto digital</option><option>Automatización e IA</option><option>Contenido y motion</option></select></label><label>¿Qué quieres transformar?<textarea name="brief" required placeholder="Cuéntanos el reto. No necesitas tener la solución."/></label><div><label>Inversión estimada<select name="budget" required defaultValue=""><option value="" disabled>Selecciona un rango</option><option>Por definir</option><option>USD 3.000–8.000</option><option>USD 8.000–20.000</option><option>Más de USD 20.000</option></select></label><label>Tu correo<input name="email" type="email" required placeholder="nombre@empresa.com"/></label></div><button type="submit">Enviar el reto <span>→</span></button></form></div>}</section>
    <footer><a className="logo brandLogo brandLogoFooter" href="#inicio" aria-label="O R-K inicio"><img src="/assets/ork-logo-white.png" alt="O R-K"/></a><p>Business innovation & technology.</p><p>© 2026 O R-K</p></footer>
  </main>;
}
