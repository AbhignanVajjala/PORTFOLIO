import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Point = { x: number; y: number; depth: number };

// Rotation is tied to absolute scroll position, so scrolling back reverses it.
export function phaseForScroll(scrollY: number): number {
  return 0.55 + Math.max(0, scrollY) * 0.006;
}

function strandPoint(
  t: number,
  phase: number,
  opposite: boolean,
  width: number,
  height: number,
): Point {
  const angle = t * Math.PI * 6.2 + phase + (opposite ? Math.PI : 0);
  const radius = Math.min(width * 0.095, height * 0.115);
  const centerX = width * (0.1 + 0.78 * t);
  const centerY =
    height * (0.92 - 0.8 * t) + Math.sin(t * Math.PI) * height * 0.035;
  const normalX = 0.72;
  const normalY = 0.7;
  const depth = Math.sin(angle);
  const projectedRadius = radius * Math.cos(angle) * (1 + depth * 0.12);
  return {
    x: centerX + normalX * projectedRadius,
    y: centerY + normalY * projectedRadius,
    depth,
  };
}

function drawHelix(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  mobile: boolean,
) {
  ctx.clearRect(0, 0, width, height);

  // Soft atmosphere behind the helix. It remains subdued under the text fade.
  const aura = ctx.createRadialGradient(
    width * 0.53,
    height * 0.52,
    0,
    width * 0.53,
    height * 0.52,
    width * 0.48,
  );
  aura.addColorStop(0, "rgba(39, 180, 179, 0.13)");
  aura.addColorStop(0.55, "rgba(35, 124, 153, 0.055)");
  aura.addColorStop(1, "rgba(35, 124, 153, 0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  const rungs = mobile ? 23 : 31;
  for (let i = 0; i <= rungs; i++) {
    const t = 0.018 + (i / rungs) * 0.964;
    const a = strandPoint(t, phase, false, width, height);
    const b = strandPoint(t, phase, true, width, height);
    const bridge = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    bridge.addColorStop(0, "rgba(105, 229, 221, 0.25)");
    bridge.addColorStop(0.5, "rgba(126, 218, 229, 0.42)");
    bridge.addColorStop(1, "rgba(105, 229, 221, 0.25)");
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineWidth = mobile ? 0.8 : 1.05;
    ctx.strokeStyle = bridge;
    ctx.stroke();
  }

  const segments = mobile ? 110 : 190;
  // Draw rear segments first, then luminous front segments. Depth controls
  // width and transparency, producing an axial turn rather than a flat spin.
  for (const front of [false, true]) {
    for (const opposite of [false, true]) {
      for (let i = 0; i < segments; i++) {
        const a = strandPoint(i / segments, phase, opposite, width, height);
        const b = strandPoint(
          (i + 1) / segments,
          phase,
          opposite,
          width,
          height,
        );
        const depth = (a.depth + b.depth) / 2;
        if (depth >= 0 !== front) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineCap = "round";
        ctx.lineWidth = front ? (mobile ? 1.8 : 2.15) + depth * 0.8 : 1.1;
        ctx.strokeStyle = opposite
          ? `rgba(105, 194, 220, ${front ? 0.56 + depth * 0.25 : 0.19})`
          : `rgba(125, 246, 225, ${front ? 0.63 + depth * 0.28 : 0.22})`;
        ctx.shadowBlur = front ? (mobile ? 7 : 14) : 0;
        ctx.shadowColor = opposite ? "#5fbad6" : "#5cebdc";
        ctx.stroke();
      }
    }
  }
  ctx.shadowBlur = 0;

  for (let i = 0; i <= rungs; i++) {
    const t = 0.018 + (i / rungs) * 0.964;
    for (const opposite of [false, true]) {
      const p = strandPoint(t, phase, opposite, width, height);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.depth > 0 ? (mobile ? 2 : 2.7) : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(151, 250, 236, ${p.depth > 0 ? 0.78 : 0.36})`;
      ctx.fill();
    }
  }
}

function CircuitField() {
  return (
    <svg
      className="hero-circuit"
      viewBox="0 0 950 720"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="#4fb3bd" strokeWidth="1" opacity=".22">
        <path d="M70 50h190l36 36h128m-342 14h171l27 27h82m-318 19h131l48 48h150m317-140h117l42 42h126m-292-19h91l38 38h112" />
        <path d="M100 666h214l39-39h144m-366-20h148l53-53h83m360 110H598l-39-39h-68m342-27H700l-32-32h-54" />
        <path d="M690 117v68l-41 41m-398-22v73l54 54m493 143v72l-44 44" />
      </g>
      <g fill="#63dfd9" opacity=".45">
        <circle cx="423" cy="86" r="3" />
        <circle cx="362" cy="127" r="3" />
        <circle cx="373" cy="194" r="3" />
        <circle cx="841" cy="96" r="3" />
        <circle cx="305" cy="331" r="3" />
        <circle cx="497" cy="627" r="3" />
        <circle cx="415" cy="554" r="3" />
        <circle cx="614" cy="566" r="3" />
        <circle cx="754" cy="590" r="3" />
      </g>
    </svg>
  );
}

export function HelixScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const mobile = window.matchMedia("(max-width: 700px)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let current = reducedMotion ? 0.55 : phaseForScroll(window.scrollY);
    let target = current;

    const paint = () => {
      drawHelix(ctx, width, height, current, mobile);
      canvas.dataset.phase = current.toFixed(3);
    };
    const tick = () => {
      frame = 0;
      const delta = target - current;
      current += delta * 0.13;
      if (Math.abs(delta) < 0.002) current = target;
      paint();
      if (current !== target) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = phaseForScroll(window.scrollY);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1.3 : 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    if (!reducedMotion)
      window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div
      className="hero-scene"
      role="img"
      aria-label="Illustrative DNA double helix with depth-based rotation linked to scrolling"
    >
      <CircuitField />
      <canvas
        ref={canvasRef}
        className="hero-helix-canvas"
        aria-hidden="true"
      />
    </div>
  );
}
