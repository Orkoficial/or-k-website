import type { Metadata } from "next";
import "./development.css";

export const metadata: Metadata = {
  title: "Development — O R-K",
  description: "Productos, plataformas y soluciones digitales construidas alrededor de lo que tu negocio necesita lograr.",
};

const capabilities = [
  { number: "01", title: "Productos digitales", items: "Apps · Web Apps · SaaS · Experiencias digitales", image: "/assets/development-digital-products.png" },
  { number: "02", title: "Plataformas para tu empresa", items: "Sistemas internos · Portales · Operación · Marketplaces", image: "/assets/development-enterprise-platforms.png" },
  { number: "03", title: "Todo conectado", items: "ERP · CRM · APIs · Integraciones · Automatización · Datos", image: "/assets/development-connected-solutions.png" },
  { number: "04", title: "IA que sí te sirve", items: "Agentes · Asistentes · Procesos inteligentes · Soluciones con IA", image: "/assets/development-ai-solutions.png" },
];

const process = ["Entender", "Diseñar", "Construir", "Conectar", "Evolucionar"];

export default function DevelopmentPage() {
  return (
    <main className="developmentPage">
      <nav className="devNav" aria-label="Navegación principal">
        <a className="devLogo" href="/" aria-label="O R-K inicio">
          <img src="/assets/ork-logo-white.png" alt="O R-K" />
        </a>
        <div className="devLinks">
          <a href="/#trabajo">Trabajo</a>
          <a href="/#servicios">Método UTS</a>
          <a href="/#nosotros">Nosotros</a>
          <a className="isActive" href="/development" aria-current="page">Development</a>
          <a href="/#contacto">Hablemos</a>
        </div>
      </nav>

      <section className="devHero">
        <div className="devHeroMedia" aria-hidden="true"><img src="/assets/development-hero-v2.png" alt="" /></div>
        <div className="devHeroIndex" aria-hidden="true"><span>01</span><i /><small>DE LA IDEA A LA REALIDAD</small></div>
        <div className="devHeroCopy">
          <span className="devEyebrow">Ideas que se vuelven realidad</span>
          <h1>¿Qué necesita<br/>tu negocio para<br/><em>avanzar?</em></h1>
          <div className="devHeroIntro">
            <p>Puede ser una idea nueva, un proceso que ya no da más o una oportunidad que vale la pena aprovechar. Empezamos por escucharte.</p>
            <p>Después unimos estrategia, diseño, software, datos e inteligencia artificial para crear una solución útil, clara y hecha a la medida de tu negocio.</p>
          </div>
          <div className="devHeroTags" aria-label="Capacidades principales"><span>Estrategia</span><span>Diseño</span><span>Software</span><span>Datos</span><span>IA</span></div>
        </div>
        <a className="devScroll" href="#what-we-build">Explorar <b>↓</b></a>
      </section>

      <section className="devCapabilities" id="what-we-build">
        <header>
          <div><span className="devEyebrow">02 / Lo que podemos crear contigo</span><p>Desde una herramienta puntual hasta un ecosistema completo. La solución se adapta a tu negocio, no tu negocio a la tecnología.</p></div>
          <h2><span className="devTypeSlice" data-text="¿Qué quieres">¿Qué quieres</span><br/><em className="devTypeSlice isPink" data-text="construir?">construir?</em></h2>
        </header>
        <div className="devCapabilityGrid">
          {capabilities.map((capability) => (
            <article key={capability.number}>
              <div className="devCapabilityPhoto"><img src={capability.image} alt="" loading="lazy" /><i /></div>
              <span>{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.items}</p>
              <b>↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="devProcess">
        <div className="devProcessHead"><span className="devEyebrow">03 / Así lo hacemos</span><span>Un solo equipo contigo<br/>Cinco pasos para avanzar</span></div>
        <h2><span className="devTypeSlice" data-text="De una idea">De una idea</span><br/><em className="devTypeSlice isPink" data-text="a algo real.">a algo real.</em></h2>
        <div className="devProcessFlow">
          {process.map((step, index) => (
            <div key={step}>
              <small>0{index + 1}</small>
              <strong>{step}</strong>
              {index < process.length - 1 && <b>→</b>}
            </div>
          ))}
        </div>
        <p className="devPrinciple"><span className="devTypeSlice" data-text="La tecnología no es el punto de partida.">La tecnología no es el punto de partida.</span><br/><em className="devTypeSlice isLight" data-text="Tu negocio y lo que quieres lograr, sí.">Tu negocio y lo que quieres lograr, sí.</em></p>
      </section>

      <section className="devCta" id="contacto">
        <span className="devEyebrow">04 / ¿Construimos juntos?</span>
        <p>¿Tienes un reto, una idea o una oportunidad dando vueltas?</p>
        <h2><span className="devTypeSlice" data-text="Hablemos de lo">Hablemos de lo</span><br/><em className="devTypeSlice isPink" data-text="que viene.">que viene.</em></h2>
        <a href="/formulario">Cuéntanos tu idea <b>→</b></a>
      </section>
    </main>
  );
}
