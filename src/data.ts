import results from "./research-results.json";

export type ResearchTopic = {
  title: string;
  text: string;
  values?: { label: string; value: string }[];
  figure?: ResearchFigure;
};

export type ResearchFigure = {
  image: string;
  title: string;
  alt: string;
  interpretation: string;
  sourceLabel: string;
  sourceUrl: string;
  width: number;
  height: number;
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
  contribution: string;
  nextSteps: string[];
  context: string;
  evidence: {
    title: string;
    text: string;
    sourceUrl: string;
    sourceLabel: string;
  };
  heroFigure?: ResearchFigure;
  findings: ResearchTopic[];
  limitations: string[];
  sourceUrl: string;
  demoUrl?: string;
  accent: "teal" | "violet";
};

export type Conference = {
  date: string;
  startDate: string;
  title: string;
  venue: string;
  status: "Participated" | "Abstract Accepted" | "Attended" | "Presented";
  description: string;
  details?: string;
  projectId?: string;
  url?: string;
  linkLabel?: string;
  featured: boolean;
  presentationType?: "Poster";
};

// Exact source revisions used by reproducibility/analyze.py and the rendered figures.
const tnbcSource = `${results.sources.tnbc.repository}/blob/${results.sources.tnbc.commit}`;
const fluxSource = `${results.sources.metaforge.repository}/blob/${results.sources.metaforge.commit}`;
const skillsSource = `${results.sources["agent-skills"].repository}/blob/${results.sources["agent-skills"].commit}`;

export const structureFigure: ResearchFigure = {
  image: "/figures/exo-cd44-thbs1.png",
  title: "A predicted CD44–THBS1 complex",
  alt: "C-alpha trace of the supplied AlphaFold2-Multimer model, with CD44 in teal and THBS1 in violet. Coordinates are in angstroms.",
  interpretation:
    "The mapped T13_THBS1 model contains 248 receptor and 1,152 candidate Cα coordinates. This unrelaxed ColabFold prediction illustrates a proposed arrangement of the modeled sequences. Direct binding and vesicle-surface presentation require experimental testing.",
  sourceLabel: "Exact predicted structure",
  sourceUrl: `${tnbcSource}/backend/data/structures/${results.structure.file}`,
  width: 1280,
  height: 1056,
};

export const rankFigure: ResearchFigure = {
  image: "/figures/exo-rank-sensitivity.png",
  title: "How evidence weights change the ranking",
  alt: "Heatmap of ranks among all 200 pairs under five weight schemes. Eight selected shortlisted pairs are shown, including five highest shortlisted pairs and three examples with all three evidence scores.",
  interpretation:
    "Numbers are ranks among all 200 pairs. The table below uses ranks within the filtered shortlist. Selected rows show the five highest shortlisted pairs and three examples with all three evidence scores. Similar rankings under these weight choices measure methodological stability.",
  sourceLabel: "Source scores and weight schemes",
  sourceUrl: `${tnbcSource}/outputs/scoring_sensitivity.csv`,
  width: 1280,
  height: 960,
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
        text: "AlphaFold-Multimer/ColabFold and AlphaFold 3 predictions supply structural confidence metrics. The structural score uses dataset-wide min–max scaled ipTM (50%), pTM (20%), inverted interface PAE (15%) and mean pLDDT (15%), describing interface, overall and local confidence.",
      },
      {
        title: "Estimate interaction evidence",
        text: "PRODIGY estimates binding free energy (ΔG) from predicted complexes. Values are clipped to the dataset’s 1st–99th percentile range and inverted min–max scaled. STRING contributes its combined association score, largely driven by text mining in this dataset.",
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
      "The TNBC-PROJECT repository contains EXO-TARGET and its EXO-RANK evidence-integration workflow. Python scripts generate scores and compare weight schemes. A FastAPI backend serves stored tables and predicted structures to a React frontend with a molecular viewer.",
    contribution:
      "I developed EXO-TARGET around the receptor–exosomal protein prioritization question and presented the work at AIU ANVESHAN as the sole member of Team PHOENIX. The public repository records the scoring workflow and research interface for this computational investigation.",
    context:
      "The panel contains 20 receptors and ten candidates per receptor, drawn from 21 distinct proteins. Five candidates per receptor were selected for extracellular, adhesion or EV-related plausibility, and five serve as background controls. ExoCarta helped seed selection. Receptor accessibility and localization informed manual selection, whose exact per-pair literature trail remains incomplete.",
    evidence: {
      title: "What has been checked",
      text: "A separate audit recalculated the normalized AlphaFold score, integrated priority score, coverage, shortlist membership and five weight schemes from the frozen CSVs. Experimental binding labels and an independently curated assay-matched reference panel remain unavailable. Group A/B membership reflects selection, so AUROC, average precision and biological prediction accuracy are unassessed. Future reference curation must reconcile species, isoform, domain and assay, and account for overlap with STRING evidence.",
      sourceLabel: "Scoring implementation",
      sourceUrl: `${tnbcSource}/scoring/final_tps.py`,
    },
    nextSteps: [
      "Curate assay-level physical-interaction references matched to the modeled molecular entities and identify any genuine negative experiments. Evaluate structural and energetic baselines with STRING overlap accounted for.",
      "Test prioritized pairs for direct binding and vesicle-surface accessibility, then assess receptor specificity in an appropriate TNBC system.",
    ],
    heroFigure: structureFigure,
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
      "The αvβ3 STRING score uses evidence for its ITGAV and ITGB3 subunits. It does not establish binding to the intact heterodimer. Candidate selection and the UniProt feasibility filter both favor surface-associated biology.",
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
        text: "Synechocystis sp. PCC 6803 model iRH783 includes a proposed TAG extension (TES160, FADD160, ATFA160 and DM_TAG160) after nine DAGK reactions were made forward-only. The comparison uses a selected light intensity of 400 µmol photons m⁻² s⁻¹ and matched non-glycogen biomass demand with reference or zero glycogen allocation.",
      },
      {
        title: "E. coli and recombinant human proinsulin",
        text: "Escherichia coli BL21(DE3) model iHK1487 includes synthesis and demand reactions for an 86-amino-acid human proinsulin precursor. Reference glucose and oxygen uptake limits are 10 and 18.5 mmol/gDCW/h. Comparisons vary those limits and minimum growth requirements, with a baseline translation cost of four ATP equivalents per amino acid.",
      },
    ],
    implementation:
      "FLUXNOVA is the public identity of the Metaforge repository. The React and TypeScript demo displays precomputed COBRApy results. Its controls select stored scenarios, allowing visitors to compare the two applications and their assumptions.",
    contribution:
      "I bring the cyanobacteria and proinsulin model comparisons together in FLUXNOVA’s scientific interface. I presented the FBA work with Team PHOENIX at the Future Forge Innovation Ideathon. The public implementation preserves the supplied output tables and makes their comparison conditions visible.",
    context:
      "Two applications share an FBA approach and a research interface. Their organisms, objectives and comparison conditions differ, so their findings are presented separately below.",
    evidence: {
      title: "What can be reproduced from the public record",
      text: "The figures here are regenerated from the original console outputs, with input checksums and arithmetic checks recorded in this portfolio’s repository. The iRH783 and iHK1487 solver runs have not been independently reproduced. Exact model files and versions, original notebooks, complete media, solver tolerances, and the adapted light-constraint implementation remain missing. Model identifiers alone cannot restore those conditions.",
      sourceLabel: "Original provenance and missing inputs",
      sourceUrl: `${fluxSource}/docs/DATA_PROVENANCE.md`,
    },
    nextSteps: [
      "Recover the exact model files and modification scripts, biomass and medium definitions, and Python/COBRApy/solver versions. Reproduce the reference scenarios with explicit numerical tolerances.",
      "With those inputs, rerun biomass-threshold sensitivity and FVA, and solve a proinsulin growth–production envelope with infeasibility checks. Experimental measurements would then test the model assumptions.",
    ],
    // Metaforge: docs/DATA_PROVENANCE.md and both original console outputs in public/research.
    findings: [
      {
        title: "Cyanobacteria · 7.96% higher theoretical TAG capacity",
        text: "At 80% matched non-glycogen biomass demand, TAG capacity was 0.019869 versus 0.021450 model flux units. The reported relative difference changes from 0.50% at 20% demand to 7.96% at 80% and 17.90% at 90%. Both scenarios contain the added TAG pathway. A separate GLGC-only control showed no TAG benefit.",
        figure: {
          image: "/figures/fluxnova-tag-demand.png",
          title: "Application A · Carbon allocation and TAG capacity",
          alt: "Source-reported TAG capacity at nine matched non-glycogen biomass demands from zero to 100 percent, comparing reference and zero glycogen allocation.",
          interpretation:
            "Each point is a reported source scenario, replotted without a new solver run. The relative difference grows as reference TAG capacity approaches zero. At 100% demand the reference is numerically near zero, making a percentage comparison undefined.",
          sourceLabel: "Original cyanobacteria output",
          sourceUrl: `${fluxSource}/public/research/cyanobacteria-output.txt`,
          width: 1280,
          height: 928,
        },
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
        figure: {
          image: "/figures/fluxnova-proinsulin-growth.png",
          title: "Application B · Growth requirements and proinsulin flux",
          alt: "Eight source-reported proinsulin fluxes decrease as the required growth fraction increases from 20 to 100 percent. Flux is in mmol per gram dry cell weight per hour.",
          interpretation:
            "These eight points come from the original reference nutrient sweep. The 80% point agrees with the printed reference flux to its rounding precision. Values describe the precursor’s theoretical flux. A new production envelope and solver feasibility checks await the executable model.",
          sourceLabel: "Original E. coli output",
          sourceUrl: `${fluxSource}/public/research/ecoli-output.txt`,
          width: 1280,
          height: 928,
        },
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
  {
    id: "bioinformatics-agent-skills",
    name: "Bioinformatics Agent Skills",
    accent: "teal",
    category: "Research software · Bioinformatics workflows",
    status: "Experimental research software",
    short:
      "Reusable research instructions and executable checks for bioinformatics data, study designs and computational workflows.",
    overview:
      "An experimental open-source collection that makes selected scientific assumptions explicit before analysis. It brings together agent instructions, seven validators, synthetic workflows and evaluation infrastructure.",
    question:
      "How can research software detect mismatched samples, confounded designs, pseudoreplication or infeasible model outputs before those errors reach a scientific claim?",
    context:
      "The collection’s 17 skills comprise seven domain workflows and ten foundation or maintainer workflows. Documented examples span bulk RNA-seq readiness, donor-aware pseudobulk, metabolic models, enrichment and descriptive multi-omics association.",
    methodsIntro:
      "The software uses explicit input declarations, deterministic validation gates, synthetic positive and failure controls, and recorded execution evidence.",
    methods: [
      {
        title: "Check data and study design",
        text: "NumPy and pandas support checks of count scales, sample IDs, replication, design rank and subject overlap. These checks assess declared inputs and cannot authenticate the underlying assay or sample identity.",
      },
      {
        title: "Exercise computational recipes",
        text: "Synthetic recipes exercise FBA, pFBA, FVA and infeasibility controls in COBRApy, and bulk RNA-seq designs in pinned DESeq2/edgeR environments. Synthetic controls establish a bounded record of software behavior.",
      },
    ],
    findings: [
      {
        title: "Executable validation is distinct from agent effectiveness",
        text: "The repository records passing synthetic validator and workflow tests. Its ten-turn Phase 2 agent pilot has provisional outcomes of 0 PASS, 4 FAIL and 6 BLOCKED. Skill activation remains unverified in all ten turns, and the study uses one response per condition. These observations cannot establish that skills improve scientific reasoning.",
      },
    ],
    evidence: {
      title: "Evidence and review status",
      text: "The public reports distinguish deterministic tool checks, synthetic recipe execution and an actual agent pilot. The pilot’s provisional automated review remains subject to independent human methodological review. Broader agent performance and scientific reliability remain open evaluation questions.",
      sourceLabel: "Recorded agent pilot and assessment",
      sourceUrl: `${skillsSource}/evals/reports/agent-benchmark-summary.md`,
    },
    implementation:
      "Python utilities expose API and CLI checks with JSON reports, schemas and hashed provenance. The source also includes pinned R recipes, tests and distribution checks. The public repository is the working implementation.",
    contribution:
      "I initiated and maintain this collection, with substantial AI assistance including OpenAI Codex. The repository documents that attribution and its limits. Maintainer responsibility, implementation assistance and independent scientific review are recorded separately.",
    nextSteps: [
      "Complete independent human review of the scientific assumptions and the provisional agent-pilot judgments.",
      "Verify skill activation and run repeated, counterbalanced agent comparisons with predefined rubrics before assessing effectiveness.",
    ],
    limitations: [
      "The executed scientific workflows use synthetic or mocked inputs. They do not establish biological discoveries or clinical utility.",
      "Full pseudobulk differential-state modeling, ranked enrichment, live public-data retrieval and broader agent-host compatibility remain incomplete or untested in the documented scope.",
    ],
    sourceUrl: "https://github.com/AbhignanVajjala/Bioinformatics-agent-skills",
  },
];

export const conferences: Conference[] = [
  {
    date: "Sep 12, 2026",
    startDate: "2026-09-12",
    featured: true,
    title: "National Level Ideathon 5.0 Life Sciences × AI",
    venue: "CBIT · Hyderabad, India",
    status: "Participated",
    description:
      "Presented computational research on cancer-associated receptor–exosomal protein interactions with Team PHOENIX.",
    projectId: "exo-target",
  },
  {
    date: "Oct 5–7, 2026",
    startDate: "2026-10-05",
    featured: true,
    title: "VESICON 2026",
    venue: "AIIMS · New Delhi, India",
    status: "Abstract Accepted",
    description:
      "The abstract was accepted. Academic examinations prevented attendance and presentation.",
    url: "https://www.vesicon2026.com/",
  },
  {
    date: "Oct 10, 2026",
    startDate: "2026-10-10",
    featured: false,
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
    startDate: "2026-10-17",
    featured: true,
    title: "Future Forge Innovation Ideathon 5.0",
    venue: "Organized by ACIC–CBIT · CBIT, Hyderabad, India",
    status: "Presented",
    description:
      "Presented “Flux Balance Analysis: From Metabolic Simulations to Real-World Applications” with Team PHOENIX.",
    projectId: "fluxnova",
  },
  {
    date: "Nov 2–3, 2026",
    startDate: "2026-11-02",
    featured: true,
    title:
      "International Conference on Integrative Oncology, Phytopharmaceutical Innovation and Translational Cancer Research",
    venue: "Metro College of Health Sciences & Research · Greater Noida, India",
    status: "Abstract Accepted",
    description: "My research abstract was accepted for this conference.",
  },
  {
    date: "Nov 13–14, 2026",
    startDate: "2026-11-13",
    featured: true,
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
    startDate: "2026-11-26",
    featured: true,
    presentationType: "Poster",
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
  "Computational Cancer Biology",
  "Structural Bioinformatics",
  "Systems Biology",
  "Genome-Scale Metabolic Modeling",
  "Scientific Software and Bioinformatics",
];

export const toolkit = [
  {
    category: "Scientific Python",
    items:
      "Python, pandas and NumPy for evidence integration, table checks and numerical workflows.",
    evidence: "Scoring scripts",
    url: `${tnbcSource}/scoring/final_interpretation.py`,
  },
  {
    category: "Metabolic models",
    items:
      "FBA and constraint-based scenario interpretation in iRH783 and iHK1487. Original solver runs remain incompletely reproducible.",
    evidence: "Source and scope",
    url: `${fluxSource}/docs/DATA_PROVENANCE.md`,
  },
  {
    category: "Structural Bioinformatics",
    items:
      "AlphaFold confidence, PRODIGY energetics, STRING evidence and UniProt-based surface-feasibility assessment.",
    evidence: "Feasibility workflow",
    url: `${tnbcSource}/scoring/build_bs.py`,
  },
  {
    category: "Workflow validation",
    items:
      "Count-scale, sample-identity, design-rank and replication checks in Python. RNA-seq and multi-omics examples use synthetic data.",
    evidence: "Executable validators",
    url: `${skillsSource}/src/bioskills/validators.py`,
  },
  {
    category: "Research interfaces",
    items:
      "React, TypeScript, Git/GitHub and scientific visualization for inspecting model outputs and communicating their limits.",
    evidence: "Interactive implementation",
    url: `${fluxSource}/src/components/EcoliLab.tsx`,
  },
];
