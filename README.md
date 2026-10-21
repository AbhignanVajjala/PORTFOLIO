# Abhignan Vajjala — Research Portfolio

A React, TypeScript, and Vite portfolio for computational biology research and scientific software. The design uses Tailwind CSS with custom CSS, Motion for restrained transitions, Lucide icons, and original SVG research illustrations.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm ci
npm run dev
```

In this cloud environment, use `npm ci --cache /workspace/.npm-cache` because npm’s default home cache is read-only. Open the address printed by Vite. To check the production build:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Commit the portfolio files and push them to the GitHub repository’s `main` branch. Then import that repository into Vercel.
2. Select the **Vite** framework preset. Use `npm run build` as the build command and `dist` as the output directory.
3. Deploy. `vercel.json` rewrites direct requests to project routes to the React app, so `/projects/exo-target` and `/projects/fluxnova` work on refresh.

No environment variables or backend services are required.

## Update content

All personal links, projects, conference statuses, research interests, and toolkit entries are in `src/data.ts`. Add the future EXO-TARGET frontend URL by changing its `demoUrl: null` to the deployed HTTPS URL. The “Interactive Demo — Coming Soon” notice then automatically becomes a “Launch Interactive Demo” link on the project card and detail page.

`src/App.tsx` contains the reusable sections, cards, navigation, and project routes. `src/Visuals.tsx` contains original illustrative scientific SVGs. `src/style.css` contains the visual system and responsive rules. `public/` contains the favicon and social preview image.

Scientific graphics are illustrative and do not represent measured data. Project findings and conference status labels should be updated only when supported by research records.
