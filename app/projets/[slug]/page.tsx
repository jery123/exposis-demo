import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getProject(slug);
  return project
    ? { title: project.title, description: project.summary }
    : { title: "Projet" };
}

export default async function ProjectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project, available, demo } = await getProject(slug);

  if (available && !project) notFound();

  return (
    <article className="project-detail section-wrap">
      <Link className="back-link" href="/projets"><span aria-hidden="true">←</span> Retour au catalogue</Link>
      {demo && (
        <p className="demo-projects-note demo-project-detail-note" role="status">
          Mode démonstration : ce projet statique s’affiche lorsque le catalogue en ligne est indisponible.
        </p>
      )}
      {!available ? (
        <div className="catalog-message" role="status">
          <h1>Le projet ne peut pas être chargé pour le moment.</h1>
          <p>La connexion au laboratoire a échoué. Réessayez dans quelques instants.</p>
        </div>
      ) : project ? (
        <>
          <header className="project-detail-header">
            <div className="project-detail-tags">
              <span className="catalog-pole">{project.pole}</span>
              <span className="catalog-status"><i aria-hidden="true" />{project.status}</span>
            </div>
            <h1>{project.title}</h1>
            <p className="project-lead">{project.summary}</p>
            {project.team_members.length > 0 && (
              <span className="project-detail-team-count">
                {project.team_members.length} membre{project.team_members.length > 1 ? "s" : ""} dans l’équipe
              </span>
            )}
          </header>

          <div className="project-detail-grid">
            <div className="project-detail-main">
              {project.images && project.images.length > 0 && (
                <section aria-label={`Images du projet ${project.title}`} className="project-gallery">
                  {project.images.map((image, index) => (
                    <a aria-label={`Ouvrir l’image ${index + 1} du projet ${project.title}`} className="project-gallery-image" href={image.url} key={image.id} rel="noreferrer" target="_blank">
                      <Image alt={`${project.title} — image ${index + 1}`} fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw" src={image.url} />
                    </a>
                  ))}
                </section>
              )}
              {project.body && (
                <section className="project-body-section">
                  <span className="section-kicker"><span>01</span> À propos</span>
                  <h2>Une idée, une démarche, un impact.</h2>
                  <div className="project-body">
                    {project.body.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </div>
                </section>
              )}
              {project.team_members.length > 0 && (
                <section className="team-section">
                  <span className="section-kicker"><span>02</span> La communauté</span>
                  <h2>Celles et ceux qui le font avancer</h2>
                  <ul>{project.team_members.map((member) => <li key={member}>{member}</li>)}</ul>
                </section>
              )}
            </div>

            <aside className="project-detail-aside" aria-label="Informations sur le projet">
              <span className="project-aside-kicker">Fiche projet</span>
              <div className="project-aside-row">
                <span>Domaine</span>
                <strong>{project.pole}</strong>
              </div>
              <div className="project-aside-row">
                <span>État</span>
                <strong className="project-aside-status"><i aria-hidden="true" />{project.status}</strong>
              </div>
              <div className="project-aside-row">
                <span>Équipe</span>
                <strong>{project.team_members.length ? `${project.team_members.length} membre${project.team_members.length > 1 ? "s" : ""}` : "Communauté EXPOSIS"}</strong>
              </div>
              {project.report && (
                <a className="button button-orange project-external-link" download href={project.report.url}>
                  Télécharger le rapport
                  <span aria-hidden="true">↓</span>
                </a>
              )}
              {project.repo_url ? (
                <a className={`button ${project.report ? "button-outline" : "button-orange"} project-external-link`} href={project.repo_url} rel="noreferrer" target="_blank">
                  Découvrir le projet <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link className={`button ${project.report ? "button-outline" : "button-dark"} project-external-link`} href="/register">
                  Rejoindre la communauté <span aria-hidden="true">↗</span>
                </Link>
              )}
            </aside>
          </div>
        </>
      ) : null}
    </article>
  );
}
