import type { Metadata } from "next";
import "./styles/marketing.css";

export const metadata: Metadata = {
  title: "O R-K — Business Innovation & Technology",
  description: "Estrategia de marca, pauta digital, plataformas, automatización e IA para transformar la atención en crecimiento.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
