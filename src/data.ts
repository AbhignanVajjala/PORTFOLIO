export type Project = {
  id: string;
  index: string;
  name: string;
  category: string;
  short: string;
  overview: string;
  question: string;
  methods: string[];
  implementation: string;
  findings: string[];
  limitations: string[];
  sourceUrl: string;
  demoUrl: string | null;
  accent: "teal" | "violet";
};

export type Conference = {
  date: string;
  title: string;
  venue: string;
  status:
    | "Participated"
    | "Abstract Accepted"
    | "Attended"
    | "Presented"
    | "Upcoming";
  description: string;
  projectId?: string;
  url?: string;
};

export const person = {
  name: "Abhignan Vajjala",
  descriptor:
    "Biotechnology Undergraduate | Computational Biology & Research Software",
  headline: "Exploring biological systems through computation.",
  intro:
    "I work at the intersection of biotechnology and programming, investigating biological systems through computational modeling, structural analysis, and research-oriented software development.",
  affiliation: [
    "Department of Biotechnology",
    "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)",
    "Hyderabad, India",
  ],
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
    index: "01",
    name: "EXO-TARGET",
    accent: "teal",
    category:
      "Structural Bioinformatics / Protein Interactions / Cancer Biology",
    short:
      "Mapping possible receptor–exosomal protein interactions in triple-negative breast cancer through structural analysis and biological evidence.",
    overview:
      "EXO-TARGET investigates computational interactions between triple-negative breast cancer-associated cell-surface receptors and exosomal proteins. It brings structural analysis and biological evidence together to prioritize candidate molecular interactions for further investigation.",
    question:
      "Which receptor–exosomal protein pairs are structurally plausible and biologically relevant enough to warrant further investigation?",
    methods: [
      "AlphaFold-Multimer",
      "Protein structure analysis",
      "Structural confidence metrics",
      "PRODIGY-based binding energetics",
      "STRING interaction evidence",
      "Biological feasibility assessment",
    ],
    implementation:
      "Python-based scientific workflows support structure and evidence analysis. Interactive visualization of molecular interaction results is being developed.",
    findings: [
      "A computational framework for assessing and prioritizing candidate receptor–exosomal protein interactions relevant to triple-negative breast cancer.",
    ],
    limitations: [
      "Predicted structures and computed interaction scores do not establish experimentally verified binding.",
      "Candidate interactions require biological and experimental follow-up.",
    ],
    sourceUrl: "https://github.com/AbhignanVajjala/TNBC-PROJECT",
    demoUrl: null,
  },
  {
    id: "fluxnova",
    index: "02",
    name: "FLUXNOVA",
    accent: "violet",
    category: "Systems Biology / Flux Balance Analysis / Metabolic Engineering",
    short:
      "Exploring metabolic design questions in cyanobacteria and E. coli with constraint-based genome-scale modeling.",
    overview:
      "FLUXNOVA explores metabolic engineering using genome-scale metabolic models and constraint-based Flux Balance Analysis across two biological applications: carbon allocation and theoretical TAG production in Synechocystis sp. PCC 6803, and modeled recombinant proinsulin production in E. coli BL21(DE3).",
    question:
      "How do simulated metabolic constraints change theoretical product capacity and pathway behavior in these model systems?",
    methods: [
      "Python",
      "COBRApy",
      "Flux Balance Analysis",
      "iRH783 model of Synechocystis sp. PCC 6803",
      "iHK1487 model of E. coli BL21(DE3)",
      "Metabolic pathway analysis",
      "Data visualization",
    ],
    implementation:
      "Python and COBRApy workflows run model comparisons and pathway analysis; an interactive scientific frontend makes the simulation results explorable.",
    findings: [
      "A simulated 7.96% increase in theoretical TAG capacity under the documented model-comparison conditions.",
      "The E. coli application explores modeled recombinant proinsulin production under varying simulated metabolic constraints.",
    ],
    limitations: [
      "The 7.96% figure is a simulation-derived theoretical result, not an experimentally verified increase in biodiesel yield or a confirmed genetic-engineering improvement.",
      "The E. coli model concerns proinsulin production, not mature insulin production.",
      "Model outputs depend on assumptions and constraints and need experimental validation.",
    ],
    sourceUrl: "https://github.com/AbhignanVajjala/Metaforge",
    demoUrl: "https://metaforge-xi.vercel.app/",
  },
];

export const conferences: Conference[] = [
  {
    date: "SEP 12, 2026",
    title: "National Level Ideathon 5.0 Life Sciences × AI",
    venue: "CBIT · Hyderabad, India",
    status: "Participated",
    description:
      "Presented computational research on cancer-associated receptor–exosomal protein interactions with Team PHOENIX.",
    projectId: "exo-target",
  },
  {
    date: "OCT 05–07, 2026",
    title: "VESICON 2026",
    venue: "AIIMS · New Delhi, India",
    status: "Abstract Accepted",
    description:
      "Abstract accepted. Did not attend or present because of academic examinations.",
  },
  {
    date: "OCT 10, 2026",
    title: "ICSEED 2026",
    venue: "CBIT · Hyderabad, India",
    status: "Attended",
    description: "Attended the conference.",
    url: "https://icseed2026.info/",
  },
  {
    date: "OCT 17, 2026",
    title: "Future Forge Innovation Ideathon 5.0",
    venue: "Organized by ACIC–CBIT · CBIT, Hyderabad, India",
    status: "Presented",
    description:
      "Presented “Flux Balance Analysis: From Metabolic Simulations to Real-World Applications” with Team PHOENIX.",
    projectId: "fluxnova",
  },
  {
    date: "NOV 02–03, 2026",
    title:
      "International Conference on Integrative Oncology, Phytopharmaceutical Innovation and Translational Cancer Research",
    venue: "Metro College of Health Sciences & Research · Greater Noida, India",
    status: "Upcoming",
    description:
      "Upcoming event; attendance and presentation have not been confirmed.",
  },
];

export const interests = [
  "Computational Biology",
  "Structural Bioinformatics",
  "Computational Cancer Biology",
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
