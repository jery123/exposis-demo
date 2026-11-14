import type { Metadata } from "next";
import Image from "next/image";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez EXPOSIS, sa mission et l’équipe qui fait avancer la recherche, l’expérimentation et l’innovation informatique en Côte d’Ivoire."
};

type TeamMember = {
  name: string;
  role: string;
  email?: string;
  biography: string;
  portrait: string;
};

const teamMembers: TeamMember[] = [{
  name: "Issouf D. Dayo",
  role: "Président | INP-HB | IT engineer | IT specialist ",
  email: "jean.kouassi@exposis.net",
  biography: "Jean KOUASSI est le Président du laboratoire EXPOSIS. Il est passionné par la recherche et l'innovation en informatique.",
  portrait: "/images/team/1.jpeg"
}, {
  name: "IVES TAHOU",
  role: "Élève en fin de cycle ingénieur en télécommunications et réseaux.",
  email: "awa.traore@exposis.net",
  biography: "Awa TRAORE est la Directrice de la recherche au laboratoire EXPOSIS. Elle est dédiée à l'avancement de la recherche et de l'innovation en informatique.",
  portrait: "/images/team/2.png"
}, {
  name: "Jery Foto",
  role: "Network Consultant Intern | Computer Engineer | Cloud & Cybersecurity | DevOps | AI/IoT Research Enthusiast",
  email: "awa.traore@exposis.net",
  biography: "Awa TRAORE est la Directrice de la recherche au laboratoire EXPOSIS. Elle est dédiée à l'avancement de la recherche et de l'innovation en informatique.",
  portrait: "/images/team/3.jpeg"
}];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroInner}>
          <h1 id="about-title">À propos</h1>
        </div>
      </section>

      <section className={styles.mission} aria-labelledby="about-intro-title">
        <div className={styles.missionInner}>
          <h2 id="about-intro-title">Le laboratoire EXPOSIS</h2>
          <p>
            EXPOSIS est le Laboratoire de Recherche, d’Expérimentation et
            d’Innovation en Informatique. Organisation indépendante de toute affiliation politique ou religieuse, nous
            contribuons au développement des compétences et à l’innovation
            informatique en Côte d’Ivoire et en Afrique.
          </p>
          <p>
            Par la recherche appliquée, l’expérimentation et la diffusion de
            solutions numériques, nous apprenons en faisant, construisons des
            réponses utiles et partageons les connaissances acquises.
          </p>
        </div>
      </section>

      <section className={styles.team} id="equipe" aria-labelledby="team-title">
        <div className={styles.teamInner}>
          <div className={styles.teamHeading}>
            <h2 id="team-title">Notre équipe</h2>
            <p>
              Les personnes qui font vivre la recherche, l’expérimentation et
              l’innovation chez EXPOSIS.
            </p>
          </div>
          {teamMembers.length > 0 ? (
            <div className={styles.teamGrid}>
              {teamMembers.map((member) => (
                <article className={styles.memberCard} key={member.name}>
                  <div className={styles.memberTop}>
                    <div className={styles.portrait}>
                      <Image
                        src={member.portrait}
                        alt={`Portrait de ${member.name}`}
                        fill
                        sizes="88px"
                      />
                    </div>
                    <div className={styles.memberInfo}>
                      <h3>{member.name}</h3>
                      <p className={styles.memberRole}>{member.role}</p>
                      {member.email && (
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      )}
                    </div>
                  </div>
                  <p className={styles.memberBiography}>{member.biography}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.teamGrid}>
              <article className={styles.memberCard}>
                <div className={styles.memberTop}>
                  <div className={`${styles.portrait} ${styles.portraitPending}`} aria-hidden="true">EX</div>
                  <div className={styles.memberInfo}>
                    <h3>Nom du membre</h3>
                    <p className={styles.memberRole}>Intitulé du poste</p>
                  </div>
                </div>
                <p className={styles.memberBiography}>
                  Les noms, fonctions et portraits seront ajoutés dès réception
                  des informations de l’équipe.
                </p>
              </article>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
