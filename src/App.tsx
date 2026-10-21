import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Braces,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  Dna,
  ExternalLink,
  Github,
  Linkedin,
  Menu,
  Microscope,
  Network,
  Orbit,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  conferences,
  interests,
  person,
  projects,
  toolkit,
  type Conference,
  type Project,
} from "./data";
import {
  FluxVisual,
  HelixVisual,
  ProteinVisual,
  Reveal,
  SectionHeading,
} from "./Visuals";

const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hash)
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    }, 70);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);
  const nav = [
    ["Home", "/#home"],
    ["Projects", "/#projects"],
    ["About", "/#about"],
    ["Research", "/#research"],
    ["Contact", "/#contact"],
  ];
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="header-inner wrap">
        <Link to="/#home" className="brand" aria-label="Abhignan Vajjala, home">
          <span className="brand-icon">
            <Dna size={20} strokeWidth={1.7} />
          </span>
          <span>
            AV<span className="brand-period">.</span>
          </span>
          <span className="brand-divider" />
          <span className="brand-descriptor">RESEARCHER + BUILDER</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, url]) => (
            <Link to={url} key={label}>
              {label}
            </Link>
          ))}
        </nav>
        <a href={`mailto:${person.email}`} className="header-cta">
          GET IN TOUCH <ArrowUpRight size={14} />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {nav.map(([label, url]) => (
              <Link to={url} onClick={() => setOpen(false)} key={label}>
                {label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-main">
        <div>
          <Link to="/#home" className="footer-name">
            Abhignan Vajjala<span>.</span>
          </Link>
          <p>Computational Biology × Research Software</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/#home">Home</Link>
          <Link to="/#projects">Projects</Link>
          <Link to="/#about">About</Link>
          <Link to="/#research">Research</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Abhignan Vajjala</span>
        <div>
          <a
            href={person.github}
            {...externalProps}
            aria-label="GitHub profile"
          >
            GITHUB <ArrowUpRight size={12} />
          </a>
          <a
            href={person.linkedin}
            {...externalProps}
            aria-label="LinkedIn profile"
          >
            LINKEDIN <ArrowUpRight size={12} />
          </a>
          <a
            href={person.rosalind}
            {...externalProps}
            aria-label="Rosalind profile"
          >
            ROSALIND <ArrowUpRight size={12} />
          </a>
        </div>
        <span>BUILT AT THE INTERSECTION OF BIOLOGY + CODE</span>
      </div>
    </footer>
  );
}

function ProjectLinks({
  project,
  detail = false,
}: {
  project: Project;
  detail?: boolean;
}) {
  return (
    <div className="project-actions">
      {!detail && (
        <Link className="button button-primary" to={`/projects/${project.id}`}>
          Explore Project <ArrowUpRight size={16} />
        </Link>
      )}
      {project.demoUrl ? (
        <a
          className={`button ${detail ? "button-primary" : "button-outline"}`}
          href={project.demoUrl}
          {...externalProps}
        >
          Launch Interactive Demo <ExternalLink size={15} />
        </a>
      ) : (
        <div className="coming-soon">
          <span className="status-pulse" /> Interactive Demo — Coming Soon
        </div>
      )}
      <a className="text-link" href={project.sourceUrl} {...externalProps}>
        View Source <ArrowUpRight size={15} />
      </a>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal className={`project-card project-${project.accent}`}>
      <div className="project-card-content">
        <div className="project-topline">
          <span>PROJECT / {project.index}</span>
          <span>
            <CircleDot size={13} />{" "}
            {project.accent === "teal"
              ? "STRUCTURAL SYSTEMS"
              : "METABOLIC SYSTEMS"}
          </span>
        </div>
        <div>
          <span className="tag">{project.category}</span>
          <h3>
            {project.name}
            <span>.</span>
          </h3>
          <p className="project-short">{project.short}</p>
        </div>
        <div className="project-card-bottom">
          <ProjectLinks project={project} />
        </div>
      </div>
      <div className="project-graphic">
        {project.id === "exo-target" ? <ProteinVisual /> : <FluxVisual />}
      </div>
    </Reveal>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-noise" />
      <div className="wrap hero-layout">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="signal-dot" /> PORTFOLIO / RESEARCH & DEVELOPMENT{" "}
            <span className="hero-kicker-line" />
          </div>
          <h1 className="hero-name">
            ABHIGNAN VAJJALA <span>— BIOTECHNOLOGY UNDERGRADUATE</span>
          </h1>
          <h2>
            Exploring
            <br />
            <em>biological systems</em>
            <br />
            through computation<span className="heading-period">.</span>
          </h2>
          <p className="hero-descriptor">{person.descriptor}</p>
          <p className="hero-intro">{person.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/#projects">
              Explore Projects <ArrowUpRight size={17} />
            </Link>
            <a
              className="button button-outline"
              href={person.github}
              {...externalProps}
            >
              GitHub <Github size={17} />
            </a>
            <Link className="button button-quiet" to="/#contact">
              Contact <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-affiliation">
            <span className="affiliation-bar" />
            <div>
              <strong>Department of Biotechnology</strong>
              <span>
                VNR Vignana Jyothi Institute of Engineering and Technology (VNR
                VJIET)
              </span>
              <span>Hyderabad, India</span>
            </div>
          </div>
        </div>
        <div className="hero-art">
          <HelixVisual />
          <div className="hero-art-caption">
            <span>
              <span className="little-square" /> BIOLOGICAL STRUCTURE
            </span>
            <span>→</span>
            <span>COMPUTATIONAL INSIGHT</span>
          </div>
        </div>
      </div>
      <div className="wrap hero-bottom">
        <span>
          SCROLL TO EXPLORE <ArrowDown size={13} />
        </span>
        <span>01 / RESEARCHER + BUILDER</span>
      </div>
    </section>
  );
}

function ResearchBuild() {
  const stages = [
    {
      n: "01",
      icon: <Microscope size={25} strokeWidth={1.5} />,
      title: "Investigate",
      text: "Identify biologically relevant questions, evaluate scientific literature, and examine biological datasets.",
    },
    {
      n: "02",
      icon: <Orbit size={25} strokeWidth={1.5} />,
      title: "Model",
      text: "Apply structural prediction and mathematical modeling to investigate biological behavior.",
    },
    {
      n: "03",
      icon: <Code2 size={25} strokeWidth={1.5} />,
      title: "Build",
      text: "Develop analysis workflows and interactive tools that make scientific results accessible.",
    },
  ];
  return (
    <section className="section process-section" id="approach">
      <div className="wrap">
        <SectionHeading
          eyebrow="THE APPROACH"
          title="From question to interface."
          intro="Research and development are two parts of the same process: understand the system, then build tools to explore it."
        />
        <div className="process-grid">
          {stages.map((s, i) => (
            <Reveal
              className="process-step"
              key={s.n}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="process-step-top">
                <span>{s.n} / 03</span>
                {s.icon}
              </div>
              <h3>
                {s.title}
                <span>.</span>
              </h3>
              <p>{s.text}</p>
              {i < 2 && (
                <span className="process-arrow">
                  <ArrowRight size={18} />
                </span>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const icons = [
    Atom,
    Network,
    Dna,
    ChartNoAxesCombined,
    Orbit,
    CircleDot,
    Braces,
  ];
  return (
    <section className="section about-section" id="about">
      <div className="wrap about-layout">
        <div>
          <SectionHeading
            eyebrow="THE PERSON BEHIND THE WORK"
            title="Curiosity, made computational."
            index="02"
          />
          <Reveal className="about-copy">
            <h3>About Me</h3>
            <p>
              I'm a biotechnology undergraduate at VNR VJIET, Hyderabad,
              interested in understanding biological systems through
              computational approaches.
            </p>
            <p>
              My work spans structural bioinformatics, protein interactions,
              computational cancer biology, and genome-scale metabolic modeling.
            </p>
            <p>
              Alongside biological research, I enjoy programming and developing
              computational tools that support scientific investigation and
              communication.
            </p>
          </Reveal>
        </div>
        <Reveal className="interests-panel">
          <div className="panel-head">
            <span>AREAS OF INTEREST</span>
            <span>07 DOMAINS</span>
          </div>
          <div className="interest-list">
            {interests.map((interest, i) => {
              const Icon = icons[i];
              return (
                <div className="interest-row" key={interest}>
                  <Icon size={17} strokeWidth={1.5} />
                  <span>{interest}</span>
                  <span className="interest-number">0{i + 1}</span>
                </div>
              );
            })}
          </div>
          <div className="panel-foot">BIOLOGY / COMPUTATION / SOFTWARE</div>
        </Reveal>
      </div>
    </section>
  );
}

function ConferenceEntry({ entry, i }: { entry: Conference; i: number }) {
  return (
    <Reveal className="timeline-item">
      <div className="timeline-axis">
        <span className="timeline-dot" />
        <span className="timeline-line" />
      </div>
      <div className="timeline-date">{entry.date}</div>
      <div className="timeline-body">
        <div className="timeline-title-row">
          <h3>{entry.title}</h3>
          <span
            className={`status-pill status-${entry.status.toLowerCase().replaceAll(" ", "-")}`}
          >
            {entry.status}
          </span>
        </div>
        <p className="timeline-venue">{entry.venue}</p>
        <p>{entry.description}</p>
        {entry.projectId && (
          <Link className="timeline-link" to={`/projects/${entry.projectId}`}>
            View {projects.find((p) => p.id === entry.projectId)?.name} project{" "}
            <ArrowUpRight size={14} />
          </Link>
        )}
        {entry.url && (
          <a className="timeline-link" href={entry.url} {...externalProps}>
            Conference website <ArrowUpRight size={14} />
          </a>
        )}
      </div>
      <span className="timeline-count">0{i + 1}</span>
    </Reveal>
  );
}

function Research() {
  return (
    <section className="section research-section" id="research">
      <div className="wrap">
        <SectionHeading
          eyebrow="RESEARCH JOURNEY"
          title="Conversations beyond the lab."
          intro="Participation, presentations, and academic recognition along the way."
          index="03"
        />
        <div className="timeline">
          {conferences.map((entry, i) => (
            <ConferenceEntry entry={entry} i={i} key={entry.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section className="section toolkit-section" id="toolkit">
      <div className="wrap">
        <SectionHeading
          eyebrow="TOOLS & METHODS"
          title="A practical scientific toolkit."
          index="04"
        />
        <div className="toolkit-layout">
          <div className="toolkit-list">
            {toolkit.map((item, i) => (
              <Reveal className="toolkit-row" key={item.category}>
                <span className="toolkit-num">0{i + 1}</span>
                <h3>{item.category}</h3>
                <p>{item.items}</p>
                <ArrowUpRight size={16} />
              </Reveal>
            ))}
          </div>
          <Reveal className="rosalind-card">
            <div className="rosalind-top">
              <BookOpen size={25} strokeWidth={1.4} />
              <span>PRACTICE / BIOINFORMATICS</span>
            </div>
            <h3>
              Problems as practice.<span> Solutions as code.</span>
            </h3>
            <p>
              Working through Rosalind problems to build practical algorithmic
              skills in bioinformatics.
            </p>
            <a href={person.rosalind} {...externalProps}>
              Rosalind profile <ArrowUpRight size={15} />
            </a>
            <a href={person.rosalindSolutions} {...externalProps}>
              Browse solutions <ArrowUpRight size={15} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="wrap contact-inner">
        <div className="contact-orbit" aria-hidden="true">
          <div />
          <div />
          <div />
        </div>
        <div className="contact-content">
          <span className="eyebrow">
            <i className="eyebrow-dot" /> OPEN TO CONVERSATION
          </span>
          <h2>
            Let's <em>connect.</em>
          </h2>
          <p>
            Interested in computational biology, scientific programming, or
            research collaboration? Feel free to get in touch.
          </p>
          <a className="contact-email" href={`mailto:${person.email}`}>
            {person.email}
            <ArrowUpRight size={23} />
          </a>
          <div className="contact-socials">
            <a href={person.linkedin} {...externalProps}>
              <Linkedin size={17} /> LinkedIn <ArrowUpRight size={13} />
            </a>
            <a href={person.github} {...externalProps}>
              <Github size={17} /> GitHub <ArrowUpRight size={13} />
            </a>
            <a href={person.rosalind} {...externalProps}>
              <BookOpen size={17} /> Rosalind <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  useEffect(() => {
    document.title =
      "Abhignan Vajjala — Computational Biology & Research Software";
    document
      .querySelector("meta[name=description]")
      ?.setAttribute(
        "content",
        "Abhignan Vajjala explores computational biology, structural bioinformatics, systems biology, and research software.",
      );
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute(
        "content",
        "Abhignan Vajjala — Computational Biology & Research Software",
      );
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute(
        "content",
        "Exploring biological systems through computation. Research, modeling, and scientific software by Abhignan Vajjala.",
      );
  }, []);
  return (
    <main id="main-content">
      <Hero />
      <div className="marquee-line" aria-hidden="true">
        <span>STRUCTURAL BIOINFORMATICS</span>
        <i />
        <span>SYSTEMS BIOLOGY</span>
        <i />
        <span>RESEARCH SOFTWARE</span>
        <i />
        <span>COMPUTATIONAL CANCER BIOLOGY</span>
      </div>
      <section className="section projects-section" id="projects">
        <div className="wrap">
          <SectionHeading
            eyebrow="SELECTED WORK"
            title="Research in motion."
            intro="Computational investigations shaped into workflows and interactive tools."
            index="01"
          />
          <div className="project-list">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>
      <ResearchBuild />
      <About />
      <Research />
      <Toolkit />
      <Contact />
    </main>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.id === slug);
  useEffect(() => {
    const title = project
      ? `${project.name} — Abhignan Vajjala`
      : "Project Not Found — Abhignan Vajjala";
    document.title = title;
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", title);
    if (project) {
      document
        .querySelector("meta[name=description]")
        ?.setAttribute("content", project.short);
      document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute("content", project.short);
    }
  }, [project]);
  if (!project)
    return (
      <section className="not-found wrap">
        <span className="eyebrow">404 / PROJECT</span>
        <h1>Project not found.</h1>
        <Link className="button button-primary" to="/#projects">
          Back to Projects <ArrowLeft size={16} />
        </Link>
      </section>
    );
  const isExo = project.id === "exo-target";
  return (
    <main id="main-content" className={`detail-page detail-${project.accent}`}>
      <div className="detail-hero">
        <div className="wrap">
          <Link className="back-link" to="/#projects">
            <ArrowLeft size={15} /> BACK TO PROJECTS
          </Link>
          <div className="detail-hero-grid">
            <div>
              <div className="detail-pretitle">
                <span className="signal-dot" /> RESEARCH PROJECT /{" "}
                {project.index}
              </div>
              <h1>
                {project.name}
                <span>.</span>
              </h1>
              <p className="detail-category">{project.category}</p>
              <p className="detail-lede">{project.overview}</p>
              <ProjectLinks project={project} detail />
            </div>
            <div className="detail-visual">
              {isExo ? <ProteinVisual /> : <FluxVisual />}
            </div>
          </div>
          <div className="detail-meta">
            <span>
              DOMAIN / {isExo ? "STRUCTURAL BIOINFORMATICS" : "SYSTEMS BIOLOGY"}
            </span>
            <span>
              METHOD /{" "}
              {isExo ? "PROTEIN INTERACTIONS" : "FLUX BALANCE ANALYSIS"}
            </span>
            <span>OUTPUT / RESEARCH + SOFTWARE</span>
          </div>
        </div>
      </div>
      <div className="wrap detail-content">
        <div className="detail-sidebar">
          <span>ON THIS PAGE</span>
          <a href="#question">01 / Question</a>
          <a href="#methods">02 / Methods</a>
          <a href="#implementation">03 / Implementation</a>
          <a href="#findings">04 / Findings</a>
          <a href="#limitations">05 / Limitations</a>
          <a href="#resources">06 / Resources</a>
        </div>
        <div className="detail-sections">
          <section id="question">
            <span className="detail-section-label">01 / RESEARCH QUESTION</span>
            <h2>What are we trying to understand?</h2>
            <p className="big-statement">{project.question}</p>
            {!isExo && (
              <p>
                In cyanobacteria, the focus is carbon allocation, glycogen
                metabolism, and theoretical triacylglycerol (TAG) capacity using
                the iRH783 model. In E. coli BL21(DE3), the focus is recombinant
                proinsulin production under changing simulated constraints using
                the iHK1487 model.
              </p>
            )}
          </section>
          <section id="methods">
            <span className="detail-section-label">02 / METHODS & TOOLS</span>
            <h2>Scientific approach.</h2>
            <p>
              {isExo
                ? "The analysis combines predicted protein structures, structural confidence, calculated binding energetics, interaction evidence, and biological feasibility."
                : "Constraint-based Flux Balance Analysis uses genome-scale models to explore how metabolic pathways respond to defined simulated constraints."}
            </p>
            <div className="method-grid">
              {project.methods.map((m, i) => (
                <div key={m}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {m}
                </div>
              ))}
            </div>
          </section>
          <section id="implementation">
            <span className="detail-section-label">03 / RESEARCH SOFTWARE</span>
            <h2>From analysis to interface.</h2>
            <p>{project.implementation}</p>
            <div className="detail-callout">
              <Code2 size={22} />
              <span>
                {isExo
                  ? "Computational analysis pipelines and interactive molecular result views are the development focus."
                  : "The live frontend presents interactive views of model-based metabolic analysis."}
              </span>
            </div>
          </section>
          <section id="findings">
            <span className="detail-section-label">04 / FINDINGS</span>
            <h2>What the modeling suggests.</h2>
            <ul className="detail-list">
              {project.findings.map((f) => (
                <li key={f}>
                  <Check size={17} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {!isExo && (
              <p className="evidence-note">
                7.96% is a simulated change in theoretical TAG capacity under
                the project's documented model-comparison conditions.
              </p>
            )}
          </section>
          <section id="limitations">
            <span className="detail-section-label">05 / LIMITATIONS</span>
            <h2>Interpretation matters.</h2>
            <ul className="detail-list limitations-list">
              {project.limitations.map((l) => (
                <li key={l}>
                  <CircleDot size={17} />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </section>
          <section id="resources">
            <span className="detail-section-label">06 / EXPLORE FURTHER</span>
            <h2>Project resources.</h2>
            <div className="resource-links">
              <a href={project.sourceUrl} {...externalProps}>
                <Github size={20} />
                <span>
                  <strong>Source repository</strong>
                  <small>Documentation and code</small>
                </span>
                <ArrowUpRight size={18} />
              </a>
              {project.demoUrl ? (
                <a href={project.demoUrl} {...externalProps}>
                  <ExternalLink size={20} />
                  <span>
                    <strong>Interactive demo</strong>
                    <small>Explore the live frontend</small>
                  </span>
                  <ArrowUpRight size={18} />
                </a>
              ) : (
                <div className="resource-unavailable">
                  <ExternalLink size={20} />
                  <span>
                    <strong>Interactive Demo — Coming Soon</strong>
                    <small>Deployment URL will be added when available</small>
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <div className="wrap next-project">
        <span>NEXT PROJECT</span>
        <Link to={`/projects/${isExo ? "fluxnova" : "exo-target"}`}>
          {isExo ? "FLUXNOVA" : "EXO-TARGET"} <ArrowRight size={24} />
        </Link>
      </div>
    </main>
  );
}

function AppRoutes() {
  const reduced = useReducedMotion();
  return (
    <>
      <ScrollManager />
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={useLocation().pathname}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route
              path="*"
              element={
                <section className="not-found wrap">
                  <span className="eyebrow">404 / PAGE</span>
                  <h1>Page not found.</h1>
                  <Link className="button button-primary" to="/">
                    Back Home <ChevronRight size={16} />
                  </Link>
                </section>
              }
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
