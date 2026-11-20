import { useEffect, useId, useRef, type CSSProperties } from "react";

export function ProteinVisual() {
  const gradient = useId();
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
      className="scientific-visual protein-visual"
      role="img"
      aria-label="Illustrative protein interaction network, not experimental data"
    >
      <div className="visual-label">
        PROTEIN INTERACTIONS <span>ILLUSTRATIVE</span>
      </div>
      <svg viewBox="0 0 350 290" fill="none">
        <defs>
          <radialGradient id={gradient}>
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
              fill={`url(#${gradient})`}
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
    </div>
  );
}

export function FluxVisual() {
  const arrow = useId();
  const nodes = [
    { x: 44, y: 145, label: "CO₂" },
    { x: 149, y: 145, label: "FIXED CARBON" },
    { x: 278, y: 80, label: "GLYCOGEN" },
    { x: 278, y: 210, label: "TAG" },
  ];
  return (
    <div
      className="scientific-visual flux-visual"
      role="img"
      aria-label="Schematic of fixed carbon allocation to glycogen or triacylglycerol"
    >
      <div className="visual-label">
        CARBON ALLOCATION <span>SCHEMATIC</span>
      </div>
      <svg viewBox="0 0 350 290" fill="none">
        <defs>
          <marker
            id={arrow}
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <path d="M0 0 7 3.5 0 7" fill="none" stroke="#8c95e7" />
          </marker>
        </defs>
        {["M62 145h61", "M169 134l87-44", "M169 156l87 44"].map((path) => (
          <path
            key={path}
            d={path}
            stroke="#8c95e7"
            strokeWidth="2"
            markerEnd={`url(#${arrow})`}
          />
        ))}
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
              fontSize="12"
              letterSpacing="1"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function BioAtmosphere({ kind }: { kind: "cell" | "molecular" }) {
  return (
    <svg
      className={`bio-atmosphere bio-atmosphere-${kind}`}
      viewBox="0 0 520 520"
      fill="none"
      aria-hidden="true"
    >
      {kind === "cell" ? (
        <>
          <path
            d="M258 32C367 27 476 115 488 239c13 135-82 246-214 253C139 499 38 411 31 279 23 146 121 37 258 32Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M259 49c108-2 202 86 209 194 9 120-78 221-197 231C152 483 55 398 49 278 43 158 132 52 259 49Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 12"
          />
          <ellipse
            cx="278"
            cy="250"
            rx="95"
            ry="88"
            transform="rotate(-21 278 250)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <ellipse
            cx="278"
            cy="250"
            rx="67"
            ry="61"
            transform="rotate(-21 278 250)"
            stroke="currentColor"
            opacity=".5"
          />
          <path
            d="M104 209c19-32 57-36 83-5 18 24 13 61-21 76-33 15-68-7-70-36m283 32c23-27 60-22 76 8 13 27-5 54-35 61-27 7-51-11-53-34"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="139" cy="232" r="7" fill="currentColor" opacity=".35" />
          <circle cx="413" cy="305" r="6" fill="currentColor" opacity=".35" />
        </>
      ) : (
        <>
          <g stroke="currentColor" strokeWidth="1.5">
            <path d="M48 276 137 147l118 75 103-138 104 106M137 147l-15 190 133-115 110 166 97-198M122 337l137 114 106-63M255 222l204 93M358 84l7 304" />
            <circle cx="48" cy="276" r="16" />
            <circle cx="137" cy="147" r="22" />
            <circle cx="255" cy="222" r="28" />
            <circle cx="358" cy="84" r="18" />
            <circle cx="462" cy="190" r="20" />
            <circle cx="122" cy="337" r="17" />
            <circle cx="365" cy="388" r="25" />
            <circle cx="259" cy="451" r="14" />
            <circle cx="459" cy="315" r="16" />
          </g>
          <g fill="currentColor" opacity=".65">
            <circle cx="48" cy="276" r="4" />
            <circle cx="137" cy="147" r="5" />
            <circle cx="255" cy="222" r="6" />
            <circle cx="358" cy="84" r="4" />
            <circle cx="462" cy="190" r="4" />
            <circle cx="122" cy="337" r="4" />
            <circle cx="365" cy="388" r="5" />
            <circle cx="259" cy="451" r="4" />
            <circle cx="459" cy="315" r="4" />
          </g>
        </>
      )}
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading-line">
        <span className="eyebrow">
          <i className="eyebrow-dot" /> {eyebrow}
        </span>
      </div>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

export function Reveal({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = element.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          target.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={element} data-reveal="" className={className} style={style}>
      {children}
    </div>
  );
}
