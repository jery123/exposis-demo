export const researchAreas = [
  "Cybersécurité",
  "Intelligence Artificielle",
  "Logiciel & Open Source",
  "Réseaux Cloud & Edge",
  "Formation"
] as const;

export type PublicProject = {
  slug: string;
  title: string;
  summary: string;
  body?: string;
  pole: string;
  status: string;
  repo_url?: string;
  has_report?: boolean;
  report?: { name: string; url: string };
  images?: { id: number; url: string }[];
  team_members: string[];
  published_at: string | null;
};

const demoProjects: PublicProject[] = [
  {
    slug: "observatoire-cybersecurite-associations",
    title: "Observatoire de la cybersécurité associative",
    summary:
      "Un exemple de plateforme pour aider les associations à évaluer et renforcer leurs pratiques de sécurité numérique.",
    body:
      "Ce projet de démonstration présente un parcours d’autoévaluation et des ressources pratiques pour mieux protéger les outils et les données des associations.",
    pole: "Cybersécurité",
    status: "Démo",
    team_members: [],
    published_at: null
  },
  {
    slug: "assistant-agricole-hors-ligne",
    title: "Assistant agricole hors ligne",
    summary:
      "Un exemple d’assistant numérique qui rend des conseils agricoles accessibles même lorsque la connexion est limitée.",
    body:
      "Ce projet de démonstration explore une interface légère donnant accès à des informations utiles sur les cultures, avec une synchronisation lorsque le réseau est disponible.",
    pole: "Intelligence Artificielle",
    status: "Démo",
    team_members: [],
    published_at: null
  },
  {
    slug: "cartographie-zones-blanches",
    title: "Cartographie des zones blanches",
    summary:
      "Un exemple de cartographie collaborative pour mieux visualiser la couverture réseau et les besoins des communautés.",
    body:
      "Ce projet de démonstration illustre comment des relevés de terrain pourraient aider à identifier les zones peu desservies et à documenter les besoins de connectivité.",
    pole: "Réseaux Cloud & Edge",
    status: "Démo",
    team_members: [],
    published_at: null
  }
];

const apiUrl = (
  process.env.LARAVEL_API_URL ??
  process.env.LARAVEL_APP_URL ??
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

function getDemoProjects(pole?: string, search?: string): PublicProject[] {
  const query = search?.toLocaleLowerCase("fr");

  return demoProjects.filter((project) => {
    if (pole && project.pole !== pole) return false;
    if (!query) return true;

    return [
      project.title,
      project.summary,
      project.body,
      project.pole,
      ...project.team_members
    ]
      .filter((value): value is string => typeof value === "string")
      .some((value) => value.toLocaleLowerCase("fr").includes(query));
  });
}

export async function getProjects(pole?: string, search?: string): Promise<{
  projects: PublicProject[] | null;
  available: boolean;
  demo: boolean;
}> {
  const query = new URLSearchParams();
  if (pole) query.set("pole", pole);
  if (search) query.set("q", search);
  const suffix = query.size ? `?${query.toString()}` : "";
  try {
    const response = await fetch(`${apiUrl}/api/public/projects${suffix}`, {
      cache: "no-store",
      headers: { Accept: "application/json" }
    });

    if (response.status >= 500) {
      return { projects: getDemoProjects(pole, search), available: true, demo: true };
    }
    if (!response.ok) return { projects: null, available: false, demo: false };

    const data: { projects?: PublicProject[] } = await response.json();
    if (!Array.isArray(data.projects)) return { projects: null, available: false, demo: false };
    return { projects: data.projects, available: true, demo: false };
  } catch (error) {
    if (error instanceof TypeError) {
      return { projects: getDemoProjects(pole, search), available: true, demo: true };
    }
    throw error;
  }
}

export async function getProject(slug: string): Promise<{
  project: PublicProject | null;
  available: boolean;
  demo: boolean;
}> {
  try {
    const response = await fetch(
      `${apiUrl}/api/public/projects/${encodeURIComponent(slug)}`,
      { cache: "no-store", headers: { Accept: "application/json" } }
    );

    if (response.status === 404) return { project: null, available: true, demo: false };
    if (response.status >= 500) {
      const project = demoProjects.find((demoProject) => demoProject.slug === slug) ?? null;
      return { project, available: project !== null, demo: project !== null };
    }
    if (!response.ok) return { project: null, available: false, demo: false };

    const data: { project?: PublicProject } = await response.json();
    if (!data.project) return { project: null, available: false, demo: false };
    return { project: data.project, available: true, demo: false };
  } catch (error) {
    if (error instanceof TypeError) {
      const project = demoProjects.find((demoProject) => demoProject.slug === slug) ?? null;
      return { project, available: project !== null, demo: project !== null };
    }
    throw error;
  }
}
