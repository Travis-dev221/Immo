import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ScrollSideNumbers } from "@/components/layout/ScrollSideNumbers";
import { SplashAnimation } from "@/components/layout/SplashAnimation";
import { ScrollImageAnimations } from "@/components/layout/ScrollImageAnimations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: "BAOBAB HORIZON — Immobilier", template: "%s | BAOBAB HORIZON" },
  description: "Achat, vente et location — annonces vérifiées, recherche avancée et accompagnement par des agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 font-sans antialiased`}>
        <SplashAnimation />
        <ScrollImageAnimations />
        <Providers>
          <ScrollSideNumbers />
          <SiteHeader />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
