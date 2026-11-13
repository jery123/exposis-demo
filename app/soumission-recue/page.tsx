import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demande reçue",
  robots: { index: false, follow: false }
};

export default async function SubmissionReceivedPage({
  searchParams
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const safeReference = ref && /^EXP-[A-Z0-9]{6}$/.test(ref) ? ref : null;

  return (
    <section className="receipt-page">
      <span className="receipt-mark" aria-hidden="true">✓</span>
      <div className="section-kicker"><span>Votre idée est en route</span> Merci pour votre confiance</div>
      <h1>Le premier pas<br /><em>est fait.</em></h1>
      <p>Notre équipe a bien reçu votre demande et va l’examiner. Nous reprendrons contact avec vous par e-mail pour la suite.</p>
      {safeReference && <p className="receipt-reference">Référence de votre demande <strong>{safeReference}</strong></p>}
      <div className="receipt-actions">
        <Link className="button button-dark" href="/">Retour à l’accueil</Link>
        <Link className="underlined-link" href="/projets">Découvrir les projets ↗</Link>
      </div>
    </section>
  );
}
