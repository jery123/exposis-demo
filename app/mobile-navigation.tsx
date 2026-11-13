"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/a-propos", label: "À propos" },
  { href: "/#approche", label: "Notre approche" },
  { href: "/projets", label: "Projets" },
  { href: "/#communaute", label: "La communauté" }
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav aria-label="Navigation principale" className="main-nav">
        {links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
      </nav>
      <div className="mobile-navigation">
        <button
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="mobile-menu-toggle"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            {isOpen
              ? <path d="m6 6 12 12M18 6 6 18" />
              : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        {isOpen && (
          <nav aria-label="Menu mobile" className="mobile-nav" id="mobile-menu">
            {links.map((link) => (
              <Link href={link.href} key={link.href} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setIsOpen(false)}>Connexion membre</Link>
          </nav>
        )}
      </div>
    </>
  );
}
