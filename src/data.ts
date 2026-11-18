type ResearchTopic = {
  title: string;
  text: string;
  values?: { label: string; value: string }[];
};

export type Project = {
  id: string;
  name: string;
  category: string;
  status: string;
  short: string;
  overview: string;
  question: string;
  methodsIntro: string;
  methods: ResearchTopic[];
  implementation: string;
  findings: ResearchTopic[];
  limitations: string[];
  sourceUrl: string;
  demoUrl: string;
  accent: "teal" | "violet";
};

export type Conference = {
  date: string;
  title: string;
  venue: string;
  status: "Participated" | "Abstract Accepted" | "Attended" | "Presented";
  description: string;
  details?: string;
  projectId?: string;
  url?: string;
  linkLabel?: string;
};

export const person = {
  name: "Abhignan Vajjala",
  descriptor: "B.Tech Biotechnology undergraduate at VNR VJIET, Hyderabad",
  intro:
    "I model protein interactions and metabolic systems, and build software to explore the results.",
  institute: "VNR Vignana Jyothi Institute of Engineering and Technology",
  email: "abhignanvajjala.2008@gmail.com",
  github: "https://github.com/AbhignanVajjala",
  linkedin: "https://www.linkedin.com/in/abhignan-vajjala-6211833b2/",
  rosalind: "https://rosalind.info/users/Abhignan/",
  rosalindSolutions:
    "https://github.com/AbhignanVajjala/Rosalind-Bioinformatics-Stronghold-Solutions",
};

export const projects: Project[] = [
  {
    id: "exo-target",
    name: "EXO-TARGET",
    accent: "teal",
    category: "Structural bioinformatics · Cancer biology",
    status: "Computational research",
    short:
      "Prioritizing candidate interactions between tumor-cell receptors and exosomal proteins in triple-negative breast cancer.",
    overview:
      "Triple-negative breast cancer (TNBC) tests negative for estrogen and progesterone receptors and for HER2 overexpression or amplification, limiting the use of therapies directed at those markers. EXO-TARGET asks which proteins could interact with TNBC-associated cell-surface receptors if exposed on the surface of exosomes, a type of extracellular vesicle.",
    question:
      "Which receptor–protein pairs should be tested first when structural confidence, predicted energetics, prior association evidence, and possible vesicle-surface exposure are considered together?",
    methodsIntro:
      "EXO-RANK is the scoring workflow within EXO-TARGET. It combines up to three available evidence scores for each pair and applies a separate surface-feasibility filter.",
    methods: [
      {
        title: "Predict complexes",
        text: "AlphaFold-Multimer and AlphaFold 3 predictions supply structural confidence metrics. The score combines ipTM and pTM (interface and overall confidence), interface PAE (predicted alignment error), and mean pLDDT (local confidence).",
      },
      {
        title: "Estimate interaction evidence",
        text: "PRODIGY estimates binding free energy (ΔG) from predicted complexes where available. The estimates are scaled after limiting the effect of outliers. STRING adds a combined association score, largely driven by text mining in this dataset.",
      },
      {
        title: "Rank with evidence coverage",
        text: "The prioritization score averages the available 0–1 scores from AlphaFold, PRODIGY, and STRING with equal weight. Coverage counts the available scores separately, and missing values are left unfilled.",
      },
      {
        title: "Filter for surface feasibility",
        text: "UniProt localization and topology annotations inform whether a protein could face outward on a vesicle. The shortlist requires at least two evidence scores and a medium or high feasibility flag.",
      },
    ],
    implementation:
      "Python scripts integrate the evidence tables and assess rank sensitivity. The repository includes scoring outputs, predicted structures, and a FastAPI backend that serves them for inspection. The interactive frontend provides a molecular viewer and pages for exploring candidate pairs.",
    // TNBC-PROJECT: final_score_calculation.csv, final_preferred_shortlist.csv, FINAL_EXO_RANK_RESULTS.md.
    findings: [
      {
        title: "Coverage and feasibility narrowed the shortlist",
        text: "Five shortlisted pairs had all three evidence scores, high surface feasibility, a top-quartile score, and stable ranks under the tested weightings. CD44–THBS1 was one example. The feasibility filter also excluded all TPI1 pairs despite high structural confidence for some of them.",
        values: [
          { label: "Pairs evaluated", value: "200" },
          { label: "With at least two scores", value: "176" },
          { label: "After feasibility filtering", value: "121" },
        ],
      },
    ],
    limitations: [
      "The ranking uses heuristic weights without experimental interaction labels. Direct binding, vesicle-surface exposure, and targeting in TNBC remain to be tested.",
      "The structural confidence and PRODIGY scores draw on the same predicted complex where both are available. STRING evidence was available for only 64 of 200 pairs and is mostly literature-derived association. Surface exposure inferred from localization remains uncertain.",
    ],
    sourceUrl: "https://github.com/AbhignanVajjala/TNBC-PROJECT",
    demoUrl: "https://tnbc-project-iota.vercel.app/",
  },
  {
    id: "fluxnova",
    name: "FLUXNOVA",
    accent: "violet",
    category: "Systems biology · Metabolic modeling",
    status: "Simulation-based investigation",
    short:
      "Modeling carbon allocation to triacylglycerol in cyanobacteria and recombinant human proinsulin flux in E. coli.",
    overview:
      "FLUXNOVA uses flux balance analysis (FBA) to investigate two genome-scale models. One explores how cyanobacteria allocate carbon to triacylglycerol (TAG). The other estimates recombinant human proinsulin flux in E. coli.",
    question:
      "How does glycogen allocation affect theoretical TAG capacity in cyanobacteria? How do nutrient availability and minimum growth requirements affect predicted proinsulin flux in E. coli?",
    methodsIntro:
      "Python and COBRApy were used to optimize product flux subject to steady-state mass balance, reaction bounds, and each scenario’s biomass requirements.",
    methods: [
      {
        title: "Cyanobacteria and triacylglycerol",
        text: "The iRH783 model of Synechocystis sp. PCC 6803 was extended with a proposed triacylglycerol (TAG) pathway. Simulations compared reference glycogen allocation with zero glycogen allocation at matched non-glycogen biomass demand to isolate the modeled carbon trade-off.",
      },
      {
        title: "E. coli and recombinant human proinsulin",
        text: "The iHK1487 model of Escherichia coli BL21(DE3) includes a reaction for the 86-amino-acid human proinsulin precursor. Simulations vary glucose and oxygen uptake limits and compare a fixed minimum growth rate with a minimum set to 80% of each nutrient scenario’s maximum growth.",
      },
    ],
    implementation:
      "The React and TypeScript demo displays precomputed COBRApy results. Its controls select stored scenarios, so visitors can compare outcomes without launching new optimizations.",
    // Metaforge: docs/DATA_PROVENANCE.md and both original console outputs in public/research.
    findings: [
      {
        title: "Cyanobacteria · 7.96% higher theoretical TAG capacity",
        text: "At 80% of the reference non-glycogen biomass flux, removing the imposed glycogen allocation increased maximum TAG capacity. Both scenarios included the added TAG pathway. A separate GLGC-only control showed no TAG benefit. Capacity is reported in model flux units.",
        values: [
          { label: "Reference glycogen allocation", value: "0.01987" },
          { label: "Zero glycogen allocation", value: "0.02145" },
        ],
      },
      {
        title:
          "E. coli · Growth requirements changed predicted proinsulin flux",
        text: "Both best-case scenarios used 1.2× the reference glucose and oxygen uptake limits. Holding minimum growth at 0.656 h⁻¹ left more capacity for proinsulin than requiring 80% of the nutrient scenario’s maximum growth. Fluxes are in mmol proinsulin per gram of dry cell weight per hour (mmol/gDCW/h).",
        values: [
          { label: "Reference", value: "0.02475" },
          { label: "Fixed minimum growth", value: "0.05010" },
          { label: "Adaptive minimum growth", value: "0.02996" },
        ],
      },
    ],
    limitations: [
      "The TAG comparison estimates theoretical capacity. Measured TAG production, downstream biodiesel yield, and the effects of genetic interventions remain unverified.",
      "The E. coli flux describes synthesis of a precursor that would require further processing to become mature insulin. Fitness and product formation under these nutrient conditions need experimental testing, including fermentation yield and titer.",
      "The repository preserves the reported outputs. Original Python notebooks, exact model files and versions, and full solver and medium settings needed to rerun the analyses are unavailable there.",
    ],
    sourceUrl: "https://github.com/AbhignanVajjala/Metaforge",
    demoUrl: "https://metaforge-xi.vercel.app/",
  },
];

export const conferences: Conference[] = [
  {
    date: "Sep 12, 2026",
    title: "National Level Ideathon 5.0 Life Sciences × AI",
    venue: "CBIT · Hyderabad, India",
    status: "Participated",
    description:
      "Presented computational research on cancer-associated receptor–exosomal protein interactions with Team PHOENIX.",
    projectId: "exo-target",
  },
  {
    date: "Oct 5–7, 2026",
    title: "VESICON 2026",
    venue: "AIIMS · New Delhi, India",
    status: "Abstract Accepted",
    description:
      "The abstract was accepted. Academic examinations prevented attendance and presentation.",
    url: "https://www.vesicon2026.com/",
  },
  {
    date: "Oct 10, 2026",
    title: "ICSEED 2026",
    venue: "CBIT · Hyderabad, India",
    status: "Participated",
    description:
      "Took part in the October 10 program on sustainable energy, environment, and development.",
    url: "https://www.cbit.ac.in/events_post/icseed-2026/",
    linkLabel: "CBIT event page",
  },
  {
    date: "Oct 17, 2026",
    title: "Future Forge Innovation Ideathon 5.0",
    venue: "Organized by ACIC–CBIT · CBIT, Hyderabad, India",
    status: "Presented",
    description:
      "Presented “Flux Balance Analysis: From Metabolic Simulations to Real-World Applications” with Team PHOENIX.",
    projectId: "fluxnova",
  },
  {
    date: "Nov 2–3, 2026",
    title:
      "International Conference on Integrative Oncology, Phytopharmaceutical Innovation and Translational Cancer Research",
    venue: "Metro College of Health Sciences & Research · Greater Noida, India",
    status: "Abstract Accepted",
    description: "My research abstract was accepted for this conference.",
  },
  {
    date: "Nov 13–14, 2026",
    title: "AIU ANVESHAN 2026 — South Zone Student Research Convention",
    venue:
      "University College of Engineering, Osmania University · Hyderabad, India",
    status: "Participated",
    description:
      "Presented EXO-TARGET under Health Sciences and Allied Subjects as the sole member of Team PHOENIX.",
    details:
      "Organised by the Association of Indian Universities (AIU) and hosted by Osmania University.",
    projectId: "exo-target",
    url: "https://projectset.com/anveshan",
    linkLabel: "Participation portal",
  },
  {
    date: "Nov 26–27, 2026",
    title:
      "NLSEV 2026 · Netherlands Society for Extracellular Vesicles 2026 Scientific Meeting",
    venue: "De Puddingfabriek · Groningen, Netherlands",
    status: "Abstract Accepted",
    description:
      "My research abstract was accepted for poster presentation at the scheduled meeting.",
    details: "Organised by the Netherlands Society for Extracellular Vesicles.",
    url: "https://www.nlsev.nl/evdelta/wp/nlsev-2026/",
  },
];

export const interests = [
  "Computational Biology",
  "Structural Bioinformatics",
  "Computational Cancer Biology",
  "Protein Interactions",
  "Systems Biology",
  "Genome-Scale Metabolic Modeling",
  "Computational Drug Discovery",
  "Scientific Software Development",
];

export const toolkit = [
  {
    category: "Programming",
    items: "Python, scientific scripting, data processing",
  },
  {
    category: "Systems Biology",
    items: "COBRApy, Flux Balance Analysis, genome-scale metabolic models",
  },
  {
    category: "Structural Bioinformatics",
    items:
      "AlphaFold-Multimer, UniProt, Protein Data Bank, protein interaction analysis",
  },
  {
    category: "Scientific Data",
    items:
      "Biological datasets, computational research workflows, scientific visualization",
  },
  {
    category: "Development",
    items: "React, TypeScript, interactive scientific applications",
  },
];
