import { useEffect, useRef } from "react";

interface Orb {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  initials: string;
  speedX: number;
  speedY: number;
}

const orbData: Omit<Orb, "speedX" | "speedY">[] = [
  { id: "1", x: 25, y: 12, size: 64, color: "#3BA8D5", initials: "RV" },
  { id: "2", x: 60, y: 22, size: 58, color: "#8B3ED7", initials: "SK" },
  { id: "3", x: 80, y: 30, size: 54, color: "#3BA8D5", initials: "AK" },
  { id: "4", x: 42, y: 40, size: 62, color: "#6A2EBD", initials: "DK" },
  { id: "5", x: 12, y: 55, size: 50, color: "#D03A85", initials: "SM" },
  { id: "6", x: 18, y: 48, size: 46, color: "#3BA8D5", initials: "LT" },
  { id: "7", x: 65, y: 52, size: 56, color: "#8B3ED7", initials: "NM" },
  { id: "8", x: 88, y: 58, size: 52, color: "#D03A85", initials: "KP" },
  { id: "9", x: 14, y: 70, size: 58, color: "#3BA8D5", initials: "AT" },
  { id: "10", x: 35, y: 78, size: 54, color: "#6A2EBD", initials: "PR" },
  { id: "11", x: 75, y: 15, size: 48, color: "#D03A85", initials: "JM" },
  { id: "12", x: 50, y: 65, size: 52, color: "#3BA8D5", initials: "VK" },
];

const FloatingOrbs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Connection pairs for lines
  const connections = [
    [0,1],[1,2],[2,7],[3,6],[4,5],[5,8],[8,9],[6,7],[3,1],[9,11],[11,6],[4,9],[10,2],[10,1],
  ];

  useEffect(() => {
    const orbs = containerRef.current?.querySelectorAll<HTMLDivElement>("[data-orb]");
    if (!orbs) return;

    const speeds = orbData.map(() => ({
      x: (Math.random() - 0.5) * 0.15,
      y: (Math.random() - 0.5) * 0.12,
    }));

    const positions = orbData.map((o) => ({ x: o.x, y: o.y }));

    let animId: number;
    const animate = () => {
      orbs.forEach((el, i) => {
        positions[i].x += speeds[i].x;
        positions[i].y += speeds[i].y;

        if (positions[i].x < 0 || positions[i].x > 95) speeds[i].x *= -1;
        if (positions[i].y < 0 || positions[i].y > 90) speeds[i].y *= -1;

        el.style.left = `${positions[i].x}%`;
        el.style.top = `${positions[i].y}%`;
      });

      // Update connection lines
      if (svgRef.current) {
        const svg = svgRef.current;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        connections.forEach(([a, b]) => {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", `${positions[a].x}%`);
          line.setAttribute("y1", `${positions[a].y}%`);
          line.setAttribute("x2", `${positions[b].x}%`);
          line.setAttribute("y2", `${positions[b].y}%`);
          line.setAttribute("stroke", orbData[a].color);
          line.setAttribute("stroke-width", "0.5");
          svg.appendChild(line);
        });
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Fade-out gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background to-transparent z-10" />

      {/* Dot grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Connection lines (subtle) */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full opacity-[0.10]">
      </svg>

      {orbData.map((orb) => (
        <div
          key={orb.id}
          data-orb
          className="absolute transition-none"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
          }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-20"
            style={{ backgroundColor: orb.color }}
          />
          {/* Orb */}
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center text-xs font-medium shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${orb.color}dd, ${orb.color}88)`,
              color: "white",
              boxShadow: `0 0 20px ${orb.color}33, 0 4px 12px ${orb.color}22`,
            }}
          >
            {orb.initials}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingOrbs;