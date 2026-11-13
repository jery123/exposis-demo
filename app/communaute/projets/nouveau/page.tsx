import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import InfinityMark from "@/app/infinity-mark";
import CommunityProjectForm from "./project-form";

export const metadata: Metadata = {
  title: "Proposer un projet membre",
  description: "Présentez un projet terminé ou en cours avec sa description, son lien et ses images."
};

async function getMembership(): Promise<{
  authenticated: boolean;
  available: boolean;
  name?: string;
}> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get("cookie");
  if (!cookie) return { authenticated: false, available: true };

  const laravelUrl = (
    process.env.LARAVEL_API_URL ??
    process.env.LARAVEL_APP_URL ??
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  try {
    const response = await fetch(`${laravelUrl}/api/community/session`, {
      cache: "no-store",
      headers: { Accept: "application/json", Cookie: cookie }
    });

    if (response.status === 401) return { authenticated: false, available: true };
    if (!response.ok) return { authenticated: false, available: false };

    const data: { user?: { name?: string } } = await response.json();
    if (!data.user?.name) return { authenticated: false, available: false };
    return { authenticated: true, available: true, name: data.user.name };
  } catch (error) {
    if (error instanceof TypeError) return { authenticated: false, available: false };
    throw error;
  }
}

export default async function NewCommunityProjectPage({
  searchParams
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { submitted } = await searchParams;
  const membership = await getMembership();
  if (!membership.available) {
    return (
      <>
        <section className="page-hero member-project-hero">
          <div className="section-kicker"><span>Projets de la communauté</span> Espace membre</div>
          <h1>Votre prochain projet<br /><em>commence ici.</em></h1>
        </section>
        <section className="section-wrap member-project-state" role="alert">
          <h2>L’espace membre est momentanément indisponible.</h2>
          <p>Nous n’avons pas pu vérifier votre session. Réessayez dans quelques instants.</p>
          <Link className="button button-dark button-small" href="/communaute/projets/nouveau">Réessayer <span aria-hidden="true">↗</span></Link>
        </section>
      </>
    );
  }

  if (!membership.authenticated) redirect("/login");

  if (submitted === "1") {
    return (
      <section className="receipt-page">
        <span className="receipt-mark" aria-hidden="true">✓</span>
        <div className="section-kicker"><span>Proposition transmise</span> Merci pour votre contribution</div>
        <h1>Votre projet est<br /><em>entre de bonnes mains.</em></h1>
        <p>L’équipe EXPOSIS va examiner votre projet et son éventuel rapport. Ils resteront privés jusqu’à leur validation.</p>
        <div className="receipt-actions">
          <Link className="button button-dark" href="/communaute/projets">Voir mes propositions</Link>
          <Link className="underlined-link" href="/">Retour à l’accueil ↗</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero member-project-hero">
        <div className="section-kicker"><span>Projets de la communauté</span> Espace membre</div>
        <h1>Votre prochain projet<br /><em>commence ici.</em></h1>
        <p>Documentez le travail que vous construisez avec la communauté — terminé ou en cours. Ajoutez sa description, ses images et son rapport. Après validation par EXPOSIS, les visiteurs pourront découvrir le projet et consulter son rapport.</p>
      </section>
      <section className="submission-section member-submission-section section-wrap">
        <aside className="submission-aside">
          <div className="section-kicker"><span>Bonjour {membership.name}</span> Votre contribution</div>
          <ol className="submission-steps">
            <li><span>01</span><div><strong>Présentez le projet</strong><p>Expliquez son objectif, son domaine et son état. Pour un projet terminé, partagez aussi ses résultats.</p></div></li>
            <li><span>02</span><div><strong>Créditez l’équipe</strong><p>Ajoutez les personnes qui participent avec leur accord.</p></div></li>
            <li><span>03</span><div><strong>Documentez les résultats</strong><p>Joignez un rapport PDF ou DOCX. Sa publication, comme celle du projet, nécessite une validation.</p></div></li>
            <li><span>04</span><div><strong>Ouvrez le partage</strong><p>Après approbation, le projet apparaît dans le catalogue et son rapport est consultable librement.</p></div></li>
          </ol>
          <div className="privacy-note">
            <InfinityMark className="privacy-infinity" /><p>Ne partagez pas de données confidentielles. Le projet et les documents joints restent privés jusqu’à leur validation.</p>
          </div>
          <p className="member-prompt"><Link href="/communaute/projets">← Retour à mes propositions</Link></p>
        </aside>
        <CommunityProjectForm />
      </section>
    </>
  );
}
