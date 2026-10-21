import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

const rungs = Array.from({ length: 19 }, (_, i) => {
  const y = 32 + i * 23;
  const phase = i * 0.62;
  const left = 170 + 92 * Math.sin(phase);
  const right = 170 - 92 * Math.sin(phase);
  return { y, left, right, opacity: 0.32 + 0.35 * Math.abs(Math.cos(phase)) };
});

export function HelixVisual() {
  const reduced = useReducedMotion();
  return (
    <div
      className="helix-shell"
      aria-label="Illustrative DNA double helix with computational annotations"
      role="img"
    >
      <div className="helix-grid" />
      <div className="helix-corner top-left">FIG 01 / STRUCTURE ↔ SIGNAL</div>
      <div className="helix-corner top-right">COMPUTATIONAL BIOLOGY</div>
      <motion.svg
        className="helix-svg"
        viewBox="0 0 340 510"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1 }}
      >
        <defs>
          <linearGradient id="strandA" x1="60" y1="0" x2="270" y2="510">
            <stop stopColor="#6ff4e2" />
            <stop offset="1" stopColor="#418ece" />
          </linearGradient>
          <linearGradient id="strandB" x1="280" y1="0" x2="70" y2="510">
            <stop stopColor="#637bc8" />
            <stop offset="1" stopColor="#77e4db" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path
          d={rungs
            .map((r, i) => `${i ? "L" : "M"}${r.left.toFixed(1)} ${r.y}`)
            .join(" ")}
          stroke="#54d8d0"
          strokeWidth="13"
          opacity=".12"
          filter="url(#glow)"
        />
        {rungs.map((r, i) => (
          <g key={i}>
            <line
              x1={r.left}
              x2={r.right}
              y1={r.y}
              y2={r.y}
              stroke={i % 3 === 0 ? "#988ae4" : "#65b9c4"}
              strokeWidth="1.5"
              opacity={r.opacity}
            />
            <circle cx={r.left} cy={r.y} r="3.3" fill="#71e9dc" />
            <circle cx={r.right} cy={r.y} r="3.3" fill="#7a91df" />
          </g>
        ))}
        <path
          d={rungs
            .map((r, i) => `${i ? "L" : "M"}${r.left.toFixed(1)} ${r.y}`)
            .join(" ")}
          stroke="url(#strandA)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={rungs
            .map((r, i) => `${i ? "L" : "M"}${r.right.toFixed(1)} ${r.y}`)
            .join(" ")}
          stroke="url(#strandB)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="170"
          cy="255"
          r="145"
          stroke="#3f7485"
          strokeDasharray="3 8"
          opacity=".25"
        />
      </motion.svg>
      <span className="helix-data data-one">
        010101&nbsp; 110010&nbsp; 001011
      </span>
      <span className="helix-data data-two">
        A—T&nbsp;&nbsp; C≡G&nbsp;&nbsp; G≡C
      </span>
      <span className="helix-corner bottom-left">
        BIOLOGY / DATA / DISCOVERY
      </span>
      <span className="helix-corner bottom-right">01—19</span>
    </div>
  );
}

export function ProteinVisual({ small = false }: { small?: boolean }) {
  const nodes = [
    [45, 56, 13],
    [81, 38, 10],
    [115, 68, 12],
    [150, 44, 16],
    [186, 77, 12],
    [221, 55, 18],
    [260, 80, 12],
    [300, 53, 10],
    [67, 122, 17],
    [111, 113, 12],
    [158, 123, 21],
    [208, 129, 13],
    [251, 132, 19],
    [294, 117, 13],
    [48, 185, 11],
    [92, 174, 19],
    [139, 192, 11],
    [184, 179, 17],
    [230, 196, 15],
    [282, 178, 18],
    [72, 241, 12],
    [118, 228, 17],
    [171, 245, 13],
    [215, 235, 20],
    [260, 248, 12],
  ];
  return (
    <div
      className={`scientific-visual protein-visual ${small ? "visual-small" : ""}`}
      role="img"
      aria-label="Illustrative protein interaction network, not experimental data"
    >
      <div className="visual-label">
        STRUCTURAL INTERACTION MAP <span>ILLUSTRATIVE</span>
      </div>
      <svg viewBox="0 0 350 290" fill="none">
        <defs>
          <radialGradient id="proteinNode">
            <stop stopColor="#80f3dc" />
            <stop offset="1" stopColor="#235c73" />
          </radialGradient>
        </defs>
        {nodes.map(([x, y], i) =>
          nodes
            .slice(i + 1)
            .filter(([x2, y2]) => Math.hypot(x - x2, y - y2) < 64)
            .map(([x2, y2], j) => (
              <line
                key={`${i}-${j}`}
                x1={x}
                y1={y}
                x2={x2}
                y2={y2}
                stroke="#70d8cf"
                opacity=".21"
              />
            )),
        )}
        <ellipse
          cx="169"
          cy="148"
          rx="121"
          ry="82"
          stroke="#6bb8bb"
          opacity=".23"
          strokeDasharray="3 6"
        />
        {nodes.map(([x, y, r], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={r}
              fill="url(#proteinNode)"
              opacity={i % 3 === 0 ? 0.83 : 0.55}
            />
            <circle cx={x - 3} cy={y - 4} r="2" fill="#a8fff0" opacity=".85" />
          </g>
        ))}
        <path
          d="M115 46 159 119 226 75"
          stroke="#f2b99b"
          opacity=".8"
          strokeDasharray="4 5"
        />
        <circle cx="159" cy="119" r="28" stroke="#f2b99b" opacity=".55" />
      </svg>
      <div className="visual-footer">
        <span>RECEPTOR / EXOSOMAL PROTEIN</span>
        <span>FIG. 01</span>
      </div>
    </div>
  );
}

export function FluxVisual({ small = false }: { small?: boolean }) {
  const nodes = [
    { x: 50, y: 145, label: "CO₂" },
    { x: 129, y: 145, label: "C" },
    { x: 207, y: 77, label: "GLY" },
    { x: 207, y: 214, label: "TAG" },
    { x: 291, y: 77, label: "BIOMASS" },
    { x: 291, y: 214, label: "PRODUCT" },
  ];
  return (
    <div
      className={`scientific-visual flux-visual ${small ? "visual-small" : ""}`}
      role="img"
      aria-label="Illustrative metabolic flux pathway, not measured or modeled data"
    >
      <div className="visual-label">
        METABOLIC PATHWAY <span>ILLUSTRATIVE</span>
      </div>
      <svg viewBox="0 0 350 290" fill="none">
        <defs>
          <marker
            id="arrow"
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <path d="M0 0 7 3.5 0 7" fill="none" stroke="#8c95e7" />
          </marker>
        </defs>
        <path
          d="M68 145h40M148 136l39-44M148 154l39 47M228 77h39M228 214h39"
          stroke="#8c95e7"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <path d="M207 98v94" stroke="#bb89c8" strokeDasharray="3 6" />
        {nodes.map((n, i) => (
          <g key={n.label}>
            <circle
              cx={n.x}
              cy={n.y}
              r={i === 1 ? 21 : 17}
              fill="#121d34"
              stroke={i === 3 ? "#c8a6e7" : "#788ee7"}
              strokeWidth="1.6"
            />
            <circle
              cx={n.x}
              cy={n.y}
              r="4"
              fill={i === 3 ? "#d4a2e9" : "#9ba8f5"}
            />
            <text
              x={n.x}
              y={n.y - 26}
              textAnchor="middle"
              fill="#a6aed1"
              fontSize="9"
              letterSpacing="1.5"
            >
              {n.label}
            </text>
          </g>
        ))}
        <path d="M70 248h210" stroke="#617197" opacity=".3" />
        <path
          d="M70 249v-11m38 11v-28m38 28v-18m38 18v-48m38 48v-33m38 33v-40"
          stroke="#a9a6ea"
          strokeWidth="7"
          opacity=".38"
        />
      </svg>
      <div className="visual-footer">
        <span>CONSTRAINT-BASED MODELING</span>
        <span>FIG. 02</span>
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  index,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  index?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading-line">
        <span className="eyebrow">
          <i className="eyebrow-dot" /> {eyebrow}
        </span>
        {index && <span className="section-index">{index} / 05</span>}
      </div>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.65 },
};
export function Reveal({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      {...(reduced ? {} : fadeUp)}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
