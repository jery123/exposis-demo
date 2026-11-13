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

const apiUrl = (
  process.env.LARAVEL_API_URL ??
  process.env.LARAVEL_APP_URL ??
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function getProjects(pole?: string, search?: string): Promise<{
  projects: PublicProject[] | null;
  available: boolean;
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

    if (!response.ok) return { projects: null, available: false };

    const data: { projects?: PublicProject[] } = await response.json();
    if (!Array.isArray(data.projects)) return { projects: null, available: false };
    return { projects: data.projects, available: true };
  } catch (error) {
    if (error instanceof TypeError) return { projects: null, available: false };
    throw error;
  }
}

export async function getProject(slug: string): Promise<{
  project: PublicProject | null;
  available: boolean;
}> {
  try {
    const response = await fetch(
      `${apiUrl}/api/public/projects/${encodeURIComponent(slug)}`,
      { cache: "no-store", headers: { Accept: "application/json" } }
    );

    if (response.status === 404) return { project: null, available: true };
    if (!response.ok) return { project: null, available: false };

    const data: { project?: PublicProject } = await response.json();
    if (!data.project) return { project: null, available: false };
    return { project: data.project, available: true };
  } catch (error) {
    if (error instanceof TypeError) return { project: null, available: false };
    throw error;
  }
}
