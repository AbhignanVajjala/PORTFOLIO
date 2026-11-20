import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import type { Plugin } from "vite";
import { AppRoutes } from "./src/App";
import { projects } from "./src/data";
import { siteMetadata, siteUrl } from "./src/seo";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function addMetadata(html: string, path: string) {
  const { title, tags } = siteMetadata(path);
  const elements = tags.map(
    ([element, key, name, attribute, value]) =>
      `<${element} ${key}="${name}" ${attribute}="${escapeHtml(value)}" />`,
  );
  const titledHtml = html.replace(
    /<title>[^<]*<\/title>/,
    () => `<title>${escapeHtml(title)}</title>`,
  );
  return titledHtml.replace("<!--page-metadata-->", () =>
    [
      ...elements,
      '<meta property="og:type" content="website" />',
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      '<meta name="twitter:card" content="summary_large_image" />',
    ].join("\n    "),
  );
}

function renderPage(html: string, path: string) {
  const content = renderToString(
    <StaticRouter location={path}>
      <AppRoutes />
    </StaticRouter>,
  );
  return addMetadata(html, path).replace(
    '<div id="root"></div>',
    () => `<div id="root">${content}</div>`,
  );
}

export function prerenderPortfolio(): Plugin {
  return {
    name: "prerender-portfolio",
    transformIndexHtml(html, context) {
      if (context.server) {
        return addMetadata(
          html,
          (context.originalUrl ?? context.path).split("?")[0],
        );
      }
    },
    generateBundle: {
      order: "post",
      handler(_, bundle) {
        const index = bundle["index.html"];
        if (index?.type !== "asset" || typeof index.source !== "string") {
          this.error(
            "Expected Vite to generate index.html before prerendering.",
          );
        }
        const template = index.source;
        index.source = renderPage(template, "/");
        for (const project of projects) {
          const path = `/projects/${project.id}`;
          this.emitFile({
            type: "asset",
            fileName: `projects/${project.id}.html`,
            source: renderPage(template, path),
          });
        }
        this.emitFile({
          type: "asset",
          fileName: "404.html",
          source: renderPage(template, "/404"),
        });
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
        });
        const paths = [
          "/",
          ...projects.map((project) => `/projects/${project.id}`),
        ];
        const sitemapEntries = paths
          .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
          .join("\n");
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
        });
      },
    },
  };
}
