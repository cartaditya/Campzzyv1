import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  initials: string;
  pulse: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
}

interface Packet {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

const NODE_DATA = [
  { initials: "AK", color: "#007BFF" },
  { initials: "PR", color: "#6366f1" },
  { initials: "SK", color: "#0ea5e9" },
  { initials: "NM", color: "#007BFF" },
  { initials: "RV", color: "#8b5cf6" },
  { initials: "AM", color: "#06b6d4" },
  { initials: "DK", color: "#3b82f6" },
  { initials: "JS", color: "#6366f1" },
  { initials: "KP", color: "#007BFF" },
  { initials: "LT", color: "#0ea5e9" },
  { initials: "VR", color: "#8b5cf6" },
  { initials: "SM", color: "#007BFF" },
  { initials: "RA", color: "#06b6d4" },
  { initials: "AT", color: "#6366f1" },
  { initials: "NG", color: "#0ea5e9" },
];

export function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    let animFrame: number;
    let nodes: Node[] = [];
    let particles: Particle[] = [];
    let packets: Packet[] = [];
    let packetTimer = 0;
    let started = false;

    function getSize() {
      return {
        w: canvas!.clientWidth || window.innerWidth,
        h: canvas!.clientHeight || window.innerHeight,
      };
    }

    function init() {
      ctx = canvas!.getContext("2d");
      if (!ctx) return;

      const { w, h } = getSize();
      canvas!.width = w;
      canvas!.height = h;

      nodes = NODE_DATA.map((n) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: 20 + Math.random() * 8,
        color: n.color,
        initials: n.initials,
        pulse: Math.random() * Math.PI * 2,
      }));

      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.1,
        size: Math.random() * 2 + 1,
      }));

      packets = [];
      packetTimer = 0;

      if (!started) {
        started = true;
        animate();
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // ── Packet spawning
      packetTimer++;
      if (packetTimer > 55 && nodes.length > 1) {
        packetTimer = 0;
        const from = Math.floor(Math.random() * nodes.length);
        let to = Math.floor(Math.random() * nodes.length);
        while (to === from) to = Math.floor(Math.random() * nodes.length);
        const dx = nodes[from].x - nodes[to].x;
        const dy = nodes[from].y - nodes[to].y;
        if (Math.sqrt(dx * dx + dy * dy) < 320) {
          packets.push({
            fromIdx: from,
            toIdx: to,
            progress: 0,
            speed: 0.008 + Math.random() * 0.008,
          });
        }
      }

      // ── Update particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // ── Update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.03;
        if (n.x < n.radius || n.x > w - n.radius) n.vx *= -1;
        if (n.y < n.radius || n.y > h - n.radius) n.vy *= -1;
      }

      // ── Grid dots
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      for (let gx = 0; gx < w; gx += 45) {
        for (let gy = 0; gy < h; gy += 45) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Small particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,123,255,${p.opacity})`;
        ctx.fill();
      }

      // ── Connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 260;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            const grad = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y,
              nodes[j].x, nodes[j].y
            );
            const hexAlpha = Math.round(alpha * 255).toString(16).padStart(2, "0");
            grad.addColorStop(0, `${nodes[i].color}${hexAlpha}`);
            grad.addColorStop(1, `${nodes[j].color}${hexAlpha}`);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // ── Data packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const pk = packets[i];
        pk.progress += pk.speed;
        if (pk.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const from = nodes[pk.fromIdx];
        const to = nodes[pk.toIdx];
        const px = from.x + (to.x - from.x) * pk.progress;
        const py = from.y + (to.y - from.y) * pk.progress;

        // Trail
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,123,255,0.12)";
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#007BFF";
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      // ── Nodes
      for (const n of nodes) {
        const pulse = 1 + Math.sin(n.pulse) * 0.1;

        // Outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 3 * pulse);
        glow.addColorStop(0, n.color + "35");
        glow.addColorStop(0.5, n.color + "12");
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Mid ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 1.5 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = n.color + "30";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Main circle
        const grad = ctx.createRadialGradient(
          n.x - n.radius * 0.3, n.y - n.radius * 0.3, 0,
          n.x, n.y, n.radius
        );
        grad.addColorStop(0, lighten(n.color));
        grad.addColorStop(1, n.color);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // White border
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Initials
        ctx.fillStyle = "#fff";
        ctx.font = `700 ${Math.round(n.radius * 0.52)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.initials, n.x, n.y);
      }

      animFrame = requestAnimationFrame(animate);
    }

    function lighten(hex: string): string {
      const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 60);
      const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 60);
      const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 60);
      return `rgb(${r},${g},${b})`;
    }

    // Delay slightly so the DOM has finished layout
    const startTimer = setTimeout(() => {
      init();
    }, 30);

    const handleResize = () => {
      if (!canvas) return;
      const { w, h } = getSize();
      canvas.width = w;
      canvas.height = h;
      // Re-clamp nodes
      for (const n of nodes) {
        n.x = Math.min(n.x, w - n.radius);
        n.y = Math.min(n.y, h - n.radius);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
