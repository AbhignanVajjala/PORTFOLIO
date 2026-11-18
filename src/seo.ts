import { person, projects } from "./data";

const siteUrl = "https://abhignanvajjala.vercel.app";

export function siteMetadata(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const project = projects.find((item) => path === `/projects/${item.id}`);
  const known = path === "/" || Boolean(project);
  const title = project
    ? `${project.name} — ${person.name}`
    : path === "/"
      ? `${person.name} — Computational Biology & Research Software`
      : `Page not found — ${person.name}`;
  const description =
    project?.short ??
    (known
      ? `${person.name} is a biotechnology undergraduate at VNR VJIET, Hyderabad, exploring computational biology, metabolic modeling, and research software.`
      : "Explore the computational biology portfolio of Abhignan Vajjala.");
  const url = siteUrl + path;

  return {
    title,
    tags: [
      ["meta", "name", "description", "content", description],
      [
        "meta",
        "name",
        "robots",
        "content",
        known ? "index, follow" : "noindex",
      ],
      ["link", "rel", "canonical", "href", url],
      ["meta", "property", "og:title", "content", title],
      ["meta", "property", "og:description", "content", description],
      ["meta", "property", "og:url", "content", url],
      ["meta", "name", "twitter:title", "content", title],
      ["meta", "name", "twitter:description", "content", description],
    ] as const,
  };
}

export const socialImage = `${siteUrl}/og.png`;
