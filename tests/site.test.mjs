import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const home = read("dist/index.html").replace(/<!--[\s\S]*?-->/g, "");
const routes = ["exo-target", "fluxnova", "bioinformatics-agent-skills"];

test("all seven academic milestones survive static rendering in event order", () => {
  const dates = [...home.matchAll(/<time[^>]+dateTime="([^"]+)"/gi)].map(
    (match) => match[1],
  );
  assert.deepEqual(dates, [
    "2026-09-12",
    "2026-10-05",
    "2026-10-10",
    "2026-10-17",
    "2026-11-02",
    "2026-11-13",
    "2026-11-26",
  ]);
  assert.equal(
    (home.match(/class="status-pill status-abstract-accepted"/g) ?? []).length,
    3,
  );
  assert.equal(
    (home.match(/class="status-pill status-participated"/g) ?? []).length,
    3,
  );
  assert.equal(
    (home.match(/class="status-pill status-presented"/g) ?? []).length,
    1,
  );
  assert.match(home, /Poster abstract accepted/);
  assert.match(home, /sole member of Team PHOENIX/);
});

test("every project has static content, a unique sharing image and a matching canonical", () => {
  for (const slug of routes) {
    const html = read(`dist/projects/${slug}.html`);
    assert.equal((html.match(/<title>/g) ?? []).length, 1);
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    assert.ok(title.includes(" | Abhignan Vajjala"));
    assert.ok(!title.includes("—"));
    assert.ok(html.includes(`content="${title}"`));
    assert.ok(
      html.includes(
        `href="https://abhignanvajjala.vercel.app/projects/${slug}"`,
      ),
    );
    assert.ok(html.includes(`og-${slug}.png`));
    for (const section of [
      "question",
      "methods",
      "findings",
      "evidence",
      "limitations",
      "implementation",
      "contribution",
      "next-steps",
    ]) {
      assert.ok(html.includes(`id="${section}"`));
    }
    assert.ok(existsSync(new URL(`dist/og-${slug}.png`, root)));
  }
  assert.match(
    home,
    /<title>Abhignan Vajjala \| Computational Biology &amp; Research Software<\/title>/,
  );
});

test("generated findings and figure assets are present before client JavaScript runs", () => {
  const exo = read("dist/projects/exo-target.html");
  const flux = read("dist/projects/fluxnova.html");
  assert.match(exo, /Selected shortlist entries/);
  assert.match(exo, /0\.803/);
  assert.match(flux, /7\.96%/);
  for (const filename of [
    "exo-cd44-thbs1.png",
    "exo-rank-sensitivity.png",
    "fluxnova-tag-demand.png",
    "fluxnova-proinsulin-growth.png",
  ]) {
    const path = `dist/figures/${filename}`;
    const bytes = readFileSync(new URL(path, root));
    assert.equal(bytes.toString("ascii", 1, 4), "PNG");
    assert.equal(bytes.readUInt32BE(16), 1280);
  }
});
