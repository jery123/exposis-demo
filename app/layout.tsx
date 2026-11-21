import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MobileNavigation from "./mobile-navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EXPOSIS — Les idées se construisent ensemble",
    template: "%s | EXPOSIS"
  },
  description:
    "Communauté de recherche, d’expérimentation et d’innovation en informatique en Côte d’Ivoire.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }]
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <header className="site-header">
          <div className="header-inner">
            <Link aria-label="EXPOSIS, accueil" className="brand" href="/">
              <Image src="/images/exposis-logo-orange.png" alt="EXPOSIS" width={132} height={79} priority />
            </Link>
            <MobileNavigation />
            <div className="header-actions">
              <Link className="text-link sign-in" href="/login">Connexion membre</Link>
              <Link className="button button-dark button-small" href="/soumettre">
                Soumettre une idée <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </header>
        <main id="contenu">{children}</main>
        <footer className="site-footer">
          <div className="footer-main">
            <div className="footer-brand">
              <Image src="/images/exposis-logo-white.png" alt="EXPOSIS" width={118} height={67} />
              <p>Un laboratoire vivant pour apprendre, explorer et bâtir des solutions utiles.</p>
            </div>
            <div>
              <p className="footer-label">Explorer</p>
              <Link href="/a-propos">À propos d’EXPOSIS</Link>
              <Link href="/projets">Projets de la communauté</Link>
              <Link href="/#approche">Notre approche</Link>
            </div>
            <div>
              <p className="footer-label">Participer</p>
              <Link href="/communaute/projets/nouveau">Proposer un projet membre</Link>
              <Link href="/soumettre">Soumettre une idée</Link>
              <Link href="mailto:contact-lab@exposis.net">Nous contacter</Link>
              </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} EXPOSIS · Côte d’Ivoire</span>
            <span>Recherche · Expérimentation · Innovation</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
