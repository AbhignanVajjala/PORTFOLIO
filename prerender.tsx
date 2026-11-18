import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import type { Plugin } from "vite";
import { AppRoutes } from "./src/App";
import { projects } from "./src/data";
import { siteMetadata, socialImage } from "./src/seo";

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
      `<meta property="og:image" content="${socialImage}" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      '<meta property="og:image:alt" content="Abhignan Vajjala, computational biology and research software" />',
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:image" content="${socialImage}" />`,
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
      },
    },
  };
}
