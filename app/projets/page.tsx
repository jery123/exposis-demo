import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, researchAreas } from "@/lib/projects";
import InfinityMark from "@/app/infinity-mark";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Projets de la communauté",
  description: "Découvrez les projets de recherche et d’innovation portés par les membres d’EXPOSIS."
};

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ pole?: string; q?: string }>;
}) {
  const { pole, q } = await searchParams;
  const selectedPole = researchAreas.find((area) => area === pole);
  const search = q?.trim().slice(0, 100) ?? "";
  const { projects, available } = await getProjects(selectedPole, search);

  return (
    <>
      <section className="page-hero projects-hero">
        <div className="section-kicker"><span>EX / 03</span> Recherche en action</div>
        <h1>Des pistes explorées.<br /><em>Des solutions partagées.</em></h1>
        <p>Chaque projet est une occasion d’apprendre ensemble et de faire émerger des réponses adaptées à nos réalités.</p>
        <div className="projects-hero-meta">
          <span><i aria-hidden="true" /> Le laboratoire en mouvement</span>
          <span>Des idées concrètes, portées par la communauté</span>
        </div>
      </section>
      <section className="catalog-section section-wrap">
        <form action="/projets" className="project-search" role="search">
          {selectedPole && <input name="pole" type="hidden" value={selectedPole} />}
          <label htmlFor="project-query">Explorer le catalogue</label>
          <div className="search-control">
            <input autoComplete="off" defaultValue={search} id="project-query" maxLength={100} name="q" placeholder="Ex. intelligence artificielle, Awa…" type="search" />
            <button aria-label="Lancer la recherche" type="submit"><span aria-hidden="true">⌕</span> Rechercher</button>
          </div>
          {search && <Link className="search-reset" href={selectedPole ? `/projets?pole=${encodeURIComponent(selectedPole)}` : "/projets"}>Effacer la recherche</Link>}
        </form>
        <div className="catalog-toolbar">
          <nav className="filter-list" aria-label="Filtrer les projets par domaine">
            <Link aria-current={!selectedPole ? "page" : undefined} className={!selectedPole ? "filter-active" : ""} href={search ? `/projets?q=${encodeURIComponent(search)}` : "/projets"}>Tous les domaines</Link>
            {researchAreas.map((area) => (
              <Link aria-current={selectedPole === area ? "page" : undefined} className={selectedPole === area ? "filter-active" : ""} href={`/projets?pole=${encodeURIComponent(area)}${search ? `&q=${encodeURIComponent(search)}` : ""}`} key={area}>
                {area}
              </Link>
            ))}
          </nav>
          <Link className="underlined-link" href="/communaute/projets/nouveau">
            Vous êtes membre ? Présentez un projet <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {!available ? (
          <div className="catalog-message" role="status">
            <h2>Le catalogue est momentanément indisponible.</h2>
            <p>La connexion au laboratoire n’a pas abouti. Réessayez un peu plus tard.</p>
          </div>
        ) : projects?.length ? (
          <>
            <div className="catalog-results-heading">
              <div>
                <span className="section-kicker"><span>La sélection</span> Des projets publiés</span>
                <h2>{search ? "Résultats de votre recherche" : "Les projets de la communauté"}</h2>
              </div>
              <span className="catalog-results-count">{projects.length} projet{projects.length > 1 ? "s" : ""}</span>
            </div>
            <div className="catalog-grid">
              {projects.map((project, index) => (
                <article className={`catalog-card catalog-card-${(index % 3) + 1}`} key={project.slug}>
                  {project.images?.[0] ? (
                    <Link aria-label={`Voir le projet ${project.title}`} className="catalog-card-image" href={`/projets/${project.slug}`}>
                      <Image alt={project.title} fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw" src={project.images[0].url} />
                      {project.images.length > 1 && <span className="catalog-image-count">+{project.images.length - 1} image{project.images.length > 2 ? "s" : ""}</span>}
                    </Link>
                  ) : (
                    <Link aria-label={`Voir le projet ${project.title}`} className="catalog-card-art" href={`/projets/${project.slug}`}>
                      <span>EX / {String(index + 1).padStart(2, "0")}</span>
                      <InfinityMark />
                      <i aria-hidden="true" />
                    </Link>
                  )}
                  <div className="catalog-card-top">
                    <span className="catalog-pole">{project.pole}</span>
                    <span className="catalog-card-badges">
                      {project.has_report && <span className="catalog-report-badge">Rapport disponible</span>}
                      <span className="catalog-status"><i aria-hidden="true" />{project.status}</span>
                    </span>
                  </div>
                  <div className="catalog-card-copy">
                    <h2><Link href={`/projets/${project.slug}`}>{project.title}</Link></h2>
                    <p>{project.summary}</p>
                    {project.team_members.length > 0 && (
                      <div className="project-card-team">
                        <span className="team-label">Équipe projet</span>
                        <ul>{project.team_members.slice(0, 3).map((member) => <li key={member}>{member}</li>)}</ul>
                      </div>
                    )}
                  </div>
                  <div className="catalog-card-bottom">
                    <span>{project.team_members.length ? `${project.team_members.length} membre${project.team_members.length > 1 ? "s" : ""} dans l’équipe` : "Projet EXPOSIS"}</span>
                    <Link aria-label={`Découvrir ${project.title}`} href={`/projets/${project.slug}`}>Découvrir <span aria-hidden="true">↗</span></Link>
                  </div>
                </article>
              ))}
              <Link className="catalog-invite" href="/soumettre">
                <span className="invite-mark" aria-hidden="true">+</span>
                <span className="section-kicker">Et si on explorait votre idée ?</span>
                <strong>Le prochain projet inspirant pourrait être le vôtre.</strong>
                <span className="underlined-link">Soumettre votre idée <span aria-hidden="true">↗</span></span>
              </Link>
            </div>
          </>
        ) : (
          <div className="catalog-message">
            <span className="empty-mark"><InfinityMark /></span>
            <h2>Les projets se préparent.</h2>
            <p>{search ? "Aucun projet ne correspond à cette recherche. Essayez d’autres mots-clés ou retirez le filtre." : "Les propositions publiées par les membres apparaîtront ici après validation par l’équipe."}</p>
            {search && <Link className="underlined-link" href={selectedPole ? `/projets?pole=${encodeURIComponent(selectedPole)}` : "/projets"}>Effacer la recherche ↗</Link>}
            <Link className="button button-dark button-small" href="/register">Rejoindre la communauté <span aria-hidden="true">↗</span></Link>
          </div>
        )}
      </section>
    </>
  );
}
