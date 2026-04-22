import React from "react";
import { Bell, X, Calendar, ChevronRight, MapPin } from "lucide-react";

const HACKATHONS = [
  { id: "h1", icon: "⬛", name: "Global AI Hack 2024", org: "Organized by MLH",   date: "Oct 12–14", action: "Apply Now" },
  { id: "h2", icon: "</>", name: "Web3 Builders",       org: "Remote · Prize $50k", date: "Nov 01–05", action: "Register"  },
  { id: "h3", icon: "🤖", name: "HackIndia 2024",       org: "Hybrid · Prize ₹10L", date: "Dec 01–03", action: "Apply Now" },
];

const HIRING = [
  { id: "j1", icon: "🎤", name: "UI Designer Intern", company: "Designify · New York / Remote", type: "Full-time", salary: "$2k – $4k" },
  { id: "j2", icon: "🗄️", name: "Data Scientist",     company: "DataFlow · San Francisco",       type: "Part-time", salary: "$3k – $5k" },
];

interface Props { open: boolean; onClose: () => void; }

export function NotificationsOverlay({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, pointerEvents: "none" }}>
      <div
        style={{
          position: "fixed", top: 0, right: 0, height: "100%",
          width: "320px", background: "rgba(15,23,42,0.7)",
          borderLeft: "1px solid #1E1E1E",
          display: "flex", flexDirection: "column",
          zIndex: 501,
          pointerEvents: "auto",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          animation: "notif-overlay-in 0.22s cubic-bezier(0.22,1,0.36,1) forwards",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem 0.875rem", borderBottom: "1px solid #1A1A1A", flexShrink: 0, background: "#0A0A0A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Bell size={18} color="#4DD9C0" />
            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#E0E0E0" }}>Updates</span>
          </div>
          <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#111111", border: "1px solid #1E1E1E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555555" }}>
            <X size={14} />
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", background: "#0A0A0A" }}>

          {/* Hackathons */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#555555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hackathons</span>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#4DD9C0", background: "#1A1A1A", borderRadius: "2px", padding: "0.12rem 0.5rem" }}>3 NEW</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {HACKATHONS.map((h) => (
                <div
                  key={h.id}
                  style={{ background: "#111111", border: "1px solid #1E1E1E", borderRadius: "10px", padding: "14px", cursor: "pointer", transition: "transform 0.16s ease, border-color 0.16s ease, background 0.16s ease" }}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.transform = "translateY(-1px)";
                    card.style.borderColor = "#2A2A2A";
                    card.style.background = "#131313";
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.transform = "translateY(0)";
                    card.style.borderColor = "#1E1E1E";
                    card.style.background = "#111111";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#1A1A1A", border: "1px solid #1E1E1E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.82rem", fontWeight: 900, color: "#555555", fontFamily: "monospace" }}>{h.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "15px", fontWeight: 500, color: "#E0E0E0", margin: "0 0 0.15rem", lineHeight: 1.3 }}>{h.name}</p>
                      <p style={{ fontSize: "12px", color: "#555555", margin: 0 }}>{h.org}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#444444" }}>
                      <Calendar size={11} color="#444444" />
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#444444" }}>{h.date}</span>
                    </div>
                    <button style={{ padding: "0.3rem 0.9rem", borderRadius: "6px", background: "#14532D", border: "none", color: "#4ADE80", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{h.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#555555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hiring Posts</span>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#FCA5A5", background: "#7F1D1D", borderRadius: "2px", padding: "0.12rem 0.5rem" }}>URGENT</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {HIRING.map((j) => (
                <div
                  key={j.id}
                  style={{ background: "#111111", border: "1px solid #1E1E1E", borderRadius: "10px", padding: "14px", cursor: "pointer", transition: "transform 0.16s ease, border-color 0.16s ease, background 0.16s ease" }}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.transform = "translateY(-1px)";
                    card.style.borderColor = "#2A2A2A";
                    card.style.background = "#131313";
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.transform = "translateY(0)";
                    card.style.borderColor = "#1E1E1E";
                    card.style.background = "#111111";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#1A1A1A", border: "1px solid #1E1E1E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.1rem" }}>{j.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "15px", fontWeight: 500, color: "#E0E0E0", margin: "0 0 0.15rem", lineHeight: 1.3 }}>{j.name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <MapPin size={10} color="#555555" />
                        <p style={{ fontSize: "12px", color: "#555555", margin: 0 }}>{j.company}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#555555", background: "#1A1A1A", border: "1px solid #1E1E1E", borderRadius: "4px", padding: "0.18rem 0.55rem" }}>{j.type}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#4ADE80" }}>{j.salary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid #1A1A1A", flexShrink: 0, background: "#0A0A0A" }}>
          <button style={{ width: "100%", padding: "0.875rem", borderRadius: "8px", border: "1px solid #1E1E1E", background: "#111111", color: "#4DD9C0", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            View All Activity <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes notif-overlay-in { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
}
