import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Braces,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDot,
  Dna,
  ExternalLink,
  Github,
  Linkedin,
  Menu,
  Network,
  Orbit,
  X,
} from "lucide-react";
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
  BioAtmosphere,
  FluxVisual,
  ProteinVisual,
  Reveal,
  SectionHeading,
} from "./Visuals";
import { HelixScene } from "./HelixScene";
import { siteMetadata } from "./seo";

const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

function ScrollManager() {
  const { key, hash } = useLocation();
  const previousKey = useRef(key);
  useEffect(() => {
    const navigated = previousKey.current !== key;
    previousKey.current = key;
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (navigated) target?.focus({ preventScroll: true });
      target?.scrollIntoView();
    } else if (navigated) {
      document.getElementById("main-content")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [key, hash]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
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
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuToggle.current?.focus();
        }
      }}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="header-inner wrap">
        <Link to="/#home" className="brand" aria-label="Abhignan Vajjala, home">
          <span className="brand-mark">AV</span>
          <span className="brand-divider" />
          <span className="brand-descriptor">
            COMPUTATIONAL BIOLOGY &amp; RESEARCH
          </span>
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
          ref={menuToggle}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {nav.map(([label, url]) => (
          <Link to={url} onClick={() => setOpen(false)} key={label}>
            {label}
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </nav>
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
      <a
        className={`button ${detail ? "button-primary" : "button-outline"}`}
        href={project.demoUrl}
        {...externalProps}
      >
        Interactive Demo <ExternalLink size={15} />
      </a>
      <a className="text-link" href={project.sourceUrl} {...externalProps}>
        View Source <ArrowUpRight size={15} />
      </a>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal className="project-reveal">
      <article className={`project-card project-${project.accent}`}>
        <div className="project-card-content">
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
      </article>
    </Reveal>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" tabIndex={-1}>
      <HelixScene />
      <div className="wrap hero-layout">
        <div className="hero-copy">
          <h1 className="hero-name">Abhignan Vajjala</h1>
          <h2>
            Exploring <em>biological systems</em> through computation
            <span className="heading-period">.</span>
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
          </div>
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
    CircleDot,
    ChartNoAxesCombined,
    Orbit,
    CircleDot,
    Braces,
  ];
  return (
    <section className="section about-section" id="about" tabIndex={-1}>
      <div className="wrap about-layout">
        <div>
          <SectionHeading
            eyebrow="THE PERSON BEHIND THE WORK"
            title="Curiosity, made computational."
          />
          <Reveal className="about-copy">
            <p>
              I’m pursuing a B.Tech in Biotechnology at {person.institute} (VNR
              VJIET) in Hyderabad, India.
            </p>
            <p>
              I’m interested in how models can guide the next experiment, from
              choosing which protein interactions to examine to understanding
              how metabolic constraints shape product flux. I build interactive
              tools to make those comparisons easier to inspect.
            </p>
          </Reveal>
        </div>
        <Reveal className="interests-panel">
          <div className="panel-head">
            <span>AREAS OF INTEREST</span>
          </div>
          <div className="interest-list">
            {interests.map((interest, i) => {
              const Icon = icons[i];
              return (
                <div className="interest-row" key={interest}>
                  <Icon size={17} strokeWidth={1.5} />
                  <span>{interest}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ConferenceEntry({ entry }: { entry: Conference }) {
  const project = projects.find((item) => item.id === entry.projectId);
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
        {entry.details && <p>{entry.details}</p>}
        <div className="timeline-actions">
          {project && (
            <Link className="timeline-link" to={`/projects/${project.id}`}>
              View {project.name} project <ArrowUpRight size={14} />
            </Link>
          )}
          {entry.url && (
            <a className="timeline-link" href={entry.url} {...externalProps}>
              {entry.linkLabel ?? "Conference website"}{" "}
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function Research() {
  return (
    <section className="section research-section" id="research" tabIndex={-1}>
      <div className="wrap">
        <SectionHeading
          eyebrow="RESEARCH JOURNEY"
          title="Conversations beyond the lab."
          intro="Conference participation, student research presentations, and abstract acceptance."
        />
        <div className="timeline">
          {conferences.map((entry) => (
            <ConferenceEntry entry={entry} key={entry.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section className="section toolkit-section" id="toolkit">
      <BioAtmosphere kind="molecular" />
      <div className="wrap">
        <SectionHeading
          eyebrow="TOOLS & METHODS"
          title="A practical scientific toolkit."
        />
        <div className="toolkit-layout">
          <div className="toolkit-list">
            {toolkit.map((item) => (
              <Reveal className="toolkit-row" key={item.category}>
                <h3>{item.category}</h3>
                <p>{item.items}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="rosalind-card">
            <svg
              className="rosalind-motif"
              viewBox="0 0 150 130"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M25 15c88 25 9 70 100 100M125 15C37 40 116 90 25 115"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M53 25h44M66 42h18M59 60h32M67 78h18M52 96h46"
                stroke="currentColor"
                strokeWidth="1"
                opacity=".6"
              />
              <circle cx="53" cy="25" r="3" fill="currentColor" />
              <circle cx="98" cy="96" r="3" fill="currentColor" />
            </svg>
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
    <section className="contact-section" id="contact" tabIndex={-1}>
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
            Get in touch about computational biology projects, research
            opportunities, or scientific software.
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
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <section className="section projects-section" id="projects" tabIndex={-1}>
        <BioAtmosphere kind="cell" />
        <div className="wrap">
          <SectionHeading
            eyebrow="SELECTED WORK"
            title="Research in motion."
            intro="Explore two modeling projects, from the research question to the results and their limits."
          />
          <div className="project-list">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>
      <About />
      <Research />
      <Toolkit />
      <Contact />
    </main>
  );
}

const detailNavigation = [
  ["question", "Research question"],
  ["methods", "Methods"],
  ["findings", "Findings"],
  ["limitations", "Limitations"],
  ["implementation", "Research software"],
];

function ProjectDetail({ project }: { project: Project }) {
  const nextProject = projects.find((item) => item.id !== project.id)!;
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`detail-page detail-${project.accent}`}
    >
      <div className="detail-hero">
        <div className="wrap">
          <Link className="back-link" to="/#projects">
            <ArrowLeft size={15} /> Back to projects
          </Link>
          <div className="detail-hero-grid">
            <div>
              <p className="detail-pretitle">
                <span className="signal-dot" /> {project.status}
              </p>
              <h1>
                {project.name}
                <span aria-hidden="true">.</span>
              </h1>
              <p className="detail-category">{project.category}</p>
              <p className="detail-lede">{project.overview}</p>
              <ProjectLinks project={project} detail />
            </div>
            <div className="detail-visual">
              {project.id === "exo-target" ? <ProteinVisual /> : <FluxVisual />}
            </div>
          </div>
        </div>
      </div>
      <div className="wrap detail-content">
        <nav className="detail-sidebar" aria-label="On this page">
          <span>ON THIS PAGE</span>
          {detailNavigation.map(([id, label]) => (
            <Link to={`#${id}`} key={id}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="detail-sections">
          <section id="question" tabIndex={-1}>
            <h2>Research question</h2>
            <p className="big-statement">{project.question}</p>
          </section>
          <section id="methods" tabIndex={-1}>
            <h2>Methods</h2>
            <p>{project.methodsIntro}</p>
            <ol className="method-grid" aria-label="Method overview">
              {project.methods.map(({ title, text }) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <section id="findings" tabIndex={-1}>
            <h2>Findings</h2>
            {project.findings.map(({ title, text, values }) => (
              <article className="finding" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
                {values && (
                  <dl className="finding-values">
                    {values.map(({ label, value }) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </article>
            ))}
          </section>
          <section id="limitations" tabIndex={-1}>
            <h2>Limitations</h2>
            <ul className="detail-list">
              {project.limitations.map((limitation) => (
                <li key={limitation}>
                  <CircleDot size={17} aria-hidden="true" />
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </section>
          <section id="implementation" tabIndex={-1}>
            <h2>Research software</h2>
            <p>{project.implementation}</p>
          </section>
        </div>
      </div>
      <div className="wrap next-project">
        <span>NEXT PROJECT</span>
        <Link to={`/projects/${nextProject.id}`}>
          {nextProject.name} <ArrowRight size={24} />
        </Link>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="not-found wrap">
      <h1>Page not found.</h1>
      <Link className="button button-primary" to="/#projects">
        Back to projects <ChevronRight size={16} />
      </Link>
    </main>
  );
}

function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = siteMetadata(pathname);
    document.title = metadata.title;
    for (const [element, key, name, attribute, value] of metadata.tags) {
      document.head
        .querySelector(`${element}[${key}="${name}"]`)
        ?.setAttribute(attribute, value);
    }
  }, [pathname]);
  return null;
}

export function AppRoutes() {
  return (
    <>
      <PageMetadata />
      <ScrollManager />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {projects.map((project) => (
          <Route
            key={project.id}
            caseSensitive
            path={`/projects/${project.id}`}
            element={<ProjectDetail key={project.id} project={project} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
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
