import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/work/theme/theme-provider";
import { THEME_BOOTSTRAP } from "@/components/work/theme/theme";
import "./work.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OR-K WORK",
  description: "Operación interna de OR-K — solicitudes, proyectos, revisión y entregas.",
  robots: { index: false, follow: false },
};

/**
 * Layout for the OR-K WORK module. Everything lives inside `[data-orkwork]`,
 * which re-establishes a clean baseline over the public site's global reset
 * (app/globals.css). `work.css` is imported here only, so Next scopes it to
 * `/work/*` — the marketing site never loads it.
 *
 * The inline bootstrap script sets the light/dark class on the wrapper before
 * first paint (no flash); ThemeProvider keeps it in sync afterwards.
 */
export default function WorkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-orkwork=""
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
    >
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
