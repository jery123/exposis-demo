import type { Metadata } from "next";
import Link from "next/link";
import InfinityMark from "@/app/infinity-mark";
import SubmissionForm from "./submission-form";

export const metadata: Metadata = {
  title: "Soumettre un projet",
  description: "Proposez une idée à l’équipe EXPOSIS pour une première étude de faisabilité."
};

export default function SubmitProjectPage() {
  return (
    <>
      <section className="page-hero submit-hero">
        <div className="section-kicker"><span>Une idée à explorer ?</span> Première étape, sans engagement</div>
        <h1>Tout commence par<br /><em>une bonne question.</em></h1>
        <p>Parlez-nous du problème que vous souhaitez résoudre. Notre équipe étudiera la faisabilité et reviendra vers vous.</p>
      </section>
      <section className="submission-section section-wrap">
        <aside className="submission-aside">
          <div className="section-kicker"><span>Le parcours</span> Après votre envoi</div>
          <ol className="submission-steps">
            <li><span>01</span><div><strong>On vous lit</strong><p>L’équipe prend connaissance de votre besoin et de son contexte.</p></div></li>
            <li><span>02</span><div><strong>On évalue</strong><p>Nous examinons la faisabilité, les ressources et l’utilité du projet.</p></div></li>
            <li><span>03</span><div><strong>On échange</strong><p>Nous vous recontactons pour clarifier les prochaines étapes.</p></div></li>
          </ol>
          <div className="privacy-note">
            <InfinityMark className="privacy-infinity" /><p>Votre idée reste la vôtre. La soumission ne transfère aucun droit de propriété intellectuelle. Un NDA peut être convenu avant tout travail approfondi.</p>
          </div>
          <p className="member-prompt">Déjà membre ? <Link href="/communaute/projets/nouveau">Présentez un projet de la communauté ↗</Link></p>
        </aside>
        <SubmissionForm />
      </section>
    </>
  );
}
