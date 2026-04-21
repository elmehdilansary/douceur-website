// /app/layout.tsx — Root layout with Pacifico script + Nunito body fonts

import type { Metadata } from "next";
import { Pacifico, Nunito } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";
import ContactFloat from "@/components/ContactFloat";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Douceur — Mouchoirs Extra Doux et Résistants",
  description: "Douceur — des mouchoirs extra doux et résistants, fabriqués au Maroc avec amour.",
  openGraph: {
    title: "Douceur Maroc",
    description: "Mouchoirs Extra Doux et Résistants",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${pacifico.variable} ${nunito.variable}`}>
      <head>
        <link rel="preload" as="image" href="/LOGO.png" fetchPriority="high" />
        <link rel="preload" as="image" href="/douceur-front.png" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body>
        <I18nProvider>
          <LangToggle />
          <ContactFloat />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
