import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez EXPOSIS, sa mission, ses objectifs et l’équipe qui fait avancer la recherche, l’expérimentation et l’innovation informatique en Côte d’Ivoire."
};

type TeamMember = {
  name: string;
  role: string;
  biography: string;
  portrait: string;
};

const teamMembers: TeamMember[] = [];

const values = [
  {
    number: "01",
    title: "Recherche appliquée",
    description:
      "Nous partons de questions concrètes et testons les idées avec rigueur avant d’en partager les résultats."
  },
  {
    number: "02",
    title: "Compétences en action",
    description:
      "Chaque projet est une occasion d’apprendre, de transmettre et de faire grandir les talents numériques."
  },
  {
    number: "03",
    title: "Innovation utile",
    description:
      "Nous cherchons des réponses adaptées aux réalités de la Côte d’Ivoire et aux besoins de ses communautés."
  },
  {
    number: "04",
    title: "Connaissances partagées",
    description:
      "Nous documentons nos démarches et privilégions les solutions ouvertes chaque fois que cela est possible."
  }
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className="eyebrow"><span className="status-dot" /> Laboratoire indépendant · Côte d’Ivoire</p>
          <h1>Faire de la curiosité<br />une force <em>collective.</em></h1>
          <p className={styles.heroIntro}>
            EXPOSIS est le Laboratoire de Recherche, d’Expérimentation et
            d’Innovation en Informatique. Nous créons un espace où les idées se
            testent, les compétences se construisent et les solutions se partagent.
          </p>
          <a className="button button-orange" href="#notre-mission">Découvrir notre mission <span aria-hidden="true">↓</span></a>
          <div className={styles.heroNote}><span>EX / CI</span><span>Apprendre · Explorer · Bâtir</span><span>01 — 04</span></div>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.orbit} />
          <div className={styles.orbitInner} />
          <div className={styles.artCore}><strong>E.</strong><span>une idée<br />en mouvement</span></div>
          <span className={`${styles.artTag} ${styles.artTagOne}`}>01 · Recherche</span>
          <span className={`${styles.artTag} ${styles.artTagTwo}`}>02 · Expérimentation</span>
          <span className={`${styles.artTag} ${styles.artTagThree}`}>03 · Partage</span>
        </div>
      </section>

      <section className={styles.mission} id="notre-mission">
        <div className="section-kicker"><span>01</span> Notre raison d’être</div>
        <div className={styles.missionGrid}>
          <h2>Un terrain de recherche tourné vers <em>le réel.</em></h2>
          <div>
            <p className={styles.missionLead}>
              Nous contribuons au développement des compétences et à
              l’innovation informatique en Côte d’Ivoire, puis en Afrique, par
              la recherche appliquée, l’expérimentation et la diffusion de
              solutions numériques.
            </p>
            <p className={styles.missionNote}>
              Organisation à but non lucratif, EXPOSIS agit de manière
              indépendante de toute affiliation politique ou religieuse.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.aims}>
        <div className={styles.aimsHeading}>
          <div className="section-kicker"><span>02</span> Ce que nous voulons faire avancer</div>
          <h2>Des objectifs concrets.<br /><em>Un impact qui se partage.</em></h2>
        </div>
        <div className={styles.aimGrid}>
          <article><span>01</span><h3>Explorer les enjeux numériques</h3><p>Ouvrir des pistes de recherche et mettre les technologies émergentes à l’épreuve des besoins locaux.</p></article>
          <article><span>02</span><h3>Former par la pratique</h3><p>Faire des projets un cadre concret pour acquérir des compétences, collaborer et progresser ensemble.</p></article>
          <article><span>03</span><h3>Prototyper des réponses utiles</h3><p>Passer de l’observation à l’expérimentation, puis construire des solutions responsables et pertinentes.</p></article>
          <article><span>04</span><h3>Diffuser les apprentissages</h3><p>Documenter les démarches et rendre les connaissances accessibles à la communauté.</p></article>
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.valuesIntro}>
          <div className="section-kicker section-kicker-light"><span>03</span> Notre manière d’agir</div>
          <h2>Une démarche ouverte.<br /><em>Des convictions solides.</em></h2>
          <p>La qualité du résultat compte. La manière de le construire et de le partager aussi.</p>
        </div>
        <div className={styles.valueList}>
          {values.map((value) => (
            <article key={value.number}>
              <span>{value.number}</span>
              <div><h3>{value.title}</h3><p>{value.description}</p></div>
              <span aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.team} id="equipe">
        <div className={styles.teamHeading}>
          <div><div className="section-kicker"><span>04</span> Celles et ceux qui font EXPOSIS</div><h2>Une équipe qui avance <em>ensemble.</em></h2></div>
          <p>Des parcours et des expertises qui se rencontrent autour d’une même envie : faire progresser l’informatique par l’action.</p>
        </div>
        {teamMembers.length > 0 ? (
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <article className={styles.memberCard} key={member.name}>
                <div className={styles.portrait}>
                  <Image src={member.portrait} alt={`Portrait de ${member.name}`} fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                </div>
                <div className={styles.memberInfo}><span>{member.role}</span><h3>{member.name}</h3><p>{member.biography}</p></div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.teamPending}>
            <span className={styles.teamMark} aria-hidden="true">∞</span>
            <div><span className="eyebrow">Une aventure collective</span><h3>Les visages de l’équipe bientôt ici.</h3><p>Cette page accueillera les portraits, les rôles et les présentations des membres d’EXPOSIS dès que les profils et les photos auront été réunis.</p></div>
          </div>
        )}
      </section>

      <section className={styles.closing}>
        <span className="section-kicker"><span>EX / 05</span> Construisons la suite</span>
        <h2>Une idée prend vie<br />quand on la <em>construit ensemble.</em></h2>
        <div><Link className="button button-orange" href="/soumettre">Parler d’un projet <span aria-hidden="true">↗</span></Link><Link className="underlined-link" href="/projets">Explorer les projets <span aria-hidden="true">↗</span></Link></div>
      </section>
    </div>
  );
}
