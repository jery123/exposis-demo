import Link from "next/link";
import { getProjects } from "@/lib/projects";
import InfinityMark from "@/app/infinity-mark";

const principles = [
  {
    number: "01",
    title: "Apprendre en faisant",
    text: "Des projets concrets pour transformer la curiosité en compétences et en expérience."
  },
  {
    number: "02",
    title: "Chercher ensemble",
    text: "Des jeunes diplômés, chercheurs et partenaires qui croisent leurs savoirs."
  },
  {
    number: "03",
    title: "Construire utile",
    text: "Des solutions pensées pour les réalités de la Côte d’Ivoire et du continent."
  }
];

export default async function HomePage() {
  const { projects, available } = await getProjects();

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Laboratoire indépendant · Côte d’Ivoire</p>
            <h1>Les idées ne changent rien. <em>Ce qu’on en fait, si.</em></h1>
            <p className="hero-intro">
              EXPOSIS est une communauté de jeunes diplômés qui apprend,
              expérimente et construit des projets innovants pour répondre aux enjeux d’ici.
            </p>
            <div className="hero-actions">
              <Link className="button button-orange" href="/soumettre">
                Soumettre un projet <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-outline" href="/projets">
                Découvrir les projets <span aria-hidden="true">↓</span>
              </Link>
            </div>
            <div className="hero-caption">
              <span className="caption-line" />
              <span>La recherche prend vie quand elle se partage.</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Les étapes d’un projet EXPOSIS">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-center">
              <span className="art-mark">E.</span>
              <span>une idée<br />en mouvement</span>
            </div>
            <div className="orbit-note note-one"><span>01</span> Imaginer</div>
            <div className="orbit-note note-two"><span>02</span> Explorer</div>
            <div className="orbit-note note-three"><span>03</span> Prototyper</div>
            <div className="orbit-note note-four"><span>04</span> Partager</div>
            <div className="art-spark spark-one"><InfinityMark /></div>
            <div className="art-spark spark-two">+</div>
          </div>
        </div>
        <div className="hero-meta">
          <span>01 / 03 <i /></span>
          <span>Faire émerger le potentiel local.</span>
          <span>Abidjan · Afrique de l’Ouest</span>
        </div>
      </section>

      <section className="manifesto section-wrap" id="approche">
        <div className="section-kicker"><span>01</span> Notre raison d’être</div>
        <div className="manifesto-main">
          <h2>Un terrain de jeu pour les esprits <em>qui veulent bâtir.</em></h2>
          <div className="manifesto-note">
            <p>
              Nous croyons qu’une communauté forte se construit en partageant les
              savoirs et en donnant aux idées l’espace d’être testées.
            </p>
            <Link className="underlined-link" href="/#communaute">
              Ce qui nous rassemble <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="principle-grid">
          {principles.map((principle) => (
            <article className="principle-card" key={principle.number}>
              <span className="principle-number">{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
              <span className="principle-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="focus-section">
        <div className="focus-inner">
          <div>
            <div className="section-kicker section-kicker-light"><span>02</span> Terrains d’exploration</div>
            <h2>La technologie comme outil.<br /><em>Le progrès comme boussole.</em></h2>
          </div>
          <p>
            De la cybersécurité à la formation, nous expérimentons là où le
            numérique peut ouvrir de nouvelles possibilités.
          </p>
          <div className="focus-tags">
            <span>Cybersécurité</span>
            <span>Intelligence artificielle</span>
            <span>Logiciel libre</span>
            <span>Réseaux & cloud</span>
            <span>Formation</span>
          </div>
          <div className="focus-aside"><span>EX / 01</span><span>Explorer sans frontières.</span></div>
        </div>
      </section>

      <section className="projects-section section-wrap">
        <div className="section-heading">
          <div>
            <div className="section-kicker"><span>03</span> Le travail en mouvement</div>
            <h2>Des idées qui <em>prennent forme.</em></h2>
          </div>
          <Link className="underlined-link" href="/projets">
            Tous les projets <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {!available ? (
          <p className="service-note">Le catalogue est momentanément indisponible. Réessayez dans quelques instants.</p>
        ) : projects?.length ? (
          <div className="project-preview-grid">
            {projects.slice(0, 2).map((project, index) => (
              <Link className={`project-preview project-preview-${index + 1}`} href={`/projets/${project.slug}`} key={project.slug}>
                <span className="preview-index">0{index + 1} / {project.pole}</span>
                <span className="preview-title">{project.title}</span>
                <span className="preview-summary">{project.summary}</span>
                <span className="preview-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-projects">
            <div className="empty-mark"><InfinityMark /></div>
            <div>
              <span className="eyebrow">Le premier chapitre reste à écrire</span>
              <h3>Les projets de la communauté arrivent ici.</h3>
              <p>Rejoignez EXPOSIS et partagez ce que vous êtes en train de construire.</p>
            </div>
            <Link className="button button-dark button-small" href="/register">
              Rejoindre la communauté <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </section>

      <section className="community-section" id="communaute">
        <div className="community-inner">
          <div>
            <div className="section-kicker"><span>04</span> À plusieurs, autrement</div>
            <h2>On ne construit pas<br />l’avenir <em>en solo.</em></h2>
          </div>
          <div className="community-copy">
            <p>
              Membres, chercheurs, institutions ou porteurs d’idées : chacun peut
              contribuer à faire avancer un projet.
            </p>
            <div className="community-actions">
              <Link className="button button-orange" href="/register">Rejoindre EXPOSIS <span aria-hidden="true">↗</span></Link>
              <Link className="button button-light-outline" href="/soumettre">Proposer une idée <span aria-hidden="true">↗</span></Link>
            </div>
            <Link className="member-link" href="/communaute/projets/nouveau">
              Déjà membre ? Présentez votre projet et ses participants <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="closing-cta">
        <p>La prochaine idée utile peut commencer ici.</p>
        <Link href="/soumettre">Racontez-nous la vôtre <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
